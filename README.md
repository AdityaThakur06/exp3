# Secure Authentication and Role-Based Access Control using JWT

A full-stack demo of JWT authentication and RBAC with three roles:
**Admin**, **Editor**, and **Viewer**. No database — users are a mock
in-memory array with bcrypt-hashed passwords.

## Project structure

```
jwt-rbac-app/
  server/     Express + JWT + bcrypt API (port 5000)
  client/     React + Redux Toolkit + React Router + Axios (port 3000)
```

## Run the backend

```
cd server
npm install
npm start
```

Runs on http://localhost:5000. Config lives in `server/.env`
(JWT secret, expiry, port, allowed CORS origin).

## Run the frontend

```
cd client
npm install
npm start
```

Runs on http://localhost:3000. `client/.env` points it at
`http://localhost:5000/api`.

## Demo accounts

| Role   | Email               | Password  |
|--------|----------------------|-----------|
| Admin  | admin@example.com    | admin123  |
| Editor | editor@example.com   | editor123 |
| Viewer | viewer@example.com   | viewer123 |

## What to try

- Log in as each role and watch the Navbar links change.
- Visit `/admin`, `/editor`, `/viewer` while logged in as a
  *different* role — you'll be redirected to `/unauthorized`.
- Visit any protected route while logged out — redirected to `/login`.
- Refresh the page after logging in — you stay logged in (session is
  restored from `localStorage`).
- Log out — token is cleared and protected pages redirect to `/login`.
- Tokens expire after 1 hour (`JWT_EXPIRES_IN` in `server/.env`); an
  expired token is rejected by the backend and the Axios response
  interceptor automatically clears local storage and redirects to
  `/login` on the next request.

Both `server` and `client` were built and verified successfully
(`npm run build` for the client, and live `curl` tests against the
API for login / profile / RBAC allow / RBAC deny / missing-token
cases) before delivery.
