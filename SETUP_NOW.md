# 🚀 Quick Setup Guide - MediQueue

## Step 1: Setup XAMPP & Database (5 minutes)

### 1.1 Start XAMPP
1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**

### 1.2 Create Database
1. Click **Admin** next to MySQL (opens phpMyAdmin)
2. Click **New** in the left sidebar
3. Database name: `mediqueue`
4. Click **Create**

### 1.3 Import Schema
1. Click on `mediqueue` database in left sidebar
2. Click **Import** tab at the top
3. Click **Choose File**
4. Select: `D:\hospital\database\schema.sql`
5. Click **Go** at the bottom
6. Wait for "Import has been successfully finished" message

## Step 2: Copy Backend to XAMPP (2 minutes)

### Option A: Copy Folder
1. Open File Explorer
2. Copy entire folder: `D:\hospital\backend`
3. Paste into: `C:\xampp\htdocs\`
4. Rename from `backend` to `hospital-backend`
5. Final path: `C:\xampp\htdocs\hospital-backend\`

### Option B: Using Command
```bash
xcopy "D:\hospital\backend" "C:\xampp\htdocs\hospital-backend\" /E /I /Y
```

### Verify Backend
Open browser and go to: `http://localhost/hospital-backend/api/doctors/list.php`
You should see JSON response with doctor data.

## Step 3: Start Frontend (Already Done!)

The frontend is already running at: **http://localhost:5173**

If it's not running:
```bash
cd D:\hospital\frontend
npm run dev
```

## 🎉 You're Ready!

### Access the Application
Open your browser and go to: **http://localhost:5173**

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient@mediqueue.com | patient123 |
| **Doctor** | doctor@mediqueue.com | doctor123 |
| **Admin** | admin@mediqueue.com | admin123 |

## ✅ Quick Test

1. **Login as Patient**
   - Email: `patient@mediqueue.com`
   - Password: `patient123`
   - You should see the Patient Dashboard

2. **Browse Doctors**
   - Click "Book Appointment"
   - You'll see 4 demo doctors

3. **Login as Admin**
   - Logout
   - Login with: `admin@mediqueue.com` / `admin123`
   - You'll see all stats and users

## 🔧 Troubleshooting

### "Cannot connect to database"
- Make sure MySQL is running in XAMPP
- Verify database `mediqueue` exists in phpMyAdmin

### "API 404 Error" or "Network Error"
- Check that Apache is running in XAMPP
- Verify backend folder is at: `C:\xampp\htdocs\hospital-backend\`
- Test: `http://localhost/hospital-backend/api/doctors/list.php`

### Frontend won't load
- Make sure you're on `http://localhost:5173`
- Check terminal for errors
- Try: `npm run dev` again

## 📁 Correct Folder Structure

```
C:\xampp\htdocs\hospital-backend\    ← Backend here!
D:\hospital\frontend\                ← Frontend here!
D:\hospital\database\schema.sql      ← Already imported
```

## 🎯 What to Test

After login, try:
- ✅ Browse doctors (Patient)
- ✅ Book an appointment (Patient)  
- ✅ Create schedule (Doctor - login required)
- ✅ View all users (Admin)
- ✅ Export CSV report (Admin)

---

**Need help?** See the full documentation in [README.md](file:///d:/hospital/README.md)
