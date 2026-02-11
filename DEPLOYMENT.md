# Deployment Guide - MediQueue

This guide provides step-by-step instructions on how to deploy the MediQueue application using **Vercel** for the frontend and **Render** for the backend.

## 1. Backend Deployment (Render)

Render is great for hosting PHP applications. However, since it doesn't have a native MySQL service, you'll need an external MySQL database.

### A. Setup MySQL Database
Use a managed MySQL provider like **Aiven** (Free plan), **TiDB Cloud**, or **PlanetScale**.
1. Create a new MySQL instance.
2. Note down your connection details:
   - `DB_HOST`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
3. Run the SQL schema from `d:/hospital/database/schema.sql` (if available) or your local database export on this new instance.

### B. Deploy PHP Backend
1. Create a New Web Service on Render and link your GitHub repository.
2. Set the **Root Directory** to `backend` (if you are deploying from a subfolder).
3. Select **PHP** as the environment.
4. Go to **Environment** tab and add the following variables:
   - `DB_HOST`: Your managed MySQL host.
   - `DB_NAME`: Your database name.
   - `DB_USER`: Your database username.
   - `DB_PASS`: Your database password.
   - `JWT_SECRET`: A long random string.
   - `FRONTEND_URL`: Your future Vercel URL (Update this after deploying frontend).

## 2. Frontend Deployment (Vercel)

Vercel is the best platform for React/Vite applications.

### A. Deploy React App
1. Create a New Project on Vercel and link your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Vercel will automatically detect Vite. Keep the default build settings.
4. Add the following **Environment Variable**:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://mediqueue-api.onrender.com/api`).
5. Click **Deploy**.

## 3. Post-Deployment Linkage

1. Once your Vercel app is deployed, copy its URL (e.g., `https://mediqueue-app.vercel.app`).
2. Go back to your **Render** dashboard.
3. Update the `FRONTEND_URL` environment variable with your Vercel URL.
4. Redeploy the Render service.

## 4. Troubleshooting
- **CORS Errors**: Ensure the `FRONTEND_URL` in Render matches your Vercel URL exactly (including `https://` but no trailing slash).
- **404 on Refresh**: The `frontend/vercel.json` I created handles this by redirecting all requests to `index.html`.
- **Database Connection**: Ensure your external MySQL provider allows connections from all IPs (0.0.0.0/0) or add Render's outbound IP addresses.
