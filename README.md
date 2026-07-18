# Tofayel — Portfolio monorepo

Personal portfolio with a Next.js frontend and Express + MongoDB CMS backend.

## Structure

- `frontend/` — Next.js portfolio + `/dashboard` CMS
- `backend/` — Express TypeScript API
- `DEPLOY.md` — free hosting guide (Atlas, Render, Vercel)

## Local development

```bash
# Backend
cd backend
cp .env.example .env   # if present, or create .env with DB_URL + DASHBOARD_SECRET
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

Dashboard: `http://localhost:3000/dashboard`  
Project list: `http://localhost:3000/project-list`
