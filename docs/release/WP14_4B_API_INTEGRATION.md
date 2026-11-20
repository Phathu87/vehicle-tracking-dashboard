# WP14.4B - Frontend API Integration Implementation

Owner: Phathutshedzo Rakhunwana. Date: 2026-11-20, Africa/Johannesburg.
Baseline: 6e3ed5cf66f54d059dccfc3382f523c806620619, master.
Status: PASS for local implementation and automated validation only.
Hosted preview: NOT DEPLOYED. Production changes: NONE.

## Root Cause and Scope

The live frontend had compiled /api as its base while Netlify's SPA catch-all
returned index.html for API paths. The former client returned HTML as a successful
text value; the authentication context could accept that value as a user.
The WP14.4A plan established DIRECT routing to the new Render API.

This phase implements that plan locally. No provider setting, deployment, account,
backend authentication logic, data, simulator or visual asset was changed. Prior
untracked reports and diagnostic scripts remain intact. No guest access was added.

## Files Changed

| File | Change |
| --- | --- |
| .env.example | Explicit localhost development example and production URL guidance; public settings only |
| netlify.toml | Public build environment for DIRECT API URL and false UI mutation mirror; no proxy rewrite |
| vite.config.js | Validate production API configuration before building |
| src/api/config.js | Shared strict base resolution and validation |
| src/api/client.js | JSON-only API responses, safe contract errors, bounded cold-start timeout and stale-401 protection |
| src/api/auth.js | Validate exact backend session/public-user schemas |
| src/lib/authSession.js | Shared tested token establishment, clearing and restoration operations |
| src/lib/AuthContext.jsx | Consume validated responses and ignore superseded session operations |
| src/test/apiAuthentication.test.js | API configuration, response and session regression coverage |
| docs/release/WP14_4B_API_INTEGRATION.md | This report |

Login, registration pages and protected-route components were reviewed but not
redesigned or modified. Their existing loading indicators, errors and redirects
consume the hardened provider/client behaviour. Backend sources are untouched.

## DIRECT API Configuration

The checked-in Netlify build environment now specifies:

```text
VITE_API_URL=https://fleet-drive-ai-api.onrender.com/api
VITE_DEMO_ALLOW_USER_MUTATIONS=false
```

These are PUBLIC frontend settings, not secrets. No JWT_SECRET, invitation token
or invitation configuration is included. Editing local netlify.toml has not
changed the current Netlify deployment or provider environment.

Base resolution requires an absolute HTTP(S) URL with exactly /api as its path,
no embedded username/password, query or fragment. Production requires HTTPS and
rejects localhost/loopback values. Missing production configuration is an explicit
error, not a silent same-origin /api fallback. Trailing slashes/whitespace are
normalised; /api/api is rejected. Routes retain /auth/login, /auth/register and
/auth/me, with one API prefix owned by the base.

Development without an override retains http://localhost:3001/api. The local
.env.example documents this. For local production validation, explicitly supply
the public production value before npm run build; Vite does not load Netlify's
build.environment automatically when invoked as a standalone local command.
The Vite build guard rejects missing/invalid bases before bundling.

