// backend-storage.js - Hybrid storage: API calls with localStorage fallback

(function () {
  const API_BASE = 'http://localhost/BrainRoot/backend/api';

  // Ensure storage exists
  if (!window.brainrootStorage) {
    window.brainrootStorage = {};
  }

  // Add Collections API methods
  window.brainrootStorage.getCollections = async function() {
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
  };

  window.brainrootStorage.addToCollection = async function(book) {
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
  };

  window.brainrootStorage.removeFromCollection = async function(title) {
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
  };

  // Borrowed Books API
  window.brainrootStorage.getBorrowedBooks = async function() {
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
  };

  window.brainrootStorage.getBorrowHistory = async function(status) {
    try {
      const historyStatus = encodeURIComponent(status || 'returned');
      const response = await fetch(`${API_BASE}/borrowed.php?status=${historyStatus}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      return [];
    }
  };

  window.brainrootStorage.getReturnedBooks = async function() {
    return this.getBorrowHistory('returned');
  };

  window.brainrootStorage.getExpiredBooks = async function() {
    return this.getBorrowHistory('expired');
  };

  window.brainrootStorage.clearBorrowHistory = async function() {
    try {
      const response = await fetch(`${API_BASE}/borrowed.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_history' })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error clearing borrow history:', error);
      return false;
    }
  };

  window.brainrootStorage.removeFromBorrowHistory = async function(book) {
    try {
      const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
      const response = await fetch(`${API_BASE}/borrowed.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_history',
          title: bookPayload.title,
          history_type: bookPayload.history_type || bookPayload.historyType || ''
        })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error removing history item:', error);
      return false;
    }
  };

  window.brainrootStorage.borrowBook = async function(title) {
    try {
      const bookPayload = typeof title === 'object' && title !== null ? title : { title };
      const response = await fetch(`${API_BASE}/borrowed.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'borrow',
          title: bookPayload.title,
          author: bookPayload.author || 'Unknown Author',
          category: bookPayload.category || 'General',
          image: bookPayload.image || bookPayload.imageUrl || bookPayload.image_url || '',
          access: bookPayload.access || bookPayload.access_type || 'free',
          description: bookPayload.description || bookPayload.summary || ''
        })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error borrowing book:', error);
      return false;
    }
  };

  window.brainrootStorage.renewBook = async function(book) {
    try {
      const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
      const response = await fetch(`${API_BASE}/borrowed.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'renew',
          title: bookPayload.title,
          author: bookPayload.author || 'Unknown Author',
          category: bookPayload.category || 'General',
          image: bookPayload.image || bookPayload.imageUrl || bookPayload.image_url || '',
          access: bookPayload.access || bookPayload.access_type || 'free',
          description: bookPayload.description || bookPayload.summary || ''
        })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error renewing book:', error);
      return false;
    }
  };

  window.brainrootStorage.returnBook = async function(title) {
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
  };

  // Wishlist API
  window.brainrootStorage.getWishlist = async function() {
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
  };

  window.brainrootStorage.addToWishlist = async function(book) {
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
  };

  window.brainrootStorage.removeFromWishlist = async function(title) {
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
  };
})();
