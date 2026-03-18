# 🐾 PawTime — Pet Feeding Scheduler

A clean, elegant, Apple-inspired scheduling platform to manage feeding times for your pets. Built with React, Express, MongoDB, and JWT authentication.

![PawTime](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20MongoDB-orange)

---

## ✨ Features

- **Authentication** — Secure JWT-based sign up / login / logout
- **Pet Management** — Add, edit, delete pets with emoji, type, age, and notes
- **Feeding Scheduler** — Multiple daily times, recurring days, meal labels
- **Dashboard** — Today's feed timeline with "Mark Fed" tracking
- **Weekly View** — 7-day calendar grid of all schedules
- **Dark Mode** — Full dark/light toggle persisted to localStorage
- **Browser Notifications** — 5-minute pre-feed alerts (requires permission)
- **Auto-suggest** — Smart feeding time suggestions based on pet type
- **LocalStorage fallback** — Works fully offline without a backend
- **Responsive** — Mobile + desktop layout

---

## 📁 Project Structure

```
pawtime/
├── frontend/                   # React + Vite app
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx            # Entry point
│       ├── App.jsx             # Root component + auth gate
│       ├── context/
│       │   └── AppContext.jsx  # Global state (pets, schedules, dark mode)
│       ├── pages/
│       │   ├── Auth.jsx        # Login / Sign up
│       │   └── Dashboard.jsx   # Main layout + routing
│       ├── components/
│       │   ├── Sidebar.jsx     # Navigation sidebar
│       │   ├── DashboardHome.jsx  # Today's overview + stats
│       │   ├── PetsManager.jsx    # Pet CRUD UI
│       │   └── ScheduleManager.jsx # Schedule CRUD + weekly view
│       └── utils/
│           └── api.js          # Backend API client
│
└── backend/                    # Express + MongoDB API
    ├── server.js               # App entry + MongoDB connect
    ├── seed.js                 # Sample data seeder
    ├── package.json
    ├── .env.example
    ├── middleware/
    │   └── auth.js             # JWT verify + sign helpers
    ├── models/
    │   ├── User.js             # User schema + bcrypt
    │   └── PetSchedule.js      # Pet + Schedule schemas
    └── routes/
        ├── auth.js             # POST /register, /login, GET /me
        ├── pets.js             # CRUD /api/pets
        └── schedules.js        # CRUD /api/schedules + mark-fed
```

---

## 🚀 Quick Start

### Option A: Frontend Only (localStorage mode)
No backend needed — works instantly in browser.

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
# Register with any email + password
```

### Option B: Full Stack

#### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm run dev
# API running at http://localhost:5000
```

#### 2. Frontend Setup

```bash
cd frontend
npm install

# Optional: point to backend
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
# App running at http://localhost:3000
```

#### 3. Seed Sample Data (optional)

```bash
cd backend
node seed.js

# Login with:
# Email:    alex@example.com
# Password: password123
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, returns JWT |
| GET  | `/api/auth/me` | Get current user (protected) |

### Pets (all protected — Bearer token required)
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/pets` | List all pets |
| POST   | `/api/pets` | Create pet |
| PUT    | `/api/pets/:id` | Update pet |
| DELETE | `/api/pets/:id` | Delete pet + schedules |

### Schedules (all protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/schedules` | List all schedules |
| GET    | `/api/schedules/today` | Today's feeds with fed status |
| POST   | `/api/schedules` | Create schedule |
| PUT    | `/api/schedules/:id` | Update schedule |
| PATCH  | `/api/schedules/:id/fed` | Mark a feeding done |
| DELETE | `/api/schedules/:id` | Delete schedule |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub → import in vercel.com
# Set env: VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render
1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on render.com
3. Set environment variables:
   - `MONGO_URI` → MongoDB Atlas connection string
   - `JWT_SECRET` → a long random string
   - `FRONTEND_URL` → your Vercel app URL
4. Build command: `npm install`
5. Start command: `npm start`

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (or Render's IPs)
4. Copy connection string → paste into `MONGO_URI`

---

## 🧩 Pet Types & Auto-Suggested Feed Times

| Pet | Times |
|-----|-------|
| 🐶 Dog | 7:00 AM, 12:00 PM, 6:00 PM |
| 🐱 Cat | 8:00 AM, 6:00 PM |
| 🐦 Bird | 7:00 AM, 1:00 PM, 7:00 PM |
| 🐠 Fish | 8:00 AM, 8:00 PM |
| 🐰 Rabbit | 8:00 AM, 12:00 PM, 6:00 PM |
| 🐹 Hamster | 6:00 PM, 10:00 PM |
| 🐢 Turtle | 9:00 AM, 5:00 PM |

---

## 🛡️ Security Notes

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire in 7 days
- All pet/schedule routes scoped to authenticated user
- Helmet.js for HTTP security headers
- Input validation on all endpoints
- `JWT_SECRET` and `MONGO_URI` must be set via environment variables in production — never commit `.env`

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, inline CSS (no Tailwind dep needed) |
| State | React Context + localStorage |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Security | Helmet, CORS |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |
