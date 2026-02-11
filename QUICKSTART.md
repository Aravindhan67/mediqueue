# Quick Start Guide - MediQueue

## For Students/Beginners - Step by Step

### 1. Install XAMPP
- Download XAMPP from https://www.apachefriends.org/
- Install it (use default settings)
- XAMPP will be installed in `C:\xampp\`

### 2. Setup Database
1. Open XAMPP Control Panel
2. Click **Start** for Apache
3. Click **Start** for MySQL
4. Click **Admin** next to MySQL (this opens phpMyAdmin)
5. In phpMyAdmin:
   - Click **New** to create a database
   - Name it: `mediqueue`
   - Click **Create**
   - Click on `mediqueue` in the left sidebar
   - Click **Import** tab at the top
   - Click **Choose File** and select: `D:\hospital\database\schema.sql`
   - Click **Go** button at bottom

### 3. Setup Backend (PHP)
1. Copy the entire `backend` folder from `D:\hospital\backend`
2. Paste it into: `C:\xampp\htdocs\`
3. Rename it to `hospital-backend`
4. Final path should be: `C:\xampp\htdocs\hospital-backend\`

### 4. Install Node.js
1. Download from: https://nodejs.org/
2. Install it (use default settings)
3. Open Command Prompt and verify:
   ```
   node --version
   npm --version
   ```

### 5. Setup Frontend (React)
1. Open Command Prompt
2. Navigate to frontend folder:
   ```
   cd D:\hospital\frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   (This will take 2-3 minutes)

### 6. Run the Application

#### Terminal 1 - Backend (should already be running via XAMPP)
- Just make sure Apache and MySQL are started in XAMPP Control Panel
- Backend API will be available at: `http://localhost/hospital-backend/api`

#### Terminal 2 - Frontend
1. Open Command Prompt
2. Navigate to frontend:
   ```
   cd D:\hospital\frontend
   ```
3. Start the dev server:
   ```
   npm run dev
   ```
4. Open browser and go to: `http://localhost:3000`

### 7. Test the Application

**Login as Admin:**
- Email: `admin@mediqueue.com`
- Password: `admin123`

**Login as Doctor:**
- Email: `doctor@mediqueue.com`
- Password: `doctor123`

**Login as Patient:**
- Email: `patient@mediqueue.com`
- Password: `patient123`

### Common Issues and Solutions

**Problem: "Cannot connect to database"**
- Solution: Make sure MySQL is running in XAMPP

**Problem: "API not found" or 404 errors**
- Solution: Check that backend folder is in `C:\xampp\htdocs\hospital-backend\`
- Make sure Apache is running in XAMPP

**Problem: Frontend won't start**
- Solution: Run `npm install` again in the frontend folder

**Problem: "Cannot POST /api/..."**
- Solution: Verify the backend path is correct in `frontend/src/api/axios.js`

### File Structure Overview
```
D:\hospital\
├── frontend\          ← React app
├── backend\           ← PHP API (copy this to C:\xampp\htdocs\)
├── database\          ← SQL file
└── README.md          ← Full documentation
```

### Next Steps
1. Try registering a new patient
2. Login as doctor and create a schedule
3. Login as patient and book an appointment
4. Login as admin to see all data
5. Try uploading a prescription file

### Video Tutorial (Conceptual Flow)
1. Start XAMPP → Apache & MySQL
2. Import database schema in phpMyAdmin
3. Copy backend to htdocs
4. npm install in frontend
5. npm run dev to start
6. Open http://localhost:3000
7. Login and explore!

📞 **Need Help?**
- Check the main README.md for detailed information
- Review the troubleshooting section
- Ensure all prerequisites are installed correctly

🎉 **You're all set! Happy coding!**
