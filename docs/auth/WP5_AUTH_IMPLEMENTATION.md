# WP5 Authentication Implementation

## Outcome

Fleet Drive AI Demo now has real username/password authentication backed by the
current Express application. Registration, login, current-user restoration,
logout, route protection, and authenticated/unauthenticated redirects all use
the documented API contract. No Base44 data services or fabricated auth state
were introduced.

## Backend implementation

| Method | Route | Authentication | Result |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Creates an in-memory demo account and returns `{ token, user }` with status `201`. |
| `POST` | `/api/auth/login` | Public | Verifies credentials and returns `{ token, user }`. |
| `GET` | `/api/auth/me` | Bearer JWT | Returns the current public user profile. |

Usernames are normalized case-insensitively for uniqueness. Passwords are
hashed with bcrypt and are never returned or logged. Public registration cannot
assign privileged roles; new accounts receive the `user` role. JWTs are signed
for the Fleet Drive AI Demo issuer and frontend audience.

Validation includes username format and length, password length, optional name
length, boolean `rememberMe`, duplicate usernames, malformed JSON, invalid
credentials, and missing or invalid bearer tokens. Errors use the standard API
error envelope.

## Frontend implementation

- The login and registration pages retain the Base44-derived visual language
  while calling the Express API through the central client.
- Both forms include browser and application validation, pending states,
  backend error messages, and password visibility controls.
- `AuthenticationBoundary` protects application routes and preserves a safe
  internal `returnTo` path for unauthenticated users.
- `GuestOnlyBoundary` redirects authenticated users away from login and
  registration.
- The auth context restores sessions with `GET /api/auth/me`, exposes the real
  user profile and role, and clears invalid sessions on `401` responses.
- Logout removes local credentials before returning to login.
- Google and Microsoft sign-in controls are disabled and labelled unavailable;
  no fake OAuth flow is present.

## Remember-me behavior

Unchecked login stores the JWT in `sessionStorage` and issues an eight-hour
token. Checked login stores it in `localStorage` and issues a 30-day token.
Registration creates a session-scoped login. The client checks both stores on
startup and restores the authenticated user through `/api/auth/me`.

## Verification

Automated Supertest coverage verifies:

- successful registration and login;
- case-insensitive duplicate registration;
- rejection of client-assigned privileged roles;
- invalid login handling;
- protected current-user access and token-based restoration;
- longer remember-me token lifetime;
- existing backend vehicle and port behavior.

Browser verification against the running Vite frontend and Express backend
confirmed the unauthenticated redirect, registration, profile and role display,
reload restoration, logout, invalid-login error, valid login, and remember-me
path. Frontend lint and production build were also run after implementation.

## Known limitations

- Accounts are held in backend memory because persistent user storage is not an
  existing capability. Accounts and sessions are lost when the backend restarts.
- In non-production environments, an absent `JWT_SECRET` is replaced by a
  process-local random secret. Production startup requires `JWT_SECRET`.
- JWT logout is client-side; there is no server-side revocation or refresh-token
  endpoint in the current contract.
- Password recovery, OAuth, account verification, and role administration are
  not implemented because the Express contract does not provide them.
