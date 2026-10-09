"""Convert the explicitly supplied owner PNGs; never modify the masters."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    'DRV-001': 'DRV-001_Ayanda_Dlamini.png',
    'DRV-002': 'DRV-002_Siyabonga_Naidoo.png',
    'DRV-003': 'DRV-003_Thandi_Mokoena.png',
    'DRV-004': 'DRV-004_Lerato_Nkosi.png',
    'DRV-005': 'DRV-005_Lerato_Khumalo.png',
    'DRV-006': 'DRV-006_Riyaad_Ahmed.png',
    'DRV-007': 'DRV-007_Carmen_Botha.png',
    'DRV-008': 'DRV-008_Sipho_Ndlovu.png',
    'DRV-009': 'DRV-009_Naledi_Peters.png',
    'DRV-010': 'DRV-010_Johan_van-der_Merwe.png',
    'DRV-011': 'DRV-011_Musa_Nkomo.png',
    'DRV-012': 'DRV-012_Leah_Jacobs.png',
    'DRV-013': 'DRV-013_Fhulufhelo_Makhale.png',
    'DRV-014': 'DRV-014_Zanele_Sithole.png',
    'DRV-015': 'DRV-015_Tshifhiwa_Netshandama.png',
    'DRV-016': 'DRV-016_Sipho_Sithole.png',
    'DRV-017': 'DRV-017_Refilwe_Mokoena.png',
    'DRV-019': 'DRV-019_Dineo_Naidoo.png',
    'DRV-024': 'DRV-024_Jared_Jacobs.png',
}
# Visually reviewed source-pixel crops exclude labels without editing faces.
CROPS = {
    'DRV-001': (87, 0, 1167, 1080),
    'DRV-002': (87, 0, 1167, 1080),
    'DRV-005': (97, 0, 1157, 1060),
    'DRV-009': (330, 0, 1254, 924),
    'DRV-012': (0, 0, 975, 975),
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-directory', required=True)
    parser.add_argument('--driver-ids', nargs='+', required=True)
    parser.add_argument('--integrated-at', required=True)
    args = parser.parse_args()
    manifest = json.loads((ROOT / 'docs/assets/driver-asset-manifest.json').read_text())
    drivers = {d['driverId']: d for d in manifest['drivers']}
    provenance_path = ROOT / 'docs/assets/driver-portrait-provenance.json'
    records = json.loads(provenance_path.read_text()) if provenance_path.exists() else []
    existing_ids = {record['driverId'] for record in records}
    if len(set(args.driver_ids)) != len(args.driver_ids):
        raise ValueError('Duplicate requested driver ID')
    inventory = []
    for driver_id in args.driver_ids:
        if driver_id not in drivers or driver_id not in SOURCES:
            raise ValueError(f'Unknown driver: {driver_id}')
        filename = SOURCES[driver_id]
        if driver_id in existing_ids or (ROOT / f'public/assets/drivers/{driver_id}.webp').exists():
            raise ValueError(f'Existing portrait is frozen: {driver_id}')
        source = Path(args.source_directory) / filename
        with Image.open(source) as image:
            image.load()
            if image.format != 'PNG' or image.size != (1254, 1254):
                raise ValueError(f'Source differs from reviewed input: {filename}')
            inventory.append((driver_id, filename, source, hashlib.sha256(source.read_bytes()).hexdigest()))
    output = ROOT / 'public/assets/drivers'
    output.mkdir(parents=True, exist_ok=True)
    new_records = []
    for driver_id, filename, source, source_hash in inventory:
        driver = drivers[driver_id]
        crop = CROPS.get(driver_id, (0, 0, 1254, 1254))
        target = output / f'{driver_id}.webp'
        with Image.open(source) as image:
            portrait = image.convert('RGB').crop(crop).resize((512, 512), Image.Resampling.LANCZOS)
            portrait.save(target, 'WEBP', quality=88, method=6)
        if hashlib.sha256(source.read_bytes()).hexdigest() != source_hash:
            raise ValueError(f'Source master changed: {filename}')
        new_records.append({
            'assetType': 'DRIVER_PORTRAIT', 'driverId': driver_id,
            'driverName': driver['name'], 'priority': driver['priority'],
            'file': f'/assets/drivers/{driver_id}.webp', 'sourceType': 'GENERATED',
            'sourceReference': 'OWNER_SUPPLIED_GENERATED_ASSET', 'sourceFilename': filename,
            'creator': 'OWNER_SUPPLIED_GENERATED_ASSET',
            'license': 'PROJECT_ASSET', 'commercialUseAllowed': True,
            'modificationAllowed': True, 'attributionRequired': False,
            'exactness': 'FICTIONAL_DRIVER_REPRESENTATION', 'integratedAt': args.integrated_at,
            'sourceSha256': source_hash, 'sourceDimensions': [1254, 1254],
            'sourceFormat': 'PNG', 'sourceAlpha': False, 'sourceValid': True,
            'sourceTextPresent': driver_id in CROPS, 'cropBox': list(crop),
            'cropSuccessful': True, 'finalDimensions': [512, 512],
            'finalBytes': target.stat().st_size, 'finalTextFree': True,
            'notes': 'Owner-approved fictional representation. Mapping uses driver ID; filename and image labels do not overwrite database identity. Crop/resize/WebP encoding only. Original PNG preserved.',
        })
    provenance_path.write_text(json.dumps(records + new_records, indent=2) + '\n')
    print(json.dumps([{'id': r['driverId'], 'name': r['driverName'], 'priority': r['priority'], 'bytes': r['finalBytes']} for r in new_records], indent=2))

if __name__ == '__main__':
    main()
