# Quick Start - Database Setup

## 1. Import Database Schema

Open terminal and run:

```bash
cd "c:\Web Project"
mysql -u root -p < database.sql
```

When prompted, enter your MySQL password (usually empty for localhost).

## 2. Start PHP Server

In PowerShell:

```powershell
cd "c:\Web Project"
php -S localhost:8000
```

The server will start at: **http://localhost:8000**

## 3. Test the Setup

Open browser and visit:
- Collections: http://localhost:8000/backend/api/collections.php
- Wishlist: http://localhost:8000/backend/api/wishlist.php
- Borrowed: http://localhost:8000/backend/api/borrowed.php

(You should see "Not authenticated" - that's normal, you need to login first)

## 4. Files Created

### Backend
- `backend/config.php` - Database connection
- `backend/api/auth.php` - Login/Register
- `backend/api/collections.php` - Collections management
- `backend/api/borrowed.php` - Borrow/Return books
- `backend/api/wishlist.php` - Wishlist management

### Frontend
- `backend-storage.js` - JavaScript module to call APIs

### Database
- `database.sql` - Database schema

### Documentation
- `SETUP_DATABASE.md` - Detailed setup guide

## 5. Next: Update Frontend

Replace localStorage calls with API calls. Update collections.js to use:

```javascript
// Instead of: window.brainrootStorage.readJson("brainrootCollections", [])
// Use: await window.brainrootBackendStorage.getCollections()
```

## 6. Troubleshooting

**MySQL not found?**
```powershell
# Find MySQL installation
where mysql

# Or set PATH if needed
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
```

**PHP server won't start?**
```powershell
# Check PHP is installed
php --version

# If not in PATH, run from PHP directory or add to PATH
```

**Still not working?**
- Check SETUP_DATABASE.md for detailed troubleshooting
- Verify MySQL is running: `mysql -u root`
- Check backend/config.php credentials

---

Let me know once you've completed these steps! 🚀
