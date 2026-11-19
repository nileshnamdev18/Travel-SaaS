# TravelPulse Backend — Express + MongoDB

## Quick Start

### Prerequisites
1. **MongoDB** running locally on port 27017
   ```bash
   mongod --dbpath C:\data\db
   ```
2. **Node.js** 18+

### Setup & Run

```bash
# 1. Install dependencies
cd server
npm install

# 2. Seed database (creates admin user + 9 holiday packages + config)
npm run seed

# 3. Start API server (dev with hot-reload)
npm run dev
```

Server starts at: **http://localhost:5000**

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new customer |
| POST | `/api/auth/login` | Public | Login (returns JWT) |
| GET | `/api/auth/me` | Bearer | Get current user |
| POST | `/api/auth/change-password` | Bearer | Change password |

### Holiday Packages (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/packages` | Public | List with filters, search, pagination |
| GET | `/api/packages/featured` | Public | Get featured packages |
| GET | `/api/packages/:id` | Public | Get package detail |
| POST | `/api/packages` | 🔒 Admin | Create new package |
| PUT | `/api/packages/:id` | 🔒 Admin | Full update |
| PATCH | `/api/packages/:id` | 🔒 Admin | Partial update |
| DELETE | `/api/packages/:id` | 🔒 Admin | Soft delete |

**Package Query Filters:**
- `search` — full-text search
- `destinationType` — `domestic` | `international`
- `theme` — `family` | `honeymoon` | `adventure`
- `category` — `Customized` | `Group Tour` | `Fixed Departure`
- `isBestSeller`, `isFeatured`, `isTrending` — `true` | `false`
- `minPrice`, `maxPrice` — USD
- `sort` — `recommended` | `price_asc` | `price_desc` | `duration_asc` | `duration_desc` | `newest`
- `page`, `limit` — pagination

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | 🔒 Customer | Create booking inquiry |
| GET | `/api/bookings/my` | 🔒 Customer | My bookings |
| GET | `/api/bookings/:id` | 🔒 Customer/Admin | Get booking detail |
| PATCH | `/api/bookings/:id/status` | 🔒 Admin | Update status |
| DELETE | `/api/bookings/:id` | 🔒 Admin | Delete booking |

**Booking Statuses:** `inquiry_received` → `customizing` → `quote_sent` → `confirmed` → `completed` | `cancelled`

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | 🔒 Admin | Stats + recent bookings |
| GET | `/api/admin/bookings` | 🔒 Admin | All bookings with filter |
| GET | `/api/admin/packages` | 🔒 Admin | All packages incl. inactive |
| GET | `/api/admin/users` | 🔒 Admin | All users |
| PATCH | `/api/admin/users/:id/toggle` | 🔒 Admin | Activate/deactivate user |

### Config

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/config/holiday` | Public | Public config (markup hidden) |
| GET | `/api/config/holiday/admin` | 🔒 Admin | Full config with markup % |
| PUT | `/api/config/holiday` | 🔒 Admin | Update global holiday settings |

---

## Default Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@travelpulse.in | Admin@123 |
| Demo Customer | customer@travelpulse.in | Customer@123 |

---

## Architecture

```
server/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── models/
│   │   ├── User.model.ts     # Users (customer/super_admin)
│   │   ├── HolidayPackage.model.ts  # Holiday packages (full CRUD)
│   │   ├── HolidayBooking.model.ts  # Booking records
│   │   └── AdminConfig.model.ts     # Admin-configurable settings
│   ├── routes/
│   │   ├── auth.routes.ts    # Register, login, me
│   │   ├── package.routes.ts # Package CRUD
│   │   ├── booking.routes.ts # Booking management
│   │   ├── admin.routes.ts   # Admin dashboard + users
│   │   └── config.routes.ts  # Global config management
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT + RBAC guards
│   ├── utils/
│   │   └── jwt.utils.ts      # Token generation
│   └── scripts/
│       └── seed.ts           # DB seed script
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travelpulse
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_DEFAULT_EMAIL=admin@travelpulse.in
ADMIN_DEFAULT_PASSWORD=Admin@123
```
