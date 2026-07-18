# Free Hosting Guide — Portfolio Backend + Frontend + MongoDB

This guide shows how to host your full stack **for free**:

| Part | Free service | Purpose |
|------|----------------|---------|
| Database | **MongoDB Atlas** | Store portfolio data |
| Backend API | **Render** (recommended) | Express + TypeScript API |
| Frontend | **Vercel** | Next.js portfolio + dashboard |

```
Browser → Vercel (frontend)
              ↓
         NEXT_PUBLIC_API_URL
              ↓
         Render (backend API)
              ↓
         MongoDB Atlas
```

---

## 0. Before you start

You need:

- GitHub account (push this repo)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account

Local folders:

```
me/
├── backend/     ← API (port 5000)
└── frontend/    ← Next.js (Vercel)
```

**Never commit** `.env` or `.env.local` (passwords / secrets).

---

## 1. MongoDB Atlas (free database)

### 1.1 Create cluster

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a project (e.g. `portfolio`)
3. **Build a Database** → choose **M0 Free**
4. Cloud provider: any (AWS / GCP) close to you
5. Create cluster (wait 1–3 minutes)

### 1.2 Database user

1. **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username + strong password (save them)
4. Role: **Atlas admin** or **Read and write to any database**
5. Add user

### 1.3 Network access (important)

1. **Network Access** → **Add IP Address**
2. For free hosting, click **Allow Access from Anywhere**
   - IP: `0.0.0.0/0`
3. Confirm

> Free Render/Vercel IPs change, so `0.0.0.0/0` is the usual free-tier approach.

### 1.4 Connection string

1. **Database** → **Connect** → **Drivers**
2. Copy the URI, like:

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. Change it to include a database name (`me`):

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/me?retryWrites=true&w=majority
```

4. Replace `USERNAME` / `PASSWORD` with your real values  
   - If password has `@ # %` etc., [URL-encode](https://www.urlencoder.org/) it

Keep this string for Render as `DB_URL`.

---

## 2. Backend on Render (free)

Render free web services sleep after ~15 minutes of no traffic (cold start ~30–60s). Fine for portfolios.

### 2.1 Push code to GitHub

From your machine:

```bash
cd me
git add .
git commit -m "Prepare for free deploy"
git push origin main
```

### 2.2 Create Web Service

1. [https://dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect your GitHub repo
4. Settings:

| Field | Value |
|-------|--------|
| Name | `portfolio-api` (any name) |
| Region | closest to you |
| Root Directory | `backend` |
| Runtime | **Node** |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance type | **Free** |

### 2.3 Environment variables (Render)

**Environment** → add:

| Key | Example value |
|-----|----------------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render sets this automatically; optional) |
| `DB_URL` | your Atlas URI with `/me?...` |
| `DASHBOARD_SECRET` | long random string (e.g. `tofayel-prod-secret-2026`) |

> Use a **new strong** `DASHBOARD_SECRET` for production. Do not reuse a weak local password if the site is public.

### 2.4 Deploy

1. Click **Create Web Service**
2. Wait for build logs: `npm run build` then `npm start`
3. Your API URL will look like:

```text
https://portfolio-api-xxxx.onrender.com
```

### 2.5 Test backend

Open in browser:

```text
https://YOUR-RENDER-URL/
```

Should show something like `Hello from setup file`.

Then:

```text
https://YOUR-RENDER-URL/api/v1/portfolio
```

Should return JSON (`success: true` and data).

### 2.6 Seed data (first time)

From PowerShell / terminal:

```powershell
Invoke-RestMethod `
  -Uri "https://YOUR-RENDER-URL/api/v1/seed" `
  -Method POST `
  -Headers @{ "x-dashboard-key" = "YOUR_DASHBOARD_SECRET"; "Content-Type" = "application/json" } `
  -Body "{}"
```

Or use Postman:

- `POST /api/v1/seed`
- Header: `x-dashboard-key: YOUR_DASHBOARD_SECRET`

---

## 3. Frontend on Vercel (free)

### 3.1 Import project

