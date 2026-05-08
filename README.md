# Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

## Live Demo

- **Frontend:** `https://devoted-strength-production-e7e7.up.railway.app/`
- **Backend API:** `https://team-task-manager-production-ba80.up.railway.app/`
- **API Docs:** `https://team-task-manager-production-ba80.up.railway.app/docs`


## Features

- **Authentication** — Signup & Login with JWT tokens
- **Role-Based Access Control** — Admin and Member roles
- **Project Management** — Create, view, and delete projects
- **Task Management** — Create, assign, and track tasks
- **Dashboard** — Live stats (Total, To Do, In Progress, Done, Overdue)
- **Protected Routes** — Pages accessible only when logged in

## Role Permissions

| Action         | Admin | Member |
|----------------|-------|--------|
| Create Project | ✅    | ❌    |
| Delete Project | ✅    | ❌    |
| Assign Tasks   | ✅    | ❌    |
| Update Status  | ✅    | ✅    |
| View Dashboard | ✅    | ✅    |



## Tech Stack

| Layer      | Technology                               |
|------------|------------------------------------------|
| Frontend   | React (Vite), React Router, Axios        |
| Backend    | FastAPI (Python)                         |
| Database   | SQLite (local) / PostgreSQL (production) |
| Auth       | JWT (JSON Web Tokens) + bcrypt           |
| Deployment | Railway                                  |



## Project Structure

```
team-task-manager/
├── backend/
│   ├── main.py            # FastAPI app entry point
│   ├── database.py        # DB connection & session
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # JWT & password hashing
│   ├── requirements.txt
│   └── routes/
│       ├── auth.py        # /api/auth/signup, /login
│       ├── projects.py    # /api/projects
│       └── tasks.py       # /api/tasks
└── frontend/
    └── src/
        ├── api/axios.js         # Axios instance with JWT
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── Projects.jsx
            └── Tasks.jsx
```

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone the repository

```bash
git clone https://github.com/aassthaa15/team-task-manager
cd team-task-manager
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```
DATABASE_URL=sqlite:///./taskmanager.db
JWT_SECRET=your-secret-key
```

Run the backend:
```bash
python -m uvicorn main:app --reload
```

Backend runs at: `https://team-task-manager-production-ba80.up.railway.app/`  
API docs at: `https://team-task-manager-production-ba80.up.railway.app/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `https://devoted-strength-production-e7e7.up.railway.app/`

> Make sure both backend and frontend are running at the same time.

---

## 📡 API Endpoints

| Method |          Endpoint                  | Access | Description           |
|--------|------------------------------------|--------|-----------------------|
| POST   | `/api/auth/signup`                 | Public | Register new user     |
| POST   | `/api/auth/login`                  | Public | Login, returns JWT    |
| GET    | `/api/projects/`                   | Auth   | List projects         |
| POST   | `/api/projects/`                   | Admin  | Create project        |
| DELETE | `/api/projects/{id}`               | Admin  | Delete project        |
| POST   | `/api/projects/{id}/members/{uid}` | Admin  | Add member to project |
| GET    | `/api/projects/members`            | Admin  | List all members      |
| GET    | `/api/tasks/`                      | Auth   | List tasks            |
| POST   | `/api/tasks/`                      | Admin  | Create & assign task  |
| PATCH  | `/api/tasks/{id}/status`           | Auth   | Update task status    |
| GET    | `/api/tasks/dashboard`             | Auth   | Get dashboard stats   |


## Deployment (Railway)

### Backend
1. Connect GitHub repo to Railway
2. Set **Root Directory** to `backend`
3. Set **Start Command** to:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   ```

### Frontend
1. Add new service, set **Root Directory** to `frontend`
2. Set **Build Command**: `npm run build`
3. Set **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
4. Add environment variable:
   ```
   VITE_API_URL=https://team-task-manager-production-ba80.up.railway.app/
   ```

