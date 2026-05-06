document.addEventListener("DOMContentLoaded", function () {
  const storage = window.brainrootStorage;

  document.body.classList.add("landing-ready");

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
      overlay.className = "home-loading-overlay";

      const card = document.createElement("div");
      card.className = "loading-card";

      const spinner = document.createElement("span");
      spinner.className = "loading-spinner";

      const text = document.createElement("span");
      text.id = "homeLoadingText";

      card.appendChild(spinner);
      card.appendChild(text);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }

    const textNode = document.getElementById("homeLoadingText");
    if (textNode) {
      textNode.textContent = message || "Loading...";
    }

    overlay.classList.add("show");
    setTimeout(function () {
      overlay.classList.remove("show");
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
    button.classList.remove("is-action-disabled", "is-action-locked");
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

      book.hidden = !(matchesCategory && matchesQuery);
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

    
    document.getElementById("modalBookTitle").textContent = title;
    document.getElementById("modalBookAuthor").textContent = author;
    document.getElementById("modalBookCategory").textContent = category;
    document.getElementById("modalBookDesc").textContent = description;
    
    const modalImage = document.getElementById("modalBookImage");
    modalImage.src = image;

    const modal = document.getElementById("bookModal");
    modal.dataset.bookAccess = access;

    
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
    }

    if (accessNote) {
      accessNote.classList.add("hidden");
      accessNote.textContent = "";
    }

    if (addCollectionBtn && paidBookLocked) {
      addCollectionBtn.textContent = "Subscription Required";
      addCollectionBtn.disabled = true;
      addCollectionBtn.classList.add("is-action-locked");

      if (upgradePlanBtn) {
        upgradePlanBtn.classList.remove("hidden");
      }

      if (accessNote) {
        accessNote.textContent = "This is a paid book. Upgrade your plan in Profile to unlock collection access.";
        accessNote.classList.remove("hidden");
      }
    }

    
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
      searchPanel.replaceChildren();
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

    searchPanel.replaceChildren();

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
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title;

      const copy = document.createElement("div");
      copy.className = "search-live-copy";

      const title = document.createElement("p");
      title.className = "search-live-title";
      title.textContent = item.title;

      const meta = document.createElement("p");
      meta.className = "search-live-meta";
      meta.textContent = item.author + " � " + item.category;

      copy.appendChild(title);
      copy.appendChild(meta);
      button.appendChild(image);
      button.appendChild(copy);
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
      addCollectionBtn.classList.add("is-action-locked");
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

    if (addCollectionBtn.textContent !== "Added to Collection ?") {
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

  
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeBookModal);
  }

  
  const modal = document.getElementById("bookModal");
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeBookModal);
  }

  const upgradePlanButton = document.getElementById("upgradePlanBtn");
  if (upgradePlanButton) {
    upgradePlanButton.addEventListener("click", function () {
      window.location.href = "../profile/profile.html";
    });
  }

  
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

      
      const collections = storage.readJson("brainrootCollections", []);
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

      
      const bookImage = document.getElementById("modalBookImage")?.getAttribute("src") || "";
      collections.push({
        title: title,
        author: author,
        category: category,
        image: bookImage,
        access: access
      });
      storage.writeJson("brainrootCollections", collections);

      
      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: title,
          author: author,
          category: category,
          source: "collection-add"
        });
      }

      
      addCollectionBtn.textContent = "Added to Collection ?";
      addCollectionBtn.disabled = true;
      addCollectionBtn.classList.add("is-action-disabled");
      showHomeCollectionToast("Great choice. \"" + title + "\" is now in your collection.");

      
      setTimeout(function () {
        showFakeLoading("Opening Collections...", 1200, function () {
          window.location.href = "../collections/collections.html";
        });
      }, 5000);
    });
  }

  
  const addWishlistBtn = document.getElementById("addToWishlistBtn");
  if (addWishlistBtn) {
    addWishlistBtn.addEventListener("click", function () {
      if (window.brainrootAuth && !window.brainrootAuth.isLoggedIn()) {
        const loginUrl = window.brainrootAuth.buildLoginUrl(new URL("../wishlist/wishlist.html", window.location.href).href);
        window.location.href = loginUrl;
        return;
      }

      const title = document.getElementById("modalBookTitle").textContent;

      
      const wishlist = storage.readJson("brainrootWishlist", []);

      
      if (wishlist.includes(title)) {
        const accessNote = document.getElementById("modalAccessNote");
        if (accessNote) {
          accessNote.textContent = "This book is already in your wishlist.";
          accessNote.classList.remove("hidden");
        }
        return;
      }

      
      wishlist.push(title);
      storage.writeJson("brainrootWishlist", wishlist);

      
      addWishlistBtn.textContent = "Added to Wishlist ?";
      addWishlistBtn.disabled = true;
      addWishlistBtn.classList.add("is-action-disabled");
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
        chip.classList.toggle("is-muted", !isActive);
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
  });

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



