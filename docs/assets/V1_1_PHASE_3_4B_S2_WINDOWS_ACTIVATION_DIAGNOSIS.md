# Phase 3.4B-S2 - Windows Activation Diagnosis

Owner: Phathutshedzo Rakhunwana. Date: 2026-10-09 (Africa/Johannesburg).
Status: PARTIAL. Read-only diagnosis completed; Blender remains blocked.
Root-cause classification: UNDETERMINED.
Observed failure mechanism: side-by-side activation cannot resolve blender.crt.
Repair applied: NO. Blender operational: NO. Safe to proceed with modelling: NO.

## Environment and Preserved Installation

Read the existing Phase 3.4B-S1 setup report before diagnosis. Windows remains
Windows 11 Home Single Language, 10.0.26300, x64; the fresh OS API returned
Microsoft Windows NT 10.0.26300.0 and OSArchitecture X64. Direct PE-header
inspection of blender.exe returned Machine 0x8664 (AMD64/x64), matching Windows.
Version 4.5.14 LTS is the official distribution version, not a successful CLI
version report. Executable path:

`C:\Users\Admin\AppData\Local\FleetDriveTooling\Blender\blender-4.5.14-windows-x64\blender.exe`

Archive path is the installation directory path plus `.zip`. Both remain
outside Git. No installation files, security settings, registry, PATH or
application dependencies were changed. No other Blender version was installed.

## Exact Launch and Event Error

Fresh `blender.exe --version` failed before application startup:

```text
The application has failed to start because its side-by-side configuration is incorrect.
Please see the application event log or use the command-line sxstrace.exe tool for more detail.
```

The fresh Application log contained SideBySide provider event ID 33,
timestamp 2026-10-09 12:35:12 as displayed by Windows:

```text
Activation context generation failed for
"C:\Users\Admin\AppData\Local\FleetDriveTooling\Blender\blender-4.5.14-windows-x64\blender.exe".
Dependent Assembly blender.crt,type="win32",version="1.0.0.0" could not be found.
Please use sxstrace.exe for detailed diagnosis.
```

A second event reports the same dependency through the executable's short path.
The PowerShell launch error and event identify the failure mechanism, but do not
prove which probing, policy or manifest-resolution step fails. A missing-assembly
event does NOT prove the bundled DLLs are absent or require a system-wide installer.

## Manifest, Access and Security Inspection

- Required blender.crt directory and blender.crt/blender.crt.manifest exist.
- XML parsing succeeds. Assembly identity is type win32, name blender.crt,
  version 1.0.0.0, namespace urn:schemas-microsoft-com:asm.v1.
- All 50 file references in the manifest exist under the CRT directory.
- The manifest ACL grants the owner, SYSTEM and Administrators full control;
  the sandbox user group has ReadAndExecute. No permissions were altered.
- All installed files were successfully opened and hashed in the integrity audit.
- blender.exe Authenticode status: Valid; message: Signature verified.
- Executable/manifest attributes: Archive. CRT directory attribute: Directory.
- No Zone.Identifier stream was found on the retained ZIP or on installed
  .exe, .dll or .manifest files. No Unblock-File operation was performed.
- Recent (three-hour window) CodeIntegrity and Defender operational logs had no
  Blender/FleetDriveTooling matching events. AppLocker EXE/DLL query returned
  no events matching the requested window. This bounded log check does not
  exclude every possible third-party security product or earlier policy event.

These results do not establish WINDOWS_SECURITY_BLOCK, INCOMPATIBLE_PLATFORM,
MISSING_RUNTIME_COMPONENT or a malformed manifest. Signature validity does not
by itself prove application compatibility or successful activation.

## Complete Extraction Integrity

Recomputed archive SHA-256:
`b9533d2397ac1984db4466fb23a7a4649391cca93f6e84209f9bcc60d071c8b9`.
It matches the official checksum recorded in the setup report.

Opened the ZIP read-only using System.IO.Compression.ZipFile. For every
non-directory entry, stripped the archive's common top-level directory, resolved
the corresponding installed file and compared stream SHA-256 against disk SHA-256.

| Check | Result |
| --- | --- |
| Archive regular files compared | 5,525 |
| Total uncompressed bytes | 924,651,575 |
| Missing files | 0 |
| Byte/hash mismatches | 0 |
| Read/access errors | 0 |

