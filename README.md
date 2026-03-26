# LerniQ Landing

React + TypeScript + Tailwind frontend for the LerniQ platform. Includes the public landing page, waitlist signup, course rep registration, and an internal admin dashboard.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router v6
- React Hook Form + Zod
- Axios

## Pages

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/join` | Waitlist signup — generates a referral link on success |
| `/join?ref=LNQ-XXXXX` | Signup via a referral link |
| `/course-rep` | Course rep registration — generates a Typeform lecturer survey link |
| `/admin` | Admin login |
| `/admin/dashboard` | Protected dashboard — waitlist signups and course rep referral stats |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_API_URL=http://localhost:3000
```

### 3. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` (or `5174` if that port is taken).

> The backend (`lerniq-api`) must be running for the forms and dashboard to work.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. The project is configured for deployment on **Vercel** — `vercel.json` handles SPA routing so all routes resolve to `index.html`.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the `lerniq-api` backend (no trailing slash) |

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo into Vercel, set root directory to `lerniq-landing`
3. Add `VITE_API_URL` pointing to your Render backend URL
4. Deploy
