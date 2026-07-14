import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL_KEYS = [
    "dashboardMeta",
]

REQUIRED_META_KEYS = [
    "title",
    "scenario",
    "audience",
    "businessObjective",
]


def validate_spec(path: str) -> None:
    file_path = Path(path)
    if not file_path.exists():
        raise FileNotFoundError(f"Spec file not found: {path}")

    data = json.loads(file_path.read_text(encoding="utf-8"))

    missing_top = [key for key in REQUIRED_TOP_LEVEL_KEYS if key not in data]
    if missing_top:
        raise ValueError(f"Missing required top-level keys: {', '.join(missing_top)}")

    meta = data.get("dashboardMeta", {})
    missing_meta = [key for key in REQUIRED_META_KEYS if key not in meta]
    if missing_meta:
        raise ValueError(f"Missing dashboardMeta keys: {', '.join(missing_meta)}")

    sections = None
    if "analysisFramework" in data:
        sections = data.get("analysisFramework", {}).get("sections")
    elif "sections" in data:
        sections = data.get("sections")

    if not isinstance(sections, list) or not sections:
        raise ValueError("A dashboard spec must include a non-empty sections list, either at sections or analysisFramework.sections")

    for index, section in enumerate(sections, start=1):
        for key in ["sectionKey", "title", "businessQuestion"]:
            if key not in section:
                raise ValueError(f"Section {index} missing required key: {key}")

    visual_standard = data.get("visualStandard", {})
    if not visual_standard:
        print("WARNING: visualStandard is missing. Resolve the DongDesign Wiki and record its source and pages.")
    else:
        source = visual_standard.get("source")
        if source not in {"local", "remote", "local_or_remote"}:
            raise ValueError("visualStandard.source must be local, remote, or local_or_remote")
        pages = visual_standard.get("pages")
        if not isinstance(pages, list) or not pages:
            raise ValueError("visualStandard.pages must contain the Wiki files or public pages used")

    # Generated visuals declare the design system, while concrete values come from the resolved Wiki.
    vibe = data.get("vibeCodingSpec", {})
    design_system = vibe.get("designSystem")
    if design_system is None:
        print("WARNING: vibeCodingSpec.designSystem is missing. It should be \"dongdesign\".")
    elif design_system != "dongdesign":
        raise ValueError(
            f"designSystem must be \"dongdesign\" to conform to the DongDesign chart standard, got: {design_system!r}"
        )
    print("Dashboard spec is valid.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python validate_dashboard_spec.py <dashboard_spec.json>")
        sys.exit(1)
    validate_spec(sys.argv[1])
