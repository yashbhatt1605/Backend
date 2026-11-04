# CarXpress Backend (hardened baseline)

## Setup (Windows PowerShell)
1. Copy `.env.example` to `.env` and fill in your MongoDB URI and a random `JWT_SECRET` (32+ characters).
2. Install dependencies: `npm.cmd install`
3. Optional: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then create/update the admin account with `npm.cmd run seed:admin`.
4. Start: `npm.cmd run dev`
5. Health check: open `http://localhost:5000/api/health`.

## Active endpoints
- `POST /api/auth/register` — registers a regular user; password must be 8–128 characters.
- `POST /api/auth/login` — returns `{ success, token, user }`; send `Authorization: Bearer <token>` on protected calls.
- `GET /api/auth/profile` — authenticated profile.
- `GET /api/cars`, `GET /api/cars/:id` — public read; create/update/delete require admin token.
- `GET /api/bikes`, `GET /api/bikes/:id` — public read; create/update/delete require admin token.
- `/api/customers` — listing/edit/delete require admin token; create requires a valid user/admin token.
- `/api/users` — admin list/delete; users can read/update only their own account.

Frontend admin/customer requests must include the bearer token. Do not store real secrets in source control. For production, use HTTPS and rotate credentials that have ever been committed/shared.

Some legacy route files for categories, products, orders, payments, notifications, and admin dashboard refer to controllers that were not present in the supplied ZIP. They are intentionally not mounted by this baseline; implement those controllers before exposing those endpoints.
