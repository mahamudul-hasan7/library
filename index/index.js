document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-box input");
  const chipButtons = Array.from(document.querySelectorAll(".chips button"));
  const books = Array.from(document.querySelectorAll(".featured .book"));

  if (!searchInput || books.length === 0) {
    return;
  }

  let activeCategory = "";

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

  function openBookModal(book) {
    const title = book.querySelector("h3")?.textContent?.trim() || "";
    const author = book.querySelector(".author")?.textContent?.trim() || "";
    const category = book.querySelector(".cat")?.textContent?.trim() || "";
    const image = book.querySelector("img")?.src || "";
    const description = bookDescriptions[title] || "A notable work in architectural and design literature.";
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

      // Check if already added
      if (collections.includes(title)) {
        const accessNote = document.getElementById("modalAccessNote");
        if (accessNote) {
          accessNote.textContent = "This book is already in your collection.";
          accessNote.classList.remove("hidden");
        }
        return;
      }

      // Add to collection
      collections.push(title);
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

      // Redirect after delay
      setTimeout(function () {
        window.location.href = "../collections/collections.html";
      }, 1200);
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

  searchInput.addEventListener("input", applyFilters);

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


