// BrainRoot Admin Panel
(function () {
  const API_BASE = resolveAppRootUrl() + 'backend/api';
  const FALLBACK_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='640' viewBox='0 0 480 640'%3E%3Crect width='480' height='640' fill='%23dfe8ea'/%3E%3Crect x='48' y='52' width='384' height='536' rx='26' fill='%23ffffff'/%3E%3Ctext x='240' y='304' font-family='Segoe UI, Arial' font-size='34' font-weight='700' text-anchor='middle' fill='%232d3435'%3EBrainRoot%3C/text%3E%3Ctext x='240' y='352' font-family='Segoe UI, Arial' font-size='20' text-anchor='middle' fill='%23596061'%3EAdmin%3C/text%3E%3C/svg%3E";
  const DEFAULT_VIEW = 'dashboard';
  const VALID_FEATURES = ['none', 'trending', 'top_reading', 'most_liked'];

  const state = {
    books: [],
    users: [],
    categories: [],
    activeView: localStorage.getItem('adminActiveView') || DEFAULT_VIEW,
    pillFilter: 'all',
    userRoleFilter: 'all',
    sidebarCollapsed: localStorage.getItem('adminSidebarCollapsed') === 'true',
    deleteBookId: null,
    isLoadingBooks: false,
    isLoadingUsers: false
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    checkAdminAccess();
    syncTopbarUser();
    syncSidebarState();
    bindNavigation();
    bindSearch();
    bindFilters();
    bindForms();
    bindActions();
    switchView(state.activeView);
    loadCategories();
    loadBooks();
    loadUsers();
  }

  function checkAdminAccess() {
    const currentUser = readCurrentUser();
    const role = normalizeRole(currentUser.role);
    const isAdmin = role === 'admin' || role === 'super admin' || String(currentUser.email || '').toLowerCase().includes('admin');

    if (!isAdmin) {
      document.body.classList.add('admin-demo-session');
    }
  }

  function bindNavigation() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }

    document.querySelectorAll('.sidebar-link[data-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        switchView(button.dataset.view || DEFAULT_VIEW);
      });
    });

    document.querySelectorAll('[data-view-jump]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.presetFeatured) {
          localStorage.setItem('adminPresetFeaturedSection', button.dataset.presetFeatured);
        }
        switchView(button.dataset.viewJump || DEFAULT_VIEW);
      });
    });
  }

  function bindSearch() {
    const form = document.getElementById('librarySearchForm');
    const search = document.getElementById('librarySearch');

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        renderAll();
      });
    }

    if (search) {
      search.addEventListener('input', debounce(renderAll, 120));
    }
  }

  function bindFilters() {
    const categoryFilter = document.getElementById('bookCategoryFilter');
    const featuredFilter = document.getElementById('bookFeaturedFilter');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const refreshUsersBtn = document.getElementById('refreshUsersBtn');

    if (categoryFilter) categoryFilter.addEventListener('change', renderAll);
    if (featuredFilter) featuredFilter.addEventListener('change', renderAll);
    if (refreshUsersBtn) refreshUsersBtn.addEventListener('click', loadUsers);

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function () {
        const search = document.getElementById('librarySearch');
        if (search) search.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (featuredFilter) featuredFilter.value = '';
        state.pillFilter = 'all';
        document.querySelectorAll('[data-pill-filter]').forEach(function (pill) {
          pill.classList.toggle('active', pill.dataset.pillFilter === 'all');
        });
        renderAll();
      });
    }

    document.querySelectorAll('[data-pill-filter]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        state.pillFilter = pill.dataset.pillFilter || 'all';
        document.querySelectorAll('[data-pill-filter]').forEach(function (node) {
          node.classList.toggle('active', node === pill);
        });
        renderAll();
      });
    });

    document.querySelectorAll('[data-user-role-filter]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        state.userRoleFilter = pill.dataset.userRoleFilter || 'all';
        document.querySelectorAll('[data-user-role-filter]').forEach(function (node) {
          node.classList.toggle('active', node === pill);
        });
        renderAll();
      });
    });
  }

  function bindForms() {
    const addBookForm = document.getElementById('addBookForm');
    const editBookForm = document.getElementById('editBookForm');
    const userForm = document.getElementById('userForm');
    const addImageInput = document.getElementById('add_image_url');
    const editImageInput = document.getElementById('edit_image_url');

    if (addBookForm) {
      addBookForm.addEventListener('submit', handleAddBook);
      addBookForm.addEventListener('reset', function () {
        window.setTimeout(function () {
          updatePreview('addCoverPreview', '');
          setMessage('addBookResult', '', '');
        }, 0);
      });
    }

    if (editBookForm) editBookForm.addEventListener('submit', handleEditBook);
    if (userForm) userForm.addEventListener('submit', handleEditUser);

    if (addImageInput) {
      addImageInput.addEventListener('input', function () {
        updatePreview('addCoverPreview', addImageInput.value);
      });
    }

    if (editImageInput) {
      editImageInput.addEventListener('input', function () {
        updatePreview('editCoverPreview', editImageInput.value);
      });
    }
  }

  function bindActions() {
    const exportReportBtn = document.getElementById('exportReportBtn');
    const publishCategoriesBtn = document.getElementById('publishCategoriesBtn');
    const publishFeaturedBtn = document.getElementById('publishFeaturedBtn');
    const draftViewBtn = document.getElementById('draftViewBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const helpBtn = document.getElementById('helpBtn');
    const exportUsersBtn = document.getElementById('exportUsersBtn');

    if (exportReportBtn) exportReportBtn.addEventListener('click', exportBooksCsv);
    if (exportUsersBtn) exportUsersBtn.addEventListener('click', exportUsersCsv);
    if (publishCategoriesBtn) {
      publishCategoriesBtn.addEventListener('click', function () {
        showToast('Category changes are already saved when you edit a book.');
      });
    }
    if (publishFeaturedBtn) {
      publishFeaturedBtn.addEventListener('click', function () {
        showToast('Featured sections are live. Use Edit or Feature to change placement.');
      });
    }
    if (draftViewBtn) {
      draftViewBtn.addEventListener('click', function () {
        showToast('Draft view is the current Featured Control preview.');
      });
    }
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', function () {
        showToast(state.books.length + ' books and ' + state.users.length + ' users loaded.');
      });
    }
    if (helpBtn) {
      helpBtn.addEventListener('click', function () {
        showToast('Use Book Management for CRUD, Category Control for featured sections, and Users for accounts.');
      });
    }
  }

  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    localStorage.setItem('adminSidebarCollapsed', String(state.sidebarCollapsed));
    syncSidebarState();
  }

  function syncSidebarState() {
    document.body.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (!sidebarToggle) return;

    sidebarToggle.setAttribute('aria-pressed', String(state.sidebarCollapsed));
    sidebarToggle.setAttribute('title', state.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
    const label = sidebarToggle.querySelector('.sidebar-toggle-label');
    if (label) label.textContent = state.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
  }

  function switchView(viewName) {
    const targetView = document.querySelector('.admin-view[data-view="' + cssEscape(viewName) + '"]') ? viewName : DEFAULT_VIEW;
    state.activeView = targetView;
    localStorage.setItem('adminActiveView', targetView);

    document.querySelectorAll('.admin-view[data-view]').forEach(function (view) {
      view.classList.toggle('active', view.dataset.view === targetView);
    });

    document.querySelectorAll('.sidebar-link[data-view]').forEach(function (button) {
      button.classList.toggle('active', button.dataset.view === targetView);
    });

    if (targetView === 'add-book') {
      const titleInput = document.getElementById('add_title');
      const presetFeatured = localStorage.getItem('adminPresetFeaturedSection');
      const featuredInput = document.getElementById('add_featured_section');
      if (presetFeatured && featuredInput) {
        featuredInput.value = normalizeFeatured(presetFeatured);
        localStorage.removeItem('adminPresetFeaturedSection');
      }
      if (titleInput) {
        window.requestAnimationFrame(function () {
          titleInput.focus();
        });
      }
    }

    renderAll();
  }

  async function loadBooks() {
    state.isLoadingBooks = true;
    renderAll();

    try {
      const result = await requestJson('/books-crud.php?action=list&t=' + Date.now());
      state.books = Array.isArray(result.books) ? result.books : [];
      window.allBooks = state.books;
      setMessage('manageResult', '', '');
    } catch (error) {
      state.books = [];
      window.allBooks = [];
      setMessage('manageResult', 'Books could not load: ' + error.message, 'error');
    } finally {
      state.isLoadingBooks = false;
      renderAll();
    }
  }

  async function loadUsers() {
    state.isLoadingUsers = true;
    renderAll();

    try {
      const result = await requestJson('/users.php?t=' + Date.now());
      state.users = Array.isArray(result.users) ? result.users : [];
    } catch (error) {
      state.users = [];
      showToast('Users could not load: ' + error.message, 'error');
    } finally {
      state.isLoadingUsers = false;
      renderAll();
    }
  }

  async function loadCategories() {
    try {
      const result = await requestJson('/categories.php?all=1&t=' + Date.now());
      state.categories = Array.isArray(result.categories) ? result.categories : [];
      populateCategoryControls();
      renderAll();
    } catch (error) {
      state.categories = [];
      showToast('Categories could not load: ' + error.message, 'error');
    }
  }

  function populateCategoryControls() {
    const activeCategories = state.categories.filter(function (category) {
      return normalizeStatus(category.status) === 'active';
    });

    if (!activeCategories.length) {
      return;
    }

    updateCategorySelect('bookCategoryFilter', activeCategories, true);
    updateCategorySelect('add_category', activeCategories, false);
    updateCategorySelect('edit_category', activeCategories, false);
  }

  function updateCategorySelect(selectId, categories, includeEmpty) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const previousValue = select.value;
    const options = [];
    if (includeEmpty) {
      options.push('<option value="">All Categories</option>');
    }

    categories.forEach(function (category) {
      options.push('<option value="' + escapeHtml(category.name) + '">' + escapeHtml(category.name) + '</option>');
    });

    select.innerHTML = options.join('');
    if (previousValue && categories.some(function (category) { return category.name === previousValue; })) {
      select.value = previousValue;
    } else if (!includeEmpty && select.options.length) {
      select.value = select.options[0].value;
    }
  }

  function renderAll() {
    const visibleBooks = getVisibleBooks();
    renderDashboard(state.books, visibleBooks);
    renderBookStats(state.books, visibleBooks);
    renderBooksTable(visibleBooks);
    renderCategoryControl(state.books, visibleBooks);
    renderUsers(state.users);
    syncPreviewFromInputs();
    bindInlineActions();
    bindUserActions();
  }

  function getVisibleBooks() {
    const searchTerm = getSearchTerm();
    const categoryFilter = getSelectedValue('bookCategoryFilter');
    const featuredFilter = getSelectedValue('bookFeaturedFilter');

    return state.books.filter(function (book) {
      const featured = normalizeFeatured(book.featured_section);
      const access = normalizeAccess(book);
      const haystack = [
        book.title,
        book.author,
        book.category,
        book.description,
        book.image_url,
        book.file_url,
        access,
        featured
      ].map(function (value) {
        return String(value || '').toLowerCase();
      });

      const matchesSearch = !searchTerm || haystack.some(function (value) {
        return value.indexOf(searchTerm) !== -1;
      });
      const matchesCategory = !categoryFilter || book.category === categoryFilter;
      const matchesFeatured = !featuredFilter || featured === featuredFilter;
      const matchesPill = state.pillFilter === 'all' ||
        (state.pillFilter === 'free' && access === 'free') ||
        (state.pillFilter === 'paid' && access !== 'free') ||
        (state.pillFilter === 'featured' && featured !== 'none');

      return matchesSearch && matchesCategory && matchesFeatured && matchesPill;
    });
  }

  function getVisibleUsers(users) {
    const searchTerm = getSearchTerm();
    const roleFilter = state.userRoleFilter || 'all';

    return (users || []).filter(function (user) {
      const role = normalizeRole(user.role);
      const haystack = [user.name, user.email, user.institution, role, user.status, user.plan_type].map(function (value) {
        return String(value || '').toLowerCase();
      });
      const matchesSearch = !searchTerm || haystack.some(function (value) {
        return value.indexOf(searchTerm) !== -1;
      });
      const matchesRole = roleFilter === 'all' || role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  function renderDashboard(allBooks, visibleBooks) {
    const stats = document.getElementById('dashboardStats');
    const recentBooksTable = document.getElementById('recentBooksTable');

    if (stats) {
      const featuredCount = allBooks.filter(function (book) {
        return normalizeFeatured(book.featured_section) !== 'none';
      }).length;
      const freeCount = allBooks.filter(function (book) {
        return normalizeAccess(book) === 'free';
      }).length;
      const categoryCount = state.categories.length || new Set(allBooks.map(function (book) {
        return book.category || 'Other';
      })).size;

      stats.innerHTML = [
        buildStatCard('Total Resources', formatNumber(allBooks.length), 'Library total', 'book'),
        buildStatCard('Available', formatNumber(freeCount), 'Free access', 'available'),
        buildStatCard('Featured Titles', formatNumber(featuredCount), 'Homepage ready', 'featured'),
        buildStatCard('Categories', formatNumber(categoryCount), 'Curated tags', 'category')
      ].join('');
    }

    if (recentBooksTable) {
      const recent = sortBooksNewest(visibleBooks.length ? visibleBooks : allBooks).slice(0, 5);
      recentBooksTable.innerHTML = buildRecentBooksTable(recent);
    }
  }

  function renderBookStats(allBooks, visibleBooks) {
    const stats = document.getElementById('bookStats');
    if (!stats) return;

    const free = allBooks.filter(function (book) {
      return normalizeAccess(book) === 'free';
    }).length;
    const restricted = allBooks.length - free;

    stats.innerHTML = [
      buildStatCard('Total Resources', formatNumber(allBooks.length), 'Database', 'book'),
      buildStatCard('Available', formatNumber(free), 'Free books', 'available'),
      buildStatCard('Restricted', formatNumber(restricted), 'Paid or premium', 'warning'),
      buildStatCard('Filtered', formatNumber(visibleBooks.length), 'Current view', 'featured')
    ].join('');
  }

  function renderBooksTable(books) {
    const container = document.getElementById('booksTableContainer');
    if (!container) return;

    if (state.isLoadingBooks) {
      container.innerHTML = '<div class="empty-state">Loading books...</div>';
      return;
    }

    if (!books.length) {
      container.innerHTML = '<div class="empty-state">No books match your filters.</div>';
      return;
    }

    container.innerHTML = [
      '<table class="admin-table">',
      '<thead><tr><th>Book</th><th>Author</th><th>Category</th><th>Access</th><th>Year</th><th>Featured</th><th>Views</th><th>Likes</th><th>Actions</th></tr></thead>',
      '<tbody>' + books.map(buildManageBookRow).join('') + '</tbody>',
      '</table>'
    ].join('');
  }

  function renderCategoryControl(allBooks, visibleBooks) {
    const categoryStats = document.getElementById('categoryStats');
    const trendingList = document.getElementById('trendingList');
    const topReadingList = document.getElementById('topReadingList');
    const featuredHeroGrid = document.getElementById('featuredHeroGrid');

    if (categoryStats) {
      categoryStats.innerHTML = [
        buildStatCard('Trending Titles', formatNumber(countFeatured(allBooks, 'trending')), 'Homepage feed', 'trending'),
        buildStatCard('Top Reading', formatNumber(countFeatured(allBooks, 'top_reading')), 'Carousel pool', 'featured'),
        buildStatCard('Most Liked', formatNumber(countFeatured(allBooks, 'most_liked')), 'Audience favorites', 'heart'),
        buildStatCard('Tags', formatNumber(state.categories.length || new Set(allBooks.map(function (book) { return book.category || 'Other'; })).size), 'Collections', 'category')
      ].join('');
    }

    const trendingBooks = sortBooksByMetric(getFeaturedBooks(allBooks, 'trending'), 'view_count').slice(0, 5);
    const topReadingBooks = sortBooksByMetric(getFeaturedBooks(allBooks, 'top_reading'), 'view_count').slice(0, 5);
    const heroBooks = uniqueBooksById(
      getFeaturedBooks(allBooks, 'trending')
        .concat(getFeaturedBooks(allBooks, 'top_reading'))
        .concat(getFeaturedBooks(allBooks, 'most_liked'))
    );
    const fallbackHero = sortBooksByMetric(visibleBooks.length ? visibleBooks : allBooks, 'view_count').slice(0, 3);

    if (trendingList) trendingList.innerHTML = buildStackList(trendingBooks, 'trending');
    if (topReadingList) topReadingList.innerHTML = buildStackList(topReadingBooks, 'top_reading');

    if (featuredHeroGrid) {
      const books = (heroBooks.length ? heroBooks : fallbackHero).slice(0, 3);
      featuredHeroGrid.innerHTML = books.length ? books.map(function (book, index) {
        return '<article class="hero-card">' +
          '<img src="' + escapeHtml(resolvePreviewUrl(book.image_url || book.image || '')) + '" alt="' + escapeHtml(book.title || 'Book cover') + '">' +
          '<div class="hero-overlay">' +
          '<span class="hero-slot">Slot ' + (index + 1) + '</span>' +
          '<h3>' + escapeHtml(book.title || 'Untitled') + '</h3>' +
          '<p>' + escapeHtml(book.author || 'Unknown author') + '</p>' +
          '<div class="hero-actions-inline">' +
          '<button type="button" class="mini-btn" data-edit-book-id="' + escapeHtml(book.id) + '">Edit</button>' +
          '<button type="button" class="mini-btn subtle" data-set-featured="' + escapeHtml(book.id) + '" data-featured-target="' + (normalizeFeatured(book.featured_section) === 'trending' ? 'top_reading' : 'trending') + '">Feature</button>' +
          '</div></div></article>';
      }).join('') : '<div class="empty-state compact">No featured books yet.</div>';
    }
  }

  function renderUsers(users) {
    const stats = document.getElementById('userStats');
    const container = document.getElementById('usersTableContainer');
    const visibleUsers = getVisibleUsers(users || []);

    if (stats) {
      const active = (users || []).filter(function (user) {
        return normalizeStatus(user.status) === 'active';
      }).length;
      const faculty = (users || []).filter(function (user) {
        return normalizeRole(user.role) === 'faculty';
      }).length;
      const loans = (users || []).reduce(function (sum, user) {
        return sum + (Number(user.current_loans) || 0);
      }, 0);

      stats.innerHTML = [
        buildStatCard('Total Members', formatNumber((users || []).length), 'Database users', 'users'),
        buildStatCard('Active Members', formatNumber(active), 'Currently active', 'available'),
        buildStatCard('Faculty Accounts', formatNumber(faculty), 'Teaching staff', 'featured'),
        buildStorageCard(formatNumber(loans), 'Current Loans')
      ].join('');
    }

    if (!container) return;

    if (state.isLoadingUsers) {
      container.innerHTML = '<div class="empty-state">Loading users...</div>';
      return;
    }

    if (!visibleUsers.length) {
      container.innerHTML = '<div class="empty-state">No users match your filters.</div>';
      return;
    }

    container.innerHTML = [
      '<table class="admin-table user-table">',
      '<thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Plan</th><th>Join Date</th><th>Current Loans</th><th>Actions</th></tr></thead>',
      '<tbody>' + visibleUsers.map(buildUserRow).join('') + '</tbody>',
      '</table>'
    ].join('');
  }

  function buildRecentBooksTable(books) {
    if (!books.length) return '<div class="empty-state compact">No books loaded yet.</div>';
    return '<table class="admin-table compact-table"><thead><tr><th>Book</th><th>Category</th><th>Access</th><th>Added</th><th>Action</th></tr></thead><tbody>' +
      books.map(function (book) {
        const access = normalizeAccess(book);
        return '<tr>' +
          '<td>' + buildBookCell(book) + '</td>' +
          '<td>' + escapeHtml(book.category || 'General') + '</td>' +
          '<td><span class="status-badge ' + escapeHtml(accessClass(access)) + '">' + escapeHtml(accessLabel(access)) + '</span></td>' +
          '<td>' + escapeHtml(formatDate(book.created_at)) + '</td>' +
          '<td><button type="button" class="mini-btn" data-edit-book-id="' + escapeHtml(book.id) + '">Edit</button></td>' +
          '</tr>';
      }).join('') + '</tbody></table>';
  }

  function buildManageBookRow(book) {
    const access = normalizeAccess(book);
    const featured = normalizeFeatured(book.featured_section);
    return '<tr>' +
      '<td>' + buildBookCell(book) + '</td>' +
      '<td>' + escapeHtml(book.author || 'Unknown') + '</td>' +
      '<td>' + escapeHtml(book.category || 'General') + '</td>' +
      '<td><span class="status-badge ' + escapeHtml(accessClass(access)) + '">' + escapeHtml(accessLabel(access)) + '</span></td>' +
      '<td>' + escapeHtml(book.published_year || '-') + '</td>' +
      '<td><span class="featured-badge ' + escapeHtml(featured) + '">' + escapeHtml(featureLabel(featured)) + '</span></td>' +
      '<td>' + escapeHtml(formatNumber(book.view_count || 0)) + '</td>' +
      '<td>' + escapeHtml(formatNumber(book.like_count || 0)) + '</td>' +
      '<td><div class="row-actions">' +
      '<button type="button" class="mini-btn" data-edit-book-id="' + escapeHtml(book.id) + '">Edit</button>' +
      '<button type="button" class="mini-btn subtle" data-set-featured="' + escapeHtml(book.id) + '" data-featured-target="' + (featured === 'none' ? 'trending' : 'none') + '">' + (featured === 'none' ? 'Feature' : 'Unfeature') + '</button>' +
      '<button type="button" class="mini-btn danger" data-delete-book-id="' + escapeHtml(book.id) + '" data-delete-book-title="' + escapeHtml(book.title || 'Untitled') + '">Delete</button>' +
      '</div></td>' +
      '</tr>';
  }

  function buildUserRow(user) {
    const role = normalizeRole(user.role);
    const status = normalizeStatus(user.status);
    const nextStatus = status === 'suspended' ? 'active' : 'suspended';
    return '<tr>' +
      '<td><div class="member-cell"><span class="member-avatar">' + escapeHtml(user.initials || initialsFor(user.name || user.email)) + '</span><div><strong>' + escapeHtml(user.name || 'Unnamed User') + '</strong><span>' + escapeHtml(user.email || '') + '</span></div></div></td>' +
      '<td><span class="featured-badge ' + escapeHtml(role) + '">' + escapeHtml(userRoleLabel(role)) + '</span></td>' +
      '<td><span class="status-badge ' + escapeHtml(status) + '">' + escapeHtml(userStatusLabel(status)) + '</span></td>' +
      '<td><span class="chip chip-soft">' + escapeHtml(userPlanLabel(user.plan_type)) + '</span></td>' +
      '<td>' + escapeHtml(formatDate(user.created_at)) + '</td>' +
      '<td>' + escapeHtml(formatNumber(user.current_loans || 0)) + '</td>' +
      '<td><div class="row-actions">' +
      '<button type="button" class="mini-btn" data-user-edit-id="' + escapeHtml(user.id) + '">Edit</button>' +
      '<button type="button" class="mini-btn subtle" data-user-toggle-status="' + escapeHtml(user.id) + '" data-user-next-status="' + escapeHtml(nextStatus) + '">' + (nextStatus === 'active' ? 'Activate' : 'Suspend') + '</button>' +
      '<button type="button" class="mini-btn danger" data-user-delete-id="' + escapeHtml(user.id) + '" data-user-delete-name="' + escapeHtml(user.name || 'Unnamed User') + '">Delete</button>' +
      '</div></td>' +
      '</tr>';
  }

  function buildBookCell(book) {
    return '<div class="book-cell">' +
      '<img class="book-thumb" src="' + escapeHtml(resolvePreviewUrl(book.image_url || book.image || '')) + '" alt="' + escapeHtml(book.title || 'Book cover') + '">' +
      '<div class="book-copy"><strong>' + escapeHtml(book.title || 'Untitled') + '</strong><span>' + escapeHtml(book.file_url ? 'Reader file attached' : 'No reader file') + '</span></div>' +
      '</div>';
  }

  function buildStackList(books, sectionName) {
    if (!books.length) return '<div class="empty-state compact">No titles in this section.</div>';

    return books.map(function (book, index) {
      return '<article class="stack-item">' +
        '<span class="stack-grip">' + (index + 1) + '</span>' +
        '<img class="stack-thumb" src="' + escapeHtml(resolvePreviewUrl(book.image_url || book.image || '')) + '" alt="' + escapeHtml(book.title || 'Book cover') + '">' +
        '<div class="stack-copy"><strong>' + escapeHtml(book.title || 'Untitled') + '</strong><span>' + escapeHtml(book.author || 'Unknown author') + '</span><small>' + escapeHtml(book.category || 'General') + '</small></div>' +
        '<div class="stack-meta"><span>' + escapeHtml(formatNumber(book.view_count || 0)) + ' views</span><button type="button" class="mini-btn subtle" data-set-featured="' + escapeHtml(book.id) + '" data-featured-target="' + (sectionName === 'trending' ? 'top_reading' : 'trending') + '">Move</button><button type="button" class="mini-btn" data-edit-book-id="' + escapeHtml(book.id) + '">Edit</button></div>' +
        '</article>';
    }).join('');
  }

  async function handleAddBook(event) {
    event.preventDefault();
    const form = event.target;
    const submit = form.querySelector('[type="submit"]');
    const payload = normalizeBookPayload(Object.fromEntries(new FormData(form)));

    if (!payload.title || !payload.author || !payload.category) {
      setMessage('addBookResult', 'Title, author, and category are required.', 'error');
      return;
    }

    setBusy(submit, true, 'Saving...');
    try {
      const result = await requestJson('/books-crud.php', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setMessage('addBookResult', result.message || 'Book added successfully.', 'success');
      form.reset();
      updatePreview('addCoverPreview', '');
      await loadBooks();
      switchView('books');
    } catch (error) {
      setMessage('addBookResult', error.message, 'error');
    } finally {
      setBusy(submit, false);
    }
  }

  async function handleEditBook(event) {
    event.preventDefault();
    const form = event.target;
    const bookId = document.getElementById('edit_book_id').value;
    const payload = normalizeBookPayload(Object.fromEntries(new FormData(form)));

    try {
      const result = await requestJson('/books-crud.php?id=' + encodeURIComponent(bookId), {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      closeEditModal();
      showToast(result.message || 'Book updated successfully.');
      await loadBooks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function updateBookFields(bookId, payload, successMessage) {
    try {
      await requestJson('/books-crud.php?id=' + encodeURIComponent(bookId), {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      showToast(successMessage || 'Book updated successfully.');
      await loadBooks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function confirmDelete() {
    if (!state.deleteBookId) return;

    try {
      await requestJson('/books-crud.php?id=' + encodeURIComponent(state.deleteBookId), {
        method: 'DELETE'
      });
      closeDeleteModal();
      showToast('Book deleted successfully.');
      await loadBooks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function handleEditUser(event) {
    event.preventDefault();
    const form = event.target;
    const userId = document.getElementById('edit_user_id').value;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const result = await requestJson('/users.php?id=' + encodeURIComponent(userId), {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      closeUserModal();
      showToast(result.message || 'User updated successfully.');
      await loadUsers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function updateUserFields(userId, payload, successMessage) {
    try {
      await requestJson('/users.php?id=' + encodeURIComponent(userId), {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      showToast(successMessage || 'User updated successfully.');
      await loadUsers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function deleteUser(userId, userName) {
    if (!window.confirm('Delete ' + userName + '? This cannot be undone.')) return;

    try {
      await requestJson('/users.php?id=' + encodeURIComponent(userId), {
        method: 'DELETE'
      });
      showToast('User deleted successfully.');
      await loadUsers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  function bindInlineActions() {
    document.querySelectorAll('[data-edit-book-id]').forEach(function (button) {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        openEditModal(button.dataset.editBookId);
      });
    });

    document.querySelectorAll('[data-delete-book-id]').forEach(function (button) {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        openDeleteModal(button.dataset.deleteBookId, button.dataset.deleteBookTitle || 'Untitled');
      });
    });

    document.querySelectorAll('[data-set-featured]').forEach(function (button) {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        updateBookFields(button.dataset.setFeatured, { featured_section: button.dataset.featuredTarget || 'none' }, 'Featured section updated.');
      });
    });
  }

  function bindUserActions() {
    document.querySelectorAll('[data-user-edit-id]').forEach(function (button) {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        openUserModal(button.dataset.userEditId);
      });
    });

    document.querySelectorAll('[data-user-toggle-status]').forEach(function (button) {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        updateUserFields(button.dataset.userToggleStatus, { status: button.dataset.userNextStatus || 'active' }, 'User status updated.');
      });
    });

    document.querySelectorAll('[data-user-delete-id]').forEach(function (button) {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        deleteUser(button.dataset.userDeleteId, button.dataset.userDeleteName || 'Unnamed User');
      });
    });
  }

  function openEditModal(bookId) {
    const book = state.books.find(function (item) {
      return String(item.id) === String(bookId);
    });
    if (!book) {
      showToast('Book not found.', 'error');
      return;
    }

    setValue('edit_book_id', book.id);
    setValue('edit_title', book.title || '');
    setValue('edit_author', book.author || '');
    setValue('edit_category', book.category || 'Other');
    setValue('edit_published_year', book.published_year || '');
    setValue('edit_access_type', normalizeAccess(book));
    setValue('edit_featured_section', normalizeFeatured(book.featured_section));
    setValue('edit_pages', book.pages || '');
    setValue('edit_description', book.description || '');
    setValue('edit_image_url', book.image_url || '');
    setValue('edit_file_url', book.file_url || '');
    setValue('edit_view_count', Number(book.view_count) || 0);
    setValue('edit_like_count', Number(book.like_count) || 0);
    updatePreview('editCoverPreview', book.image_url || '');
    openModal('editModal');
  }

  function closeEditModal() {
    closeModal('editModal');
  }

  function openDeleteModal(bookId, bookTitle) {
    state.deleteBookId = bookId;
    const message = document.getElementById('deleteMessage');
    if (message) message.textContent = 'Delete "' + bookTitle + '"? This action cannot be undone.';
    openModal('deleteModal');
  }

  function closeDeleteModal() {
    state.deleteBookId = null;
    closeModal('deleteModal');
  }

  function openUserModal(userId) {
    const user = state.users.find(function (item) {
      return String(item.id) === String(userId);
    });
    if (!user) {
      showToast('User not found.', 'error');
      return;
    }

    setValue('edit_user_id', user.id);
    setValue('edit_user_name', user.name || '');
    setValue('edit_user_email', user.email || '');
    setValue('edit_user_institution', user.institution || '');
    setValue('edit_user_role', normalizeRole(user.role));
    setValue('edit_user_plan', String(user.plan_type || 'free').toLowerCase());
    setValue('edit_user_status', normalizeStatus(user.status));
    openModal('userModal');
  }

  function closeUserModal() {
    closeModal('userModal');
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function normalizeBookPayload(raw) {
    const featured = normalizeFeatured(raw.featured_section);
    return {
      title: String(raw.title || '').trim(),
      author: String(raw.author || '').trim(),
      category: String(raw.category || '').trim(),
      description: String(raw.description || '').trim(),
      access_type: normalizeAccess({ access_type: raw.access_type }),
      image_url: String(raw.image_url || '').trim(),
      file_url: String(raw.file_url || '').trim(),
      published_year: raw.published_year === '' ? '' : Math.max(0, parseInt(raw.published_year, 10) || 0),
      pages: raw.pages === '' ? '' : Math.max(0, parseInt(raw.pages, 10) || 0),
      featured_section: featured,
      view_count: Math.max(0, parseInt(raw.view_count, 10) || 0),
      like_count: Math.max(0, parseInt(raw.like_count, 10) || 0)
    };
  }

  async function requestJson(path, options) {
    const config = options || {};
    const headers = getAdminRequestHeaders();
    const response = await fetch(API_BASE + path, {
      method: config.method || 'GET',
      credentials: 'include',
      headers: headers,
      body: config.body
    });
    let result = null;

    try {
      result = await response.json();
    } catch (error) {
      throw new Error('Invalid server response');
    }

    if (!response.ok || !result || result.success === false) {
      throw new Error((result && result.error) || ('HTTP Error: ' + response.status));
    }

    return result;
  }

  function getAdminRequestHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const currentUser = readCurrentUser();
    if (currentUser.id && currentUser.email) {
      headers['X-Brainroot-User-Id'] = String(currentUser.id);
      headers['X-Brainroot-User-Email'] = String(currentUser.email);
    }
    return headers;
  }

  function readCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('brainrootCurrentUser') || '{}') || {};
    } catch (error) {
      return {};
    }
  }

  function syncTopbarUser() {
    const currentUser = readCurrentUser();
    const name = document.getElementById('topbarUserName');
    const role = document.getElementById('topbarUserRole');
    const avatar = document.getElementById('topbarAvatar');
    if (name) name.textContent = currentUser.name || 'Admin User';
    if (role) role.textContent = userRoleLabel(currentUser.role || 'admin');
    if (avatar && currentUser.avatar) avatar.src = currentUser.avatar;
  }

  function exportBooksCsv() {
    const rows = [['Title', 'Author', 'Category', 'Access', 'Year', 'Featured', 'Views', 'Likes']];
    state.books.forEach(function (book) {
      rows.push([
        book.title || '',
        book.author || '',
        book.category || '',
        normalizeAccess(book),
        book.published_year || '',
        normalizeFeatured(book.featured_section),
        book.view_count || 0,
        book.like_count || 0
      ]);
    });

    const csv = rows.map(function (row) {
      return row.map(csvEscape).join(',');
    }).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brainroot-admin-books.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportUsersCsv() {
    const rows = [['Name', 'Email', 'Institution', 'Role', 'Status', 'Plan', 'Current Loans']];
    state.users.forEach(function (user) {
      rows.push([
        user.name || '',
        user.email || '',
        user.institution || '',
        normalizeRole(user.role),
        normalizeStatus(user.status),
        user.plan_type || 'free',
        user.current_loans || 0
      ]);
    });

    const csv = rows.map(function (row) {
      return row.map(csvEscape).join(',');
    }).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brainroot-admin-users.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function buildStatCard(title, value, delta, type) {
    const statType = type || 'book';
    return '<article class="stat-card stat-' + escapeHtml(statType) + '">' +
      '<div class="stat-head"><span class="stat-ico stat-' + escapeHtml(statType) + '-ico"></span><span class="stat-delta">' + escapeHtml(delta || '') + '</span></div>' +
      '<p>' + escapeHtml(title) + '</p>' +
      '<strong>' + escapeHtml(value) + '</strong>' +
      '</article>';
  }

  function buildStorageCard(value, title) {
    return '<article class="stat-card stat-storage">' +
      '<div class="stat-head"><span class="stat-ico stat-storage-ico"></span><span class="stat-delta">Live</span></div>' +
      '<p>' + escapeHtml(title) + '</p><strong>' + escapeHtml(value) + '</strong>' +
      '<div class="storage-bar"><span style="width: 68%"></span></div>' +
      '</article>';
  }

  function setMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message || '';
    element.className = 'form-result';
    element.style.display = message ? 'block' : 'none';
    if (message) element.classList.add(type === 'error' ? 'error' : 'success');
  }

  function showToast(message, type) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'admin-toast ' + (type === 'error' ? 'error' : 'success') + ' is-visible';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  function getFeaturedBooks(books, section) {
    return (books || []).filter(function (book) {
      return normalizeFeatured(book.featured_section) === section;
    });
  }

  function sortBooksByMetric(books, metric) {
    return (books || []).slice().sort(function (a, b) {
      return (Number(b[metric]) || 0) - (Number(a[metric]) || 0);
    });
  }

  function sortBooksNewest(books) {
    return (books || []).slice().sort(function (a, b) {
      const aTime = new Date(a.created_at || 0).getTime() || Number(a.id) || 0;
      const bTime = new Date(b.created_at || 0).getTime() || Number(b.id) || 0;
      return bTime - aTime;
    });
  }

  function uniqueBooksById(books) {
    const seen = {};
    return (books || []).filter(function (book) {
      const key = String(book.id || book.title || '');
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function countFeatured(books, section) {
    return getFeaturedBooks(books, section).length;
  }

  function normalizeFeatured(value) {
    const normalized = String(value || 'none').trim().toLowerCase();
    return VALID_FEATURES.indexOf(normalized) === -1 ? 'none' : normalized;
  }

  function normalizeAccess(book) {
    const value = String((book && (book.access_type || book.access)) || 'free').trim().toLowerCase();
    if (value === 'paid' || value === 'premium') return value;
    return 'free';
  }

  function accessLabel(accessType) {
    if (accessType === 'paid') return 'Paid';
    if (accessType === 'premium') return 'Premium';
    return 'Free';
  }

  function accessClass(accessType) {
    if (accessType === 'paid') return 'paid';
    if (accessType === 'premium') return 'premium';
    return 'available';
  }

  function featureLabel(value) {
    if (value === 'trending') return 'Trending';
    if (value === 'top_reading') return 'Top Reading';
    if (value === 'most_liked') return 'Most Liked';
    return 'None';
  }

  function normalizeRole(role) {
    const normalized = String(role || 'student').trim().toLowerCase();
    return normalized || 'student';
  }

  function normalizeStatus(status) {
    const normalized = String(status || 'active').trim().toLowerCase();
    return normalized === 'suspended' ? 'suspended' : 'active';
  }

  function userRoleLabel(role) {
    const normalized = normalizeRole(role);
    if (normalized === 'admin' || normalized === 'super admin') return 'Admin';
    if (normalized === 'faculty') return 'Faculty';
    if (normalized === 'guest') return 'Guest';
    return 'Student';
  }

  function userStatusLabel(status) {
    return normalizeStatus(status) === 'suspended' ? 'Suspended' : 'Active';
  }

  function userPlanLabel(planType) {
    const plan = String(planType || 'free').trim().toLowerCase();
    return plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Free';
  }

  function getSearchTerm() {
    const search = document.getElementById('librarySearch');
    return search ? search.value.trim().toLowerCase() : '';
  }

  function getSelectedValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  function formatNumber(value) {
    return new Intl.NumberFormat().format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(value || ''));
    return String(value || '').replace(/"/g, '\\"');
  }

  function resolveAppRootUrl() {
    const marker = '/admin/';
    const pathname = window.location.pathname;
    const index = pathname.toLowerCase().lastIndexOf(marker);
    if (index !== -1) {
      return window.location.origin + pathname.slice(0, index + 1);
    }
    return new URL('../', window.location.href).href;
  }

  function resolvePreviewUrl(value) {
    const source = String(value || '').trim();
    if (!source) return FALLBACK_COVER;
    if (/^(https?:)?\/\//i.test(source) || /^(data|blob):/i.test(source)) return source;
    if (source.startsWith('/')) return new URL(source, window.location.origin).href;
    return new URL(source, resolveAppRootUrl()).href;
  }

  function updatePreview(id, value) {
    const image = document.getElementById(id);
    if (!image) return;
    image.onerror = function () {
      image.onerror = null;
      image.src = FALLBACK_COVER;
    };
    image.src = resolvePreviewUrl(value);
  }

  function syncPreviewFromInputs() {
    const addInput = document.getElementById('add_image_url');
    const editInput = document.getElementById('edit_image_url');
    if (addInput) updatePreview('addCoverPreview', addInput.value);
    if (editInput) updatePreview('editCoverPreview', editInput.value);
  }

  function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value == null ? '' : value;
  }

  function setBusy(button, isBusy, label) {
    if (!button) return;
    if (isBusy) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || 'Working...';
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function csvEscape(value) {
    const text = String(value == null ? '' : value);
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function debounce(fn, delay) {
    let timer = null;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  function initialsFor(value) {
    const clean = String(value || 'U').replace(/[^a-zA-Z0-9]+/g, ' ').trim();
    return (clean.slice(0, 2) || 'U').toUpperCase();
  }

  function adminLogout() {
    localStorage.removeItem('brainrootCurrentUser');
    localStorage.removeItem('brainrootProfile');
    localStorage.removeItem('brainrootAuth');
    window.location.href = '../login/login.html';
  }

  window.openEditModal = openEditModal;
  window.closeEditModal = closeEditModal;
  window.openDeleteModal = openDeleteModal;
  window.closeDeleteModal = closeDeleteModal;
  window.confirmDelete = confirmDelete;
  window.openUserModal = openUserModal;
  window.closeUserModal = closeUserModal;
  window.adminLogout = adminLogout;
})();
