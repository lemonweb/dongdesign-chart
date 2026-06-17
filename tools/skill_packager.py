#!/usr/bin/env python3
"""Package wiki-backed skills into standalone installable folders and zip files."""

from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import re
import shutil
import sys
import zipfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


DEFAULT_MANIFEST = "08-skill-center/skill-package-manifest.json"
DEFAULT_OUTPUT_DIR = "dist/skills"
SKILL_CENTER = Path("08-skill-center")
KNOWN_NON_SUFFIX_SKILLS = {"chart-appropriateness-reviewer"}

PATH_RE = re.compile(
    r"(?P<path>(?:00-overview|01-design-language|02-chart-type|03-pattern|04-adaptation|"
    r"05-rules|06-self-check|07-document-governance|08-skill-center|ai-file-index|README)"
    r"[\w./<>\-]*\.(?:md|json|svg|png|html|ts|tsx|js|css))"
)
SKILL_NAME_RE = re.compile(r"`(?P<name>[a-z0-9][a-z0-9-]*(?:-skill)?)`")


@dataclass(frozen=True)
class SkillSource:
    name: str
    source_path: Path
    is_directory_skill: bool


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def rel(path: Path) -> Path:
    return path.relative_to(repo_root())


def display_path(path: Path) -> str:
    try:
        return rel(path).as_posix()
    except ValueError:
        return path.as_posix()


def load_manifest(root: Path, manifest_path: Path) -> dict:
    if not manifest_path.exists():
        return {}
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def skill_name_from_path(path: Path) -> str:
    if path.name == "SKILL.md":
        return path.parent.name
    return path.stem


def discover_skills(root: Path) -> dict[str, SkillSource]:
    skills: dict[str, SkillSource] = {}
    for path in sorted((root / SKILL_CENTER).rglob("*.md")):
        if path.name in {
            "registry.md",
            "dependency-map.md",
            "skill-runtime-contract.md",
            "skill-packaging.md",
        }:
            continue
        if "examples" in path.parts:
            continue
        name = skill_name_from_path(path)
        if path.name != "SKILL.md" and not (
            path.stem.endswith("-skill") or path.stem in KNOWN_NON_SUFFIX_SKILLS
        ):
            continue
        if name in skills:
            continue
        skills[name] = SkillSource(
            name=name,
            source_path=rel(path),
            is_directory_skill=path.name == "SKILL.md",
        )
    return skills


def read_text(root: Path, rel_path: Path) -> str:
    return (root / rel_path).read_text(encoding="utf-8")


def strip_comments(path_text: str) -> str:
    return path_text.split("#", 1)[0].strip()


def normalize_candidate(raw_path: str) -> str | None:
    cleaned = strip_comments(raw_path.strip("` \t\r\n,.;:()[]{}'\""))
    if not cleaned or cleaned.startswith(("http://", "https://")):
        return None
    if "<" in cleaned or ">" in cleaned:
        return cleaned
    return cleaned


def extract_repo_paths(text: str) -> set[str]:
    paths: set[str] = set()
    for match in PATH_RE.finditer(text):
        candidate = normalize_candidate(match.group("path"))
        if candidate:
            paths.add(candidate)
    return paths


def extract_skill_names(text: str, known_skills: set[str]) -> set[str]:
    found: set[str] = set()
    for match in SKILL_NAME_RE.finditer(text):
        name = match.group("name")
        if name in known_skills:
            found.add(name)
    return found


def resolve_globs(root: Path, patterns: Iterable[str]) -> set[Path]:
    resolved: set[Path] = set()
    for pattern in patterns:
        for path in root.glob(pattern):
            if path.is_file():
                resolved.add(rel(path))
    return resolved


def resolve_placeholder_paths(root: Path, manifest: dict, paths: Iterable[str]) -> set[Path]:
    placeholders = manifest.get("placeholderGlobs", {})
    resolved: set[Path] = set()
    for path in paths:
        if "<" not in path and ">" not in path:
            continue
        globs = placeholders.get(path)
        if not globs:
            continue
        resolved.update(resolve_globs(root, globs))
    return resolved


def include_by_patterns(root: Path, patterns: Iterable[str], exclude_patterns: Iterable[str]) -> set[Path]:
    included = resolve_globs(root, patterns)
    if not exclude_patterns:
        return included
    return {
        path
        for path in included
        if not any(fnmatch.fnmatch(path.as_posix(), pattern) for pattern in exclude_patterns)
    }


