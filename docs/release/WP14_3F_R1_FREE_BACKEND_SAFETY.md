# WP14.3F-R1 - Free Backend Safety Remediation

Owner: Phathutshedzo Rakhunwana. Date: 2026-11-20 (Africa/Johannesburg).
Status: PASS for a locally validated, controlled disposable-testing candidate.
No production deployment, service creation, settings changes, commits or pushes.

## Baseline and Scope

Baseline HEAD: 5fbd3fffdf6a739cecf29f7ec49154f64938a322, master.
Existing WP14.1, WP14.2 and WP14.3F documents remain uncommitted and preserved.
The earlier WP14.3F report correctly describes the pre-remediation blockers;
this report supersedes its readiness decision for the revised local source only.

The original ignored .topology-recovery/wp14-3f-readiness-20261120/smoke.cjs is
unchanged, SHA-256:
03eeee47926247eb9edc8ef9ff5e00ef70edef18493e862444913069bc83ccd3.
The readiness report is unchanged, SHA-256:
a6b22a91989c6ce803e92e7c545cfc607862d4d03d412d9f12dd7a4dd744c119.

No database/schema, canonical data, assignment, telemetry, simulator, frozen
visual asset, 3D report, frontend or legacy code was changed.

## Registration Gate Design

New service: server/services/registrationAdmission.js. The existing register
controller checks admission before credential validation or user creation.
Keeping the check inside the controller covers Express's case-insensitive and
trailing-slash route variants without a separately maintained path filter.

Production defaults to DENY. With NODE_ENV=production, absent, empty, malformed,
oversized or ambiguous invitation configuration does not enable registration.
The response is HTTP 403 with structured JSON:

```json
{
  "error": {
    "code": "REGISTRATION_UNAVAILABLE",
    "message": "Registration is not available for this request.",
    "details": {}
  }
}
```

No distinction is disclosed between unapproved usernames, missing tokens, bad
tokens, expired entries or invalid configuration. The existing auth rate limiter
still applies and can return 429; parser/size validation can reject requests
before the controller. None of these behaviours grants admission.

Local development and isolated test mode retain existing registration behaviour.
Production MUST explicitly set NODE_ENV=production. Existing login, JWT/session
verification and ordinary-user role assignment remain unchanged. Admin role
requests continue to be rejected; this mechanism never creates an administrator.

### Server-Only Configuration

REGISTRATION_TEST_INVITES_JSON is an array of at most 25 entries. Each entry has:

| Field | Meaning |
| --- | --- |
| username | Exact approved fictional test username, matched case-insensitively |
| tokenSha256 | 64 hexadecimal characters: SHA-256 of the plaintext invitation token string |
| expiresAt | UTC ISO timestamp, not expired and no more than 24 hours ahead when checked |

The entire configuration is capped at 16,384 characters. Invalid fields or duplicate
usernames/token digests close admission for the configuration. An expired entry
cannot authorise its account. A digest is compared with timingSafeEqual after
hashing the supplied token. Neither plaintext invitations nor their digests are
returned in API responses or logged by this feature.

The request carries X-Registration-Invite, a 64-character hexadecimal token
generated from 32 cryptographically random bytes. The header is accepted in CORS
preflights from allowed origins. It is NOT a JWT, shared test password, query
parameter, body-field bypass or frontend configuration. The React application
does not receive an embedded credential and was not changed.

### Storage and Replay Semantics

This is an expiring, username-bound allowlist with bearer proof, NOT a durable
single-use invitation system. No invitation table, migration or persistent token
store is introduced. The existing case-insensitive unique username prevents a
second account for that username; an approved retry then receives 409.

Before expiry/revocation, a token can be retried after invalid input. If the entire
ephemeral database disappears, that same token can recreate ONLY its bound username
until expiry. Tokens must not be reused across users; duplicate digests are rejected.
Remove the entry after the test or shorten its expiry to revoke further admission.
Existing sessions/login are unaffected by invitation revocation. Stolen invitations
remain bearer credentials until expiry/revocation: keep them confidential.

## Controlled Test Admission Procedure

At a later explicitly approved deployment, NOT during this phase:

1. Set NODE_ENV=production, exact ALLOWED_ORIGINS, DEMO_SIMULATION_ENABLED=false,
   DEMO_ALLOW_USER_MUTATIONS=false and an approved Node 22 runtime.
2. Generate a separate strong JWT_SECRET securely and store only in the backend
   environment. Do not rotate an existing production secret as part of this work.
3. Leave REGISTRATION_TEST_INVITES_JSON unset to keep registration closed. To
   approve a specific disposable account, generate a fresh 32-byte random token
   using a cryptographic generator and encode it as 64 hexadecimal characters.
4. Compute SHA-256 of that exact token string. Configure only its digest, the
   approved fictional username and a UTC expiry within 24 hours in the backend
   JSON variable. Do not put plaintext admission tokens in provider variables,
   source, .env.example, VITE variables, documentation, logs or shell history.
