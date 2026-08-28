# Shoot Delight — Full Stack Booking Platform

A production-ready booking website for **Shoot Delight**, an Instagram-first content creation
studio. Customers browse services & packages and book a shoot with live slot availability;
admins manage bookings, services, packages, and slots from a secure dashboard.

The site **never uploads or stores media** — the Portfolio page links straight to Instagram.

---

## Tech Stack

| Layer      | Tech                                                                 |
|------------|-----------------------------------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, React Router, Axios, React Hook Form, Framer Motion, React Icons |
| Backend    | Node.js, Express.js                                                  |
| Database   | PostgreSQL via Prisma ORM                                            |
| Auth       | JWT + bcrypt (admin-only; customers never create accounts)          |
| Email      | Nodemailer (SMTP) or Resend                                          |
| Deploy     | Vercel (frontend), Railway (backend), Supabase (Postgres)            |

---

## Project Structure

```
shoot-delight/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Navbar, Footer, cards, ProtectedRoute...
│       ├── context/        # AuthContext (admin session)
│       ├── layouts/        # MainLayout (public site), AdminLayout (dashboard)
│       ├── pages/          # Home, About, Services, Packages, Portfolio, Booking, Contact, FAQ
│       │   └── admin/      # AdminLogin, AdminDashboard, AdminBookings, AdminServices, AdminPackages, AdminSlots
│       └── services/api.js # Axios instance with auth token injection
│
└── server/                 # Express backend
    ├── prisma/
    │   ├── schema.prisma   # Admin, Customer, Service, Package, Slot, Booking models
    │   └── seed.js         # Creates first admin + starter services/packages
    └── src/
        ├── controllers/    # Business logic per resource
        ├── routes/         # Express routers
        ├── middlewares/    # auth (JWT), validate, errorHandler
        ├── utils/          # email templates + sender, JWT helper
        ├── app.js           # Express app (security, routes)
        └── server.js        # Entry point
```

---

