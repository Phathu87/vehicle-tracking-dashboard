# Known Limitations

| Priority | Classification | Limitation |
| --- | --- | --- |
| P0 | PARTIAL | The canonical source is normalized inside the Git root and prepared for tracking, but no owner-authorized release commit exists yet; a real clean checkout of that commit is therefore still pending. |
| P0 | PARTIAL | A legacy tracked `.env` contained a token-like map credential. The working-tree file is removed and ignored, but the credential remains in history and must be rotated before public release. |
| P2 | PARTIAL | Frontend production dependencies report 2 moderate React Router advisories after safe remediation. A fix requires a breaking major migration; exposure and acceptance are documented for this client-only Demo. |
| P1 | DEMO-ONLY | Normal production users are read-only for shared fleet state. Admin CRUD and simulator telemetry are server-enforced; deployment configuration still needs hosted verification. |
| P2 | PARTIAL | Chromium was rendered and exercised. Firefox and WebKit were unavailable in this environment. |
| P2 | PARTIAL | Browser automation verified map render and polling surfaces but did not produce a reliable visual assertion of marker movement without a full map remount. API/simulator behavior remains tested. |
| P2 | PARTIAL | JavaScript typecheck reports 172 pre-existing inference/declaration errors before the Vite declaration adjustment; lint and production build are the release gates. |
| P2 | DEMO-ONLY | Node emits an experimental warning for `node:sqlite`. |
| P2 | PARTIAL | Alerts cannot be acknowledged and reports cannot export PDF/CSV. |
| P3 | SIMULATED | Vehicle telemetry and locations are simulated, not production GPS hardware. |
| P3 | FUTURE COMMERCIAL | WebSockets, production telematics, traffic-aware routing, advanced fuel theft detection, trained AI, billing, mobile apps, SSO, multi-tenancy and production-scale observability are not implemented. |
