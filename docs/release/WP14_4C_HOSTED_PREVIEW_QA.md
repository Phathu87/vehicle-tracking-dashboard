# WP14.4C - Hosted Preview Verification

Owner: Phathutshedzo Rakhunwana. Date: 2026-11-20, Africa/Johannesburg.
Status: BLOCKED at provider-access and preview-origin CORS gates.
No hosted preview was published. No production setting was changed.

## Baseline and Exact Scope

Initial branch: master. Initial/current source HEAD:
6e3ed5cf66f54d059dccfc3382f523c806620619.
Read docs/release/WP14_4B_API_INTEGRATION.md before review.

There were TEN existing WP14.4B integration files, not eleven. This QA report
is the eleventh intended file for a future scoped preview publication:

1. .env.example
2. netlify.toml
3. vite.config.js
4. src/api/config.js
5. src/api/client.js
6. src/api/auth.js
7. src/lib/authSession.js
8. src/lib/AuthContext.jsx
9. src/test/apiAuthentication.test.js
10. docs/release/WP14_4B_API_INTEGRATION.md
11. docs/release/WP14_4C_HOSTED_PREVIEW_QA.md (created by this phase)

The four earlier untracked WP14.1, WP14.2, WP14.3F and WP14.4A reports are
unrelated publication content and remain untouched/untracked. Existing ignored
diagnostic harnesses are preserved. No server/, legacy/ or frozen-asset diff
was present. Nothing was discarded, staged, committed or pushed.

Prepared local branch: codex/wp14-4c-api-preview, based on the HEAD above.
The local branch carries the existing uncommitted integration changes; it does
not yet contain a new committed preview revision. master was not advanced.

## Preview Identity and Configuration

| Item | Result |
| --- | --- |
| Hosted preview URL / actual browser origin | NOT ALLOCATED; no deploy result exists |
| Hosted preview commit | NONE; not published |
| Local branch HEAD | 6e3ed5cf66f54d059dccfc3382f523c806620619, baseline only |
| Selected API routing | DIRECT, not proxy |
| Intended VITE_API_URL | https://fleet-drive-ai-api.onrender.com/api |
| UI mutation mirror | VITE_DEMO_ALLOW_USER_MUTATIONS=false |
| Build / publish | Repository root, npm run build, dist |

A candidate stable alias was proposed only for origin-policy probing:
`https://codex-wp14-4c-api-preview--vehicle-tracking-dashboard.netlify.app`.
This is NOT a live or provider-confirmed preview URL. Do not publish it as a
working preview link or claim that Netlify has reserved its branch slug.
The final exact URL/origin must come from an authorised deploy result.

