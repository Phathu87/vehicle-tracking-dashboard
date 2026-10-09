# Phase 3.4B-S1 - Blender Setup

Owner: Phathutshedzo Rakhunwana. Verification date: 2026-10-09 (Africa/Johannesburg).
Status: BLOCKED. Official portable distribution downloaded and extracted;
installation is NOT operational. No full vehicle modelling was attempted.

## Environment and Discovery

- Windows 11 Home Single Language, version 10.0.26300, x64.
- CPU: AMD Ryzen 5 3500U, four cores.
- OS-visible physical memory: 6,386,728,960 bytes (~5.95 GiB).
- GPU: AMD Radeon Vega 8 Graphics; driver 27.20.11044.5003.
- C: free space before installation: 27,345,551,360 bytes (~25.47 GiB);
  after extraction: 25,987,715,072 bytes (~24.20 GiB).
- Blender was not found on PATH, in standard Program Files/LocalAppData
  locations, immediate user folders, Store packages, or checked portable
  locations C:\Blender, C:\Tools, C:\PortableApps and user Programs/scoop paths.
  This bounded search does not prove absence from every disk/directory.
- Windows Package Manager exists at
  C:\Users\Admin\AppData\Local\Microsoft\WindowsApps\winget.exe;
  explicit invocation returned v1.29.380. DesktopAppInstaller is registered.
  It was not found by this shell's Get-Command lookup. No choco/scoop command
  was found. Official portable ZIP was selected instead of a package-manager install.

The machine has less RAM than the published 8 GB minimum. Windows/CPU architecture
match the selected distribution; complete GPU/API compatibility and interactive
performance remain NOT VALIDATED. Low RAM is a limitation, not an established
cause of the activation failure. No hardware/driver changes were made.

## Official Distribution and Installation

Selected version: Blender 4.5.14 LTS Windows x64, pinned from the official 4.5
release index. This is the package version, not output from a working local CLI.

Source:
https://download.blender.org/release/Blender4.5/blender-4.5.14-windows-x64.zip

Checksum source:
https://download.blender.org/release/Blender4.5/blender-4.5.14.sha256

Archive bytes: 398,661,046.
Official and downloaded SHA-256 both:
`b9533d2397ac1984db4466fb23a7a4649391cca93f6e84209f9bcc60d071c8b9`.

Portable executable:
`C:\Users\Admin\AppData\Local\FleetDriveTooling\Blender\blender-4.5.14-windows-x64\blender.exe`

Executable SHA-256:
`57fa1d294ea76448c3bec84ca758caf4629611330abba7dcf55bb0c56a0a15ab`.

The archive was downloaded, verified BEFORE extraction, then extracted using
PowerShell Expand-Archive. Installation and retained verified ZIP are outside
Git. No PATH, file associations or system runtimes were changed. No unrelated
software was installed; no elevation/UAC prompt was bypassed. Tool permission
approval enabled network/filesystem inspection outside the managed sandbox;
it does not establish that the Windows process ran as administrator.

## Verification Commands and Results

Commands attempted from the repository and installation directory:

```powershell
$blender = 'C:\Users\Admin\AppData\Local\FleetDriveTooling\Blender\blender-4.5.14-windows-x64\blender.exe'
& $blender --version
$env:BLENDER_USER_CONFIG = Join-Path $env:TEMP 'fleet-blender-s1-config'
$env:BLENDER_USER_SCRIPTS = Join-Path $env:TEMP 'fleet-blender-s1-scripts'
$env:BLENDER_USER_DATAFILES = Join-Path $env:TEMP 'fleet-blender-s1-data'
& $blender --background --factory-startup --disable-autoexec --python-exit-code 1 --python '.qa-blender-s1\export-test.py' -- 'C:\Users\Admin\vehicle-tracking-dashboard\.qa-blender-s1\setup-cube.glb'
```

These are recorded test commands; temporary files have been removed, so they
are not runnable verbatim without recreating the test below. Environment
overrides were process-local, not persistent user settings.

Both CLI and background attempts failed before Blender/Python execution:
Windows reported that the application's side-by-side configuration was incorrect.
Repeating outside the sandbox, using the installation working directory and
Start-Process with WindowStyle Hidden produced the same error. No interactive
Blender window was successfully launched. No CLI version output was obtained.

