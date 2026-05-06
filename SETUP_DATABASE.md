# Brainroot Library - Database Setup Guide

## Prerequisites
- PHP 7.4+ (with MySQLi extension)
- MySQL Server
- Node.js (for Vercel deployment later, optional)

## Step 1: Create MySQL Database

### Option A: Using MySQL Command Line
```bash
mysql -u root -p < database.sql
```

### Option B: Using phpMyAdmin
1. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
2. Create new database: `brainroot_library`
3. Import `database.sql` file
4. Execute the SQL

### Verify Database Created
```bash
mysql -u root -p
> USE brainroot_library;
> SHOW TABLES;
```

You should see:
- users
- books
- collections
- wishlist
- borrowed_books
- book_views

## Step 2: Configure PHP Backend

### Update backend/config.php
```php
$db_host = 'localhost';      // Your MySQL host
$db_user = 'root';           // Your MySQL username
$db_password = '';           // Your MySQL password (change if needed)
$db_name = 'brainroot_library';
```

## Step 3: Start PHP Server

### Option A: Built-in PHP Server (for development)
```bash
cd c:\Web Project
php -S localhost:8000
```

The server will run at: http://localhost:8000

### Option B: Using XAMPP
1. Copy the project to `C:\xampp\htdocs\brainroot`
2. Start XAMPP (Apache & MySQL)
3. Access at: http://localhost/brainroot

### Option C: Using WAMP/MAMP
Similar to XAMPP - copy files to www folder and start servers

## Step 4: Test API Endpoints

### Test Collections API
```bash
curl -X GET http://localhost:8000/backend/api/collections.php \
  -H "Cookie: PHPSESSID=your_session_id"
```

### Test Borrow API
```bash
curl -X POST http://localhost:8000/backend/api/borrowed.php \
  -H "Content-Type: application/json" \
  -d '{"action":"borrow","title":"The Kite Runner"}' \
  -H "Cookie: PHPSESSID=your_session_id"
```

## Step 5: Load Backend Storage in Frontend

Add this to your HTML files (before other scripts):
```html
<script src="/backend-storage.js"></script>
```

## Step 6: Seed Initial Books (Optional)

Create `backend/api/seed-books.php`:
```php
<?php
require_once '../config.php';

$books = [
    ['title' => 'The Kite Runner', 'author' => 'Khaled Hosseini', 'category' => 'Drama', 'access_type' => 'free'],
    ['title' => 'Atomic Habits', 'author' => 'James Clear', 'category' => 'Productivity', 'access_type' => 'free'],
    // Add more books...
];

foreach ($books as $book) {
    $query = "INSERT IGNORE INTO books (title, author, category, access_type) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssss", $book['title'], $book['author'], $book['category'], $book['access_type']);
    $stmt->execute();
}

echo "Books seeded successfully";
?>
```

Then visit: http://localhost:8000/backend/api/seed-books.php

## Troubleshooting

### "Database connection failed"
- Check MySQL is running
- Verify credentials in config.php
- Check database exists

### "Method not allowed"
- Ensure you're using correct HTTP method (GET, POST, DELETE)
- Check CORS headers are set

### "Not authenticated"
- Session not created
- User needs to login first

## File Structure
```
c:/Web Project/
├── backend/
│   ├── config.php              # Database configuration
│   └── api/
│       ├── collections.php     # Collections endpoints
│       ├── borrowed.php        # Borrow/Return endpoints
│       └── wishlist.php        # Wishlist endpoints
├── backend-storage.js          # Frontend JS module for API calls
├── database.sql                # Database schema
├── collections/
│   ├── collections.js
│   └── ...
└── ...
```

## Next Steps

1. Update collections.js to use `window.brainrootBackendStorage` instead of `brainrootStorage`
2. Add authentication API
3. Deploy to production
4. Set up mobile access

---

**Need Help?**
- Check browser console for errors
- Check PHP error logs
- Verify all tables created in MySQL
