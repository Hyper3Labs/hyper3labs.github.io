"""Mount reviewed HyperView Static Spaces into public/spaces/.

The mounted bundles are committed, so the GitHub Pages workflow's plain
`next build` ships working viewers without any cross-repository checkout.
Re-run this script after re-exporting bundles in HyperView/hyperview-spaces.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from hyperview.static_export import copy_static_bundle


def _read_json(path: Path) -> dict[str, object]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"Expected a JSON object: {path}")
    return payload


def main() -> None:
    site_root = Path(__file__).resolve().parents[1]
    hyperview_root = Path(
        os.environ.get("HYPERVIEW_ROOT", site_root.parent / "HyperView")
    ).expanduser().resolve()
    spaces_repo = Path(
        os.environ.get(
            "HYPERVIEW_SPACES_REPO",
            hyperview_root / "hyperview-spaces",
        )
    ).expanduser().resolve()
    registry_path = spaces_repo / "static-spaces.registry.json"
    registry = _read_json(registry_path)
    static_spaces = registry.get("static_spaces")
    if not isinstance(static_spaces, list):
        raise RuntimeError(f"{registry_path} must contain a static_spaces list.")
    bundles_root = Path(
        os.environ.get("HYPERVIEW_STATIC_SPACES_ROOT", spaces_repo)
    ).expanduser().resolve()
    spaces_root = Path(
        os.environ.get("HYPERVIEW_MOUNT_ROOT", site_root / "public" / "spaces")
    ).expanduser().resolve()
    spaces_root.mkdir(parents=True, exist_ok=True)

    mounted: list[dict[str, object]] = []
    for entry in static_spaces:
        if not isinstance(entry, dict):
            raise RuntimeError(f"Invalid Static Space entry: {entry!r}")
        slug = entry.get("slug")
        bundle_folder = entry.get("bundle_folder")
        if (
            not isinstance(slug, str)
            or not isinstance(bundle_folder, str)
        ):
            raise RuntimeError(f"Incomplete Static Space entry: {entry!r}")
        source = bundles_root / bundle_folder
        source_manifest_path = source / "hyperview-static.json"
        if not source_manifest_path.is_file():
            raise RuntimeError(f"Missing reviewed HyperView Static Space: {source}")
        source_manifest = _read_json(source_manifest_path)
        capabilities = source_manifest.get("capabilities")
        if (
            source_manifest.get("kind") != "hyperview-static-space"
            or source_manifest.get("static") is not True
            or source_manifest.get("warnings") != []
            or not isinstance(capabilities, dict)
            or capabilities.get("text_search") is not False
        ):
            raise RuntimeError(
                f"Static Space {slug} does not satisfy the reviewed static contract."
            )

        destination = spaces_root / slug
        result = copy_static_bundle(source, destination)
        mounted_manifest = _read_json(destination / "hyperview-static.json")

        # A bundle that names its own prefix, or links shell assets from the
        # origin root, only works at one path. These must stay relative.
        index_html = (destination / "index.html").read_text(encoding="utf-8")
        if "__HYPERVIEW_MOUNT_PATH__" in index_html:
            raise RuntimeError(f"Mounted Space pins a URL prefix: {destination}")
        if 'src="/_next/' in index_html or 'href="/_next/' in index_html:
            raise RuntimeError(f"Mounted Space still has root shell assets: {destination}")

        mounted.append(
            {
                "slug": slug,
                "source": bundle_folder,
                "mount_path": f"/spaces/{slug}",
                "live_space_id": entry.get("live_space_id"),
                "live_url": entry.get("live_url"),
                "workspace": mounted_manifest.get("workspace"),
                "num_files": result.num_files,
                "bundle_bytes": result.bundle_bytes,
            }
        )

    (spaces_root / "mounted-spaces.json").write_text(
        json.dumps({"spaces": mounted}, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(
        f"Mounted {len(mounted)} HyperView Static Spaces under {spaces_root} "
        f"({sum(int(item['bundle_bytes']) for item in mounted)} bytes)."
    )


if __name__ == "__main__":
    main()