Read-only Windows Application log inspection identified SideBySide event 33:
activation context generation failed; dependent assembly
`blender.crt,type="win32",version="1.0.0.0"` could not be found.
The bundled blender.crt directory, manifest and DLLs exist. A read-only SHA-256
comparison of 52 executable/CRT archive entries against installed files found
ZERO mismatches. Therefore incomplete extraction of those files is not supported
by the evidence. Exact activation-resolution cause remains undiagnosed.

An attempted `sxstrace.exe Trace -logfile:<temporary-directory>\activation.etl
-nostop` returned `StartTrace failed. Unknown Error.` No trace was produced.
No manifest patches, copied system DLLs, registry edits, runtime installers or
security-policy workarounds were attempted. Administrator diagnostic/repair may
be necessary and needs explicit approval if it requires an interactive/UAC step.

## Isolated Export Test

The temporary script would clear the factory scene, create a one-metre cube,
assert eight source vertices/six faces, and export a selected binary GLB using:

```python
import bpy
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 0.0, 0.5))
obj = bpy.context.object
obj.name = 'IsolatedSetupCube'
bpy.context.scene.unit_settings.system = 'METRIC'
bpy.context.scene.unit_settings.scale_length = 1.0
assert len(obj.data.vertices) == 8
assert len(obj.data.polygons) == 6
result = bpy.ops.export_scene.gltf(
    filepath=output, export_format='GLB', use_selection=True,
    export_yup=True, export_animations=False,
)
assert result == {'FINISHED'}
```

`output` was supplied as an absolute path inside .qa-blender-s1. This code never
ran because process activation failed. Mesh creation: NOT EXECUTED. GLB export:
NOT EXECUTED. No setup-cube.glb exists; header/chunk/accessor/index/finite-position
and nonzero-geometry validation could not be performed. No export PASS is claimed.
The temporary Python script, two empty process-output logs and empty scratch
directory were removed after recording this evidence. No test assets remain.

## Acceptance Gate

| Gate | Result | Evidence / limitation |
| --- | --- | --- |
| Blender installed | FAIL | Verified files extracted; usable installation blocked by Windows activation |
| Blender launches | FAIL | Side-by-side configuration error |
| CLI | FAIL | --version cannot start |
| Python scripting | FAIL | Process never reaches bpy |
| Mesh creation | FAIL | Test not executed |
| GLB export | FAIL | Test not executed; no exported artifact |
| Headless execution | FAIL | Background process cannot start |
| Existing GLBs preserved | PASS | Both pre-existing hashes match |
| Frozen 2D assets preserved | PASS | All pre-existing image hashes match preservation inventory |
| Database/runtime unchanged | PASS | Preserved source/data/database hashes |
| git diff --check | PASS | Exit zero; existing LF/CRLF warnings only |

Before and after checks compare all 426 files from Phase 3.4B-S's preservation
inventory, plus both recovery deliverables (428 files total). No changes found.
Recovery inventory hash: 467f02a88ea7692ee504718644d5526bf0d44985cd541a7fa38b41d53284babb.
Recovery report hash: ff5ac6c9dfbcdbeb1e15f71442896049dfddc36e42f39f3fd90911a1f52d17a3.
All 16 existing QA renders, scripts and provenance are preserved; both vehicle
models retain BLOCKED visual status. Existing dirty work remains untouched.
Frontend/backend tests were not run: this is tooling/documentation-only work.

## Remaining Limitations and Next Approval

Setup is BLOCKED, not ready for reconstruction. Next step is owner-approved
Windows activation diagnosis/repair, potentially official installer repair with
interactive administrator confirmation. Do not assume installing a generic VC++
runtime fixes the named bundled assembly. Following a successful repair, repeat
CLI, bpy/mesh creation, background execution and actual GLB structure/geometry
validation before any feature study. Interactive viewport/GPU capability remains
a distinct check; the below-minimum memory must remain visible in readiness decisions.

No Sedan/Hatchback rebuild, other categories, runtime/map/simulator changes,
commits, pushes or deployment. STOP after this setup report.

## Official Sources

- [Blender 4.5 release distribution](https://download.blender.org/release/Blender4.5/): archive/version and matching checksum were read directly over HTTPS.
- [Windows portable installation](https://docs.blender.org/UATEST/manual/en/4.5/getting_started/installing/windows.html): official ZIP extraction route.
- [System requirements](https://www.blender.org/download/requirements/): published requirements do not guarantee compatibility of this specific local GPU/driver.
