# Auto Shop Demo - Modern Auto Repair Website

A custom-built, high-performance website for Auto Shop Demo, a Dallas-based auto repair shop established in 1987.

## 🏗️ Architecture

**Monorepo Structure** using npm workspaces:
```
autoshopdemo/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express.js + PostgreSQL + Prisma
├── docs/              # Documentation
└── PROGRESS.md        # Development progress tracker
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ (JavaScript/JSX)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup
- **Animations**: Framer Motion
- **State**: React Context + React Query
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js (CommonJS)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Yup
- **Email**: Nodemailer
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 14+
- npm 10+

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb autoshopdemo

# Run Prisma migrations
npm run prisma:migrate --workspace=backend
```

4. **Start development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:5000
```

## 📦 Available Scripts

### Root Commands
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm test` - Run all tests
- `npm run docker:up` - Start Docker containers
- `npm run prisma:studio` - Open Prisma Studio

### Workspace Commands
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run test:frontend` - Test frontend
- `npm run test:backend` - Test backend

## 🐳 Docker

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📂 Project Structure

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts
│   ├── utils/            # Utility functions
│   ├── assets/           # Images, fonts, etc.
│   └── App.jsx           # Root component
├── public/               # Static files
└── package.json
```

### Backend (`/backend`)
```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utilities
│   ├── config/           # Configuration
│   └── server.js         # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## 🗄️ Database Schema

### Models
- **Contact** - Contact form submissions
- **Quote** - Service quote requests
- **Coupon** - Active coupons and specials
- **Review** - Customer testimonials

See `/backend/prisma/schema.prisma` for full schema.

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `SMTP_*` - Email configuration
- `VITE_API_BASE_URL` - Backend API URL

### Optional
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps integration
- `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA spam protection
- `SENTRY_DSN` - Error monitoring

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend
```

## 📈 Performance Targets

- Lighthouse Score: 90+ (all metrics)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 300KB gzipped

## 🚢 Deployment

### Frontend
- Recommended: Vercel, Netlify, or AWS S3 + CloudFront
- Build command: `npm run build:frontend`
- Output directory: `frontend/dist`

### Backend
- Recommended: Railway, Render, or AWS ECS
- Start command: `node src/server.js`
- Environment: Node.js 20+

### Database
- Recommended: Supabase, PlanetScale, or managed PostgreSQL

## 📝 Development Progress

See [PROGRESS.md](./PROGRESS.md) for detailed development progress and task tracking.

## 🏢 Business Information

**Auto Shop Demo**
- Address: 1818 Storey Ln #100, Dallas, TX 75220
- Phone: 214-353-9605
- Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM, Sun Closed
- Established: 1987 (38 years in business)

## 📄 License

UNLICENSED - Proprietary software for Auto Shop Demo

---

**Built with ❤️ for Auto Shop Demo**
