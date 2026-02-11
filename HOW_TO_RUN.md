# 🚀 How to Run MediQueue

## Backend (PHP - No npm needed!)

The backend is **PHP** and runs through **XAMPP**, not npm.

### Steps:

1. **Start XAMPP Control Panel**
   - Start **Apache** (for PHP)
   - Start **MySQL** (for database)

2. **Import Database** (One-time setup)
   ```
   1. Open http://localhost/phpmyadmin
   2. Create database: mediqueue
   3. Import file: D:\hospital\database\schema.sql
   ```

3. **Copy Backend to XAMPP**
   ```bash
   xcopy "d:\hospital\backend" "C:\xampp\htdocs\hospital-backend\" /E /I /Y
   ```
   
   Or manually copy `d:\hospital\backend` folder to `C:\xampp\htdocs\hospital-backend\`

4. **Test Backend**
   Open browser: http://localhost/hospital-backend/api/doctors/list.php
   
   You should see JSON with doctor data ✅

---

## Frontend (React)

### Steps:

1. **Open terminal in frontend folder**
   ```bash
   cd d:\hospital\frontend
   ```

2. **Run the dev server**
   ```bash
   npm run dev
   ```

3. **Open the app**
   Browser will open at: http://localhost:5173

---

## ✅ Quick Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running  
- [ ] Database `mediqueue` exists with tables
- [ ] Backend folder is at: `C:\xampp\htdocs\hospital-backend\`
- [ ] Frontend is running: `npm run dev` in `d:\hospital\frontend`
- [ ] App is open at: http://localhost:5173

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@mediqueue.com | patient123 |
| Doctor | doctor@mediqueue.com | doctor123 |
| Admin | admin@mediqueue.com | admin123 |

---

## 🐛 Common Errors

**"Cannot connect to database"**
- Make sure MySQL is running in XAMPP
- Database name is exactly: `mediqueue`

**"404 Not Found" on API calls**
- Backend must be at: `C:\xampp\htdocs\hospital-backend\`
- Apache must be running

**Frontend PostCSS error**
- Already fixed! (renamed postcss.config.js to .cjs)

---

## 📁 Final Folder Structure

```
C:\xampp\htdocs\hospital-backend\    ← Backend (PHP) runs here via Apache
D:\hospital\frontend\                ← Frontend (React) runs here via npm
```

**Backend = XAMPP/Apache** (no npm)  
**Frontend = npm run dev**
