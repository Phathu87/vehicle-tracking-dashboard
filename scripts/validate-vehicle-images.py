"""Validate acquired vehicle images without loading the backend or database."""

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def read_json(relative):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def require(condition, message):
    if not condition:
        raise ValueError(message)


def main():
    manifest = read_json("docs/assets/V1_1_PRIORITY_A_VEHICLE_ACQUISITION_MANIFEST.json")
    provenance = read_json("docs/assets/vehicle-image-provenance.json")
    fleet = read_json("server/data/fleet.json")
    vehicles = {v["id"]: v for v in fleet["vehicles"]}
    drivers = {d["id"]: d for d in fleet["drivers"]}
    records = {p["visualKey"]: p for p in provenance}
    require(len(records) == len(provenance), "Duplicate provenance visual key")
    require(len({p["assetId"] for p in provenance}) == len(provenance), "Duplicate asset ID")
    available = [v for v in manifest["vehicles"] if v["status"] == "AVAILABLE"]
    require({v["visualKey"] for v in available} == set(records), "Orphan provenance or missing record")
    expected_files = set()
    for entry in available:
        key = entry["visualKey"]
        record = records[key]
        vehicle = vehicles[entry["vehicleId"]]
        for left, right in {"registration": "plate", "year": "year", "make": "make",
                            "model": "model", "vehicleType": "vehicleType", "visualKey": "visualKey"}.items():
            require(entry[left] == vehicle[right], f"Identity mismatch: {key}/{left}")
        require(drivers[entry["driverId"]]["name"] == entry["driverName"], f"Driver mismatch: {key}")
        require({"driverId": entry["driverId"], "vehicleId": entry["vehicleId"]}
                in fleet["currentOperations"], f"Current-operation mismatch: {key}")
        require(record["vehicleIds"] == [entry["vehicleId"]], f"Coverage mismatch: {key}")
        require(entry["targetRuntimePath"] == record["file"] == f"/assets/vehicles/images/{key}.webp",
                f"Path mismatch: {key}")
        target = ROOT / "public" / record["file"].lstrip("/")
        require(target.resolve().is_relative_to((ROOT / "public/assets/vehicles/images").resolve()),
                "Asset path outside allowed directory")
        expected_files.add(target.name)
        data = target.read_bytes()
        require(hashlib.sha256(data).hexdigest() == record["sha256"] == entry["sha256"], f"Hash mismatch: {key}")
        require(len(data) == record["finalBytes"] == entry["finalBytes"], f"Size mismatch: {key}")
        with Image.open(target) as image:
            image.load()
            require(image.format == "WEBP" and image.size == (1200, 800), f"Invalid WebP/canvas: {key}")
            require(not any(image.info.get(k) for k in ["exif", "xmp", "icc_profile"]), f"Embedded metadata: {key}")
            require(image.mode == "RGBA" and image.getextrema()[-1][0] == 0, f"Alpha lost: {key}")
        require(record["exactness"] == entry["actualExactness"] == "GENERATED_REPRESENTATIVE",
                f"Dishonest exactness: {key}")
        require(record["sourceType"] == "GENERATED" and record["license"] == "PROJECT_ASSET", f"Source mismatch: {key}")
        require(record["commercialUseAllowed"] is True and record["modificationAllowed"] is True
                and record["attributionRequired"] is False, f"Permissions incomplete: {key}")
        require(all(k in record for k in ["creator", "sourceReference", "createdAt", "notes", "attribution"]),
                f"Provenance incomplete: {key}")
        spec_name, _, spec_key = record["sourceReference"].partition("#")
        require(Path(spec_name).name == spec_name and spec_name.endswith(".json"), "Invalid specification path")
        require(spec_key == key, f"Specification key mismatch: {key}")
        specs = read_json(f"docs/assets/{spec_name}")
        require(any(key in s["visualKeys"] for s in specs["specifications"]), f"Missing prompt: {key}")
        print(f"PASS {key}: 1200x800 WebP, {len(data):,} bytes")
    require({p.name for p in (ROOT / "public/assets/vehicles/images").iterdir()} == expected_files,
            "Orphan or unexpected vehicle file")
    print(f"PASS: {len(available)} images; identity, provenance, hashes, decode, canvas and metadata checks.")
    print("Text, body style and visual suitability require the documented manual review.")


if __name__ == "__main__":
    main()