## 1. Local Setup

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local, or a free [Supabase](https://supabase.com) project)

### Backend

```bash
cd server
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, SMTP/Resend credentials
npm install
npx prisma migrate dev --name init   # creates tables
npm run seed                          # creates the first admin + starter services/packages
npm run dev                           # http://localhost:5000
```

Your seeded admin login is printed to the console (from `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `.env` — **change the password after first login**).

### Frontend

```bash
cd client
cp .env.example .env      # set VITE_API_URL and VITE_INSTAGRAM_URL
npm install
npm run dev                # http://localhost:5173
```

Visit `http://localhost:5173/admin/login` to sign in to the dashboard.

> **Note on this sandbox:** `prisma generate` needs to download engine binaries from
> `binaries.prisma.sh`. It works normally on your machine, Vercel, and Railway — it was
> only blocked in the network-restricted environment this project was assembled in.

---

## 2. How the Booking + Slot System Works

1. Admin creates time slots for a date (`Admin → Slots`), e.g. 10:00 AM, 12:00 PM, 2:00 PM...
2. On the public **Booking** page, selecting a date fetches that date's slots. Already-booked
   or blocked slots render disabled and can't be selected.
3. On submit, the backend runs an atomic **Prisma transaction**: it re-checks the slot is
   still free, creates the customer + booking, and locks the slot to that booking — this
   prevents two customers from double-booking the same slot in a race condition.
4. Two emails fire: a confirmation to the customer, a full-detail alert to the business inbox.
5. If an admin **rejects** or **cancels** a booking, its slot automatically frees up again.

---

## 2b. Advance Payment (Manual UPI Verification)

After a booking is submitted, the success page shows the business UPI number (`PAYMENT_NUMBER`
env var, defaults to `8919080514`) and asks the customer to pay a 50% advance and upload a
screenshot. That screenshot is:

1. Held only in memory (`multer.memoryStorage()` — never written to disk).
2. Emailed as an attachment straight to `BUSINESS_EMAIL`, along with the booking reference.
3. Discarded once the request completes — nothing is stored in the database or filesystem.

The booking's `advancePaymentStatus` flips to `SUBMITTED` so it shows up in `Admin → Bookings`
with a **Verify** button; clicking it sets it to `VERIFIED` once you've manually confirmed the
payment. This is intentionally a manual-verification flow — no payment gateway integration is
required (see the API requirements note below).

---

## 3. Security Measures Implemented

- **JWT auth** for all admin routes, **bcrypt** (cost factor 12) for password hashing
- **Helmet** for secure HTTP headers
- **CORS** locked to `CLIENT_URL`
- **express-rate-limit**: global limiter + a stricter one on `/api/admin/login`
- **express-validator** on all write endpoints (booking form, admin login, service/package creation)
- **xss-clean** to sanitize request bodies against script injection
- Prisma's parameterized queries eliminate SQL injection by design
- Centralized error handler that never leaks stack traces in production
- All secrets (DB, JWT, SMTP) via environment variables — never hardcoded

---

## 4. API Reference

| Method | Endpoint                  | Auth  | Purpose                              |
|--------|---------------------------|-------|---------------------------------------|
| POST   | `/api/admin/login`        | –     | Admin login, returns JWT              |
| GET    | `/api/admin/me`           | Admin | Current admin profile                 |
| GET    | `/api/services`           | –     | List active services                  |
| POST   | `/api/services`           | Admin | Create service                        |
| PUT    | `/api/services/:id`       | Admin | Update service                        |
| DELETE | `/api/services/:id`       | Admin | Delete service                        |
| GET    | `/api/packages`           | –     | List active packages                  |
| POST   | `/api/packages`           | Admin | Create package                        |
| PUT    | `/api/packages/:id`       | Admin | Update package                        |
| DELETE | `/api/packages/:id`       | Admin | Delete package                        |
| GET    | `/api/slots?date=`        | –     | Slots + availability for a date       |
| POST   | `/api/slots`              | Admin | Create slots for a date               |
| PUT    | `/api/slots/:id/block`    | Admin | Block a slot / mark holiday           |
| PUT    | `/api/slots/:id/unblock`  | Admin | Unblock a slot                        |
| DELETE | `/api/slots/:id`          | Admin | Delete a slot                         |
| POST   | `/api/bookings`           | –     | Create a booking (public form)        |
| GET    | `/api/bookings`           | Admin | List/search/filter bookings           |
| GET    | `/api/bookings/:id`       | Admin | Booking detail                        |
| PUT    | `/api/bookings/:id`       | Admin | Update status/notes                   |
| DELETE | `/api/bookings/:id`       | Admin | Delete booking                        |
| GET    | `/api/dashboard`          | Admin | Dashboard stats + monthly chart data  |

---

## 5. Deployment

### Database — Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Copy the **connection string** (Settings → Database → Connection string, "URI" mode,
   use the pooled connection for serverless) into `DATABASE_URL`.

### Backend — Railway
1. Push `server/` to a GitHub repo (or connect the monorepo and set the root directory to `server`).
2. Create a new Railway project from that repo.
3. Add all variables from `.env.example` in Railway's Variables tab.
4. `railway.json` is already configured to run `prisma migrate deploy` before starting the server.
5. After first deploy, run `npm run seed` once via Railway's shell (or a one-off command) to create the admin.

### Frontend — Vercel
1. Import `client/` into Vercel (set root directory to `client` if using a monorepo).
2. Framework preset: **Vite**.
3. Set `VITE_API_URL` to your deployed Railway URL (e.g. `https://your-app.up.railway.app/api`)
   and `VITE_INSTAGRAM_URL` to your real Instagram page.
4. `vercel.json` is already set up to rewrite all routes to `index.html` for React Router.

### Post-deploy checklist
- [ ] Update `CLIENT_URL` in the backend env to your live Vercel domain (for CORS).
- [ ] Change the seeded admin password immediately.
- [ ] Add real slots for the upcoming week (`Admin → Slots`).
- [ ] Verify a test booking sends both emails correctly.

---

## 6. What APIs / Credentials You Actually Need

Nothing beyond what's already in `.env.example` — no payment gateway, no third-party upload
service, no paid API is required for what's built:

| Need | What to get | Where it's used |
|---|---|---|
| **Database** | A `DATABASE_URL` connection string (free tier on Supabase is fine) | Prisma, all data |
| **Email sending** | Either a Gmail **App Password** (Google Account → Security → App Passwords, requires 2FA on) for `SMTP_USER`/`SMTP_PASS`, **or** a free Resend API key | Booking confirmations, admin alerts, payment screenshots |
| **JWT secret** | Any long random string you generate yourself | Signing admin login tokens |

Since `BUSINESS_EMAIL` and `SMTP_USER` are the same Gmail address
(`shootdelight678@gmail.com`), you only need **one App Password** — Gmail's regular password
won't work for SMTP, it has to be an App Password.

You'd only need a *real* payment API (Razorpay/Cashfree/Stripe, etc.) if you later want
automatic payment verification instead of the current manual "upload a screenshot, admin
verifies" flow. That's a bigger change (webhooks, signature verification, a live payment
page) — let me know if you want that instead of the manual flow.

---

## 7. What's Intentionally Not Included

- No customer accounts/login — bookings are guest-submitted by design.
- No media upload/storage anywhere — Portfolio links out to Instagram only.
- PDF export of bookings and Instagram embeds are marked "optional" in the spec and were
  left as a fast follow — the `Booking` model and admin detail modal already have everything
  needed to add a PDF export button (e.g. with a small `pdfkit` route) without schema changes.
#   s h o o t - d e l i g h t  
 #   s h o o t d e l i g h t  
 