1. [https://vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import the same GitHub repo
3. Configure:

| Field | Value |
|-------|--------|
| Framework | Next.js (auto) |
| Root Directory | `frontend` |
| Build Command | `npm run build` (default) |
| Output | default |

### 3.2 Environment variables (Vercel)

**Settings → Environment Variables**:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-URL/api/v1` |
| `NEXT_PUBLIC_DASHBOARD_SECRET` | same as Render `DASHBOARD_SECRET` |

Apply to **Production**, **Preview**, **Development** (or at least Production).

### 3.3 Deploy

1. Click **Deploy**
2. Get URL like:

```text
https://your-portfolio.vercel.app
```

3. Open:

```text
https://your-portfolio.vercel.app/dashboard
```

Unlock with your `DASHBOARD_SECRET`, edit content, save.

---

## 4. Local `.env` reference

### Backend `backend/.env`

```env
NODE_ENV=development
PORT=5000
DB_URL=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/me?retryWrites=true&w=majority
DASHBOARD_SECRET=tofayel-admin-2026
```

### Frontend `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_DASHBOARD_SECRET=tofayel-admin-2026
```

Production frontend must point to Render:

```env
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-URL/api/v1
```

---

## 5. Optional free alternatives

### Backend (instead of Render)

| Service | Notes |
|---------|--------|
| [Railway](https://railway.app) | Free credit monthly; easy Node deploy |
| [Fly.io](https://fly.io) | Free allowance; more setup |
| [Koyeb](https://www.koyeb.com) | Free instance option |

Same idea: set `DB_URL`, `DASHBOARD_SECRET`, build `npm run build`, start `npm start`, root = `backend`.

### Frontend (instead of Vercel)

| Service | Notes |
|---------|--------|
| [Netlify](https://netlify.com) | Also free for Next.js |
| [Cloudflare Pages](https://pages.cloudflare.com) | Free; check Next.js support |

Vercel is the simplest for this Next.js app.

---

## 6. After deploy checklist

- [ ] Atlas Network Access allows `0.0.0.0/0`
- [ ] `DB_URL` includes database name `/me`
- [ ] Render build succeeds (`tsc` → `dist/`)
- [ ] `GET /api/v1/portfolio` works on Render
- [ ] Seeded once (`POST /api/v1/seed`)
- [ ] Vercel `NEXT_PUBLIC_API_URL` = Render `/api/v1`
- [ ] Dashboard unlock works with production secret
- [ ] Home page shows data from API (role, projects, etc.)

---

## 7. Common problems

### `ENOTFOUND` / Mongo DNS error

- Wrong cluster hostname in `DB_URL`
- Copy a **fresh** connection string from Atlas

### Render build fails on `tsc`

- Root Directory must be `backend`
- Build command: `npm install && npm run build`
- TypeScript is in `devDependencies`; Render installs them during build by default

### Frontend still shows old/local data

- Wrong `NEXT_PUBLIC_API_URL` (still `localhost`)
- Redeploy Vercel after changing env vars
- Hard refresh browser

### Dashboard 401 Unauthorized

- `x-dashboard-key` / unlock secret must match Render `DASHBOARD_SECRET`
- Vercel `NEXT_PUBLIC_DASHBOARD_SECRET` must be the same value

### API slow first request

- Render free tier sleeps; first hit wakes the server (cold start)

### CORS errors

- Backend already uses `cors()` open for all origins
- If you tighten CORS later, allow your Vercel domain

---

## 8. Useful URLs

| What | URL pattern |
|------|-------------|
| API health | `https://API.onrender.com/` |
| Portfolio JSON | `https://API.onrender.com/api/v1/portfolio` |
| Site | `https://APP.vercel.app/` |
| Dashboard | `https://APP.vercel.app/dashboard` |

---

## 9. Security tips (still free)

1. Strong unique `DASHBOARD_SECRET` in production  
2. Do not share Atlas password or commit `.env`  
3. Rotate Atlas password if it was ever pasted in chat/public  
4. Later (optional): restrict Atlas IPs if you move to a paid fixed IP host  

---

## 10. Separate Project list section (password-protected repos)

This is a **separate page** from the visual showcase.

| Page | Path | Folder |
|------|------|--------|
| Showcase cards | `/project` | `frontend/src/components/projects/` |
| **Project list table** | **`/project-list`** | **`frontend/src/components/project-list/`** |

### Table columns

| Column | Dashboard field | Visibility |
|--------|-----------------|------------|
| Title | `title` | Public |
| Description | `description` | Public |
| Status | `status` | Public |
| Start date | `startDate` | **Locked** until password |
| End date | `endDate` | **Locked** until password |
| Live link | `href` | **Locked** until password |
| Repo link | `github` | **Locked** until password |

### Set unlock password (recommended way)

1. Open **`/dashboard`**
2. Go to **Site Settings**
3. Set:

```json
"repoUnlockPassword": "yel59-repos",
"repoUnlockTtlSeconds": 60
```

4. Save Site Settings

Visitors unlock start / end / live / repo on `/project-list` with that same password. Details **auto-lock** after `repoUnlockTtlSeconds` (default 60). They can also click **Lock now**.

> Optional fallback: `REPO_UNLOCK_PASSWORD` in backend `.env` / Render — only used if Site Settings value is empty.

### How unlock works

```http
POST /api/v1/projects/unlock-repos
Content-Type: application/json

{ "password": "yel59-repos" }
```

Backend reads password from **Site Settings → `repoUnlockPassword`** first.

### Add a project

1. Dashboard → **Projects** → create/edit
2. Fill `title`, `description`, `startDate`, `endDate`, `status`, `href`, `github`
3. Open **`/project-list`** → start, end, live, and repo stay 🔒 until Site Settings password is entered

---

## Quick command summary

```bash
# Backend local
cd backend
npm run start:dev

# Frontend local
cd frontend
npm run dev
# http://localhost:3000
# http://localhost:3000/dashboard
```

**Production path:**

1. Atlas free cluster + `DB_URL`  
2. Render free service (`backend` folder)  
3. Vercel project (`frontend` folder) + `NEXT_PUBLIC_API_URL`  
4. Seed once → edit forever from `/dashboard`
