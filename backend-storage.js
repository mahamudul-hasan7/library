// backend-storage.js - Replace localStorage with API calls

(function () {
  const API_BASE = 'http://localhost:8000/backend/api';

  window.brainrootBackendStorage = {
    // Collections API
    async getCollections() {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
      }
    },

    async addToCollection(book) {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book)
        });
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error adding to collection:', error);
        return false;
      }
    },

    async removeFromCollection(title) {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error removing from collection:', error);
        return false;
      }
    },

    // Borrowed Books API
    async getBorrowedBooks() {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        return [];
      }
    },

    async borrowBook(title) {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'borrow', title })
        });
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error borrowing book:', error);
        return false;
      }
    },

    async returnBook(title) {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'return', title })
        });
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error returning book:', error);
        return false;
      }
    },

    // Wishlist API
    async getWishlist() {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }
    },

    async addToWishlist(book) {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book)
        });
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        return false;
      }
    },

    async removeFromWishlist(title) {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        return false;
      }
    }
  };
})();
