// api-client.js - Connect frontend to database APIs

(function() {
  const API_BASE = 'http://localhost:8000/backend/api';

  window.brainrootAPI = {
    // Collections - Get all books
    async getCollections() {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('API Error:', response.status);
          return [];
        }
        
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
      }
    },

    // Collections - Add book to collection
    async addToCollection(book) {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: book.title,
            author: book.author || 'Unknown',
            category: book.category || 'General',
            image: book.image || book.imageUrl,
            progress: book.progress || 0,
            access: book.access || 'free'
          })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error adding to collection:', error);
        return false;
      }
    },

    // Collections - Remove book from collection
    async removeFromCollection(title) {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error removing from collection:', error);
        return false;
      }
    },

    // Borrowed Books - Get all borrowed books
    async getBorrowedBooks() {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        return [];
      }
    },

    // Borrowed Books - Borrow a book
    async borrowBook(title) {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'borrow',
            title: title
          })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error borrowing book:', error);
        return false;
      }
    },

    // Borrowed Books - Return a book
    async returnBook(title) {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'return',
            title: title
          })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error returning book:', error);
        return false;
      }
    },

    // Wishlist - Get all wishlist items
    async getWishlist() {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }
    },

    // Wishlist - Add book to wishlist
    async addToWishlist(book) {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: book.title,
            author: book.author || 'Unknown',
            category: book.category || 'General',
            image: book.image || book.imageUrl,
            access: book.access || 'free'
          })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        return false;
      }
    },

    // Wishlist - Remove book from wishlist
    async removeFromWishlist(title) {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        return false;
      }
    },

    // Check if book is borrowed
    async isBookBorrowed(title) {
      try {
        const borrowed = await this.getBorrowedBooks();
        return borrowed.some(b => b.title.toLowerCase() === title.toLowerCase());
      } catch (error) {
        console.error('Error checking borrowed status:', error);
        return false;
      }
    }
  };

  console.log('API Client loaded - use window.brainrootAPI');
})();
