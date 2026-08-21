# TaskFlow — Frontend

React (Vite) client for the TaskFlow task-management app.

## Structure
```
src/
├── assets/          Static images/styles
├── components/      Navbar, TaskCard, TaskFormModal, WeatherBadge, ProtectedRoute
├── context/         AuthContext (JWT auth state)
├── pages/           LoginPage, RegisterPage, DashboardPage
├── services/        api.js (Axios instance + interceptors)
├── App.jsx          Route definitions
├── index.css        Tailwind imports
└── main.jsx         React root
```

## Setup

```bash
npm install
cp .env.example .env   # then fill in VITE_API_BASE_URL and VITE_OPENWEATHER_API_KEY
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Express backend, e.g. `http://localhost:5000/api` |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key used by `WeatherBadge` |

## Notes

- Auth token is stored in `localStorage` and attached to every request via an Axios request interceptor.
- A response interceptor logs the user out automatically on `401` responses.
- Task create/update use `multipart/form-data` so a file (`attachment`) can be uploaded alongside task fields; the backend is expected to forward it to Cloudinary and return a `attachmentUrl`.
- Expected backend endpoints: `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `GET/POST /tasks`, `GET/PUT/DELETE /tasks/:id`.
