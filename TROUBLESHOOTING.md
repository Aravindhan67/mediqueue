# 🔧 Troubleshooting "Login Failed" Error

## ✅ CRITICAL FIX APPLIED (2026-02-10)

**Issue Found:** The authentication endpoints (`login.php` and `register.php`) had incorrect file paths preventing them from loading required dependencies.

**Solution Applied:**
- Fixed `backend/api/auth/login.php` - Changed require paths from `'/../'` to `'/../../'`
- Fixed `backend/api/auth/register.php` - Changed require paths from `'/../'` to `'/../../'`

**Why this matters:** The auth files are located in `backend/api/auth/`, so they need to go up TWO directory levels (`../../`) to reach `backend/config/` and `backend/utils/`, not just one level (`../`).

**Next Steps:** After this fix, proceed with the steps below to ensure XAMPP and database are properly set up.

---

## Current Status
✅ Frontend is running on http://localhost:5173  
❌ Backend API is not responding  

## Step-by-Step Fix

### 1. Check if XAMPP is Running

**Open XAMPP Control Panel and verify:**
- [ ] **Apache** - Status should be GREEN/Running
- [ ] **MySQL** - Status should be GREEN/Running

If not running:
- Click **Start** button next to Apache
- Click **Start** button next to MySQL
- Wait for them to turn green

---

### 2. Verify Backend Files Location

Check if this folder exists:
```
C:\xampp\htdocs\hospital-backend\
```

**Quick check:**
1. Open File Explorer
2. Navigate to: `C:\xampp\htdocs\`
3. You should see a folder named `hospital-backend`
4. Inside it, you should see folders: `api`, `config`, `utils`, `uploads`

If folder doesn't exist, copy it:
```bash
xcopy "d:\hospital\backend" "C:\xampp\htdocs\hospital-backend\" /E /I /Y
```

---

### 3. Test Backend API Directly

Open your browser and visit:
```
http://localhost/hospital-backend/api/doctors/list.php
```

**Expected result:**
You should see JSON data with doctors list like:
```json
{"success":true,"message":"Doctors retrieved successfully","data":[...]}
```

**If you see error:**
- "Not Found" → Backend files are not in the right location
- "Connection failed" → Database is not set up
- Blank page → PHP error, check XAMPP logs

---

### 4. Setup Database (If not done)

1. **Open phpMyAdmin:**
   - Go to: http://localhost/phpmyadmin
   
2. **Create Database:**
   - Click **New** in left sidebar
   - Database name: `mediqueue`
   - Click **Create**

3. **Import Schema:**
   - Click on `mediqueue` database in left sidebar
   - Click **Import** tab
   - Click **Choose File**
   - Select: `D:\hospital\database\schema.sql`
   - Click **Go** at bottom
   - Wait for success message

---

### 5. Test Login Again

After completing steps 1-4:

1. Refresh the login page: http://localhost:5173
2. Try logging in with:
   - Email: `patient@mediqueue.com`
   - Password: `patient123`

---

## Quick Debug Commands

**Test if Apache is running:**
```
http://localhost
```
(Should show XAMPP dashboard)

**Test backend API:**
```
http://localhost/hospital-backend/api/doctors/list.php
```
(Should show JSON)

**Test database connection:**
```
http://localhost/phpmyadmin
```
(Should open phpMyAdmin)

---

## Common Issues

### "404 Not Found" on API calls
→ Backend is not at `C:\xampp\htdocs\hospital-backend\`  
→ Copy backend folder to correct location

### "Connection failed" / "Database error"
→ MySQL is not running OR database not imported  
→ Start MySQL in XAMPP and import schema.sql

### API returns empty response
→ CORS issue or PHP error  
→ Check Apache error logs in XAMPP

---

## 📅 Schedule Issues

### "No schedules available for this doctor yet"
**Issue:** Schedules are date-based. If no schedules are created for today or future dates, the frontend will show this message.

**Solution:**
1. Open your browser and visit:
   ```
   http://localhost/hospital-backend/api/debug_seed_schedules.php
   ```
2. This script will automatically create 7 days of schedules for all doctors.
3. Refresh the booking page, and the dates should now appear.

---

## Need Help?

If still not working, check:
1. XAMPP logs: `C:\xampp\apache\logs\error.log`
2. Make sure Windows Firewall isn't blocking Apache
3. Try restarting XAMPP completely
