# Full-Stack Task Manager App

Register, log in, and manage daily tasks. Node/Express backend + MongoDB (Mongoose) +
JWT auth + React frontend.

## Project Structure

```
task-manager-app/
├── backend/          Express API, MongoDB models, JWT auth
│   ├── config/db.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── middleware/auth.js
│   ├── routes/auth.js
│   ├── routes/tasks.js
│   ├── server.js
│   └── .env.example
└── frontend/         React app (Login, Register, Dashboard)
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.js
    │   ├── components/PrivateRoute.js
    │   ├── components/TaskItem.js
    │   ├── pages/Login.js
    │   ├── pages/Register.js
    │   ├── pages/Dashboard.js
    │   ├── App.js
    │   └── index.js
    └── .env.example
```

## How the pieces connect

1. **MongoDB Atlas** stores two collections: `users` and `tasks`. Each task document
   has a `user` field referencing the owning user's `_id`.
2. **Express backend** exposes:
   - `POST /api/auth/register` — hash password with bcrypt, create user, return JWT
   - `POST /api/auth/login` — verify password, return JWT
   - `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`
     — all protected by `middleware/auth.js`, which reads the `Authorization: Bearer <token>`
     header and rejects the request if the token is missing/invalid.
3. **React frontend**:
   - `AuthContext` stores the JWT + user in `localStorage` and React state.
   - `api/axios.js` automatically attaches the token to every request.
   - `PrivateRoute` redirects to `/login` if there's no token.
   - `Dashboard.js` calls the task endpoints to load/add/complete/delete tasks live.

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: paste your MongoDB Atlas URI and a random JWT_SECRET
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already points to http://localhost:5000/api by default
npm start
```

Frontend runs at `http://localhost:3000`.

## Getting a free MongoDB Atlas database

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free "M0" cluster.
3. Under **Database Access**, create a user with a username/password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for simplicity.
5. Click **Connect > Drivers**, copy the connection string, and paste it into
   `backend/.env` as `MONGO_URI` (replace `<username>` and `<password>`).

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repo.
2. On https://render.com, create a **New Web Service**, connect the repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables in Render's dashboard: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
   (set `CLIENT_URL` to your Vercel URL once you have it).
7. Deploy — Render gives you a public URL like `https://task-manager-backend.onrender.com`.

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo (or the same repo, different root).
2. On https://vercel.com, import the repo, set root directory to `frontend`.
3. Add environment variable `REACT_APP_API_URL` = `https://task-manager-backend.onrender.com/api`
   (your Render URL + `/api`).
4. Deploy — Vercel gives you a public URL like `https://task-manager.vercel.app`.
5. Go back to Render and update `CLIENT_URL` to this Vercel URL, then redeploy the backend
   so CORS allows requests from your live frontend.

## Testing the deployed app

1. Visit your Vercel URL.
2. Register a new account.
3. Add, complete, and delete a few tasks — refresh the page to confirm they persist
   (they're stored in MongoDB, not just local state).
4. Log out and log back in to confirm JWT auth is working end-to-end.
