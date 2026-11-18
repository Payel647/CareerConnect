# JobPortal

A React and Express job portal with separate employer and job-seeker workflows.

## Features

- JWT sign-up and login with employer/job-seeker roles
- Job search by keyword, location, company, category, and type
- Job applications with PDF resume upload and application-status tracking
- Saved jobs and job-seeker profile/resume management
- Employer job creation, editing, closing, and deletion
- Applicant review, resume access, and application-status updates
- Employer company profile and platform/employer analytics
- Responsive layouts for mobile and desktop

## Run locally

Requirements: Node.js and a MongoDB database.

1. Configure the backend environment:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

   Set `MONGO_URI` to your MongoDB connection string, `JWT_SECRET` to a long
   random secret, and optionally `PORT` (defaults to `8000`).

2. Start the backend in one terminal:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. Start the frontend in another terminal:

   ```powershell
   cd frontend/job-portal
   npm install
   npm run dev
   ```

The Vite development server prints the frontend URL (normally
`http://localhost:5173`). The frontend API base URL is configured in
`src/utils/apiPaths.js` and defaults to `http://localhost:8000`.

## Checks

```powershell
cd frontend/job-portal
npm run build
npm run lint
```
