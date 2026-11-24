# 🍣 Sushi Photography — Lucky Titity

Photography portfolio + booking platform. **Next.js 16 (App Router) + PostgreSQL**, ported from the original React/Vite + Django project. One app now serves the site, the admin panel and the API.

## Stack
- **Next.js 16** (App Router, JavaScript) — pages are server components that read Postgres directly
- **PostgreSQL** via **Drizzle ORM** (`pg` driver, SQL migrations in `drizzle/`)
- **Auth**: bcrypt-hashed admin users, signed JWT in an `HttpOnly` cookie (`jose`)
- **Uploads**: stored on disk in `UPLOAD_DIR`, served at `/media/...` (same URLs as Django)
- Same design/CSS as the original (Cormorant Garamond + Josefin Sans)

## Quick start

```bash
npm install
cp .env.example .env.local        # then edit AUTH_SECRET + ADMIN_PASSWORD
docker compose up -d              # optional: local Postgres (or use your own)
npm run db:setup                  # migrate + seed starter content + create admin
npm run dev
```

| URL | What |
|---|---|
| `/` `/portfolio` `/services` `/book` `/contact` | Public site |
| `/admin/login` → `/admin` | Admin panel (credentials from `.env`) |

Generate a secret with `openssl rand -base64 32`. **Change the admin password** — the old `admin/admin123` is gone.

## Scripts
| Command | |
|---|---|
| `npm run db:migrate` | Apply SQL migrations |
| `npm run db:seed` | Categories, services & testimonials carried over from the Django DB (idempotent) |
| `npm run admin:create -- <user> <password>` | Create an admin / reset a password |
| `npm run db:generate` | After editing `src/db/schema.js`, generate a new migration |
| `npm run db:studio` | Browse the DB in Drizzle Studio |

## Project layout
```
src/
  db/schema.js            tables (snake_case columns, same field names as the old API)
  lib/
    queries.js            all DB reads
    resources.js crud.js  admin CRUD: validation + file handling per table
    auth.js media.js      sessions · image storage
  app/
    (site)/               public pages (+ Navbar/Footer layout)
    admin/login, admin/(panel)/…   admin pages (guarded server-side)
    api/…                 REST API    media/[...path]   uploaded images
  components/             client components (HeroSlider, PortfolioGallery, BookingForm, admin/*)
scripts/                  migrate · seed · create-admin
```

## API (same shapes as the Django API)
```
Public   GET  /api/categories  /api/photos?category=slug&featured=1  /api/services
              /api/testimonials?featured=1  /api/hero-slides  /api/gallery-spots
         POST /api/bookings
Auth     POST /api/auth/login  {username,password}   (sets cookie)   POST /api/auth/logout
Admin    /api/admin/{categories,photos,services,testimonials,hero-slides,gallery-spots}   GET, POST
         /api/admin/<resource>/:id                                                         GET, PATCH, DELETE
         /api/admin/bookings, /api/admin/bookings/:id (PATCH status/notes/quoted_price), /api/admin/bookings/stats
```
Admin routes return `401` without a session. Uploads accept JPEG/PNG/WebP/GIF/AVIF only (checked by file signature, ≤10 MB).

## Moving over your existing Django data
- **Rows**: the SQLite DB only contained the starter content (4 categories, 5 services, 3 testimonials, no photos/bookings) — `npm run db:seed` recreates exactly that.
- **Images**: if you had uploaded any, copy Django's `media/` folder contents into `uploads/` — paths like `portfolio/x.jpg` map straight onto `/media/portfolio/x.jpg`.
- **Admin login**: Django password hashes aren't reused; create a new admin with `npm run admin:create`.

## Behaviour changes / fixes vs the original
- **Category management** now exists in *Admin → Portfolio* (previously only possible in Django admin, which is gone). Deleting a category that still has photos is blocked.
- **Services admin** lists inactive services too (before, deactivating one made it unreachable).
- **Portfolio category tabs** now filter correctly (the old API returned a category id, so filtering never matched).
- **Booking form**: per-step required-field checks; time and guest count are genuinely optional (the old API rejected blanks); hidden honeypot field for bots.
- **Navbar** text was cream-on-cream on `/services`, `/portfolio`, `/contact` — fixed.
- Admin actions now show error toasts instead of failing silently.
- Login is rate-limited (10 attempts / 15 min / IP, in-memory — use Redis/your proxy if you scale to multiple instances).

## Deploying
- Needs a Node server + Postgres (VPS, Railway, Render, Fly…). Run `npm run build && npm run db:migrate && npm start`.
- **Uploads live on local disk**, so mount a persistent volume at `UPLOAD_DIR`. On serverless hosts (Vercel) the disk is ephemeral — swap `saveUpload/removeUpload` in `src/lib/media.js` for S3 / Cloudinary / R2.
- Behind nginx, raise `client_max_body_size` (default 1 MB) to ≥ 10 MB or uploads will fail.
- Set `AUTH_SECRET` and `DATABASE_URL` in the host's environment; serve over HTTPS (the cookie is marked `Secure` automatically when behind HTTPS).