Vite embeds configuration at build time. Provider/context overrides still need
review before any hosted preview. Verify the compiled bundle target after each
approved build; changing an environment setting does not patch an existing bundle.
The existing /* -> /index.html SPA rewrite is unchanged. No /api proxy is added.

## Response Handling

- Success requires parseable JSON with application/json or application/*+json
  content type. 204 remains supported for empty delete responses, but cannot
  establish a user session.
- HTTP 200 HTML, malformed JSON, missing/wrong content type and empty JSON bodies
  produce INVALID_API_RESPONSE. No raw HTML is attached to the error or rendered.
- Login/register must return a nonempty string token plus a public user object.
  /me must return id, username, name and role user/admin. Arbitrary strings, null,
  arrays and malformed objects cannot mark the frontend authenticated.
- Only approved public-user fields are retained. Client shape validation does
  not cryptographically verify JWTs: Express remains the authentication authority.
- JSON 400/401/403/409/429/5xx errors preserve their status, structured code and
  server message. HTML gateway/5xx responses are safe unavailable errors, not
  success. Network failures omit raw transport details and have NETWORK_ERROR.
- Requests, including reading their response bodies, have a bounded 75-second
  timeout for Free-instance cold starts. TIMEOUT explains that the Demo API may
  be starting; explicit caller cancellation is ABORTED. No POST is automatically
  retried, avoiding duplicate login/register side effects.
- No JWTs, passwords, raw invitation material or request payloads are logged.

## Session Behaviour and Registration Safety

Login/register establish token storage only after schema validation. Remember-me
uses localStorage; normal sessions use sessionStorage. Both stores are cleared
before choosing one and on logout. Stored data alone is not proof of server auth.
Restoration calls the authenticated /me endpoint and validates its user response.

401/403 restoration becomes guest; temporary service/contract failure becomes
unavailable with no trusted user, while retaining the stored token for explicit
retry. The existing protected boundary renders loading/retry or redirects guests
to login with returnTo. Logout clears the session and redirects to /login.

AuthProvider versions in-flight operations so superseded responses do not restore
state after logout or a later auth operation. A stale 401 for an older token does
not clear a newer token; restoration clearing is similarly token-bound.

The server's production default-deny registration and username-bound expiring
invitations are unchanged. The ordinary frontend sends no invitation credential;
controlled invitation registration remains the separate approved tester procedure.
The form surfaces a structured 403 rather than bypassing admission. Ordinary
users retain ordinary permissions, and the UI mutation mirror stays false.

SQLite remains ephemeral. No permanent-account/session-retention promise is added.
Logout remains client-side; no new server-side JWT revocation is claimed.

## Automated Validation

| Check | Result |
| --- | --- |
| Frontend lint | PASS |
| Frontend tests | PASS, 18/18, including 13 new API/auth/session tests |
| Production build | PASS, Vite 6.4.3, 2,839 modules |
| Vite production config guard | PASS, rejects /api and accepts explicit DIRECT base |
| Final compiled API base | PASS, exact Render URL; no duplicate /api |
| Authentication response and HTML rejection | PASS, mocked transport; no production accounts |
| Session restoration/storage/logout/error state logic | PASS, shared actual session operations tested with synthetic credentials |
| Timeout and no-automatic-POST-retry | PASS, deterministic mocked aborts, including stalled body |
| Backend regression suite | PASS, 67/67, in-memory/isolated temporary SQLite |
| Local SPA fallback/static assets | PASS |
| git diff --check and new-file whitespace | PASS |
| Hosted preview | NOT DEPLOYED |
| Real-browser login/refresh/logout E2E | NOT RUN |

Tests cover default local and explicit production URL resolution, malformed bases,
auth URL/payload construction, successful JSON schemas, all requested HTTP error
statuses, invalid HTML/JSON, expired/forbidden sessions, retryable unavailability,
both token stores, logout and a late-response/new-token race. All HTTP POSTs in
frontend tests are mocked; backend tests are isolated. No public API request or
production account creation was necessary in this local phase.

The final local build used explicit VITE_API_URL and false mutation mirror; the
final main bundle was checked for the approved base and both rejection codes.
An automatically stopped localhost Vite preview returned the built HTML for /,
/login, /register, /app/dashboard and /about, and JavaScript for the main asset.
These are SPA-delivery checks, not authenticated React/browser acceptance.
Local harness: .topology-recovery/wp14-4b-preview-checks.mjs, ignored and new;
prior diagnostic harnesses were not overwritten. No dependency was added.

## Remaining Risks and Preview Requirements

Playwright is not installed in the current project/test package path. No browser
dependency/software was installed merely for this phase. Real-browser effect/
redirect behaviour, mobile/desktop authentication interaction and hosted CORS must
still be tested before production approval. Local helper/transport tests do not
certify browser E2E or durable production storage.

Required hosted-preview procedure, only after explicit approval:

1. Confirm the source revision to publish, Netlify repository-root base/build/
   dist settings and any context overrides. Commit/push are not authorised here.
2. Approve a non-production preview. Use the exact DIRECT public base and false
   mutation mirror; verify the build actually embeds them and contains no secrets.
3. Verify CORS for the specific preview origin. Production CORS was previously
   verified only for the public Netlify origin; a new preview domain may be denied.
   Do not broaden origins or change Render settings without separate approval.
4. Verify public pages/deep links and static assets are unchanged, health is JSON,
   tokenless /me is 401 JSON and HTML cannot authenticate. Do not add a proxy fallback.
5. Obtain separate disposable-account test approval and confidential invitation
   handling before any hosted login/register test. Check ordinary roles, refresh,
   expiry, invalid token, logout, cold starts and mobile/desktop errors without
   storing credentials in logs or screenshots.
6. Require successful preview/security acceptance before asking for production
   publication. Free-instance durability remains explicitly out of scope.

## Rollback and Preservation

The baseline 6e3ed5c frontend is a public-site availability checkpoint, not a
working-auth fallback. No current deployment/configuration was changed to roll
back. A later failed preview must not be promoted. If an approved production
release regresses, restore the recorded prior frontend deployment/environment
context, acknowledging its historical API problem; never weaken server admission,
change JWT secrets, replace Render services or restore databases as a UI rollback.

The historical 426-file inventory has no unexpected differences beyond approved
R1 backend changes and this phase's declared frontend/configuration files. Frozen
data, runtime database, simulator, visual assets and legacy remain unchanged.
Prior WP14.1/14.2/14.3F/14.4A reports and old smoke evidence were preserved.
Ignored dist output and new local test harness are not proposed Git content.

## Completion Report

| Field | Result |
| --- | --- |
| Phase | WP14.4B |
| Status | PASS for local implementation/validation |
| Direct API routing | PASS, build configuration and bundle verified |
| HTML response rejection | PASS |
| Authentication handling | PASS locally; hosted browser acceptance pending |
| Session restoration | PASS in local shared-logic tests; browser refresh acceptance pending |
| Frontend tests | 18/18 PASS |
| Backend tests | 67/67 PASS |
| Production build | PASS |
| Hosted preview | NOT DEPLOYED |
| Production changes | NONE |
| Safe for preview publication | YES after separate publication approval and preview-origin/CORS review |

HARD STOP. No commits, pushes, frontend deployment, Render changes, production
accounts, unrestricted registration, canonical data/asset edits or 3D work.
