# QuickConnect Backend API

Backend for multi-service worker booking platform built with Node.js, Express, TypeScript, and Supabase.

## Quick Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Setup Environment Variables**

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Run Database Setup**

- Go to Supabase SQL Editor
- Run the `database.sql` script

4. **Start Development Server**

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user/worker
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users/bookings` - Get user bookings
- `DELETE /api/users/account` - Delete account

### Workers

- `GET /api/workers` - Search workers
- `GET /api/workers/:id` - Get worker details
- `PUT /api/workers/profile` - Update worker profile
- `POST /api/workers/services` - Update services
- `GET /api/workers/my/bookings` - Get worker bookings

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/review` - Add review

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details

## Environment Variables

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

## Testing

Test the health endpoint:

```bash
curl http://localhost:5000/health
```

Register a user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "user_type": "user"
  }'
```

## Project Structure
