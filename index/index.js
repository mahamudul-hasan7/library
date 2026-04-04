document.addEventListener("DOMContentLoaded", function () {
  function normalizeTitleKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  const searchInput = document.querySelector(".search-box input");
  const searchBox = document.querySelector(".search-box");
  const chipButtons = Array.from(document.querySelectorAll(".chips button"));
  const books = Array.from(document.querySelectorAll(".featured .book"));

  if (!searchInput || books.length === 0) {
    return;
  }

  let activeCategory = "";
  let homeCollectionToastTimer = null;

  function showHomeCollectionToast(message) {
    let toast = document.getElementById("homeCollectionToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "homeCollectionToast";
      toast.className = "home-collection-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    if (homeCollectionToastTimer) {
      clearTimeout(homeCollectionToastTimer);
    }

    homeCollectionToastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 5000);
  }

  function showFakeLoading(message, duration, onDone) {
    let overlay = document.getElementById("homeLoadingOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "homeLoadingOverlay";
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.background = "rgba(12, 15, 15, 0.34)";
      overlay.style.backdropFilter = "blur(6px)";
      overlay.style.webkitBackdropFilter = "blur(6px)";
      overlay.style.display = "grid";
      overlay.style.placeItems = "center";
      overlay.style.zIndex = "95";

      const card = document.createElement("div");
      card.style.background = "rgba(246, 247, 255, 0.9)";
      card.style.border = "1px solid rgba(172, 179, 180, 0.45)";
      card.style.borderRadius = "14px";
      card.style.padding = "14px 16px";
      card.style.minWidth = "220px";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.gap = "10px";
      card.style.color = "#2d3435";
      card.style.fontWeight = "700";

      const spinner = document.createElement("span");
      spinner.style.width = "16px";
      spinner.style.height = "16px";
      spinner.style.border = "2px solid rgba(0, 95, 175, 0.3)";
      spinner.style.borderTopColor = "#005faf";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "brainrootSpin 0.8s linear infinite";

      const text = document.createElement("span");
      text.id = "homeLoadingText";

      card.appendChild(spinner);
      card.appendChild(text);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }

    if (!document.getElementById("brainrootLoadingSpinStyle")) {
      const style = document.createElement("style");
      style.id = "brainrootLoadingSpinStyle";
      style.textContent = "@keyframes brainrootSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    const textNode = document.getElementById("homeLoadingText");
    if (textNode) {
      textNode.textContent = message || "Loading...";
    }

    overlay.style.display = "grid";
    setTimeout(function () {
      overlay.style.display = "none";
      if (typeof onDone === "function") {
        onDone();
      }
    }, typeof duration === "number" ? duration : 1200);
  }

  const searchPanel = document.createElement("div");
  searchPanel.className = "search-live-panel";
  searchPanel.id = "homeSearchLivePanel";
  if (searchBox) {
    searchBox.appendChild(searchPanel);
  }

  // Book descriptions mapping
  const bookDescriptions = {
    "The Form of Space": "Explore the fundamental principles of spatial design and how form shapes human experience in architectural spaces.",
    "Urban Rhythms": "A sociological study of how cities function as living organisms, driven by patterns of human behavior and interaction.",
    "The Digital Archive": "Investigating how digital technology transforms our relationship with knowledge, memory, and cultural preservation.",
    "Lost Collections": "Uncovering forgotten architectural treasures and the stories behind civilizations that shaped our built environment.",
    "Minimalist Logic": "The philosophy and practice of designing with essential elements, reducing complexity to reveal pure functionality.",
    "Future Structures": "Pioneering technologies and innovative materials that will define the architecture of tomorrow.",
    "Green Horizons": "Sustainable landscape design practices that integrate nature with human development for a balanced future.",
    "Cities in Motion": "Understanding urban planning strategies that create livable, connected, and resilient metropolitan areas.",
    "Building Tomorrow": "Comprehensive framework for sustainable architecture and construction practices for environmental responsibility.",
    "Structure & Form": "Exploring materials and structural systems that enable creative architectural expression while ensuring durability.",
    "Virtual Spaces": "The intersection of digital art and architecture in creating immersive virtual environments and experiences.",
    "Preservation Arts": "Techniques and philosophies for conserving heritage architecture and adapting historical buildings for modern use."
  };

  const extraSearchCatalog = [
    { title: "The Design of Everyday Things", author: "Don Norman", category: "Design" },
    { title: "A Pattern Language", author: "Christopher Alexander", category: "Architecture" },
    { title: "Delirious New York", author: "Rem Koolhaas", category: "Urbanism" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology" },
    { title: "The Architecture of Happiness", author: "Alain de Botton", category: "Architecture" },
    { title: "The Kite Runner", author: "Khaled Hosseini", category: "Drama" },
    { title: "Dune", author: "Frank Herbert", category: "Sci-Fi" },
    { title: "The Power of Habit", author: "Charles Duhigg", category: "Productivity" },
    { title: "Atomic Habits", author: "James Clear", category: "Productivity" },
    { title: "Deep Work", author: "Cal Newport", category: "Productivity" },
    { title: "The Silent Patient", author: "Alex Michaelides", category: "Mystery" },
    { title: "Educated", author: "Tara Westover", category: "Memoir" },
    { title: "Sapiens", author: "Yuval Noah Harari", category: "History" },
    { title: "Why We Sleep", author: "Matthew Walker", category: "Health" },
    { title: "The Lean Startup", author: "Eric Ries", category: "Business" },
    { title: "Hidden Figures", author: "Margot Lee Shetterly", category: "Biography" },
    { title: "The Psychology of Money", author: "Morgan Housel", category: "Finance" },
    { title: "The Death and Life of Great American Cities", author: "Jane Jacobs", category: "Urbanism" },
    { title: "How Buildings Learn", author: "Stewart Brand", category: "Architecture" },
    { title: "The Story of Art", author: "E. H. Gombrich", category: "History" },
    { title: "On the Origin of Species", author: "Charles Darwin", category: "Science" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction" },
    { title: "The Book Thief", author: "Markus Zusak", category: "Drama" }
  ];

  function getCategoryFallbackImage(category) {
    const map = {
      architecture: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=420&q=80",
      urbanism: "https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=420&q=80",
      design: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=420&q=80",
      productivity: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=420&q=80",
      history: "https://images.unsplash.com/photo-1455885666463-9ea6be0b1784?auto=format&fit=crop&w=420&q=80",
      science: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=420&q=80",
      fiction: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=420&q=80"
    };

    return map[String(category || "").toLowerCase()] || "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=420&q=80";
  }

  function buildGlobalSearchCatalog() {
    const map = new Map();

    books.forEach(function (bookCard) {
      const title = bookCard.querySelector("h3")?.textContent?.trim() || "";
      const author = bookCard.querySelector(".author")?.textContent?.trim() || "";
      const category = bookCard.querySelector(".cat")?.textContent?.trim() || "";
      const image = bookCard.querySelector("img")?.src || "";
      if (!title) {
        return;
      }

      map.set(normalizeTitleKey(title), {
        title: title,
        author: author,
        category: category,
        image: image,
        description: bookDescriptions[title] || "A notable work in architectural and design literature."
      });
    });

    extraSearchCatalog.forEach(function (item) {
      const key = normalizeTitleKey(item.title);
      if (!key || map.has(key)) {
        return;
      }

      map.set(key, {
        title: item.title,
        author: item.author,
        category: item.category,
        image: getCategoryFallbackImage(item.category),
        description: bookDescriptions[item.title] || "Available in the BrainRoot library collection."
      });
    });

    return Array.from(map.values());
  }

  const globalCatalog = buildGlobalSearchCatalog();

  function isPaidSubscriber() {
    if (window.brainrootAuth && typeof window.brainrootAuth.isPaidSubscriber === "function") {
      return window.brainrootAuth.isPaidSubscriber();
    }

    return false;
  }

  function getBookAccess(title) {
    if (window.brainrootAuth && typeof window.brainrootAuth.getBookAccess === "function") {
      return window.brainrootAuth.getBookAccess(title);
    }

    return "free";
  }

  function resetActionButtonState(button, defaultText) {
    if (!button) {
      return;
    }

    button.textContent = defaultText;
    button.disabled = false;
    button.style.opacity = "";
    button.style.pointerEvents = "";
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    books.forEach(function (book) {
      const category = (book.querySelector(".cat")?.textContent || "").toLowerCase();
      const title = (book.querySelector("h3")?.textContent || "").toLowerCase();
      const author = (book.querySelector(".author")?.textContent || "").toLowerCase();

      const matchesCategory = !activeCategory || category === activeCategory;
      const matchesQuery =
        !query || title.includes(query) || author.includes(query) || category.includes(query);

      book.style.display = matchesCategory && matchesQuery ? "block" : "none";
    });
  }

  function openBookModalFromData(bookData) {
    const title = String(bookData.title || "").trim();
    const author = String(bookData.author || "").trim();
    const category = String(bookData.category || "General").trim();
    const image = String(bookData.image || getCategoryFallbackImage(category));
    const description = String(bookData.description || bookDescriptions[title] || "A notable work in architectural and design literature.");
    const access = getBookAccess(title);
    const paidBookLocked = access === "paid" && !isPaidSubscriber();

    // Populate modal
    document.getElementById("modalBookTitle").textContent = title;
    document.getElementById("modalBookAuthor").textContent = author;
    document.getElementById("modalBookCategory").textContent = category;
    document.getElementById("modalBookDesc").textContent = description;
    
    const modalImage = document.getElementById("modalBookImage");
    modalImage.src = image;

    const modal = document.getElementById("bookModal");
    modal.dataset.bookAccess = access;

    // Update access badge
    const accessBadge = document.getElementById("modalAccessBadge");
    accessBadge.textContent = access.toUpperCase();
    accessBadge.className = "access-badge";
    accessBadge.classList.add(access);

    const addCollectionBtn = document.getElementById("addToCollectionBtn");
    const addWishlistBtn = document.getElementById("addToWishlistBtn");
    const upgradePlanBtn = document.getElementById("upgradePlanBtn");
    const accessNote = document.getElementById("modalAccessNote");
    resetActionButtonState(addCollectionBtn, "Add to Collection");
    resetActionButtonState(addWishlistBtn, "Add to Wishlist");

    if (upgradePlanBtn) {
      upgradePlanBtn.classList.add("hidden");
      upgradePlanBtn.onclick = null;
    }

    if (accessNote) {
      accessNote.classList.add("hidden");
      accessNote.textContent = "";
    }

    if (addCollectionBtn && paidBookLocked) {
      addCollectionBtn.textContent = "Subscription Required";
      addCollectionBtn.disabled = true;
      addCollectionBtn.style.opacity = "0.65";
      addCollectionBtn.style.pointerEvents = "none";

      if (upgradePlanBtn) {
        upgradePlanBtn.classList.remove("hidden");
        upgradePlanBtn.onclick = function () {
          window.location.href = "../profile/profile.html";
        };
      }

      if (accessNote) {
        accessNote.textContent = "This is a paid book. Upgrade your plan in Profile to unlock collection access.";
        accessNote.classList.remove("hidden");
      }
    }

    // Show modal
    document.getElementById("bookModal").classList.remove("hidden");
  }

  function openBookModal(book) {
    const modalData = {
      title: book.querySelector("h3")?.textContent?.trim() || "",
      author: book.querySelector(".author")?.textContent?.trim() || "",
      category: book.querySelector(".cat")?.textContent?.trim() || "",
      image: book.querySelector("img")?.src || ""
    };

    openBookModalFromData(modalData);
  }

  function hideLiveSearchPanel() {
    if (searchPanel) {
      searchPanel.classList.remove("show");
      searchPanel.innerHTML = "";
    }
  }

  function renderLiveSearchResults(query) {
    if (!searchPanel) {
      return;
    }

    const q = String(query || "").trim().toLowerCase();
    if (!q) {
      hideLiveSearchPanel();
      return;
    }

    const matches = globalCatalog.filter(function (item) {
      const text = [item.title, item.author, item.category].join(" ").toLowerCase();
      return text.includes(q);
    }).slice(0, 8);

    searchPanel.innerHTML = "";

    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "search-live-empty";
      empty.textContent = 'No books matched "' + query.trim() + '".';
      searchPanel.appendChild(empty);
      searchPanel.classList.add("show");
      return;
    }

    matches.forEach(function (item) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-live-item";
      button.innerHTML =
        '<img src="' + item.image + '" alt="' + item.title + '">' +
        '<div class="search-live-copy">' +
        '<p class="search-live-title">' + item.title + '</p>' +
        '<p class="search-live-meta">' + item.author + ' · ' + item.category + '</p>' +
        '</div>';
      button.addEventListener("click", function () {
        openBookModalFromData(item);
        searchInput.value = item.title;
        hideLiveSearchPanel();
      });
      searchPanel.appendChild(button);
    });

    searchPanel.classList.add("show");
  }

  function closeBookModal() {
    document.getElementById("bookModal").classList.add("hidden");
  }

  function refreshOpenModalSubscriptionState() {
    const modalElement = document.getElementById("bookModal");
    if (!modalElement || modalElement.classList.contains("hidden")) {
      return;
    }

    const access = modalElement.dataset.bookAccess || "free";
    const addCollectionBtn = document.getElementById("addToCollectionBtn");
    const upgradePlanBtn = document.getElementById("upgradePlanBtn");
    if (!addCollectionBtn) {
      return;
    }

    if (access === "paid" && !isPaidSubscriber()) {
      addCollectionBtn.textContent = "Subscription Required";
      addCollectionBtn.disabled = true;
      addCollectionBtn.style.opacity = "0.65";
      addCollectionBtn.style.pointerEvents = "none";
      if (upgradePlanBtn) {
        upgradePlanBtn.classList.remove("hidden");
      }
      const accessNote = document.getElementById("modalAccessNote");
      if (accessNote) {
        accessNote.textContent = "This is a paid book. Upgrade your plan in Profile to unlock collection access.";
        accessNote.classList.remove("hidden");
      }
      return;
    }

    if (addCollectionBtn.textContent !== "Added to Collection ✓") {
      resetActionButtonState(addCollectionBtn, "Add to Collection");
    }

    if (upgradePlanBtn) {
      upgradePlanBtn.classList.add("hidden");
    }

    const accessNote = document.getElementById("modalAccessNote");
    if (accessNote) {
      accessNote.classList.add("hidden");
      accessNote.textContent = "";
    }
  }

  // Modal close button
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeBookModal);
  }

  // Modal backdrop click
  const modal = document.getElementById("bookModal");
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeBookModal);
  }

  // Add to Collection button
  const addCollectionBtn = document.getElementById("addToCollectionBtn");
  if (addCollectionBtn) {
    addCollectionBtn.addEventListener("click", function () {
      if (window.brainrootAuth && !window.brainrootAuth.isLoggedIn()) {
        const loginUrl = window.brainrootAuth.buildLoginUrl(new URL("../collections/collections.html", window.location.href).href);
        window.location.href = loginUrl;
        return;
      }

      const title = document.getElementById("modalBookTitle").textContent;
      const author = document.getElementById("modalBookAuthor").textContent;
      const category = document.getElementById("modalBookCategory").textContent;
      const access = document.getElementById("bookModal")?.dataset?.bookAccess || "free";

      if (access === "paid" && !isPaidSubscriber()) {
        const accessNote = document.getElementById("modalAccessNote");
        if (accessNote) {
          accessNote.textContent = "This is a paid book. Upgrade your plan in Profile to add it to your collection.";
          accessNote.classList.remove("hidden");
        }
        return;
      }

      // Get current collections
      const collections = JSON.parse(localStorage.getItem("brainrootCollections") || "[]");
      const normalizedTitle = String(title || "").trim().toLowerCase();

      function getCollectionEntryTitle(entry) {
        if (typeof entry === "string") {
          return entry;
        }

        if (entry && typeof entry === "object") {
          return entry.title;
        }

        return "";
      }

      function getCollectionLimit() {
        if (window.brainrootAuth && typeof window.brainrootAuth.getCollectionLimit === "function") {
          return window.brainrootAuth.getCollectionLimit();
        }

        return 8;
      }

      function getPlanType() {
        if (window.brainrootAuth && typeof window.brainrootAuth.getPlanType === "function") {
          return window.brainrootAuth.getPlanType();
        }

        return "free";
      }

      function getPlanDisplayName(type) {
        const normalized = String(type || "free").toLowerCase();
        if (normalized === "basic") {
          return "Basic";
        }
        if (normalized === "standard") {
          return "Standard";
        }
        if (normalized === "premium") {
          return "Premium";
        }
        return "Free";
      }

      // Check if already added
      if (collections.some(function (entry) { return String(getCollectionEntryTitle(entry) || "").trim().toLowerCase() === normalizedTitle; })) {
        const accessNote = document.getElementById("modalAccessNote");
        if (accessNote) {
          accessNote.textContent = "This book is already in your collection.";
          accessNote.classList.remove("hidden");
        }
        return;
      }

      const limit = getCollectionLimit();
      if (Number.isFinite(limit) && collections.length >= limit) {
        const accessNote = document.getElementById("modalAccessNote");
        if (accessNote) {
          accessNote.textContent = "Collection limit reached for " + getPlanDisplayName(getPlanType()) + " plan (" + limit + " books). Upgrade plan from Profile.";
          accessNote.classList.remove("hidden");
        }
        return;
      }

      // Add to collection
      const bookImage = document.getElementById("modalBookImage")?.getAttribute("src") || "";
      collections.push({
        title: title,
        author: author,
        category: category,
        image: bookImage,
        access: access
      });
      localStorage.setItem("brainrootCollections", JSON.stringify(collections));

      // Record behavior
      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: title,
          author: author,
          category: category,
          source: "collection-add"
        });
      }

      // Provide feedback
      addCollectionBtn.textContent = "Added to Collection ✓";
      addCollectionBtn.disabled = true;
      addCollectionBtn.style.opacity = "0.6";
      addCollectionBtn.style.pointerEvents = "none";
      showHomeCollectionToast("Great choice. \"" + title + "\" is now in your collection.");

      // Redirect after delay
      setTimeout(function () {
        showFakeLoading("Opening Collections...", 1200, function () {
          window.location.href = "../collections/collections.html";
        });
      }, 5000);
    });
  }

  // Add to Wishlist button
  const addWishlistBtn = document.getElementById("addToWishlistBtn");
  if (addWishlistBtn) {
    addWishlistBtn.addEventListener("click", function () {
      if (window.brainrootAuth && !window.brainrootAuth.isLoggedIn()) {
        const loginUrl = window.brainrootAuth.buildLoginUrl(new URL("../wishlist/wishlist.html", window.location.href).href);
        window.location.href = loginUrl;
        return;
      }

      const title = document.getElementById("modalBookTitle").textContent;

      // Get current wishlist
      const wishlist = JSON.parse(localStorage.getItem("brainrootWishlist") || "[]");

      // Check if already added
      if (wishlist.includes(title)) {
        const accessNote = document.getElementById("modalAccessNote");
        if (accessNote) {
          accessNote.textContent = "This book is already in your wishlist.";
          accessNote.classList.remove("hidden");
        }
        return;
      }

      // Add to wishlist
      wishlist.push(title);
      localStorage.setItem("brainrootWishlist", JSON.stringify(wishlist));

      // Provide feedback
      addWishlistBtn.textContent = "Added to Wishlist ✓";
      addWishlistBtn.disabled = true;
      addWishlistBtn.style.opacity = "0.6";
      addWishlistBtn.style.pointerEvents = "none";
    });
  }

  searchInput.addEventListener("input", function () {
    applyFilters();
    renderLiveSearchResults(searchInput.value);
  });

  searchInput.addEventListener("focus", function () {
    renderLiveSearchResults(searchInput.value);
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideLiveSearchPanel();
      searchInput.blur();
    }
  });

  document.addEventListener("click", function (event) {
    if (searchBox && !searchBox.contains(event.target)) {
      hideLiveSearchPanel();
    }
  });

  chipButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selected = button.textContent.trim().toLowerCase();
      activeCategory = activeCategory === selected ? "" : selected;

      chipButtons.forEach(function (chip) {
        const isActive = chip === button && activeCategory;
        chip.setAttribute("aria-pressed", String(Boolean(isActive)));
        chip.style.opacity = isActive ? "1" : "0.75";
      });

      applyFilters();
    });
  });

  books.forEach(function (book) {
    book.addEventListener("click", function () {
      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: book.querySelector("h3")?.textContent?.trim() || "Featured book",
          author: book.querySelector(".author")?.textContent?.trim() || "",
          category: book.querySelector(".cat")?.textContent?.trim() || "",
          source: "home"
        });
      }

      openBookModal(book);
    });
    book.style.cursor = "pointer";
  });

  // RECOMMENDED FOR YOU SECTION
  function renderRecommendedBooks() {
    const recommendedGrid = document.getElementById("recommendedGrid");
    if (!recommendedGrid) {
      return;
    }

    // Get a random selection of books from featured + extra catalog
    const allRecommended = globalCatalog.slice().sort(() => 0.5 - Math.random()).slice(0, 6);

    recommendedGrid.innerHTML = "";

    allRecommended.forEach(function (book) {
      const article = document.createElement("article");
      article.className = "recommended-book-card";

      const title = book.title || "";
      const author = book.author || "";
      const category = book.category || "";
      const image = book.image || getCategoryFallbackImage(category);
      const access = getBookAccess(title);

      article.innerHTML =
        '<img src="' + image + '" alt="' + title + '">' +
        '<span class="badge ' + access + '">' + access.toUpperCase() + '</span>' +
        '<p class="cat">' + category + '</p>' +
        '<h3>' + title + '</h3>' +
        '<p class="author">' + author + '</p>' +
        '<div class="card-actions">' +
        '<button class="btn-view-book" type="button">View Book</button>' +
        '<button class="btn-borrow" type="button">Borrow</button>' +
        '</div>';

      const viewBtn = article.querySelector(".btn-view-book");
      const borrowBtn = article.querySelector(".btn-borrow");

      // View Book button - opens modal
      viewBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openBookModalFromData(book);
      });

      // Borrow button - direct borrow
      borrowBtn.addEventListener("click", function (e) {
        e.stopPropagation();

        // Check login
        if (window.brainrootAuth && !window.brainrootAuth.isLoggedIn()) {
          const loginUrl = window.brainrootAuth.buildLoginUrl(new URL("../explore/explore.html", window.location.href).href);
          window.location.href = loginUrl;
          return;
        }

        // Check if already borrowed
        const borrowed = JSON.parse(localStorage.getItem("brainrootBorrowed") || "[]");
        if (borrowed.includes(title)) {
          borrowBtn.textContent = "Already Borrowed ✓";
          borrowBtn.disabled = true;
          borrowBtn.style.opacity = "0.6";
          borrowBtn.style.pointerEvents = "none";
          showHomeCollectionToast("This book is already in your borrowed list.");
          return;
        }

        // Check if paid subscriber access required
        if (access === "paid" && !isPaidSubscriber()) {
          borrowBtn.textContent = "Subscription Required";
          borrowBtn.disabled = true;
          borrowBtn.style.opacity = "0.6";
          borrowBtn.style.pointerEvents = "none";
          showHomeCollectionToast("This is a paid book. Upgrade your plan to borrow it.");
          return;
        }

        // Add to borrowed
        borrowed.push(title);
        localStorage.setItem("brainrootBorrowed", JSON.stringify(borrowed));

        // Update button state
        borrowBtn.textContent = "Borrowed ✓";
        borrowBtn.disabled = true;
        borrowBtn.style.opacity = "0.6";
        borrowBtn.style.pointerEvents = "none";

        showHomeCollectionToast('"' + title + '" added to your borrowed books. Due date: 14 days from now.');
      });

      recommendedGrid.appendChild(article);
    });
  }

  renderRecommendedBooks();

  window.addEventListener("storage", function (event) {
    if (event.key === "brainrootSubscription" || event.key === "brainrootSubscriptionsByUser") {
      refreshOpenModalSubscriptionState();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      refreshOpenModalSubscriptionState();
    }
  });

  window.addEventListener("brainroot:subscription-updated", function () {
    refreshOpenModalSubscriptionState();
  });
});


