document.addEventListener("DOMContentLoaded", function () {
  const storage = window.brainrootStorage;

  if (!window.brainrootAuth || !window.brainrootAuth.requireLogin("Please login to access collections.")) {
    return;
  }

  const collectionKey = "brainrootCollections";
  const wishlistKey = "brainrootWishlist";
  const removalKey = "brainrootCollectionRotations";
  const toastId = "collectionsToast";
  const recommendationLimit = 8;
  const initialRecommendationVisibleCount = 3;
  const defaultCollections = [
    "Metropolitan Tunnels",
    "Concrete Poetry",
    "Vascular Cities",
    "Silent Archives"
  ];
  const fallbackCollectionCovers = [
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
  ];

  const bookCatalog = [
    {
      title: "Metropolitan Tunnels",
      author: "Urban Systems Review",
      category: "Architecture",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80",
      summary: "Exploration of underground infrastructure and transit systems in modern cities.",
      progress: 60,
      importance: 88,
      tags: ["architecture", "urbanism", "infrastructure"]
    },
    {
      title: "Concrete Poetry",
      author: "Tadao Ando",
      category: "Theory",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80",
      summary: "Study of concrete as both material and metaphor in contemporary architecture.",
      progress: 40,
      importance: 86,
      tags: ["minimalism", "architecture", "theory"]
    },
    {
      title: "Vascular Cities",
      author: "Urban Planning Journal",
      category: "Urbanism",
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=700&q=80",
      summary: "Urban planning through the lens of organic systems and circulatory networks.",
      progress: 80,
      importance: 83,
      tags: ["urbanism", "systems", "architecture"]
    },
    {
      title: "Silent Archives",
      author: "Curation Lab",
      category: "History",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80",
      summary: "Curation practices and archival theory in the digital age.",
      progress: 25,
      importance: 77,
      tags: ["history", "archives", "research"]
    },
    {
      title: "The Geometry of Silence",
      author: "Elena V. Kostova",
      category: "Architecture",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=80",
      summary: "A definitive exploration of minimalist structural design in post-war Europe.",
      progress: 56,
      importance: 98,
      tags: ["architecture", "minimalism", "design"]
    },
    {
      title: "Structure & Light",
      author: "Louis Kahn",
      category: "Architecture",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=700&q=80",
      summary: "The definitive study of structure, light, and spiritual form in architecture.",
      progress: 68,
      importance: 92,
      tags: ["architecture", "light", "theory"]
    },
    {
      title: "Urban Metabolism",
      author: "Kenzo Tange",
      category: "Urbanism",
      image: "https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=700&q=80",
      summary: "A groundbreaking exploration of mega-structure design and urban renewal.",
      progress: 34,
      importance: 91,
      tags: ["urbanism", "systems", "design"]
    },
    {
      title: "The Modular Man",
      author: "Le Corbusier",
      category: "Design",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&q=80",
      summary: "A foundational text on proportion systems and the human scale in design.",
      progress: 47,
      importance: 89,
      tags: ["design", "proportion", "architecture"]
    },
    {
      title: "Nordic Pavilions",
      author: "Alvar Aalto",
      category: "Architecture",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=700&q=80",
      summary: "A detailed study of pavilion design and humanistic modernism in the Nordic region.",
      progress: 72,
      importance: 85,
      tags: ["architecture", "humanism", "nature"]
    },
    {
      title: "The Grid System in Digital Ethics",
      author: "Mara Feld",
      category: "Design",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80",
      summary: "A sharp look at digital order, visual systems, and ethical interface design.",
      progress: 29,
      importance: 84,
      tags: ["design", "digital", "ethics"]
    },
    {
      title: "The Alexandrian Echo",
      author: "Noura Khalil",
      category: "History",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80",
      summary: "A historical reconstruction of library culture, memory, and preservation.",
      progress: 53,
      importance: 79,
      tags: ["history", "archives", "research"]
    },
    {
      title: "Machine Learning for Curators",
      author: "J. H. Mercer",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80",
      summary: "How machine intelligence can support cataloging, discovery, and curation.",
      progress: 31,
      importance: 90,
      tags: ["technology", "curation", "research"]
    },
    {
      title: "Spatial Dialectics",
      author: "Unknown Author",
      category: "Theory",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80",
      summary: "An exploration of spatial relationships through phenomenological lenses.",
      progress: 67,
      importance: 95,
      tags: ["theory", "space", "architecture"]
    },
    {
      title: "Bauhaus Theory",
      author: "Unknown Author",
      category: "History",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=700&q=80",
      summary: "The revolutionary design philosophy that reshaped art, architecture, and industry.",
      progress: 44,
      importance: 87,
      tags: ["history", "design", "architecture"]
    },
    {
      title: "Organic Forms",
      author: "Unknown Author",
      category: "Design",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=80",
      summary: "Biomorphic design language and the influence of natural forms on contemporary space.",
      progress: 55,
      importance: 81,
      tags: ["design", "nature", "architecture"]
    },
    {
      title: "Curvature",
      author: "Unknown Author",
      category: "Design",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80",
      summary: "A visual exploration of curved form, movement, and architectural perception.",
      progress: 38,
      importance: 76,
      tags: ["design", "form", "architecture"]
    },
    {
      title: "Zen Planning",
      author: "Unknown Author",
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80",
      summary: "Minimalism and balance applied to urban design and restorative environments.",
      progress: 49,
      importance: 74,
      tags: ["wellness", "design", "minimalism"]
    },
    {
      title: "Kinetic Cities",
      author: "Unknown Author",
      category: "Urbanism",
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=700&q=80",
      summary: "A study of movement, commerce, and cultural change inside living urban systems.",
      progress: 52,
      importance: 75,
      tags: ["urbanism", "movement", "systems"]
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Productivity",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
      summary: "Tiny changes that compound into remarkable results and stronger routines.",
      progress: 22,
      importance: 82,
      tags: ["productivity", "habits", "self-improvement"]
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Mystery",
      image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=500&q=80",
      summary: "A psychological thriller built around obsession, silence, and revelation.",
      progress: 18,
      importance: 80,
      tags: ["mystery", "thriller", "fiction"]
    },
    {
      title: "Educated",
      author: "Tara Westover",
      category: "Memoir",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=500&q=80",
      summary: "A story of self-determination, education, and transformation.",
      progress: 26,
      importance: 79,
      tags: ["memoir", "education", "growth"]
    },
    {
      title: "Why We Sleep",
      author: "Matthew Walker",
      category: "Health",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80",
      summary: "A practical look at sleep science, performance, and longevity.",
      progress: 28,
      importance: 78,
      tags: ["health", "science", "wellness"]
    },
    {
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      category: "Drama",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
      summary: "A powerful story of friendship, guilt, and redemption.",
      progress: 30,
      importance: 77,
      tags: ["drama", "fiction", "literature"]
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      category: "Sci-Fi",
      image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=500&q=80",
      summary: "Politics, ecology, and power on the desert planet Arrakis.",
      progress: 35,
      importance: 84,
      tags: ["sci-fi", "ecology", "fiction"]
    }
  ];

  bookCatalog.forEach(function (book) {
    book.image = getStableImageUrl(book.image, book.title);
    book.access = window.brainrootAuth?.getBookAccess?.(book.title) || "free";
  });

  const catalogByTitle = bookCatalog.reduce(function (accumulator, book) {
    accumulator[normalizeKey(book.title)] = book;
    return accumulator;
  }, {});

  const collectionsList = document.getElementById("collectionsList");
  const recommendationsList = document.getElementById("recommendationsList");
  const collectionsEmptyState = document.getElementById("collectionsEmptyState");
  const collectionsRootColumn = collectionsList ? collectionsList.parentElement : null;
  let recommendationsExpanded = false;

  function getPlanType() {
    if (window.brainrootAuth && typeof window.brainrootAuth.getPlanType === "function") {
      return window.brainrootAuth.getPlanType();
    }

    return "free";
  }

  function getCollectionLimit() {
    if (window.brainrootAuth && typeof window.brainrootAuth.getCollectionLimit === "function") {
      return window.brainrootAuth.getCollectionLimit();
    }

    return 8;
  }

  function getCollectionLimitLabel(limit) {
    return Number.isFinite(limit) ? String(limit) : "Unlimited";
  }

  function getPlanDisplay(planType) {
    const normalized = String(planType || "free").toLowerCase();

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

  function isCollectionLimitReached(collectionEntries) {
    const limit = getCollectionLimit();
    if (!Number.isFinite(limit)) {
      return false;
    }

    return collectionEntries.length >= limit;
  }

  function getLimitReachedMessage() {
    const planType = getPlanType();
    const limit = getCollectionLimit();
    return "Collection limit reached for " + getPlanDisplay(planType) + " plan (" + getCollectionLimitLabel(limit) + " books). Upgrade plan from Profile to add more.";
  }

  function renderCollectionLimitNote(collectionEntries) {
    if (!collectionsRootColumn || !collectionsEmptyState) {
      return;
    }

    let note = document.getElementById("collectionsLimitNote");
    if (!note) {
      note = document.createElement("div");
      note.id = "collectionsLimitNote";
      note.className = "collections-limit-note";
      collectionsRootColumn.insertBefore(note, collectionsEmptyState);
    }

    const planType = getPlanType();
    const limit = getCollectionLimit();
    const reached = isCollectionLimitReached(collectionEntries);
    const used = collectionEntries.length;

    note.classList.toggle("is-limit-reached", reached);
    note.textContent =
      "Plan: " + getPlanDisplay(planType) +
      " | Collections: " + used + " / " + getCollectionLimitLabel(limit) +
      (reached ? " | Limit Reached" : "");
  }

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function isPaidSubscriber() {
    if (window.brainrootAuth && typeof window.brainrootAuth.isPaidSubscriber === "function") {
      return window.brainrootAuth.isPaidSubscriber();
    }

    return false;
  }

  function isPaidBook(book) {
    return normalizeKey(book?.access) === "paid";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readJson(storageKey, fallback) {
    const parsed = storage.readJson(storageKey, null);
    return Array.isArray(parsed) ? parsed : fallback;
  }

  function hashValue(value) {
    return String(value || "").split("").reduce(function (accumulator, char) {
      return (accumulator * 31 + char.charCodeAt(0)) >>> 0;
    }, 17);
  }

  function getFallbackCoverForTitle(title) {
    return fallbackCollectionCovers[hashValue(title) % fallbackCollectionCovers.length];
  }

  function getProgressClass(progress) {
    const value = Math.max(10, Math.min(100, Number(progress) || 30));
    const rounded = Math.max(10, Math.min(100, Math.round(value / 10) * 10));
    return "progress-width-" + rounded;
  }

  function isTemporaryImageUrl(value) {
    return String(value || "").includes("lh3.googleusercontent.com/aida-public");
  }

  function getStableImageUrl(value, title) {
    const source = String(value || "").trim();
    if (!source || isTemporaryImageUrl(source)) {
      return getFallbackCoverForTitle(title);
    }

    return source;
  }

  function applyImageFallback(image, title) {
    if (!image) {
      return;
    }

    const fallback = getFallbackCoverForTitle(title || image.alt || "book");
    image.onerror = function () {
      if (image.src !== fallback) {
        image.src = fallback;
      }
    };

    if (image.complete && image.naturalWidth === 0) {
      image.src = fallback;
    }
  }

  function getCollectionTitle(entry) {
    if (typeof entry === "string") {
      return String(entry).trim();
    }

    if (entry && typeof entry === "object") {
      return String(entry.title || "").trim();
    }

    return "";
  }

  function normalizeCollectionEntry(entry) {
    const title = getCollectionTitle(entry);
    if (!title) {
      return null;
    }

    const source = entry && typeof entry === "object" ? entry : {};
    const catalogMeta = catalogByTitle[normalizeKey(title)] || {};
    const sourceImage = source.image || source.imageUrl || catalogMeta.image;

    return {
      title: title,
      author: String(source.author || catalogMeta.author || "Unknown").trim(),
      category: String(source.category || catalogMeta.category || "General").trim(),
      image: String(getStableImageUrl(sourceImage, title)).trim(),
      summary: String(source.summary || catalogMeta.summary || "A saved title from your library.").trim(),
      progress: Number(source.progress || catalogMeta.progress || 32),
      access: String(source.access || catalogMeta.access || window.brainrootAuth?.getBookAccess?.(title) || "free").trim(),
      tags: Array.isArray(source.tags) ? source.tags : (Array.isArray(catalogMeta.tags) ? catalogMeta.tags : ["general"]),
      importance: Number(source.importance || catalogMeta.importance || 60)
    };
  }

  function showToast(message) {
    const hasConfig = message && typeof message === "object";
    const toastMessage = hasConfig ? String(message.text || "") : String(message || "");
    const actionLabel = hasConfig ? String(message.actionLabel || "") : "";
    const actionHandler = hasConfig ? message.onAction : null;

    let toast = document.getElementById(toastId);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = toastId;
      toast.className = "collections-toast";
      document.body.appendChild(toast);
    }

    toast.replaceChildren();
    const textNode = document.createElement("span");
    textNode.textContent = toastMessage;
    toast.appendChild(textNode);

    if (actionLabel && typeof actionHandler === "function") {
      const actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.className = "collections-toast-action";
      actionButton.textContent = actionLabel;
      actionButton.addEventListener("click", function () {
        actionHandler();
        toast.classList.remove("show");
      });
      toast.appendChild(actionButton);
    }

    toast.classList.add("show");

    clearTimeout(window.__collectionsToastTimer);
    window.__collectionsToastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 5000);
  }

  function getReturnModal() {
    let overlay = document.getElementById("returnModalOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "returnModalOverlay";
      overlay.className = "return-modal-overlay";

      const modal = document.createElement("div");
      modal.className = "return-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Return confirmation");

      const body = document.createElement("div");
      body.className = "return-modal-body";
      const coverWrap = document.createElement("div");
      coverWrap.className = "return-modal-cover";
      const cover = document.createElement("img");
      cover.id = "returnModalCover";
      cover.alt = "Book cover";
      coverWrap.appendChild(cover);

      const copy = document.createElement("div");
      copy.className = "return-modal-copy";
      const title = document.createElement("h3");
      title.id = "returnModalTitle";
      title.textContent = "Return this book?";
      const message = document.createElement("p");
      message.id = "returnModalMessage";
      copy.appendChild(title);
      copy.appendChild(message);
      body.appendChild(coverWrap);
      body.appendChild(copy);

      const actions = document.createElement("div");
      actions.className = "return-modal-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "return-modal-btn";
      cancel.dataset.returnModal = "cancel";
      cancel.textContent = "Keep in Collection";
      const confirm = document.createElement("button");
      confirm.type = "button";
      confirm.className = "return-modal-btn return-modal-btn--primary";
      confirm.dataset.returnModal = "confirm";
      confirm.textContent = "Return Book";
      actions.appendChild(cancel);
      actions.appendChild(confirm);

      modal.appendChild(body);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      cancel.addEventListener("click", function () {
        if (typeof overlay.__closeModal === "function") {
          overlay.__closeModal();
        }
      });
      confirm.addEventListener("click", function () {
        if (typeof overlay.__closeModal === "function") {
          overlay.__closeModal();
        }
        if (typeof overlay.__confirmHandler === "function") {
          overlay.__confirmHandler();
        }
      });
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay && typeof overlay.__closeModal === "function") {
          overlay.__closeModal();
        }
      });

      document.body.appendChild(overlay);
    }

    return overlay;
  }

  function openReturnModal(book, onConfirm) {
    const overlay = getReturnModal();
    const cover = overlay.querySelector("#returnModalCover");
    const title = overlay.querySelector("#returnModalTitle");
    const message = overlay.querySelector("#returnModalMessage");

    if (cover) {
      cover.src = getStableImageUrl(book.image, book.title);
      applyImageFallback(cover, book.title);
    }

    if (title) {
      title.textContent = 'Return "' + book.title + '"?';
    }

    if (message) {
      message.textContent = "This will remove the book from your collection list. You can still add it again later anytime.";
    }

    function closeModal() {
      overlay.classList.remove("show");
      overlay.__confirmHandler = null;
    }

    overlay.__closeModal = closeModal;
    overlay.__confirmHandler = onConfirm;

    overlay.classList.add("show");
  }

  function restoreReturnedBook(book) {
    const collectionEntries = getStoredCollections();
    const alreadyExists = collectionEntries.some(function (entry) {
      return normalizeKey(getCollectionTitle(entry)) === normalizeKey(book.title);
    });

    if (alreadyExists) {
      showToast('"' + book.title + '" is already in your collection.');
      return;
    }

    if (isCollectionLimitReached(collectionEntries)) {
      showToast(getLimitReachedMessage());
      return;
    }

    collectionEntries.unshift(normalizeCollectionEntry(book));
    saveStoredCollections(collectionEntries);
    clearRecentlyRemoved(book.title);
    
    
    const borrowedBooks = storage.readJson("brainrootBorrowed", []);
    if (borrowedBooks.indexOf(book.title) === -1) {
      borrowedBooks.push(book.title);
      storage.writeJson("brainrootBorrowed", borrowedBooks);
    }
    
    rerender();
    showToast('Restored "' + book.title + '" to your collection.');
  }

  function returnBookFlow(book, cardElement) {
    const collectionEntries = getStoredCollections();
    const bookToRemove = collectionEntries.find(function (item) {
      return normalizeKey(getCollectionTitle(item)) === normalizeKey(book.title);
    });
    const filteredEntries = collectionEntries.filter(function (item) {
      return normalizeKey(getCollectionTitle(item)) !== normalizeKey(book.title);
    });

    if (cardElement) {
      cardElement.classList.add("is-returning");
    }

    showFakeLoading("Processing return...", 950, function () {
      saveStoredCollections(filteredEntries);
      markRecentlyRemoved(book.title);
      
      
      const borrowedBooks = storage.readJson("brainrootBorrowed", []);
      const isBorrowed = borrowedBooks.indexOf(book.title) !== -1;
      if (isBorrowed) {
        const filteredBorrowed = borrowedBooks.filter(function (title) {
          return title !== book.title;
        });
        storage.writeJson("brainrootBorrowed", filteredBorrowed);
      }
      
      rerender();
      showToast({
        text: 'Done. "' + book.title + '" was returned from your collection.',
        actionLabel: "Undo",
        onAction: function () {
          if (bookToRemove) {
            restoreReturnedBook(bookToRemove);
          }
        }
      });
    });
  }

  function showFakeLoading(message, duration, onDone) {
    let overlay = document.getElementById("collectionsLoadingOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "collectionsLoadingOverlay";
      overlay.setAttribute("aria-live", "polite");
      overlay.className = "collections-loading-overlay";

      const card = document.createElement("div");
      card.className = "loading-card";

      const spinner = document.createElement("span");
      spinner.className = "loading-spinner";

      const text = document.createElement("span");
      text.id = "collectionsLoadingText";

      card.appendChild(spinner);
      card.appendChild(text);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }

    const textNode = document.getElementById("collectionsLoadingText");
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

  function getStoredCollections() {
    const savedValue = storage.getItem(collectionKey);

    if (savedValue === null) {
      const seeded = defaultCollections.map(normalizeCollectionEntry).filter(Boolean);
      storage.writeJson(collectionKey, seeded);
      return seeded;
    }

    try {
      const parsed = JSON.parse(savedValue || "[]");
      if (!Array.isArray(parsed)) {
        return [];
      }

      const unique = [];
      const seen = new Set();

      parsed.forEach(function (item) {
        const normalized = normalizeCollectionEntry(item);
        if (!normalized) {
          return;
        }

        const key = normalizeKey(normalized.title);
        if (!key || seen.has(key)) {
          return;
        }

        seen.add(key);
        unique.push(normalized);
      });

      if (JSON.stringify(parsed) !== JSON.stringify(unique)) {
        saveStoredCollections(unique);
      }

      return unique;
    } catch (error) {
      return [];
    }
  }

  function saveStoredCollections(items) {
    const unique = [];
    const seen = new Set();

    (Array.isArray(items) ? items : []).forEach(function (item) {
      const normalized = normalizeCollectionEntry(item);
      if (!normalized) {
        return;
      }

      const key = normalizeKey(normalized.title);
      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      unique.push(normalized);
    });

    storage.writeJson(collectionKey, unique);
  }

  function getWishlistTitles() {
    return readJson(wishlistKey, [])
      .map(function (entry) {
        if (typeof entry === "string") {
          return entry;
        }

        if (entry && typeof entry === "object") {
          return entry.title;
        }

        return "";
      })
      .filter(Boolean);
  }

  function readRemovalHistory() {
    try {
      const parsed = storage.readJson(removalKey, []);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveRemovalHistory(items) {
    storage.writeJson(removalKey, items);
  }

  function markRecentlyRemoved(title) {
    const cutoff = Date.now() - 1000 * 60 * 60 * 8;
    const history = readRemovalHistory().filter(function (entry) {
      return entry && entry.title && entry.timestamp >= cutoff;
    });

    history.unshift({ title: title, timestamp: Date.now() });
    saveRemovalHistory(history.slice(0, 12));
  }

  function clearRecentlyRemoved(title) {
    const normalizedTitle = normalizeKey(title);
    const history = readRemovalHistory().filter(function (entry) {
      return normalizeKey(entry?.title) !== normalizedTitle;
    });

    saveRemovalHistory(history);
  }

  function getPreferenceWeights(collectionEntries) {
    const weights = Object.create(null);
    const behavior = window.brainrootLibraryBehavior ? window.brainrootLibraryBehavior.getBookBehavior() : { views: [] };
    const recentViews = Array.isArray(behavior.views) ? behavior.views.slice(0, 12) : [];

    recentViews.forEach(function (view, index) {
      const weight = Math.max(1, 10 - index);
      const categoryKey = normalizeKey(view?.category);
      const titleKey = normalizeKey(view?.title);

      if (categoryKey) {
        weights[categoryKey] = (weights[categoryKey] || 0) + weight * 3;
      }

      if (titleKey) {
        weights[titleKey] = (weights[titleKey] || 0) + weight;
      }
    });

    collectionEntries.forEach(function (entry, index) {
      const book = normalizeCollectionEntry(entry);
      if (!book) {
        return;
      }

      const weight = Math.max(1, 5 - index);
      const categoryKey = normalizeKey(book.category);

      weights[categoryKey] = (weights[categoryKey] || 0) + weight * 2;

      (book.tags || []).forEach(function (tag) {
        const tagKey = normalizeKey(tag);
        weights[tagKey] = (weights[tagKey] || 0) + weight;
      });
    });

    return weights;
  }

  function getAvailableRecommendations(collectionEntries) {
    const collectionSet = new Set(
      collectionEntries
        .map(function (entry) {
          return normalizeKey(getCollectionTitle(entry));
        })
        .filter(Boolean)
    );
    const wishlistSet = new Set(getWishlistTitles().map(normalizeKey));
    const recentRemovalSet = new Set(
      readRemovalHistory()
        .filter(function (entry) {
          return entry && entry.timestamp >= Date.now() - 1000 * 60 * 60 * 8;
        })
        .map(function (entry) {
          return normalizeKey(entry.title);
        })
    );
    const preferenceWeights = getPreferenceWeights(collectionEntries);

    return bookCatalog
      .filter(function (book) {
        const titleKey = normalizeKey(book.title);
        return !collectionSet.has(titleKey) && !wishlistSet.has(titleKey) && !recentRemovalSet.has(titleKey);
      })
      .map(function (book) {
        const titleKey = normalizeKey(book.title);
        const categoryKey = normalizeKey(book.category);
        let score = book.importance || 0;

        score += (preferenceWeights[categoryKey] || 0) * 4;

        (book.tags || []).forEach(function (tag) {
          score += (preferenceWeights[normalizeKey(tag)] || 0) * 1.5;
        });

        score += (preferenceWeights[titleKey] || 0) * 1.2;

        return Object.assign({}, book, { score: score });
      })
      .sort(function (left, right) {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return (right.importance || 0) - (left.importance || 0);
      })
      .slice(0, recommendationLimit);
  }

  function getBookMeta(entryOrTitle) {
    const normalized = normalizeCollectionEntry(entryOrTitle);
    if (normalized) {
      return normalized;
    }

    const title = getCollectionTitle(entryOrTitle) || "Untitled Book";
    return {
      title: title,
      author: "Unknown",
      category: "General",
      image: getFallbackCoverForTitle(title),
      summary: "A saved title from your library.",
      progress: 32,
      importance: 60,
      tags: ["general"],
      access: window.brainrootAuth?.getBookAccess?.(title) || "free"
    };
  }

  function renderCollections(collectionEntries) {
    if (!collectionsList) {
      return;
    }

    collectionsList.replaceChildren();
    collectionsEmptyState.classList.toggle("hidden", collectionEntries.length > 0);

    if (collectionEntries.length === 0) {
      return;
    }

    collectionEntries.forEach(function (entry, index) {
      const book = getBookMeta(entry);
      const article = document.createElement("article");
      article.className = "collection-card";
      article.setAttribute("data-book-title", book.title);

      const cover = document.createElement("div");
      cover.className = "collection-cover";
      const image = document.createElement("img");
      image.alt = book.title;
      image.src = book.image;
      cover.appendChild(image);

      const body = document.createElement("div");
      body.className = "collection-body";
      const topLine = document.createElement("div");
      topLine.className = "collection-topline";
      const titleGroup = document.createElement("div");
      const category = document.createElement("span");
      category.className = "collection-category";
      category.textContent = book.category + " | " + String(book.access || "free").toUpperCase();
      const title = document.createElement("h3");
      title.className = "collection-title";
      title.textContent = book.title;
      titleGroup.appendChild(category);
      titleGroup.appendChild(title);

      const saved = document.createElement("span");
      saved.className = "collection-category";
      saved.textContent = "Saved " + String(index + 1).padStart(2, "0");
      topLine.appendChild(titleGroup);
      topLine.appendChild(saved);

      const summary = document.createElement("p");
      summary.className = "collection-copy";
      summary.textContent = book.summary;

      const progress = document.createElement("div");
      progress.className = "collection-progress " + getProgressClass(book.progress);
      progress.appendChild(document.createElement("span"));

      const actions = document.createElement("div");
      actions.className = "collection-actions";
      const readButton = document.createElement("button");
      readButton.type = "button";
      readButton.dataset.collectionAction = "read";
      readButton.className = "collection-action";
      readButton.textContent = "View Book";
      const returnButton = document.createElement("button");
      returnButton.type = "button";
      returnButton.dataset.collectionAction = "return";
      returnButton.className = "collection-action collection-action--ghost";
      returnButton.textContent = "Return";
      actions.appendChild(readButton);
      actions.appendChild(returnButton);

      body.appendChild(topLine);
      body.appendChild(summary);
      body.appendChild(progress);
      body.appendChild(actions);
      article.appendChild(cover);
      article.appendChild(body);

      collectionsList.appendChild(article);
      applyImageFallback(article.querySelector(".collection-cover img"), book.title);
    });
  }

  function renderRecommendations(collectionEntries) {
    if (!recommendationsList) {
      return;
    }

    const recommendations = getAvailableRecommendations(collectionEntries);
    const visibleRecommendations = recommendationsExpanded
      ? recommendations
      : recommendations.slice(0, initialRecommendationVisibleCount);

    recommendationsList.replaceChildren();

    if (recommendations.length === 0) {
      const empty = document.createElement("div");
      empty.className = "collections-empty";
      empty.textContent = "No fresh recommendations right now. Browse a few more books and we will refresh this list.";
      recommendationsList.appendChild(empty);
      return;
    }

    visibleRecommendations.forEach(function (book) {
      const lockedBySubscription = isPaidBook(book) && !isPaidSubscriber();
      const accessLevel = String(book.access || "free").toLowerCase();
      const accessClassName = "book-access-" + accessLevel.replace(/[^a-z0-9-]/g, "");
      const article = document.createElement("article");
      article.className = "recommendation-card";
      article.setAttribute("data-book-title", book.title);

      const cover = document.createElement("div");
      cover.className = "recommendation-cover";
      const image = document.createElement("img");
      image.alt = book.title;
      image.src = book.image;
      cover.appendChild(image);

      const body = document.createElement("div");
      body.className = "recommendation-body";
      const meta = document.createElement("span");
      meta.className = "recommendation-meta";
      const category = document.createElement("span");
      category.className = "recommendation-category-label";
      category.textContent = book.category;
      const access = document.createElement("span");
      access.className = "recommendation-access " + accessClassName;
      access.textContent = String(book.access || "free").toUpperCase();
      meta.appendChild(category);
      meta.appendChild(access);

      const topLine = document.createElement("div");
      topLine.className = "recommendation-topline";
      const title = document.createElement("h4");
      title.className = "recommendation-title";
      title.textContent = book.title;
      topLine.appendChild(title);

      const summary = document.createElement("p");
      summary.className = "recommendation-copy";
      summary.textContent = book.summary;

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.dataset.collectionAction = "add";
      addButton.className = "recommendation-button";
      addButton.disabled = lockedBySubscription;
      addButton.textContent = lockedBySubscription ? "Subscription Required" : "Add to Collection";

      body.appendChild(meta);
      body.appendChild(topLine);
      body.appendChild(summary);
      body.appendChild(addButton);
      article.appendChild(cover);
      article.appendChild(body);

      recommendationsList.appendChild(article);
      applyImageFallback(article.querySelector(".recommendation-cover img"), book.title);
    });

    if (recommendations.length > initialRecommendationVisibleCount) {
      const seeMoreButton = document.createElement("button");
      seeMoreButton.type = "button";
      seeMoreButton.className = "recommendations-see-more";
      seeMoreButton.setAttribute("data-collection-action", "recommendations-toggle");
      seeMoreButton.textContent = recommendationsExpanded ? "See Less" : "See More";
      recommendationsList.appendChild(seeMoreButton);
    }
  }

  function rerender() {
    const collectionEntries = getStoredCollections();
    renderCollectionLimitNote(collectionEntries);
    renderCollections(collectionEntries);
    renderRecommendations(collectionEntries);
  }

  document.addEventListener("click", function (event) {
    const actionButton = event.target.closest("[data-collection-action]");
    if (!actionButton || !document.body.contains(actionButton)) {
      return;
    }

    const action = actionButton.getAttribute("data-collection-action");
    const card = actionButton.closest("[data-book-title]");
    const title = card ? card.getAttribute("data-book-title") || "book" : "book";
    const book = getBookMeta(title);

    if (action === "recommendations-toggle") {
      recommendationsExpanded = !recommendationsExpanded;
      renderRecommendations(getStoredCollections());
      return;
    }

    if (action === "read") {
      if (isPaidBook(book) && !isPaidSubscriber()) {
        showToast("This is a paid book. Upgrade subscription from Profile.");
        return;
      }

      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: book.title,
          author: book.author,
          category: book.category,
          source: "collections"
        });
      }

      showFakeLoading("Opening reader...", 1200, function () {
        showToast("Reader is ready for \"" + book.title + "\".");
      });
      return;
    }

    if (action === "add") {
      if (isPaidBook(book) && !isPaidSubscriber()) {
        showToast("Paid books require an active subscription.");
        return;
      }

      const collectionEntries = getStoredCollections();
      const existing = collectionEntries.some(function (entry) {
        return normalizeKey(getCollectionTitle(entry)) === normalizeKey(book.title);
      });

      if (!existing && isCollectionLimitReached(collectionEntries)) {
        showToast(getLimitReachedMessage());
        return;
      }

      if (!existing) {
        collectionEntries.push(normalizeCollectionEntry(book));
        saveStoredCollections(collectionEntries);
      }

      clearRecentlyRemoved(book.title);

      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: book.title,
          author: book.author,
          category: book.category,
          source: "collection-add"
        });
      }

      rerender();
      showToast("Great choice. \"" + book.title + "\" is now in your collection.");
      return;
    }

    if (action === "return") {
      openReturnModal(book, function () {
        returnBookFlow(book, card);
      });
    }
  });

  window.addEventListener("storage", function (event) {
    if (event.key === "brainrootSubscription" || event.key === "brainrootSubscriptionsByUser") {
      rerender();
      showToast("Subscription status updated.");
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      rerender();
    }
  });

  window.addEventListener("brainroot:subscription-updated", function () {
    rerender();
  });

  rerender();
});