[Netlify branch deploy documentation](https://docs.netlify.com/deploy/deploy-types/branch-deploys/)
describes branch-specific deployments and provider controls. Branch deployment
enablement, effective context variables, protection and production-branch
configuration must be read before publication. A Git push alone must not be
assumed to produce the required preview or safe effective build settings.

## Provider Access Gate

Discovery found no connected Netlify tool; no installed netlify CLI command
was found on PATH. A Render connector is listed as available but uninstalled;
it was not installed or granted permissions. No credential files were read.

Public Netlify site metadata was accessible and identifies production branch
master, published deployment 6b001328e8c1c1d5d047ce55, commit
6e3ed5cf66f54d059dccfc3382f523c806620619. The protected build metadata endpoint
returned HTTP 401. This does not establish any usable deployment authorisation
or reveal the project's effective branch-deploy configuration.

Additional authenticated provider access is therefore required to verify preview
configuration and obtain an actual preview deployment URL. Per the task's
permission/configuration gate, publication was not attempted. No UI automation,
API deploy POST, branch push, pull request, build hook or production deploy occurred.

## Live Read-Only API and CORS Evidence

API base: https://fleet-drive-ai-api.onrender.com/api.
All production requests in this phase were GET or OPTIONS, without credentials.

| Probe | Observed result |
| --- | --- |
| GET /api/health with production Netlify Origin | 200 application/json; status=ok, service=fleet-drive-ai-demo-api |
| GET /api/auth/me without token, production Netlify Origin | 401 JSON AUTH_REQUIRED |
| Production Origin allow header | Exact https://vehicle-tracking-dashboard.netlify.app |
| OPTIONS /api/auth/login with candidate preview Origin | 403 JSON ORIGIN_NOT_ALLOWED |
| Candidate preview allow-origin header | Absent |

The preflight requested POST with content-type and authorization. It did not
submit a login request or account credentials. This is a confirmed rejection
of the candidate preview origin, not a test from an actual hosted preview.
Actual deployed-preview-origin verification remains NOT RUN.

Production CORS permission does NOT cover other Netlify subdomains. The intended
DIRECT browser integration would be blocked from this candidate origin even
though server-to-server health checks and production-origin checks succeed.
Do not spoof a production Origin in a script and call that preview browser QA.

Required separate decision: approve the exact final preview origin in an
appropriate backend allowlist, or provide an already approved isolated backend
and its exact-origin policy. This would be a configuration/infrastructure change
outside the current hard stop. No wildcard CORS, wildcard Netlify-domain rule,
same-origin proxy substitution or production-site path workaround was introduced.

## Security Review

Scope review of the ten existing integration files: PASS.

- No JWT secret, private key, real access token or invitation secret was found.
  Credential-pattern scans had no matches; code/tests were reviewed separately.
- .env.example contains public development/API settings only. netlify.toml
  contains only the public HTTPS API base and false mutation mirror.
- Frontend tests use clearly synthetic fixture values; there are no production
  credentials. No JWT or password was read from browser storage or logs.
- The new client rejects HTML/malformed auth responses, validates public-user
  fields and does not implement guest/admin authentication bypasses.
- The server registration gate is unchanged. No invitation is embedded in React
  or supplied through VITE variables. No unrestricted signup was enabled.
- The UI mutation mirror is false. Actual backend environment/role behaviour
  beyond the tokenless contract remains unverified without authorised sessions;
  source review is not claimed as live permission testing.

No runtime SQLite files, production .env files, node_modules, build output,
private user data or unrelated documents were staged or published. Nothing is staged.

## Browser Acceptance Matrix

No hosted browser session was started because no preview URL exists and CORS
would reject the candidate origin. Prior WP14.4B results remain useful local
evidence but do not count as hosted acceptance.

| Acceptance item | Hosted result / limitation |
| --- | --- |
| Login page loads | NOT RUN |
| Registration page loads | NOT RUN |
| API requests reach Render from preview | BLOCKED by candidate-origin preflight; actual hosted origin unverified |
| Invalid login returns controlled JSON in browser | NOT RUN; no login POST submitted |
| HTML responses are rejected | NOT RUN hosted; prior local automated tests PASS |
| Session restoration after refresh | NOT RUN hosted; prior shared-logic tests PASS |
| Protected routes reject unauthenticated users | NOT RUN hosted; prior route review/local tests are not browser proof |
| Logout clears the browser session | NOT RUN hosted; prior session helper tests PASS |
| Cold-start behaviour | NOT RUN hosted; prior mocked timeout tests PASS |
| Mobile layout | NOT RUN hosted |
| Successful login with valid disposable account | NOT RUN; no authorised valid account supplied/used |
| Successful invited registration | NOT RUN; no invitation supplied, no production account created |

No successful login, browser JWT verification, production registration or durable
account claim is made. Ephemeral SQLite still cannot support permanent-user
promises. A stable signing secret alone does not preserve missing account rows.

## Preservation and Validation

Only the local preview branch and this report were created in this phase.
The ten integration files and four unrelated untracked reports were preserved.
Previous local evidence is retained, not relabelled as freshly run hosted tests:
18 frontend tests, 67 backend tests, lint, production build, config guard and
temporary localhost SPA checks passed in WP14.4B.

Current checks: source/config/security review, GET/OPTIONS probes, provider-access
discovery, git diff --check and untracked-report whitespace validation. No
expensive regression rerun was needed to establish these external blockers.
Canonical data, runtime DB, simulator, legacy, frozen assets and backend source
remain unchanged. No production process was restarted or redeployed.

## Requirements Before Continuing

1. Provide authenticated, task-scoped Netlify access through an approved connection
   or already-authorised deployment workflow. Do not paste credentials into chat.
2. Confirm production branch remains master and review branch/context settings.
   Approve a specific non-production deploy mechanism and obtain its actual origin.
3. Separately approve exact-origin backend CORS for that preview, or an isolated
   approved backend; do not modify the existing live API under this phase's rules.
4. Recheck the eleven-file scope and stage/commit only that scope on the preview
   branch after the blockers are cleared. Leave four earlier reports and all
   ignored diagnostics unstaged. Never push to master or force-push.
5. Build/publish only the isolated preview; verify its reported commit and compiled
   DIRECT API base, then rerun health/401/preflight from its actual browser origin.
6. Complete browser QA at mobile/desktop sizes. Use valid disposable credentials
   only through confidential approved entry; no token/password logging. No
   production account creation or successful registration without separate approval.
7. Require hosted authentication/permission acceptance before production rollout.
   Current evidence is insufficient to recommend production publication.

## Completion Report

| Field | Result |
| --- | --- |
| Phase | WP14.4C |
| Status | BLOCKED |
| Hosted preview | BLOCKED, not published |
| Preview commit | NONE; local branch exists at baseline HEAD only |
| API routing | PASS in existing local evidence; hosted integration NOT VERIFIED |
| CORS | FAIL for candidate preview origin; actual preview origin NOT ALLOCATED |
| Authentication browser QA | PARTIAL overall evidence; hosted browser tests NOT RUN |
| Session restoration | PARTIAL overall evidence; hosted refresh NOT RUN |
| Registration restrictions | PRESERVED |
| Production frontend | UNCHANGED, no publication triggered |
| Render backend | UNCHANGED, read-only requests only |
| Safe for production rollout | NO |

STOP after reporting requirements. No provider configuration changes, preview
publication, master push, production deployment, accounts, data/asset changes or 3D work.
