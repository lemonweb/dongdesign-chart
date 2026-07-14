#!/usr/bin/env python3
"""Resolve a local dongDesign Chart Wiki or return its public fallback."""

import argparse
import json
import subprocess
from pathlib import Path


SENTINELS = (
    "ai-file-index.md",
    "00-overview/how-to-use.md",
    "00-overview/ai-reading-flow.md",
)

TASK_FILES = {
    "dashboard": (
        "00-overview/decision-tree.md",
        "03-pattern/README.md",
        "01-design-language/README.md",
        "06-self-check/design-checklist.md",
    ),
    "selection": (
        "00-overview/decision-tree.md",
        "02-chart-type/selection-rules.md",
        "02-chart-type/capability-matrix.md",
    ),
    "style": (
        "01-design-language/README.md",
        "01-design-language/theme-token.md",
        "01-design-language/color.md",
        "01-design-language/typography.md",
    ),
    "code": (
        "01-design-language/README.md",
        "04-adaptation/theme-schema.md",
        "04-adaptation/echarts-adapter.md",
        "06-self-check/code-checklist.md",
    ),
    "review": (
        "05-rules/README.md",
        "06-self-check/design-checklist.md",
        "06-self-check/code-checklist.md",
    ),
}

REMOTE = {
    "wiki": "https://github.com/lemonweb/dongdesign-chart/wiki",
    "repository": "https://github.com/lemonweb/dongdesign-chart",
    "wikiGit": "https://github.com/lemonweb/dongdesign-chart.wiki.git",
}


def ancestors(start: Path):
    current = start.resolve()
    if current.is_file():
        current = current.parent
    yield current
    yield from current.parents


def find_wiki_root(starts):
    seen = set()
    for start in starts:
        for candidate in ancestors(start):
            if candidate in seen:
                continue
            seen.add(candidate)
            if all((candidate / sentinel).is_file() for sentinel in SENTINELS):
                return candidate
    return None


def git_commit(root: Path):
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "rev-parse", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        return None
    return result.stdout.strip() or None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", action="append", default=[])
    parser.add_argument("--task", choices=sorted(TASK_FILES), default="dashboard")
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    starts = [Path(item) for item in args.start] or [Path.cwd()]
    starts.extend((skill_dir, skill_dir.parent))
    root = find_wiki_root(starts)

    base_files = list(SENTINELS)
    task_files = list(TASK_FILES[args.task])
    required = base_files + task_files
    missing = [item for item in required if not root or not (root / item).is_file()]
    if root and not missing:
        files = [str(root / item) for item in required]
        result = {
            "source": "local",
            "root": str(root),
            "task": args.task,
            "files": files,
            "commitSha": git_commit(root),
            "remoteFallback": REMOTE,
        }
    else:
        result = {
            "source": "remote",
            "task": args.task,
            "requiredTopics": required,
            **REMOTE,
        }
        if root:
            result["localCandidate"] = str(root)
            result["missingLocalFiles"] = missing

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
