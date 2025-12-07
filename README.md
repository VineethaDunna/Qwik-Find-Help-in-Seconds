

```md
# 🚀 Qwik – Find Help In Seconds


QuickConnect is a full-stack platform that connects customers with local workers such as carpenters, electricians, drivers, beauticians, tailors, and more.  
Users can instantly book workers, and workers get a dashboard to manage bookings, availability, services, and earnings.

---

## 📸 Screenshots

> Replace these placeholders with your actual screenshots inside `/public/images`.

![Home](./public/images/home.png)
![Worker Dashboard](./public/images/worker-dashboard.png)
![Booking Flow](./public/images/booking-flow.png)

---

## 🧰 Tech Stack

### **Frontend**
- React + TypeScript  
- Vite  
- TailwindCSS  
- ShadCN UI  
- React Router  
- Lucide Icons  
- Google Identity Services (Google Sign-In)

### **Backend**
- Node.js + Express  
- TypeScript  
- Supabase (PostgreSQL)  
- Supabase Auth (Service Role)  
- JWT Authentication (Access + Refresh Tokens)  
- Google OAuth Token Verification  
- Zod Validation Middleware

### **Dev Tools**
- Nodemon / ts-node  
- Git & GitHub  
- ESLint + Prettier  
- Railway / Render (Backend)  
- Vercel / Netlify (Frontend)

---

## 🧩 Core Features

### 🎯 User Features
- Create account (Email or Google)  
- Browse workers by service or location  
- Book workers instantly  
- Pricing transparency  
- Track booking status  
- Leave ratings and reviews  

### 👨‍🔧 Worker Features
- Service management (add/remove services)  
- Custom service support  
- Set hourly rate  
- Add bio, experience, description  
- Set availability for all weekdays (Mon–Sun)  
- Manage bookings (accept/decline/complete)  
- Customer history + analytics dashboard  
- Earnings summary  
- Edit profile anytime  

### 🔐 Authentication
- Access Token + Refresh Token  
- Google Sign-In (GSI SDK)  
- Supabase database with secure row access  
- Role-based (`user`, `worker`)

---

## 🏗 Project Structure

```

/
├─ frontend/                # React + Vite client app
│  ├─ src/
│  │  ├─ components/       # UI components + shadcn
│  │  ├─ pages/            # User & worker pages
│  │  ├─ services/         # API wrapper
│  │  └─ data/             # Mock data for UI
│  └─ public/
│
├─ backend/                 # Express API
│  ├─ src/
│  │  ├─ controllers/      # Request handlers
│  │  ├─ services/         # Business logic
│  │  ├─ routes/           # Route definitions
│  │  ├─ middleware/       # Auth + validation
│  │  └─ config/           # JWT + Google + Supabase setup
│  └─ package.json
│
└─ README.md

```

---

## ⚙️ Environment Setup

### **Backend `.env`**
```

PORT=5000

SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_SECRET=supersecret_32_chars_minimum
JWT_EXPIRES_IN=7d

JWT_REFRESH_SECRET=another_supersecret_32_chars_minimum
JWT_REFRESH_EXPIRES_IN=30d

FRONTEND_URL=[http://localhost:8080](http://localhost:8080)
CORS_ORIGIN=[http://localhost:8080](http://localhost:8080)

```

### **Frontend `.env`**
```

VITE_API_URL=[http://localhost:5000](http://localhost:5000)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

````

---

## ▶️ Running the Project

### **Backend**
```bash
cd backend
npm install
npm run dev
````

### **Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open the app at:
👉 [http://localhost:8080](http://localhost:8080)

---

## 🔌 API Endpoints Overview

### **AUTH**

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register (user/worker) |
| POST   | `/api/auth/login`    | Login                  |
| POST   | `/api/auth/google`   | Google OAuth           |
| POST   | `/api/auth/refresh`  | Refresh JWT            |
| GET    | `/api/auth/me`       | Logged-in user         |

### **WORKERS**

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/api/workers`     | Get all workers     |
| GET    | `/api/workers/:id` | Get worker details  |
| PUT    | `/api/workers/:id` | Edit worker profile |

### **BOOKINGS**

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| POST   | `/api/bookings`            | Create booking            |
| PUT    | `/api/bookings/:id/status` | Accept, Decline, Complete |
| GET    | `/api/bookings/user`       | User’s bookings           |
| GET    | `/api/bookings/worker`     | Worker’s bookings         |

---

## 📦 Building for Production

### Frontend Build

```bash
npm run build
```

### Backend Build

```bash
npm run build
npm start
```

---

## 🚀 Deployment Guide

### **Frontend (Vercel/Netlify)**

* Set environment variables under project settings
* Add backend API base URL
* Allow Google OAuth domain

### **Backend (Railway/Render)**

* Add all `.env` variables
* Allow CORS from the frontend domain
* Add your production frontend URL to Google console

### **Google OAuth Setup**

1. Go to: [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URIs:

   ```
   http://localhost:8080
   https://your-production-domain.com
   ```
4. Copy **Client ID** → set to frontend `.env`

---

## 👑 Author

Made with ❤️ by **Vineetha**