This is full content comparison, not merely successful ZIP download or file-size
comparison. Incomplete extraction is not supported by the evidence. Directory
metadata, NTFS policies and activation probing are not certified by byte equality.

## Native Side-by-Side Tracing

sxstrace.exe exists at C:\WINDOWS\system32\sxstrace.exe. Attempted:

```powershell
$trace = Join-Path $env:TEMP 'fleet-blender-s2-activation.etl'
sxstrace.exe Trace -logfile:$trace -nostop
```

Output: `StartTrace failed. Error message is: Unknown Error.` No trace file was
created, so parsing/probing-path evidence is unavailable. The native utility
returned process exit zero despite reporting failure; exit code alone was not
treated as PASS. WindowsPrincipal.IsInRole(Administrator) returned false.
Tool permission escalation did not provide a Windows administrator token.
Lack of privilege is a possible explanation for trace failure, not a proven
error-code diagnosis. No UAC bypass, global trace stop or system repair was used.

## Root-Cause Decision and Repair Approval

Classification: UNDETERMINED. Confirmed symptom is side-by-side activation failure;
underlying private-assembly lookup failure is unresolved. Do not classify this
as SIDE_BY_SIDE_MANIFEST_FAILURE in the sense of a proven invalid manifest:
well-formed XML and matching files are verified, but Windows semantic/probing
acceptance still needs a successful trace.

No verified low-risk repair has been established. Repair proposed: NONE at this
time. Re-extraction would replace identical bytes without evidence of benefit.
A generic system VC++ runtime install, CRT relocation, manifest modification,
alternative version or Windows repair is not justified by these results.

Recommended next action: request owner approval for a bounded administrator
sxstrace capture, using a genuinely elevated Windows terminal/UAC confirmation.
This is further diagnosis, NOT permission to apply a repair. Record exact private
assembly probing paths and errors, then propose the smallest evidence-based
repair and obtain separate approval before any installation/file/policy change.
No automatic approval request for a speculative repair is made in this phase.

Approved future trace sequence: start trace into a dedicated temporary file,
attempt only blender.exe --version, stop ONLY the trace started by that diagnostic
session, and parse the captured ETL with a Blender filter. If tracing cannot start,
do not stop unrelated tracing sessions. Keep diagnostic files outside runtime/Git
or record a narrowly scoped excerpt in a subsequent approved report.

## Verification Plan After Separately Approved Repair

1. Invoke the pinned absolute executable with --version; require version output
   and successful process exit, not installation-file presence alone.
2. Use --background --factory-startup --disable-autoexec --python-exit-code 1
   with a controlled Python script; verify bpy version and background state.
3. Create a temporary simple mesh and assert source vertices/faces.
4. Export binary GLB via bpy.ops.export_scene.gltf with export_format='GLB'.
5. Independently validate GLB magic/version 2/declared length/chunk layout,
   JSON scene/mesh/accessors, bounded buffer views, nonzero finite positions,
   valid indices and triangles. Actual exported geometry is required.
6. Record results and hashes, remove temporary test assets, and recheck protected
   application/model/image/database files. A cube export does not approve vehicle
   visual quality, GPU performance or reconstruction.

Current CLI: FAIL. Python/background/mesh/export/GLB-geometry verification:
NOT EXECUTED because launch is blocked. No vehicle models or test GLBs created.
The prior below-minimum RAM limitation remains separate from this activation
diagnosis; no inference that RAM caused this particular error is made.

## Preservation and Closeout

Repository unchanged means all pre-existing protected files preserved, with this
requested diagnostic report as the sole intentional addition. The 426-file
Phase 3.4B-S inventory plus three recovery/setup documents are checked before
and after (429 protected files). Both GLBs, all existing 2D assets, 16 QA renders,
scripts, provenance, database/runtime and package manifests remain unchanged.
No application processes, seed/migration, dependency installation, repair,
model rebuild, commits, push or deployment were performed. No ETL was created.
Runtime test suites were not run for this documentation/read-only diagnostic work.
STOP after this report; Phase 3.4C is not authorized.

## Diagnostic References

- [Microsoft sxstrace](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sxstrace): native trace and parse syntax.
- [Microsoft assembly search sequence](https://learn.microsoft.com/en-us/windows/win32/sbscs/assembly-searching-sequence): private assembly probing includes the application's named assembly subdirectory. The expected layout is present locally, but actual failed probing paths remain unavailable.