5. Give the plaintext token only to the authorised tester through a confidential
   channel. Use an approved API client with protected local credential entry and
   no request-header/body logging. Send it over HTTPS in X-Registration-Invite to
   POST /api/auth/register with that username and a separate disposable password.
   The ordinary frontend registration form intentionally has no invite input.
6. Verify the created role is user; test login and /me without sharing returned
   JWTs. Remove the invitation after testing. Do not create customer accounts or
   advertise unrestricted signup. No real identities or customer information.

Do not supply invitation data via command-line arguments or ask the tester to
paste credentials into chat. Keep provider/request access logs from capturing
the invitation header, passwords or JWTs. Do not enable verbose request logging.

## Production Dependency Audit

Before: critical 1, high 1, moderate 1; all three transitive, no direct dependency
changes required. Installed versions were confirmed in the lockfile before edits.

| Package / installed before | Dependency path | Severity / advisory | Affected range | Patched and selected |
| --- | --- | --- | --- | --- |
| body-parser 2.3.0 | server -> express 5.1.0 -> body-parser | HIGH, GHSA-27r3-jxmh-p828 | >=2.0.0 <2.4.0 | 2.4.0 |
| proxy-addr 2.0.7 | server -> express 5.1.0 -> proxy-addr | CRITICAL, GHSA-jqcg-44mw-7w3h | >=1.1.0 <2.0.8 | 2.0.8 |
| qs 6.16.0 | server -> express -> qs; express -> body-parser -> qs | MODERATE, GHSA-6pq8-jhm2-2vcw | >=6.7.0 <=6.16.0 | 6.16.1 |

