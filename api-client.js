// api-client.js - Connect frontend to database APIs

(function() {
  const API_BASE = resolveAppRootUrl() + 'backend/api';
  const REQUEST_TIMEOUT = 8000; // 8 seconds

  function getStoredCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('brainrootCurrentUser') || 'null');
    } catch (error) {
      return null;
    }
  }

  function resolveAppRootUrl() {
    const pathname = window.location.pathname.replace(/\\/g, '/');
    const match = pathname.match(/^(.*\/)(?:index|wishlist|collections|profile|explore|login|register|reader|admin)\/[^/]+$/i);
    if (match) {
      return window.location.origin + match[1];
    }
    return new URL('./', window.location.href).href;
  }

  function getJsonHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const user = getStoredCurrentUser();

    if (user && user.id && user.email) {
      headers['X-Brainroot-User-Id'] = String(user.id);
      headers['X-Brainroot-User-Email'] = String(user.email);
    }

    return headers;
  }

  // Helper function to wrap fetch with timeout
  async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('CONNECTION_TIMEOUT');
      }
      throw error;
    }
  }

  // Helper to determine error type
  function getErrorMessage(error, defaultMsg = 'Connection failed') {
    if (error.message === 'CONNECTION_TIMEOUT') {
      return 'Server is not responding. Please check if the backend is running.';
    }
    if (error instanceof TypeError) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    return defaultMsg;
  }

  window.brainrootAPI = {
    // Books - Public catalog
    async getBooks() {
      try {
        const response = await fetch(`${API_BASE}/books.php`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching books:', error);
        return [];
      }
    },

    async getFeaturedBooks(section) {
      try {
        const featuredSection = encodeURIComponent(section || 'trending');
        const response = await fetch(`${API_BASE}/books-crud.php?section=${featuredSection}`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        return data.success ? (data.books || []) : [];
      } catch (error) {
        console.error('Error fetching featured books:', error);
        return [];
      }
    },

    // Collections - Get all books
    async getCollections() {
      try {
        const response = await fetch(`${API_BASE}/collections.php`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
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
          headers: getJsonHeaders(),
          body: JSON.stringify({
            title: book.title,
            author: book.author || 'Unknown',
            category: book.category || 'General',
            image: book.image || book.imageUrl || book.image_url,
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
          headers: getJsonHeaders(),
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
          headers: getJsonHeaders()
        });
        
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        return [];
      }
    },

    // Borrowed Books - Get returned or expired history
    async getBorrowHistory(status) {
      try {
        const historyStatus = encodeURIComponent(status || 'returned');
        const response = await fetch(`${API_BASE}/borrowed.php?status=${historyStatus}`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching borrow history:', error);
        this.lastError = error.message;
        return [];
      }
    },

    async getReturnedBooks() {
      return this.getBorrowHistory('returned');
    },

    async getExpiredBooks() {
      return this.getBorrowHistory('expired');
    },

    async clearBorrowHistory() {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            action: 'clear_history'
          })
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error clearing borrow history:', error);
        this.lastError = error.message;
        return false;
      }
    },

    async removeFromBorrowHistory(book) {
      try {
        const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            action: 'remove_history',
            title: bookPayload.title,
            history_type: bookPayload.history_type || bookPayload.historyType || ''
          })
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error removing history item:', error);
        this.lastError = error.message;
        return false;
      }
    },

    // Borrowed Books - Borrow a book
    async borrowBook(book) {
      try {
        const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
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
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error borrowing book:', error);
        this.lastError = error.message;
        return false;
      }
    },

    // Borrowed Books - Renew a returned or expired book
    async renewBook(book) {
      try {
        const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
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
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error renewing book:', error);
        this.lastError = error.message;
        return false;
      }
    },

    // Borrowed Books - Return a book
    async returnBook(title) {
      try {
        const response = await fetch(`${API_BASE}/borrowed.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            action: 'return',
            title: title
          })
        });
        
        const data = await response.json();
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error returning book:', error);
        this.lastError = error.message;
        return false;
      }
    },

    // Wishlist - Get all wishlist items
    async getWishlist() {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
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
          headers: getJsonHeaders(),
          body: JSON.stringify({
            title: book.title,
            author: book.author || 'Unknown',
            category: book.category || 'General',
            image: book.image || book.imageUrl || book.image_url,
            access: book.access || book.access_type || 'free',
            description: book.description || book.summary || ''
          })
        });
        
        const data = await response.json();
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        this.lastError = error.message;
        return false;
      }
    },

    // Wishlist - Remove book from wishlist
    async removeFromWishlist(title) {
      try {
        const response = await fetch(`${API_BASE}/wishlist.php`, {
          method: 'DELETE',
          credentials: 'include',
          headers: getJsonHeaders(),
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
    },

    // Auth - Register a new user
    async register(userData) {
      try {
        const response = await fetchWithTimeout(`${API_BASE}/auth.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            action: 'register',
            name: userData.name,
            email: userData.email,
            password: userData.password,
            institution: userData.institution || userData.institute || '',
            role: userData.role || ''
          })
        });

        // Check for HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP_ERROR_${response.status}`);
        }

        const data = await response.json();
        return {
          success: data.success,
          user: data.user || null,
          error: data.error || null,
          message: data.message || null
        };
      } catch (error) {
        console.error('Error registering:', error);
        const errorMsg = getErrorMessage(error, 'Failed to create account');
        return {
          success: false,
          user: null,
          error: errorMsg,
          message: null
        };
      }
    },

    // Auth - Login user
    async login(email, password) {
      try {
        const response = await fetchWithTimeout(`${API_BASE}/auth.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            action: 'login',
            email: email,
            password: password
          })
        });

        // Check for HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP_ERROR_${response.status}`);
        }

        const data = await response.json();
        return {
          success: data.success,
          user: data.user || null,
          error: data.error || null,
          message: data.message || null
        };
      } catch (error) {
        console.error('Error logging in:', error);
        const errorMsg = getErrorMessage(error, 'Login failed');
        return {
          success: false,
          user: null,
          error: errorMsg,
          message: null
        };
      }
    },

    // Auth - Logout user
    async logout() {
      try {
        const response = await fetch(`${API_BASE}/auth.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            action: 'logout'
          })
        });

        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error logging out:', error);
        return false;
      }
    },

    // Profile - Get current user's profile from database
    async getProfile() {
      try {
        const response = await fetch(`${API_BASE}/profile.php`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        return {
          success: data.success,
          user: data.user || null,
          error: data.error || null,
          message: data.message || null
        };
      } catch (error) {
        console.error('Error getting profile:', error);
        return {
          success: false,
          user: null,
          error: error.message,
          message: null
        };
      }
    },

    // Profile - Update current user's profile in database
    async updateProfile(profileData) {
      try {
        const response = await fetch(`${API_BASE}/profile.php`, {
          method: 'PUT',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            institution: profileData.institution || '',
            role: profileData.role || ''
          })
        });

        const data = await response.json();
        return {
          success: data.success,
          user: data.user || null,
          error: data.error || null,
          message: data.message || null
        };
      } catch (error) {
        console.error('Error updating profile:', error);
        return {
          success: false,
          user: null,
          error: error.message,
          message: null
        };
      }
    },

    // Subscription - Update user's subscription plan in database
    async updateSubscription(subscriptionData) {
      try {
        const response = await fetch(`${API_BASE}/subscription.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            plan: subscriptionData.plan,
            billingCycle: subscriptionData.billingCycle || 'monthly',
            price: subscriptionData.price || 0,
            planType: subscriptionData.planType || 'free'
          })
        });

        const data = await response.json();
        return {
          success: data.success,
          plan: data.plan || null,
          planType: data.planType || null,
          user: data.user || null,
          error: data.error || null,
          message: data.message || null
        };
      } catch (error) {
        console.error('Error updating subscription:', error);
        return {
          success: false,
          plan: null,
          planType: null,
          user: null,
          error: error.message,
          message: null
        };
      }
    },

    // Categories - Shared catalog
    async getCategories(includeAll = false) {
      try {
        const suffix = includeAll ? '?all=1' : '';
        const response = await fetch(`${API_BASE}/categories.php${suffix}`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        return data.success ? (data.categories || []) : [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },

    // Reader progress - Save and restore per user/book
    async getReadingProgress(book) {
      try {
        const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
        const params = bookPayload.book_id || bookPayload.id
          ? `book_id=${encodeURIComponent(bookPayload.book_id || bookPayload.id)}`
          : `title=${encodeURIComponent(bookPayload.title || '')}`;
        const response = await fetch(`${API_BASE}/reading-progress.php?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success ? data.progress : null;
      } catch (error) {
        console.error('Error fetching reading progress:', error);
        this.lastError = error.message;
        return null;
      }
    },

    async saveReadingProgress(progressData) {
      try {
        const response = await fetch(`${API_BASE}/reading-progress.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify(progressData || {})
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success;
      } catch (error) {
        console.error('Error saving reading progress:', error);
        this.lastError = error.message;
        return false;
      }
    },

    // Ratings - One rating per user/book
    async getBookRating(book) {
      try {
        const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
        const params = bookPayload.book_id || bookPayload.id
          ? `book_id=${encodeURIComponent(bookPayload.book_id || bookPayload.id)}`
          : `title=${encodeURIComponent(bookPayload.title || '')}`;
        const response = await fetch(`${API_BASE}/ratings.php?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success ? data.rating : null;
      } catch (error) {
        console.error('Error fetching book rating:', error);
        this.lastError = error.message;
        return null;
      }
    },

    async rateBook(book, rating) {
      try {
        const bookPayload = typeof book === 'object' && book !== null ? book : { title: book };
        const response = await fetch(`${API_BASE}/ratings.php`, {
          method: 'POST',
          credentials: 'include',
          headers: getJsonHeaders(),
          body: JSON.stringify({
            book_id: bookPayload.book_id || bookPayload.id || null,
            title: bookPayload.title || '',
            rating: rating
          })
        });

        const data = await response.json();
        this.lastError = data.error || null;
        return data.success ? data.rating : null;
      } catch (error) {
        console.error('Error saving book rating:', error);
        this.lastError = error.message;
        return null;
      }
    },

    // Auth - Get current user
    async getCurrentUser() {
      try {
        const response = await fetch(`${API_BASE}/auth.php`, {
          method: 'GET',
          credentials: 'include',
          headers: getJsonHeaders()
        });

        const data = await response.json();
        return data.success ? data.user : null;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    }
  };

  console.log('API Client loaded - use window.brainrootAPI');
})();

