# Aionion Events

Premium financial events, private experiences and ticket-booking platform for **Aionion Capital**.

- **client/** — React 18 + Vite + React Router (all pages, design system in `src/styles/styles.css`)
- **server/** — Node + Express API (events, bookings, meetings, access requests, profile). Data lives in `server/data.js`; bookings persist to `server/db.json` (created automatically, delete it to reset the demo).

## Run

```bash
npm run install:all   # root + server + client deps
npm run dev           # API on :5000, web on http://localhost:5173 (proxies /api)
```

Production: `npm run build && npm start` → everything served from http://localhost:5000.

## Pages

| Route | Page |
|---|---|
| `/` | Home — cinematic hero, conversation selector, featured experience, ACCESS, private, speakers, impact, cities |
| `/explore` | Event discovery — search, dashboard filters, quick chips, sort (server-side filtering) |
| `/categories` | Event types, each with its own atmosphere |
| `/events/:id` | Event detail + sticky booking panel (mobile: sticky Reserve bar) |
| `/private` | Aionion Private + Request Access |
| `/meetings` | Client meeting booking — type, mode, calendar, live slot availability |
| `/checkout/:id` | 01 Ticket → 02 Attendee → 03 Payment (UPI / Cards / Net Banking) |
| `/confirmation/:bookingId` | “You’re in.” + digital credential (download, calendar .ics, share, directions) |
| `/tickets` | My Tickets — upcoming / past / cancelled passes |
| `/speakers`, `/profile` | Speakers, member profile & preferences |

## API

`GET /api/catalog` · `GET /api/events?q&category&city&date&format&price&audience&quick&sort` · `GET /api/events/:id` · `GET /api/events/:id/ics` · `GET|POST /api/bookings` · `GET /api/bookings/:id` · `POST /api/bookings/:id/cancel` · `GET /api/meetings/availability?date=` · `POST /api/meetings` · `POST /api/access-requests` · `POST /api/newsletter` · `GET|PUT /api/profile`

## Before going live

- **Payments are simulated.** Plug a gateway (e.g. Razorpay) into `POST /api/bookings` and only confirm after the payment webhook.
- **Authentication is simulated.** Demo login scopes member bookings and restricts organizer routes; replace its demo tokens with production authentication before launch.
- Swap the JSON store (`server/store.js`) for a real database.
- QR tickets use real scannable codes. Organizer check-in supports the camera and manual entry, and rejects duplicate or invalid tickets.
- Speaker portraits, attendee faces and event scenes use original AI-generated Indian professional imagery in `client/public/images/india/`. These are fictional demonstration people and events, not real Aionion team photos. City and office photography remains illustrative stock content. Replace demo names, biographies and market figures with approved Aionion content before launch. See `client/public/images/india/ASSETS.md` for the prompt set and asset details.

## Updated journeys and appearance

The floating **White / Dark** panel remembers the selected theme. Discovery includes category and date filters, recommendations, experts and nearby events. Checkout supports guests, company/designation fields, server-calculated fees and GST, promotion codes, Invite Only access codes and simulated wallet payment.

New routes:

- `/login`: use `arjun.raman@example.com` for the member demo or `organizer@aionion.com` for organizer access. Enter any password with at least six characters.
- `/organizer`: overview, events, attendee/booking search, revenue, payments, promotions, CSV reports and settings.
- `/organizer/events/new`: submit an event for review. Submissions remain unpublished until approved.
- `/checkin`: organizer camera QR scanner and manual entry.
- `/invite/LEGACY-7Q2K`: sample private invitation. Verify with `arjun.raman@example.com`; supports Admit 2.
- `/about`, `/organizers`, `/help`, `/contact`, `/privacy`, `/terms`, `/refund-policy`: supporting information.

Public Invite Only code: `AIONION-CLIENT`. Sample promotion: `EARLYBIRD`.

Email ticket requests are recorded in the preview, but email delivery requires a provider. The confirmation page offers print/save as PDF, calendar, directions and sharing. Payments and refunds remain simulations. Production authentication, payment webhooks, transactional inventory, final policies and an organizer approval workflow are still required for a public launch.

## Netlify visual preview

The Netlify configuration publishes a read-only preview. Run `npm run build:preview` to export public demo events from an isolated temporary database and build with `VITE_PREVIEW_ONLY=true`. It includes images, filtering, public event details and calendar files. Accounts, bookings, private invitations, payments and form submissions are disabled. No local users or bookings are exported.

Netlify site: https://aionion-events-abishek.netlify.app

After signing in with Netlify CLI, publish the preview build with `netlify deploy --prod --dir client/dist --no-build`. Always run `npm run build:preview` before publishing. A normal `npm run build` continues to produce the backend-connected application for local/full-stack hosting.

The Netlify account session and project link stay outside the published directory. `.netlify/`, temporary tools and exported preview snapshots are excluded from Git. The cloud build regenerates public snapshots from the demo data; it does not read `server/db.json`.

## Validation

Run `npm --prefix server test` and `npm run build`. On PowerShell systems blocking `npm.ps1`, use `npm.cmd`.

The API smoke test starts an isolated temporary database and verifies quotes, guest bookings, organizer access, QR check-in, RSVP and review submissions without changing `server/db.json`.

The temporary browser check at `.tmp/visual-check.cjs` checks 390/768/1100/1440px layouts, saved appearance, guest wallet checkout, QR confirmation, organizer routes and private RSVP. Its Playwright installation and Chromium live under `.tmp`; screenshots are saved to `.tmp/screenshots`.

`npm run dev` manages one development session with a process lock. Repeating the command does not create additional API or Vite processes. The API uses port 5000 and Vite uses port 5173; an occupied port produces a clear error instead of silently selecting another port or reusing an old API. Stop the existing terminal with Ctrl+C before starting a new session. API file changes restart the server and release its listening port cleanly.
