# rentanindian.ai

> From AI to reality — tasks executed.

A full-stack MERN task marketplace where users post, browse, and accept tasks. Built with MongoDB Atlas, Express, React + Vite, and Node.js.

---

## 📁 Project Structure

```
rentanindian/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer, TaskCard, ProtectedRoute
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── pages/           # Home, Auth, Tasks, CreateTask, Profile, Admin
│   │   └── utils/           # axios api.js
│   ├── .env.example
│   └── vite.config.js
│
└── server/                  # Express + Node.js backend
    ├── models/              # User.js, Task.js
    ├── routes/              # auth.js, users.js, tasks.js, admin.js
    ├── middleware/          # auth.js (JWT + role guard)
    ├── index.js
    └── .env.example
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone and install

```bash
# Backend
cd server
cp .env.example .env      # fill in your values
npm install

# Frontend
cd ../client
cp .env.example .env
npm install
```

### 2. Configure environment variables

**server/.env**
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/rentanindian
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173
PORT=5000
```

**client/.env**
```
VITE_API_URL=http://localhost:5000
```

### 3. Run both servers

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

App is live at **http://localhost:5173**

---

## 🌐 Deployment

### Backend → Render (free tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel URL)

### Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set **Root Directory** to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` (your Render backend URL)

### Database → MongoDB Atlas (free tier)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create database user and get connection string
4. Whitelist `0.0.0.0/0` for access from Render

---

## 🔑 User Roles

| Feature | User | Admin |
|---------|------|-------|
| Register/Login | ✅ | ✅ |
| Browse tasks | ✅ | ✅ |
| Post tasks | ✅ | ✅ |
| Accept tasks | ✅ | ✅ |
| View profile | ✅ | ✅ |
| Admin dashboard | ❌ | ✅ |
| Edit/Delete any task | ❌ | ✅ |
| View all users | ❌ | ✅ |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |

### Users (🔒 JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile + tasks |
| PUT | `/api/users/profile` | Update name/bio |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task (🔒) |
| PUT | `/api/tasks/:id` | Update task (🔒 owner/admin) |
| DELETE | `/api/tasks/:id` | Delete task (🔒 owner/admin) |
| POST | `/api/tasks/:id/accept` | Accept task (🔒) |

### Admin (🔒 Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/tasks` | List all tasks |
| POST | `/api/admin/tasks` | Add task |
| PUT | `/api/admin/tasks/:id` | Edit task |
| DELETE | `/api/admin/tasks/:id` | Delete task |
| PUT | `/api/admin/tasks/:id/status` | Change task status |

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] `server/.env` filled with MONGO_URI, JWT_SECRET, CLIENT_URL
- [ ] Backend deployed to Render and health-checked at `/`
- [ ] `client/.env` filled with VITE_API_URL (Render URL)
- [ ] Frontend deployed to Vercel
- [ ] User registration tested
- [ ] Login tested (user + admin roles)
- [ ] Task creation tested
- [ ] Task acceptance tested
- [ ] Admin dashboard accessible with admin account
- [ ] Admin add/edit/delete task tested

---

## 🎨 Design System

Follows the `rentanindian.ai` brand identity:
- **Fonts:** Sora (display), DM Sans (body), JetBrains Mono (code)
- **Primary:** `#2E8CE8` (sky blue)
- **Accent:** `#F56C1D` (orange)
- **Dark:** `#0A0E1A`
- **Gradient hero:** Deep navy → sky blue → pale blue

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS + custom CSS vars |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios |
| Deployment | Vercel (frontend), Render (backend) |
