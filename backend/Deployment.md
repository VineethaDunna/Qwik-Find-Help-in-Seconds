# QuickConnect Backend - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Cloud Console account (for OAuth)
- Git installed
- Basic knowledge of terminal/command line

## Step-by-Step Setup

### 1. Create Project Directory

```bash
mkdir quickconnect-backend
cd quickconnect-backend
```

### 2. Initialize Project

```bash
# Initialize npm
npm init -y

# Install production dependencies
npm install express cors dotenv bcryptjs jsonwebtoken express-validator
npm install @supabase/supabase-js google-auth-library compression helmet morgan

# Install development dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/bcryptjs @types/jsonwebtoken @types/compression
npm install -D @types/morgan ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

### 3. Create Folder Structure

```bash
mkdir -p src/{config,middleware,routes,controllers,services,types,utils}
mkdir -p src
```

### 4. Copy All Code Files

Copy the following files into your project:

**Configuration Files (root directory):**

- `package.json`
- `tsconfig.json`
- `nodemon.json`
- `.env.example`
- `.gitignore`

**Source Files (src directory):**

- `src/app.ts`
- `src/types/index.ts`
- `src/config/database.ts`
- `src/config/jwt.ts`
- `src/config/google-oauth.ts`
- `src/middleware/auth.ts`
- `src/middleware/errorHandler.ts`
- `src/middleware/validate.ts`
- `src/services/auth.service.ts`
- `src/services/user.service.ts`
- `src/services/worker.service.ts`
- `src/services/booking.service.ts`
- `src/controllers/auth.controller.ts`
- `src/controllers/user.controller.ts`
- `src/controllers/worker.controller.ts`
- `src/controllers/booking.controller.ts`
- `src/controllers/service.controller.ts`
- `src/routes/auth.routes.ts`
- `src/routes/user.routes.ts`
- `src/routes/worker.routes.ts`
- `src/routes/booking.routes.ts`
- `src/routes/service.routes.ts`

### 5. Setup Supabase

#### A. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Fill in details:
   - Name: QuickConnect
   - Database Password: (save this!)
   - Region: Choose closest to your users
5. Wait for project to be created

#### B. Get API Credentials

1. Go to Project Settings > API
2. Copy these values:
   - Project URL → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### C. Run Database Setup

1. Go to SQL Editor in Supabase Dashboard
2. Copy and paste the main database setup SQL
3. Click "Run"
4. Copy and paste the additional SQL functions
5. Click "Run"

Verify tables created:

- Go to Table Editor
- You should see: users, workers, services, worker_services, bookings, reviews

### 6. Setup Google OAuth

#### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
   - Go to "APIs & Services" > "Library"
   - Search "Google+ API"
   - Click "Enable"

#### B. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure consent screen if prompted
4. Choose "Web application"
5. Add authorized redirect URIs:
   ```
   http://localhost:5173
   https://your-production-domain.com
   ```
6. Copy:
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

### 7. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
nano .env  # or use any text editor
```

Fill in all the values you collected:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

JWT_SECRET=generate_a_long_random_string_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=generate_another_long_random_string
JWT_REFRESH_EXPIRES_IN=30d

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOC...

CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

**Generate secure JWT secrets:**

```bash
# On Linux/Mac
openssl rand -base64 64

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### 8. Create .gitignore

```bash
cat > .gitignore << EOL
node_modules/
dist/
.env
.DS_Store
*.log
.vscode/
.idea/
EOL
```

### 9. Start Development Server

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

You should see:

```
  ╔══════════════════════════════════════╗
  ║   QuickConnect API Server Running   ║
  ╠══════════════════════════════════════╣
  ║   Port: 5000                         ║
  ║   Environment: development           ║
  ╚══════════════════════════════════════╝
```

### 10. Test the API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is healthy","timestamp":"..."}

# Get services
curl http://localhost:5000/api/services

# Register a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "user_type": "user"
  }'
```

## Frontend Integration

### Update your Frontend .env

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### API Service Example

Create `src/services/api.js` in your frontend:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
	// Auth
	async register(data) {
		const res = await fetch(`${API_URL}/api/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		return res.json();
	},

	async login(email, password) {
		const res = await fetch(`${API_URL}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		return res.json();
	},

	// Workers
	async getWorkers(params = {}) {
		const query = new URLSearchParams(params);
		const res = await fetch(`${API_URL}/api/workers?${query}`);
		return res.json();
	},

	// Bookings
	async createBooking(data, token) {
		const res = await fetch(`${API_URL}/api/bookings`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		return res.json();
	},
};
```

## Production Deployment

### Deploy to Railway.app

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Connect your repository
4. Add environment variables in Railway dashboard
5. Deploy!

Railway will automatically:

- Install dependencies
- Build TypeScript
- Start the server

### Deploy to Render.com

1. Create account at [render.com](https://render.com)
2. Click "New" > "Web Service"
3. Connect your repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy!

### Deploy to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create quickconnect-api

# Set environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
# ... set all other vars

# Deploy
git push heroku main
```

### Deploy to DigitalOcean/AWS/VPS

1. Setup Node.js on server
2. Clone repository
3. Install dependencies: `npm install`
4. Create `.env` file with production values
5. Build: `npm run build`
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/app.js --name quickconnect-api
   pm2 save
   pm2 startup
   ```
7. Setup Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

## Monitoring & Logging

### Add Logging Service

```bash
npm install winston
```

Create `src/config/logger.ts`:

```typescript
import winston from "winston";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}
```

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable helmet middleware
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Set up health checks
- [ ] Use environment-specific configs
- [ ] Never commit .env files
- [ ] Review and test all endpoints
- [ ] Set up continuous deployment
- [ ] Configure firewall rules
- [ ] Regular security updates

## Troubleshooting

### Port already in use

```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### Cannot connect to Supabase

- Verify SUPABASE_URL format
- Check API keys are correct
- Ensure project is not paused

### Google OAuth not working

- Verify redirect URIs match exactly
- Check client ID/secret
- Ensure Google+ API is enabled

### Database errors

- Verify all SQL scripts ran successfully
- Check table names and relationships
- Look for typos in queries

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Express.js Guide: https://expressjs.com/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Google OAuth: https://developers.google.com/identity

## Next Steps

1. Test all endpoints thoroughly
2. Add rate limiting for production
3. Set up automated testing
4. Configure CI/CD pipeline
5. Add API documentation (Swagger)
6. Implement email notifications
7. Add payment integration
8. Set up analytics
