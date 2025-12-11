# Application Architecture

End-to-end overview of the Google Sign-In demo across frontend, backend, and database layers.

## Flow at a Glance
- **User signs in with Google** via the React frontend (`@react-oauth/google`).
- **Frontend posts Google ID token** to the FastAPI backend at `/auth/google`.
- **Backend verifies the token** with Google, upserts the user, and issues a **JWT access token**.
- **Frontend stores token + user** in `localStorage`, attaches the token on requests, and renders protected routes.
- **Backend validates JWT** on protected endpoints (e.g., `/auth/me`) and reads user data from PostgreSQL.

## Frontend (Vite + React + Ant Design)
- **Key components**: `App.jsx`, `Login.jsx`, `Navbar.jsx`, `Home.jsx`, `UserProfile.jsx`.
- **Google OAuth**: `GoogleLogin` button (one-tap enabled) obtains a Google ID token.
- **API client**: `src/config/api.js` configures Axios with `VITE_API_BASE_URL` and a request interceptor that injects `Authorization: Bearer <jwt>` from `localStorage`. A 401 response clears stored auth and emits `auth:logout`.
- **Auth service**: `src/services/authService.js` sends the Google token to `/auth/google`, stores the returned JWT + user, fetches `/auth/me`, and handles logout.
- **Routing/guards**: `App.jsx` defines protected routes (`/home`, `/profile`) and redirects unauthenticated users to `/login`. Navbar shows user avatar/menu when authenticated.

## Backend (FastAPI)
- **Entry**: `app/main.py` configures CORS, mounts the `auth` router, and exposes `/` + `/health`.
- **Routes**: `app/routes/auth.py`
  - `POST /auth/google`: verifies Google ID token (`google.oauth2.id_token.verify_oauth2_token`), extracts profile fields, upserts the user through the service layer, and returns a JWT + user payload.
  - `GET /auth/me`: protected; returns the current authenticated user.
- **Dependencies**: `app/core/dependencies.py` uses `HTTPBearer` to pull the JWT, verifies it (`verify_token`), and loads the user by ID; raises 401/404 as needed.
- **Security**: `app/core/security.py` issues HS256 JWTs with `SECRET_KEY` and `ACCESS_TOKEN_EXPIRE_MINUTES`.
- **Config**: `app/core/config.py` loads `DATABASE_URL`, Google OAuth keys (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`), CORS origins, and JWT settings via Pydantic settings (`.env`).

## Service & Data Layers
- **Service**: `app/services/auth_service.py` orchestrates user upsert and token generation.
- **Repository**: `app/repositories/user_repository.py` handles all user queries/mutations.
- **Model**: `app/models/user.py` defines the `users` table (email, google_id, names, profile picture, timestamps).
- **Schemas**: `app/schemas/user.py` defines request/response models (`GoogleTokenRequest`, `GoogleAuthResponse`, `UserResponse`).

## Database & Migrations
- **Database**: PostgreSQL (configurable via `DATABASE_URL`).
- **Migrations**: Alembic `001_initial_migration.py` creates the `users` table and indexes on `email`, `google_id`, and `id`. Apply with `alembic upgrade head`.

## End-to-End Sequence
1) User clicks **Sign in with Google** → Google returns an ID token to the frontend.
2) Frontend calls `POST /auth/google` with `{ token }`.
3) Backend validates the Google token, upserts the user record, and returns `{ access_token, token_type, user }`.
4) Frontend saves the JWT and user in `localStorage`; Axios attaches the JWT on future requests.
5) Protected routes call `/auth/me`; backend verifies the JWT and returns the user; UI renders personalized data.
6) If the JWT expires, backend sends 401 → Axios interceptor clears storage and emits `auth:logout`, prompting re-login.

## Environment Variables to Set
- **Frontend**: `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`
- **Backend**: `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `CORS_ORIGINS`

## Running the Stack (summary)
- Run PostgreSQL and apply migrations: `alembic upgrade head`.
- Start backend (FastAPI with Uvicorn): `uvicorn app.main:app --reload`.
- Start frontend (Vite): `npm install && npm run dev` in `frontend/`.
