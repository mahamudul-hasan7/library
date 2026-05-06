# API Client - Frontend Usage Guide

## Load the API Client

Add this to your HTML before your main script:
```html
<script src="../api-client.js"></script>
```

Then in your JavaScript, use `window.brainrootAPI` to call methods.

---

## Available Methods

### Collections

```javascript
// Get all books in user's collection
const books = await window.brainrootAPI.getCollections();

// Add book to collection
const success = await window.brainrootAPI.addToCollection({
  title: 'The Kite Runner',
  author: 'Khaled Hosseini',
  category: 'Drama',
  image: 'https://...',
  access: 'free'
});

// Remove book from collection
const removed = await window.brainrootAPI.removeFromCollection('The Kite Runner');
```

### Borrowed Books

```javascript
// Get all borrowed books
const borrowed = await window.brainrootAPI.getBorrowedBooks();

// Borrow a book
const success = await window.brainrootAPI.borrowBook('The Kite Runner');

// Return a book
const success = await window.brainrootAPI.returnBook('The Kite Runner');

// Check if book is borrowed
const isBorrowed = await window.brainrootAPI.isBookBorrowed('The Kite Runner');
```

### Wishlist

```javascript
// Get all wishlist items
const wishlist = await window.brainrootAPI.getWishlist();

// Add book to wishlist
const success = await window.brainrootAPI.addToWishlist({
  title: 'Dune',
  author: 'Frank Herbert',
  category: 'Sci-Fi',
  image: 'https://...',
  access: 'paid'
});

// Remove book from wishlist
const removed = await window.brainrootAPI.removeFromWishlist('Dune');
```

---

## Example Usage in Collections Page

```javascript
// Load collections
async function loadCollections() {
  const collections = await window.brainrootAPI.getCollections();
  
  collections.forEach(book => {
    console.log(book.title, book.author, book.progress);
  });
}

// Return a book
async function returnBook(title) {
  const success = await window.brainrootAPI.returnBook(title);
  if (success) {
    console.log('Book returned successfully');
    // Reload collections
    loadCollections();
  }
}

loadCollections();
```

---

## Response Format

All API methods return:

```javascript
// Success
{
  "success": true,
  "data": [ /* array of items */ ]
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

---

## Error Handling

```javascript
try {
  const collections = await window.brainrootAPI.getCollections();
  if (!collections || collections.length === 0) {
    console.log('No books in collection');
  }
} catch (error) {
  console.error('Failed to load collections:', error);
}
```

---

## Integration with Collections.js

Replace localStorage calls:

```javascript
// OLD (localStorage):
// const collections = storage.readJson("brainrootCollections", []);

// NEW (Database):
const collections = await window.brainrootAPI.getCollections();
```

Replace add/remove functions:

```javascript
// OLD: saveStoredCollections(items)
// NEW:
await window.brainrootAPI.addToCollection(book);
await window.brainrootAPI.removeFromCollection(title);
```

Replace borrow/return:

```javascript
// OLD: localStorage.getItem("brainrootBorrowed")
// NEW:
const borrowed = await window.brainrootAPI.getBorrowedBooks();
const isBorrowed = await window.brainrootAPI.isBookBorrowed(title);
await window.brainrootAPI.borrowBook(title);
await window.brainrootAPI.returnBook(title);
```

---

**All data is now saved in MySQL Database! 🎉**
