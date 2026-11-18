# JobPortal

A full-stack job portal with separate workflows for job seekers and employers.
The frontend is built with React and Vite, and the backend uses Express,
MongoDB, and Mongoose.

## Features

- Register and sign in as a job seeker or employer
- Browse and search job listings
- Apply for jobs and track application status
- Save jobs and manage a profile and PDF resume
- Create, edit, close, and delete job listings
- Review applicants and update application statuses
- View employer and platform analytics

## Requirements

- Node.js and npm
- A MongoDB database

## Setup

### Backend

Copy `backend/.env.example` to `backend/.env` and set your MongoDB connection
string, a strong JWT secret, and Cloudinary credentials:

```env
MONGO_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=replace-with-a-long-random-secret
PORT=8000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

`FRONTEND_URL` is the allowed frontend origin. For multiple frontend origins,
separate them with commas.

In a terminal, install dependencies and start the backend:

```powershell
cd backend
npm install
npm run dev
```

### Frontend

In another terminal:

```powershell
cd frontend/job-portal
npm install
npm run dev
```

Vite prints the local frontend URL when the development server starts
(typically `http://localhost:5173`).

## Available scripts

From `frontend/job-portal`:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

From `backend`:

```powershell
npm run dev
npm start
```

`npm start` runs the backend with Node.js; `npm run dev` uses nodemon for local
development.

## Deploy

One simple option is MongoDB Atlas for the database, Render for the backend,
and Vercel for the frontend.

1. Create a MongoDB Atlas database and allow your backend host to connect.
2. On Render, create a Web Service for this repository with root directory
   `backend`, build command `npm install`, and start command `npm start`.
   Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, and the three Cloudinary
   credentials in the service's environment variables. Set `FRONTEND_URL` to
   your deployed Vercel origin.
3. In `frontend/job-portal/src/utils/apiPaths.js`, the API base URL defaults to
   localhost for local development. On Vercel, set the build environment
   variable `VITE_API_BASE_URL` to your Render service URL (for example,
   `https://your-service.onrender.com`) and redeploy.
4. Test signup, login, job actions, and uploads against the deployed services.

New uploaded images and resumes are stored in Cloudinary. Existing legacy
uploads are still served from the backend's `/uploads` path.
