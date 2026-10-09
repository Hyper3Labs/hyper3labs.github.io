#!/usr/bin/env python3
"""Generate content/examples.json from the hyperview-spaces registries.

The registries in Hyper3Labs/hyperview-spaces are the single source of truth
for every HyperView Space. This script turns them into the public examples
gallery: an entry is listed only when visitors can open it, either as a Static
Space mounted on this site, a Static Space hosted on Hugging Face, or a Live
Space that Hugging Face reports as running or sleeping.

    python3 scripts/build-examples-catalog.py                 # sibling checkout
    python3 scripts/build-examples-catalog.py --spaces-repo .hyperview-spaces
    python3 scripts/build-examples-catalog.py --offline       # skip HF status
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

SOURCE_TREE = "https://github.com/Hyper3Labs/hyperview-spaces/tree/main"
REACHABLE_STAGES = {"RUNNING", "SLEEPING", "RUNNING_BUILDING", "APP_STARTING"}

# Gallery order. Entries not listed here follow in registry order.
ORDER = [
    "hello-world",
    "abo-catalog",
    "fashion-products",
    "precision-regions",
    "logo-search",
    "geospatial",
    "visual-safety",
    "jaguar-multigeometry",
]


def read_object(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"Expected a JSON object: {path}")
    return payload


def hf_stage(space_id: str, timeout: float) -> str:
    request = urllib.request.Request(
        f"https://huggingface.co/api/spaces/{space_id}",
        headers={"Accept": "application/json", "User-Agent": "hyper3labs-docs-catalog/1"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            runtime = json.loads(response.read().decode("utf-8")).get("runtime") or {}
            return str(runtime.get("stage") or "UNKNOWN")
    except urllib.error.HTTPError as exc:
        return "NOT_FOUND" if exc.code == 404 else "UNKNOWN"
    except Exception:  # noqa: BLE001 - an unreachable API must not break the build.
        return "UNKNOWN"


def strip_prefix(name: str) -> str:
    for prefix in ("HyperView - ", "HyperView – ", "HyperView "):
        if name.startswith(prefix):
            return name[len(prefix):]
    return name


def main() -> None:
    site_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--spaces-repo",
        type=Path,
        default=Path(os.environ.get("HYPERVIEW_SPACES_REPO", site_root.parent / "HyperView" / "hyperview-spaces")),
    )
    parser.add_argument("--output", type=Path, default=site_root / "content" / "examples.json")
    parser.add_argument("--offline", action="store_true", help="Do not query Hugging Face; list no Live links.")
    parser.add_argument("--timeout", type=float, default=8.0)
    args = parser.parse_args()

    repo = args.spaces_repo.expanduser().resolve()
    live_entries = read_object(repo / "live-spaces.registry.json").get("spaces", [])
    static_entries = read_object(repo / "static-spaces.registry.json").get("static_spaces", [])
    live_by_folder = {e["folder"]: e for e in live_entries if isinstance(e, dict) and e.get("folder")}
    mounted = {
        item["slug"]
        for item in read_object(site_root / "public" / "spaces" / "mounted-spaces.json").get("spaces", [])
    }
    previews = site_root / "public" / "spaces" / "previews"

    def live_link(entry: dict[str, Any] | None) -> dict[str, str] | None:
        if not entry or entry.get("status") != "live" or "hf-docker" not in entry.get("deploy_targets", []):
            return None
        space_id = entry.get("space_id")
        if not space_id or args.offline or hf_stage(space_id, args.timeout) not in REACHABLE_STAGES:
            return None
        return {"space_id": space_id, "url": f"https://huggingface.co/spaces/{space_id}"}

    examples: list[dict[str, Any]] = []
    seen_folders: set[str] = set()
    for static in static_entries:
        slug = static["slug"]
        folder = static["source_folder"]
        seen_folders.add(folder)
        live = live_by_folder.get(folder)
        gallery = (live or {}).get("gallery") or {}

        if slug in mounted:
            url, host = f"/spaces/{slug}/", "site"
        elif "hf-static" in static.get("deploy_targets", []) and static.get("live_space_id"):
            url, host = f"https://huggingface.co/spaces/{static['live_space_id']}", "huggingface"
        else:
            continue

        source = (live or {}).get("source_repository") or f"{SOURCE_TREE}/{folder}"
        examples.append(
            {
                "slug": slug,
                "name": static.get("name") or strip_prefix((live or {}).get("demo_name", slug)),
                "description": (live or {}).get("description", ""),
                "question": gallery.get("question", ""),
                "workflow": gallery.get("workflow", "Other"),
                "modality": gallery.get("modality", ""),
                "mode": "static",
                "url": url,
                "host": host,
                "live": live_link(live),
                "preview": f"/spaces/previews/{slug}.png" if (previews / f"{slug}.png").is_file() else None,
                "source": source,
            }
        )

    # Live-only Spaces (no static bundle) appear only while they are reachable.
    for entry in live_entries:
        if not isinstance(entry, dict) or entry.get("folder") in seen_folders:
            continue
        live = live_link(entry)
        if not live:
            continue
        slug = entry["demo_slug"]
        gallery = entry.get("gallery") or {}
        examples.append(
            {
                "slug": slug,
                "name": strip_prefix(entry.get("demo_name", slug)),
                "description": entry.get("description", ""),
                "question": gallery.get("question", ""),
                "workflow": gallery.get("workflow", "Other"),
                "modality": gallery.get("modality", ""),
                "mode": "live",
                "url": live["url"],
                "host": "huggingface",
                "live": live,
                "preview": f"/spaces/previews/{slug}.png" if (previews / f"{slug}.png").is_file() else None,
                "source": f"{SOURCE_TREE}/{entry['folder']}",
            }
        )

    rank = {slug: i for i, slug in enumerate(ORDER)}
    examples.sort(key=lambda e: rank.get(e["slug"], len(ORDER)))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({"examples": examples}, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(examples)} examples to {args.output}")


if __name__ == "__main__":
    main()