def source_support_files(root: Path, source: SkillSource, manifest: dict) -> set[Path]:
    if not source.is_directory_skill:
        return set()
    source_dir = source.source_path.parent
    exclude_patterns = manifest.get("exclude", [])
    return {
        rel(path)
        for path in (root / source_dir).rglob("*")
        if path.is_file()
        and rel(path) != source.source_path
        and not any(fnmatch.fnmatch(rel(path).as_posix(), pattern) for pattern in exclude_patterns)
    }


def resolve_package_files(
    root: Path,
    manifest: dict,
    skills: dict[str, SkillSource],
    skill_name: str,
) -> tuple[set[Path], list[str]]:
    if skill_name not in skills:
        raise SystemExit(f"Unknown skill: {skill_name}")

    files: set[Path] = set()
    missing: list[str] = []
    seen_skills: set[str] = set()
    queue = [skill_name]

    default_includes = manifest.get("defaultIncludes", [])
    files.update(include_by_patterns(root, default_includes, manifest.get("exclude", [])))

    skill_overrides = manifest.get("skills", {})

    while queue:
        current = queue.pop(0)
        if current in seen_skills:
            continue
        seen_skills.add(current)

        source = skills[current]
        files.add(source.source_path)
        files.update(source_support_files(root, source, manifest))

        text = read_text(root, source.source_path)
        raw_paths = extract_repo_paths(text)
        files.update(resolve_placeholder_paths(root, manifest, raw_paths))

        for raw_path in raw_paths:
            if "<" in raw_path or ">" in raw_path:
                if raw_path not in manifest.get("placeholderGlobs", {}):
                    missing.append(raw_path)
                continue
            candidate = Path(raw_path)
            if (root / candidate).is_file():
                files.add(candidate)
            else:
                missing.append(raw_path)

        for linked_skill in extract_skill_names(text, set(skills)):
            if linked_skill not in seen_skills and linked_skill not in queue:
                queue.append(linked_skill)

        override = skill_overrides.get(current, {})
        files.update(include_by_patterns(root, override.get("include", []), manifest.get("exclude", [])))
        for linked_skill in override.get("includeSkills", []):
            if linked_skill in skills and linked_skill not in seen_skills and linked_skill not in queue:
                queue.append(linked_skill)
            elif linked_skill not in skills:
                missing.append(f"skill:{linked_skill}")

    return files, sorted(set(missing))


def frontmatter_for_single_file(source_text: str, skill_name: str, manifest: dict) -> str:
    if source_text.startswith("---\n"):
        return source_text

    descriptions = manifest.get("descriptions", {})
    description = descriptions.get(
        skill_name,
        f"Wiki-backed packaged skill for {skill_name}.",
    )
    return (
        "---\n"
        f"name: {skill_name}\n"
        f"description: {description}\n"
        "---\n\n"
        + source_text
    )


def packaged_notice(source_rel: Path) -> str:
    return (
        "<!-- AUTO-GENERATED PACKAGE NOTICE: do not edit inside generated package. -->\n\n"
        "## Packaged Skill Runtime\n\n"
        "This folder is a generated standalone package. The original source file is "
        f"`{source_rel.as_posix()}`.\n\n"
        "When this Skill references a repository path such as `01-design-language/color.md`, "
        "read the mirrored file at `references/01-design-language/color.md` if the full "
        "repository is not available. Keep wiki maintenance in the source repository, then "
        "regenerate this package.\n\n"
    )


def inject_packaged_notice(source_text: str, source_rel: Path) -> str:
    notice = packaged_notice(source_rel)
    if not source_text.startswith("---\n"):
        return notice + source_text
    closing = source_text.find("\n---\n", 4)
    if closing == -1:
        return notice + source_text
    insert_at = closing + len("\n---\n")
    return source_text[:insert_at] + "\n" + notice + source_text[insert_at:]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def copy_reference_file(root: Path, package_dir: Path, source_rel: Path) -> dict:
    source = root / source_rel
    target = package_dir / "references" / source_rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    return {
        "path": source_rel.as_posix(),
        "package_path": rel_from(package_dir, target).as_posix(),
        "sha256": sha256_file(source),
        "bytes": source.stat().st_size,
    }


