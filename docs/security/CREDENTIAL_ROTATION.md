# Credential Rotation

Date: 2026-09-23

## Incident

| Field | Finding |
| --- | --- |
| Credential type | Mapbox public access token |
| Historical location | `app/.env` in commits including `71b294d` and `88d06df` |
| Variable | `VITE_MAPBOX_TOKEN` |
| Current source | The tracked file is deleted and root ignore rules block local `.env` files |
| Release dependency | None. The authoritative frontend uses Leaflet with OpenStreetMap tiles |
| Rotation status | **REVOKED - OWNER CONFIRMED** |
| Current application dependency on old token | **NONE** |
| Current map implementation | Leaflet / OpenStreetMap |

The token value is intentionally omitted. Current source contains only an empty legacy `app/.env.example` variable name.

## Closure

The repository owner confirmed on 2026-09-25 that a replacement token was generated and the historically exposed token was revoked or disabled. Neither value was requested, displayed, recovered, logged or recorded in this repository.

The repository secret scan must remain clean before release. Provider-side revocation is recorded as owner-confirmed because the credential value is intentionally unavailable for direct verification.

## Replacement configuration

No replacement is required by Fleet Drive AI Demo. If the legacy reference application is run separately, use a local untracked environment variable and a least-privilege public token.

## History decision

- **Option A, recommended minimum:** revoke the credential and leave the obsolete value in history. This removes active-secret risk without rewriting shared history.
- **Option B:** rewrite history only after explicit owner approval, coordinate every clone/fork, and force-push deliberately.

The historical credential P0 is **RESOLVED**. History rewriting is a separate decision and was not performed.
