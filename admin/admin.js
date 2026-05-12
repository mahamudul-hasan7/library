// Admin Panel JavaScript

// Check if user is admin
document.addEventListener('DOMContentLoaded', function() {
  checkAdminAccess();
  
  // Restore the last active tab
  const lastTab = localStorage.getItem('adminActiveTab') || 'add-book';
  switchTab(lastTab);
  
  loadBooks();
  
  // Tab switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  // Add book form
  document.getElementById('addBookForm').addEventListener('submit', handleAddBook);

  // Edit book form
  document.getElementById('editBookForm').addEventListener('submit', handleEditBook);

  // Search and filter
  document.getElementById('searchBooks').addEventListener('input', filterBooks);
  document.getElementById('filterCategory').addEventListener('change', filterBooks);
});

function checkAdminAccess() {
  // Simple admin check - in production, verify from backend
  const currentUser = JSON.parse(localStorage.getItem('brainrootCurrentUser') || '{}');
  
  // For demo, check if user email contains 'admin' or has role 'admin'
  const isAdmin = currentUser.email?.includes('admin') || currentUser.role === 'admin';
  
  if (!isAdmin) {
    // Redirect to home if not admin
    // Uncomment to enforce admin-only access
    // window.location.href = '../index/index.html';
  }
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.admin-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName).classList.add('active');
  
  // Update button states
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  
  // Save the active tab to localStorage
  localStorage.setItem('adminActiveTab', tabName);
}

async function handleAddBook(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const bookData = Object.fromEntries(formData);

  try {
    const response = await fetch('../backend/api/books-crud.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      showMessage('addBookResult', 'Book added successfully!', 'success');
      e.target.reset();
      setTimeout(() => {
        switchTab('manage-books');
        loadBooks();
      }, 1500);
    } else {
      showMessage('addBookResult', 'Error: ' + (result.error || 'Failed to add book'), 'error');
    }
  } catch (error) {
    showMessage('addBookResult', 'Error: ' + error.message, 'error');
  }
}

async function loadBooks() {
  try {
    // Add cache buster
    const cacheBuster = new Date().getTime();
    const response = await fetch(`../backend/api/books-crud.php?action=list&t=${cacheBuster}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.books) {
      window.allBooks = result.books;
      renderBooksTable(result.books);
    } else {
      const errorMsg = result.error || 'No books found';
      console.error('API error:', errorMsg);
      document.getElementById('booksTableBody').innerHTML = 
        `<tr><td colspan="6" class="empty">${errorMsg}</td></tr>`;
    }
  } catch (error) {
    console.error('Error loading books:', error);
    document.getElementById('booksTableBody').innerHTML = 
      `<tr><td colspan="6" class="empty">Error: ${error.message}</td></tr>`;
  }
}

function renderBooksTable(books) {
  if (!books || books.length === 0) {
    document.getElementById('booksTableBody').innerHTML = 
      '<tr><td colspan="9" class="empty">No books found</td></tr>';
    return;
  }

  const tbody = document.getElementById('booksTableBody');
  tbody.innerHTML = books.map(book => `
    <tr>
      <td><strong>${escapeHtml(book.title)}</strong></td>
      <td>${escapeHtml(book.author || '-')}</td>
      <td>${escapeHtml(book.category || '-')}</td>
      <td>${book.access_type || 'free'}</td>
      <td>${book.published_year || '-'}</td>
      <td><span class="badge ${book.featured_section || 'none'}">${book.featured_section || 'none'}</span></td>
      <td>${book.view_count || 0}</td>
      <td>${book.like_count || 0}</td>
      <td class="actions">
        <button class="btn btn-edit" data-book-id="${book.id}">Edit</button>
        <button class="btn btn-danger" data-book-id="${book.id}" data-book-title="${escapeHtml(book.title)}">Delete</button>
      </td>
    </tr>
  `).join('');
  
  // Add event listeners to buttons
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      openEditModal(parseInt(this.getAttribute('data-book-id')));
    });
  });
  
  tbody.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', function() {
      openDeleteModal(parseInt(this.getAttribute('data-book-id')), this.getAttribute('data-book-title'));
    });
  });
}

// Helper function to escape HTML special characters
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function filterBooks() {
  const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
  const categoryFilter = document.getElementById('filterCategory').value;

  const filtered = window.allBooks.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  renderBooksTable(filtered);
}

function openEditModal(bookId) {
  const book = window.allBooks.find(b => b.id === bookId);
  
  if (!book) return;

  document.getElementById('edit_book_id').value = book.id;
  document.getElementById('edit_title').value = book.title;
  document.getElementById('edit_author').value = book.author || '';
  document.getElementById('edit_category').value = book.category || '';
  document.getElementById('edit_published_year').value = book.published_year || '';
  document.getElementById('edit_description').value = book.description || '';
  document.getElementById('edit_pages').value = book.pages || '';
  document.getElementById('edit_access_type').value = book.access_type || 'free';
  document.getElementById('edit_image_url').value = book.image_url || '';
  document.getElementById('edit_file_url').value = book.file_url || '';
  document.getElementById('edit_featured_section').value = book.featured_section || 'none';
  document.getElementById('edit_view_count').value = book.view_count || 0;
  document.getElementById('edit_like_count').value = book.like_count || 0;

  document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function handleEditBook(e) {
  e.preventDefault();

  const bookId = document.getElementById('edit_book_id').value;
  const formData = new FormData(e.target);
  const bookData = Object.fromEntries(formData);
  delete bookData.book_id;

  try {
    const response = await fetch(`../backend/api/books-crud.php?id=${bookId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      closeEditModal();
      loadBooks();
      showMessage('manageResult', 'Book updated successfully!', 'success');
    } else {
      alert('Error: ' + (result.error || 'Failed to update book'));
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function openDeleteModal(bookId, bookTitle) {
  window.deleteBookId = bookId;
  document.getElementById('deleteMessage').textContent = 
    `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
  const bookId = window.deleteBookId;
  
  try {
    const response = await fetch(`../backend/api/books-crud.php?id=${bookId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      closeDeleteModal();
      loadBooks();
      showMessage('manageResult', 'Book deleted successfully!', 'success');
    } else {
      alert('Error: ' + (result.error || 'Failed to delete book'));
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.textContent = message;
  element.className = `form-result ${type}`;
  element.style.display = 'block';
  element.style.visibility = 'visible';
  element.style.opacity = '1';
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Clear any existing timeout
  if (element._messageTimeout) {
    clearTimeout(element._messageTimeout);
  }

  if (type === 'success') {
    element._messageTimeout = setTimeout(() => {
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        element.style.display = 'none';
        element.style.opacity = '1';
        element.style.transition = '';
      }, 300);
    }, 4000);
  }
}

function adminLogout() {
  localStorage.removeItem('brainrootCurrentUser');
  localStorage.removeItem('brainrootProfile');
  localStorage.removeItem('brainrootAuth');
  window.location.href = '../login/login.html';
}
