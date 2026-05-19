document.addEventListener("DOMContentLoaded", function () {
  const api = window.brainrootAPI;
  const modal = document.getElementById("bookModal");
  const topbar = document.querySelector(".topbar");
  let currentModalBook = null;
  let indexAllBooks = []; // Store all books from database
  const fallbackBookImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='1000' viewBox='0 0 700 1000'%3E%3Crect width='700' height='1000' fill='%23dfe8ea'/%3E%3Crect x='70' y='80' width='560' height='840' rx='24' fill='%23ffffff'/%3E%3Ctext x='350' y='470' font-family='Segoe UI, Arial' font-size='54' font-weight='700' text-anchor='middle' fill='%232d3435'%3EBrainRoot%3C/text%3E%3Ctext x='350' y='540' font-family='Segoe UI, Arial' font-size='30' text-anchor='middle' fill='%23596061'%3EBook Cover%3C/text%3E%3C/svg%3E";

  function setBookImage(image, source, title) {
    if (!image) return;
    image.onerror = function () {
      image.onerror = null;
      image.src = fallbackBookImage;
    };
    image.src = String(source || "").trim() || fallbackBookImage;
    image.alt = title || "Book cover";
  }
  
  // Show book modal
  function showBookModal(book) {
    if (!modal) return;

    currentModalBook = book;
    setBookImage(document.getElementById("modalBookImage"), book.image || book.image_url || book.imageUrl, book.title);
    document.getElementById("modalBookCategory").textContent = book.category || "General";
    document.getElementById("modalBookTitle").textContent = book.title;
    document.getElementById("modalBookAuthor").textContent = book.author || "Unknown";
    document.getElementById("modalBookDesc").textContent = book.description || book.summary || "A curated work from the BrainRoot library.";

    const accessBadge = document.getElementById("modalAccessBadge");
    if (accessBadge) {
      accessBadge.textContent = book.access === "paid" ? "PAID" : "FREE";
      accessBadge.className = "access-badge " + (book.access === "paid" ? "paid" : "free");
    }

    modal.classList.remove("hidden");
  }

  // Close modal
  const modalClose = document.querySelector(".modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", function() {
      modal?.classList.add("hidden");
    });
  }

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
        modal.classList.add("hidden");
      }
    });
  }

  function getBookFromElement(bookElement) {
    const badge = bookElement.querySelector(".badge");
    return {
      title: bookElement.dataset.title || bookElement.querySelector("h3")?.textContent || "",
      author: bookElement.dataset.author || bookElement.querySelector(".author")?.textContent || "Unknown",
      image: bookElement.dataset.image || bookElement.querySelector("img")?.src || "",
      category: bookElement.dataset.category || bookElement.querySelector(".cat")?.textContent || "General",
      access: bookElement.dataset.access || (badge && badge.textContent === "PAID" ? "paid" : "free"),
      description: bookElement.dataset.description || ""
    };
  }

  function bindFeaturedBookClickHandlers() {
    const featuredBooks = document.querySelectorAll(".featured .book");
    featuredBooks.forEach(bookElement => {
      if (bookElement.dataset.bound === "true") {
        return;
      }

      bookElement.dataset.bound = "true";
      const image = bookElement.querySelector("img");
      if (image) {
        setBookImage(image, image.getAttribute("src") || image.src, bookElement.dataset.title || "Book cover");
      }
      bookElement.addEventListener("click", function() {
        showBookModal(getBookFromElement(this));
      });
    });
  }

  function createFeaturedBookCard(book) {
    const article = document.createElement("article");
    const image = document.createElement("img");
    const badge = document.createElement("span");
    const category = document.createElement("p");
    const title = document.createElement("h3");
    const author = document.createElement("p");
    const access = String(book.access || book.access_type || "free").toLowerCase() === "paid" ? "paid" : "free";

    article.className = "book";
    article.dataset.title = book.title || "";
    article.dataset.author = book.author || "Unknown";
    article.dataset.category = book.category || "General";
    article.dataset.access = access;
    article.dataset.description = book.description || "";
    article.dataset.image = book.image || book.image_url || book.imageUrl || "";

    setBookImage(image, article.dataset.image, (book.title || "Book") + " cover");
    badge.className = "badge " + access;
    badge.textContent = access === "paid" ? "PAID" : "FREE";
    category.className = "cat";
    category.textContent = book.category || "General";
    title.textContent = book.title || "Untitled Book";
    author.className = "author";
    author.textContent = book.author || "Unknown";

    article.append(image, badge, category, title, author);
    return article;
  }

  function renderFeaturedEmptyState(grid) {
    if (!grid) return;
    const empty = document.createElement("div");
    empty.className = "featured-empty";
    empty.textContent = "Featured books are loading from the archive.";
    grid.replaceChildren(empty);
  }

  function uniqueBooksById(books) {
    const seen = new Set();
    const uniqueBooks = [];

    books.forEach(function (book) {
      const key = String(book && (book.id ?? book.title ?? "")).trim().toLowerCase();
      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      uniqueBooks.push(book);
    });

    return uniqueBooks;
  }

  async function loadBooksForSearch() {
    if (!api || typeof api.getBooks !== "function") {
      return [];
    }

    const books = await api.getBooks();
    if (books && books.length) {
      indexAllBooks = books;
      resetIndexSearchIndex();
    }

    return books || [];
  }

  async function renderFeaturedBooksFromDatabase() {
    const grid = document.querySelector(".featured .grid");
    if (!grid) {
      return;
    }

    renderFeaturedEmptyState(grid);

    if (!api || typeof api.getFeaturedBooks !== "function") {
      return;
    }

    const allBooks = await loadBooksForSearch();
    const featuredSections = ["trending", "top_reading", "most_liked"];
    const featuredResults = await Promise.all(featuredSections.map(function (section) {
      return api.getFeaturedBooks(section);
    }));

    const featuredBooks = uniqueBooksById(featuredResults.flat()).slice(0, 12);
    const booksToRender = featuredBooks.length ? featuredBooks : allBooks.slice(0, 12);
    if (!booksToRender.length) {
      renderFeaturedEmptyState(grid);
      return;
    }

    grid.replaceChildren();
    booksToRender.forEach(function (book) {
      grid.appendChild(createFeaturedBookCard(book));
    });
    bindFeaturedBookClickHandlers();
  }

  bindFeaturedBookClickHandlers();
  renderFeaturedBooksFromDatabase();

  if (topbar) {
    let lastScrollY = window.scrollY;
    const toggleIndexNav = function () {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      topbar.classList.toggle("is-scroll-hidden", isScrollingDown && currentScrollY > 80);
      lastScrollY = currentScrollY;
    };
    toggleIndexNav();
    window.addEventListener("scroll", toggleIndexNav, { passive: true });
  }

  // ===== Index Page Search Implementation =====
  let indexSearchIndex = null;
  let indexSearchPanel = null;
  let indexSearchResults = null;
  let indexSearchCount = null;
  const INDEX_SEARCH_RESULT_LIMIT = 8;

  function normalizeTitleKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function ensureIndexSearchPanel() {
    if (indexSearchPanel && indexSearchResults && indexSearchCount) {
      return indexSearchPanel;
    }

    indexSearchPanel = document.getElementById("indexSearchPanel");
    indexSearchResults = document.getElementById("indexSearchResults");
    indexSearchCount = document.getElementById("indexSearchCount");

    return indexSearchPanel;
  }

  function hideIndexSearchPanel() {
    const panel = ensureIndexSearchPanel();
    if (!panel) return;
    panel.classList.add("is-hidden");
    if (indexSearchResults) {
      indexSearchResults.replaceChildren();
    }
    if (indexSearchCount) {
      indexSearchCount.textContent = "0 results";
    }
  }

  function resetIndexSearchIndex() {
    indexSearchIndex = null;
  }

  function getIndexSearchIndex() {
    if (indexSearchIndex) {
      return indexSearchIndex;
    }

    // Build search index from all available books (featured + database)
    const seenTitles = new Set();
    indexSearchIndex = [];

    // First add featured books from DOM
    const bookElements = document.querySelectorAll('.featured .book');
    bookElements.forEach(function (element) {
      const title = element.dataset.title || element.querySelector("h3")?.textContent || "";
      const author = element.dataset.author || element.querySelector(".author")?.textContent || "";
      const description = element.dataset.description || "";
      const image = element.dataset.image || element.querySelector("img")?.src || "";
      const category = element.dataset.category || element.querySelector(".cat")?.textContent || "General";
      const access = element.dataset.access || (element.querySelector(".badge.paid") ? "paid" : "free");
      
      const titleKey = normalizeTitleKey(title);
      if (!titleKey || seenTitles.has(titleKey)) {
        return;
      }

      seenTitles.add(titleKey);

      indexSearchIndex.push({
        element: element,
        title: title,
        author: author,
        description: description,
        imageUrl: image,
        category: category,
        access: access,
        searchText: [title, author, description].join(" ").toLowerCase()
      });
    });

    // Then add database books
    indexAllBooks.forEach(function (book) {
      const title = book.title || "";
      const author = book.author || "";
      const description = book.description || book.summary || "";
      const image = book.image || book.image_url || book.imageUrl || "";
      
      const titleKey = normalizeTitleKey(title);
      if (!titleKey || seenTitles.has(titleKey)) {
        return;
      }

      seenTitles.add(titleKey);

      indexSearchIndex.push({
        element: null,
        title: title,
        author: author,
        description: description,
        imageUrl: image,
        category: book.category || "General",
        access: book.access || "free",
        searchText: [title, author, description].join(" ").toLowerCase()
      });
    });

    return indexSearchIndex;
  }

  function openIndexSearchResult(item) {
    if (!item) return;
    showBookModal({
      title: item.title,
      author: item.author,
      image: item.imageUrl,
      category: item.category || "General",
      access: item.access || "free",
      description: item.description
    });
    hideIndexSearchPanel();
    const searchInput = document.getElementById("indexSearchInput");
    if (searchInput) {
      searchInput.value = item.title;
    }
  }

  function renderIndexSearchResults(query) {
    const panel = ensureIndexSearchPanel();
    if (!panel || !indexSearchResults || !indexSearchCount) {
      return;
    }

    const normalizedQuery = String(query || "").trim().toLowerCase();
    if (!normalizedQuery) {
      hideIndexSearchPanel();
      return;
    }

    const matches = getIndexSearchIndex().filter(function (item) {
      return item.searchText.indexOf(normalizedQuery) !== -1;
    }).slice(0, INDEX_SEARCH_RESULT_LIMIT);

    indexSearchResults.replaceChildren();
    indexSearchCount.textContent = matches.length + (matches.length === 1 ? " result" : " results");

    if (matches.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "index-search-empty";
      emptyState.textContent = 'No books matched "' + query.trim() + '". Try a different search.';
      indexSearchResults.appendChild(emptyState);
      panel.classList.remove("is-hidden");
      return;
    }

    matches.forEach(function (item) {
      const button = document.createElement("button");
      button.className = "index-search-item";
      button.type = "button";
      
      const layout = document.createElement("div");
      layout.className = "index-search-item-layout";
      
      const image = document.createElement("img");
      setBookImage(image, item.imageUrl, item.title);
      image.className = "index-search-item-thumb";

      const copy = document.createElement("div");
      copy.className = "index-search-item-copy";
      
      const titleEl = document.createElement("p");
      titleEl.className = "index-search-item-title";
      titleEl.textContent = item.title;

      const metaEl = document.createElement("p");
      metaEl.className = "index-search-item-meta";
      metaEl.textContent = (item.author || "Unknown") + " - " + (item.category || "General") + " - " + (item.access === "paid" ? "Paid" : "Free");

      copy.append(titleEl, metaEl);
      layout.append(image, copy);
      button.appendChild(layout);
      
      button.addEventListener("click", function () {
        openIndexSearchResult(item);
      });

      indexSearchResults.appendChild(button);
    });

    panel.classList.remove("is-hidden");
  }

  function initializeIndexSearch() {
    const searchInput = document.getElementById("indexSearchInput");
    const searchShell = document.getElementById("indexSearchShell");
    
    if (!searchInput) return;

    searchInput.addEventListener("input", function (event) {
      renderIndexSearchResults(event.target.value);
    });

    searchInput.addEventListener("focus", function () {
      renderIndexSearchResults(searchInput.value);
    });

    document.addEventListener("click", function (event) {
      if (searchShell && !searchShell.contains(event.target)) {
        hideIndexSearchPanel();
      }
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideIndexSearchPanel();
        searchInput.blur();
      }
    });
  }

  // Initialize index search
  initializeIndexSearch();

  // Handle Category Buttons with Search
  const categoryButtons = document.querySelectorAll(".chips button");
  categoryButtons.forEach(button => {
    button.addEventListener("click", function() {
      const category = this.textContent.trim();
      const searchInput = document.getElementById("indexSearchInput");
      if (searchInput) {
        searchInput.value = category;
        renderIndexSearchResults(category);
      }
    });
  });


  // Handle Add to Collection button
  const addToCollectionBtn = document.getElementById("addToCollectionBtn");
  if (addToCollectionBtn) {
    addToCollectionBtn.addEventListener("click", async function() {
      const title = document.getElementById("modalBookTitle").textContent;
      if (window.brainrootAuth) {
        const canAddToCollection = typeof window.brainrootAuth.requireBackendLogin === "function"
          ? await window.brainrootAuth.requireBackendLogin("Please login to add books.")
          : window.brainrootAuth.requireLogin("Please login to add books.");

        if (!canAddToCollection) {
          return;
        }
      }
      
      try {
        if (!api || typeof api.addToCollection !== "function") {
          alert("Collection service is not available right now.");
          return;
        }

        const success = await api.addToCollection(Object.assign({}, currentModalBook || {}, { title: title }));
        if (success) {
          alert(`"${title}" added to your collection!`);
          modal?.classList.add("hidden");
        } else {
          alert(api.lastError || "Could not add this book to your collection.");
        }
      } catch (error) {
        console.error("Error adding to collection:", error);
        alert("Error adding book to collection. Try again.");
      }
    });
  }

  // Handle Add to Wishlist button
  const addToWishlistBtn = document.getElementById("addToWishlistBtn");
  if (addToWishlistBtn) {
    addToWishlistBtn.addEventListener("click", async function() {
      const title = document.getElementById("modalBookTitle").textContent;
      if (window.brainrootAuth) {
        const canUseWishlist = typeof window.brainrootAuth.requireBackendLogin === "function"
          ? await window.brainrootAuth.requireBackendLogin("Please login to add to wishlist.")
          : window.brainrootAuth.requireLogin("Please login to add to wishlist.");

        if (!canUseWishlist) {
          return;
        }
      }
      
      try {
        const alreadyBorrowed = typeof api.isBookBorrowed === "function"
          ? await api.isBookBorrowed(title)
          : false;

        if (alreadyBorrowed) {
          alert(`"${title}" is already borrowed, so it cannot be added to your wishlist.`);
          return;
        }

        const success = await api.addToWishlist(Object.assign({}, currentModalBook || {}, { title: title }));
        if (success) {
          alert(`"${title}" added to your wishlist!`);
          modal?.classList.add("hidden");
        } else {
          alert(api.lastError || "Could not add this book to wishlist.");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    });
  }
});