Advisory sources: [body-parser](https://github.com/advisories/GHSA-27r3-jxmh-p828),
[proxy-addr](https://github.com/advisories/GHSA-jqcg-44mw-7w3h),
[qs](https://github.com/advisories/GHSA-6pq8-jhm2-2vcw).
The wider body-parser advisory also covers an older major line; the table records
the installed 2.x line relevant here.

### Reachability Assessment Before Remediation

- body-parser: active request-processing path through app.use(express.json()).
  Compressed JSON input can reach this dependency before authentication. A 32 KiB
  configured limit is not proof the compressed-trailing-byte issue is unreachable.
- proxy-addr: Express computes request IP and the auth limiter uses req.ip.
  The specific advisory requires vulnerable mapped-address/trusted-subnet behaviour;
  default trust=false and the optional numeric one-hop setting do not establish
  the documented exploit conditions. Actual provider proxy topology is unknown.
  Treat dependency reachability as real but exploitability as conditional, not proven.
- qs: installed via Express and body-parser. The advisory concerns stringify with
  comma-array formatting and specially shaped objects. No application call to
  qs.stringify or that option was found; express.json is used, not a configured
  urlencoded parser. No current app exploit path was identified. It was still
  patched rather than suppressed. The test-only supertest -> superagent path
  also deduplicates to the same qs package but is omitted in production installs.

No live exploit or denial-of-service test was performed against production.

### Exact Remediation

Added three exact npm overrides in server/package.json:

```json
{
  "body-parser": "2.4.0",
  "proxy-addr": "2.0.8",
  "qs": "6.16.1"
}
```

Their versions satisfy Express 5.1.0's existing ^2.2.0, ^2.0.7 and ^6.14.0 ranges.
The selected body-parser release requires Node >=18, compatible with Node 22.
Only these three package versions changed in server/package-lock.json; dependency
metadata and integrity values changed accordingly. Express stays at 5.1.0 and
the root frontend manifest/lockfile are untouched.

Commands: npm install --prefix server --package-lock-only --ignore-scripts
--no-audit --no-fund, then npm ci --prefix server to validate the full test install.
No npm audit fix, --force, major upgrade or advisory suppression was used.
Review the exact pins during future upgrades; do not keep them forever without
checking newer security releases and parent dependency compatibility.

After: npm audit --prefix server --omit=dev --json returned exit 0, with critical 0,
high 0, moderate 0 and no reported vulnerabilities. A clean isolated production
install also reported zero. This is an audit result at inspection time, not a
guarantee of absence of unknown vulnerabilities or a full security certification.

## Validation Evidence

| Check | Result |
| --- | --- |
| Full backend tests | PASS, 67/67, including 10 new admission tests |
| Production deny / unauthorised / authorised admission | PASS |
| Duplicate / invalid / role escalation rejection | PASS |
| Login and JWT verification after invite revocation | PASS |
| Route-case, slash, query/body bypass attempts | PASS |
| Secret-free response assertions | PASS |
| Malformed, expired, duplicate and oversized configuration | PASS, fail closed |
| Frontend tests | PASS, 5/5, no frontend edits |
| Repository lint | PASS |
| Clean root production install | PASS, npm ci --prefix server --omit=dev |
| Root startup | PASS, npm start --prefix server |
| Health / no-token me / default registration deny | PASS, 200 JSON / 401 JSON / 403 JSON |
| Exact-origin CORS / denied origin / invitation-header preflight | PASS |
| Missing production JWT secret | PASS, nonzero startup before listening |
| Production dependency audit | PASS, zero reported findings |
| git diff --check and new-file whitespace | PASS |

All write-capable tests use in-memory or isolated temporary SQLite databases.
The existing production-policy test now creates its test fixtures in test mode
before switching to production for the permission assertions; it does not bypass
the gate for actual production requests. No production account was created.

A new isolated copy of current server files, excluding ignored .env/databases
and node_modules, was created at
.topology-recovery/wp14-3f-r1-readiness-20261120/.
Production dependencies were installed there with the exact root-level command.
A copy of the original smoke harness was extended ONLY in this new workspace
to assert registration denial and invitation-header preflight. Its database is
:memory:, simulation disabled, and temporary JWT secret held in memory. All child
server processes were stopped after verification. Runtime tested: Node v22.21.0.

## Data and Evidence Preservation

The 426-file historical preservation inventory includes intentionally modified
backend files. Differences are restricted to this phase's allowlist; all other
inventory entries, including runtime DB, fleet data, simulator, legacy and frozen
assets, remain unchanged. Original smoke harness and prior readiness report hashes
above remain identical. Earlier WP14.1 and WP14.2 documents are also preserved.

Changed project files:

- server/.env.example: empty invitation configuration name only.
- server/package.json: three compatible transitive overrides.
- server/package-lock.json: targeted patched versions/integrities.
- server/services/registrationAdmission.js: new admission predicate.
- server/controllers/authController.js: production admission enforcement.
- server/middleware/security.js: invitation-header preflight allowance.
- server/test/registration-admission.test.js: new isolated coverage.
- server/test/public-demo-policy.test.js: test-fixture setup adjustment.
- docs/release/WP14_3F_R1_FREE_BACKEND_SAFETY.md: this report.

Ignored validation copies/dependencies are local-only, not proposed Git content.

## Deployment Requirements and Remaining Limits

This local candidate is ready for a separately approved Free test deployment with
registration closed by default. That is NOT deployment authorisation. GitHub master
still contains the old 5fbd3ff baseline until separately approved commit/push; do not
deploy that old SHA as if it includes these fixes. Record the eventual approved SHA.

Use new fleet-drive-ai-api, repository-root build/start commands above, Node version
explicitly validated/pinned, NODE_ENV=production, exact Netlify origin, simulation
disabled, ordinary-user mutations disabled and a securely configured backend JWT
secret. Keep invitations unset except for explicit disposable testing.

Render Free remains ephemeral: user accounts can disappear on restart, redeploy or
spin-down. There is no durable invitation-consumption state, durable sessions or
production-customer persistence claim. Cold starts can exceed the frontend timeout.
No paid disk/database is proposed and no Netlify routing change is included.
Current provider settings and Linux execution are not validated by local Windows
tests. Verify Free plan, quotas, runtime, safe logging and the actual deployed SHA
at the later approval gate without introducing paid resources.

Other unchanged limits: JWT logout is client-side, rate limiting is process-local,
and the existing JWT implementation does not explicitly pin its algorithm list.
These are not newly introduced regressions or unresolved npm advisories; they
remain considerations for any later production-hardening scope.

## Rollback Considerations

Do not roll back the new gate to unrestricted production registration. Revoke
admission by removing the invitation configuration, preserving existing JWT/login
configuration. A later operational change may trigger deployment and needs approval.
Reverting to the earlier source restores vulnerable dependency versions and open
registration: it is not a safe public rollback target. Prefer a forward fix with
registration closed or an approved stop of the new test service.

Do not modify the existing Render service or silently replace/restore any database.
Keep the prior service and Netlify configuration untouched until separately approved.
No production secret rotation, account provisioning or data migration was performed.

## Completion Report

| Item | Result |
| --- | --- |
| Phase | WP14.3F-R1 |
| Status | PASS, local controlled-test candidate only |
| Registration gate | PASS |
| Production default deny | PASS |
| Controlled test registration | PASS, isolated tests only |
| Audit before: critical / high / moderate | 1 / 1 / 1 |
| Audit after: critical / high / moderate | 0 / 0 / 0 |
| Unresolved npm production vulnerabilities | None reported by current audit |
| Backend tests | 67/67 PASS |
| Database | UNCHANGED |
| Frozen assets | UNCHANGED |
| Ready for free Render deployment | YES as a local candidate, after separate publication/deployment approval and required backend configuration |

HARD STOP. No Render service creation, unrestricted registration, Netlify changes,
production JWT changes, existing Render changes, commits, pushes, deployment or 3D work.