def rel_from(base: Path, path: Path) -> Path:
    return path.relative_to(base)


def write_install_doc(package_dir: Path, skill_name: str, source_rel: Path) -> None:
    install = package_dir / "INSTALL.md"
    install.write_text(
        f"# Install {skill_name}\n\n"
        "Copy this whole folder into the target agent's skills directory, keeping the "
        "`references/` directory next to `SKILL.md`.\n\n"
        "For Codex-style agents, the final folder should look like this:\n\n"
        "```txt\n"
        f"{skill_name}/\n"
        "  SKILL.md\n"
        "  references/\n"
        "  package-manifest.json\n"
        "```\n\n"
        f"The editable source remains `{source_rel.as_posix()}` in the wiki repository. "
        "Regenerate the package after changing source wiki files.\n",
        encoding="utf-8",
    )


def zip_dir(source_dir: Path, zip_path: Path) -> None:
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(source_dir.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(source_dir.parent))


def package_skill(
    root: Path,
    output_dir: Path,
    manifest: dict,
    skills: dict[str, SkillSource],
    skill_name: str,
    strict: bool,
) -> dict:
    files, missing = resolve_package_files(root, manifest, skills, skill_name)
    if missing and strict:
        raise SystemExit(
            "Unresolved package references for "
            f"{skill_name}: {', '.join(missing)}"
        )

    source = skills[skill_name]
    package_dir = output_dir / skill_name
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir(parents=True, exist_ok=True)

    source_text = read_text(root, source.source_path)
    source_text = frontmatter_for_single_file(source_text, skill_name, manifest)
    (package_dir / "SKILL.md").write_text(
        inject_packaged_notice(source_text, source.source_path),
        encoding="utf-8",
    )

    copied = []
    for file_rel in sorted(files):
        if file_rel == source.source_path:
            continue
        copied.append(copy_reference_file(root, package_dir, file_rel))

    package_manifest = {
        "name": skill_name,
        "source": source.source_path.as_posix(),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "references_count": len(copied),
        "missing_references": missing,
        "references": copied,
    }
    (package_dir / "package-manifest.json").write_text(
        json.dumps(package_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_install_doc(package_dir, skill_name, source.source_path)

    zip_path = output_dir / f"{skill_name}.zip"
    zip_dir(package_dir, zip_path)

    return {
        "name": skill_name,
        "folder": package_dir,
        "zip": zip_path,
        "references_count": len(copied),
        "missing_references": missing,
    }


def list_skills(skills: dict[str, SkillSource]) -> None:
    for name, source in sorted(skills.items()):
        print(f"{name}\t{source.source_path.as_posix()}")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Package wiki-backed skills into standalone folders and zip files."
    )
    parser.add_argument(
        "skills",
        nargs="*",
        help="One or more skill names to package, for example chart-builder-skill visual-auditor-skill.",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Package every discovered skill.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List discovered skills.",
    )
    parser.add_argument(
        "--manifest",
        default=DEFAULT_MANIFEST,
        help=f"Package manifest path. Default: {DEFAULT_MANIFEST}",
    )
    parser.add_argument(
        "--out",
        default=DEFAULT_OUTPUT_DIR,
        help=f"Output directory. Default: {DEFAULT_OUTPUT_DIR}",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail if any referenced file or placeholder cannot be resolved.",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    root = repo_root()
    manifest_path = root / args.manifest
    output_dir = root / args.out
    manifest = load_manifest(root, manifest_path)
    skills = discover_skills(root)

    if args.list:
        list_skills(skills)
        return 0

    if not args.skills and not args.all:
        raise SystemExit("Provide one or more skill names, --all, or --list.")

    if args.skills and args.all:
        raise SystemExit("Use either explicit skill names or --all, not both.")

    targets = sorted(skills) if args.all else args.skills
    for target in targets:
        result = package_skill(
            root=root,
            output_dir=output_dir,
            manifest=manifest,
            skills=skills,
            skill_name=target,
            strict=args.strict,
        )
        print(
            f"Packaged {result['name']}: "
            f"{result['references_count']} references, "
            f"folder={display_path(result['folder'])}, "
            f"zip={display_path(result['zip'])}"
        )
        if result["missing_references"]:
            print(
                "  unresolved: "
                + ", ".join(result["missing_references"]),
                file=sys.stderr,
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
