document.addEventListener("DOMContentLoaded", function () {
  const storage = window.brainrootStorage;
  if (!window.brainrootAuth || !window.brainrootAuth.requireLogin("Please login to access your wishlist.")) {
    return;
  }

  const collectionsKey = "brainrootCollections";
  const wishlistContainer = document.querySelector(".wish-list");
  const wishlistKey = "brainrootWishlist";
  const wishlistItems = readWishlistItems();
  let feedbackTimer = null;

  function normalizeTitleKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getWishlistItemTitle(item) {
    if (typeof item === "string") {
      return item.trim();
    }

    if (item && typeof item === "object") {
      return String(item.title || "").trim();
    }

    return "";
  }

  function getDisplayBookTitle(title) {
    const cleaned = String(title || "").trim();
    if (!cleaned) {
      return "Selected book";
    }

    const normalized = cleaned.toLowerCase();
    if (normalized === "any book" || normalized === "book") {
      return "Selected book";
    }

    return cleaned;
  }

  function readWishlistItems() {
    const parsed = storage.readJson(wishlistKey, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveWishlistItems(items) {
    storage.writeJson(wishlistKey, items);
  }

  function findWishlistItemIndex(items, title) {
    const key = normalizeTitleKey(title);
    return items.findIndex(function (entry) {
      return normalizeTitleKey(getWishlistItemTitle(entry)) === key;
    });
  }

  function hashTitle(value) {
    return String(value || "").split("").reduce(function (acc, char) {
      return (acc * 31 + char.charCodeAt(0)) >>> 0;
    }, 7);
  }

  function getFallbackCoverImage(title) {
    const fallbackCovers = [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=320&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=320&q=80"
    ];

    return fallbackCovers[hashTitle(title) % fallbackCovers.length];
  }

  function getBehaviorCatalog() {
    if (!window.brainrootLibraryBehavior || typeof window.brainrootLibraryBehavior.getBookBehavior !== "function") {
      return Object.create(null);
    }

    const behavior = window.brainrootLibraryBehavior.getBookBehavior();
    const views = behavior && Array.isArray(behavior.views) ? behavior.views : [];
    const catalog = Object.create(null);

    views.forEach(function (view) {
      const title = String(view && view.title || "").trim();
      const key = normalizeTitleKey(title);
      if (!key) {
        return;
      }

      catalog[key] = {
        author: String(view.author || "").trim(),
        category: String(view.category || "").trim()
      };
    });

    return catalog;
  }

  function showFeedback(message, options) {
    const config = options || {};
    let feedback = document.getElementById("wishlistFeedback");
    let messageText = null;
    let ctaLink = null;

    if (!feedback) {
      feedback = document.createElement("div");
      feedback.id = "wishlistFeedback";
      feedback.setAttribute("aria-live", "polite");
      feedback.setAttribute("role", "status");

      messageText = document.createElement("p");
      messageText.className = "wishlist-feedback-text";

      ctaLink = document.createElement("a");
      ctaLink.className = "wishlist-feedback-link";
      ctaLink.href = "../collections/collections.html";
      ctaLink.textContent = "Go to Collection";

      feedback.appendChild(messageText);
      feedback.appendChild(ctaLink);
      document.body.appendChild(feedback);
    } else {
      messageText = feedback.querySelector(".wishlist-feedback-text");
      ctaLink = feedback.querySelector(".wishlist-feedback-link");
    }

    if (messageText) {
      messageText.textContent = message;
    }

    if (ctaLink) {
      if (config.showGoToCollection) {
        ctaLink.textContent = "Open Collections";
        ctaLink.classList.remove("is-hidden");
      } else {
        ctaLink.classList.add("is-hidden");
      }

      if (!ctaLink.dataset.loaderBound) {
        ctaLink.addEventListener("click", function (event) {
          event.preventDefault();
          const targetUrl = ctaLink.getAttribute("href") || "../collections/collections.html";
          showFakeLoading("Opening Collections...", 1200, function () {
            window.location.href = targetUrl;
          });
        });
        ctaLink.dataset.loaderBound = "true";
      }
    }

    feedback.classList.add("show");

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }

    feedbackTimer = setTimeout(function () {
      feedback.classList.remove("show");
    }, typeof config.duration === "number" ? config.duration : 5000);
  }

  function showFakeLoading(message, duration, onDone) {
    let overlay = document.getElementById("wishlistLoadingOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "wishlistLoadingOverlay";
      overlay.className = "wishlist-loading-overlay";

      const card = document.createElement("div");
      card.className = "loading-card";

      const spinner = document.createElement("span");
      spinner.className = "loading-spinner";

      const text = document.createElement("span");
      text.id = "wishlistLoadingText";

      card.appendChild(spinner);
      card.appendChild(text);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }

    const textNode = document.getElementById("wishlistLoadingText");
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

  function removeFromWishlistStorage(bookTitle) {
    const updatedWishlist = readWishlistItems();
    const idx = findWishlistItemIndex(updatedWishlist, bookTitle);
    if (idx > -1) {
      updatedWishlist.splice(idx, 1);
      saveWishlistItems(updatedWishlist);
    }
  }

  function renderEmptyWishlist() {
    const empty = document.createElement("p");
    empty.className = "wishlist-empty";
    empty.textContent = "Your wishlist is empty. ";
    const link = document.createElement("a");
    link.href = "../explore/explore.html";
    link.textContent = "Explore books";
    empty.appendChild(link);
    wishlistContainer.replaceChildren(empty);
  }

  function showEmptyWishlistIfNeeded() {
    if (!wishlistContainer.querySelector("article")) {
      renderEmptyWishlist();
    }
  }

  function getCollections() {
    const parsed = storage.readJson(collectionsKey, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveCollections(items) {
    storage.writeJson(collectionsKey, items);
  }

  function getCollectionTitle(item) {
    if (typeof item === "string") {
      return item;
    }

    if (item && typeof item === "object") {
      return item.title;
    }

    return "";
  }

  function isBookAlreadyInCollections(items, title) {
    const key = normalizeTitleKey(title);
    return items.some(function (entry) {
      return normalizeTitleKey(getCollectionTitle(entry)) === key;
    });
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

  function setAddedState(button, isAdded, isLocked) {
    if (!button) {
      return;
    }

    if (isLocked) {
      button.textContent = "Subscription Required";
      button.classList.add("wishlist-action-locked");
      button.classList.remove("wishlist-action-added");
      return;
    }

    button.textContent = isAdded ? "Added" : "Add to Collection";
    button.classList.toggle("wishlist-action-added", isAdded);
    button.classList.remove("wishlist-action-locked");
  }

  
  wishlistContainer.replaceChildren();

  if (wishlistItems.length === 0) {
    renderEmptyWishlist();
    return;
  }

  
  const defaultBooks = {
    "Concrete Poetry": { image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=320&q=80", category: "Theory", year: "2023", author: "Tadao Ando" },
    "The Kite Runner": { image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=320&q=80", category: "Drama", year: "2003", author: "Khaled Hosseini" },
    "Atomic Habits": { image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=320&q=80", category: "Motivational", year: "2018", author: "James Clear" },
    "The Silent Patient": { image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=320&q=80", category: "Mystery", year: "2019", author: "Alex Michaelides" },
    "Educated": { image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=320&q=80", category: "Educational", year: "2018", author: "Tara Westover" },
    "Why We Sleep": { image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=320&q=80", category: "Health", year: "2017", author: "Matthew Walker" },
    "Dune": { image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=320&q=80", category: "Sci-Fi", year: "1965", author: "Frank Herbert" }
  };

  const behaviorCatalog = getBehaviorCatalog();

  wishlistItems.forEach((item, index) => {
    const bookTitle = getWishlistItemTitle(item);
    if (!bookTitle) {
      return;
    }

    const storedData = item && typeof item === "object" ? item : {};
    const behaviorData = behaviorCatalog[normalizeTitleKey(bookTitle)] || {};
    const defaultData = defaultBooks[bookTitle] || {};
    const bookData = {
      image: storedData.image || defaultData.image || getFallbackCoverImage(bookTitle),
      category: storedData.category || behaviorData.category || defaultData.category || "General",
      year: storedData.year || defaultData.year || "2023",
      author: storedData.author || behaviorData.author || defaultData.author || "Unknown Author"
    };
    
    const article = document.createElement("article");
    const indexNode = document.createElement("b");
    indexNode.textContent = String(index + 1).padStart(2, "0");
    const image = document.createElement("img");
    image.src = bookData.image;
    image.alt = bookTitle;
    const copy = document.createElement("div");
    const meta = document.createElement("small");
    meta.textContent = bookData.category + " · " + bookData.year;
    const title = document.createElement("h3");
    title.textContent = bookTitle;
    const author = document.createElement("p");
    author.textContent = bookData.author;
    const addLink = document.createElement("a");
    addLink.href = "#";
    addLink.className = "add-btn";
    addLink.textContent = "Add to Collection";
    const removeLink = document.createElement("a");
    removeLink.href = "#";
    removeLink.className = "remove-btn";
    removeLink.textContent = "Remove";

    copy.appendChild(meta);
    copy.appendChild(title);
    copy.appendChild(author);
    copy.appendChild(addLink);
    copy.appendChild(document.createTextNode(" "));
    copy.appendChild(removeLink);
    article.appendChild(indexNode);
    article.appendChild(image);
    article.appendChild(copy);
    
    const removeBtn = article.querySelector(".remove-btn");
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      removeFromWishlistStorage(bookTitle);

      article.classList.add("is-removing");
      setTimeout(function () {
        article.remove();
        showEmptyWishlistIfNeeded();
      }, 220);

      showFeedback(`Removed "${bookTitle}" from wishlist.`);
    });

    const addBtn = article.querySelector(".add-btn");
    if (addBtn) {
      const paidLocked = getBookAccess(bookTitle) === "paid" && !isPaidSubscriber();
      setAddedState(addBtn, isBookAlreadyInCollections(getCollections(), bookTitle), paidLocked);

      addBtn.addEventListener("click", function (e) {
        e.preventDefault();

        if (getBookAccess(bookTitle) === "paid" && !isPaidSubscriber()) {
          showFeedback("This is a paid book. Upgrade your plan in Profile first.");
          return;
        }

        if (!window.brainrootAuth.requireLogin("Please login to add books to collections.")) {
          return;
        }

        const collections = getCollections();
        const limit = getCollectionLimit();
        if (Number.isFinite(limit) && collections.length >= limit) {
          showFeedback("Collection limit reached for " + getPlanDisplayName(getPlanType()) + " plan (" + limit + " books). Upgrade plan from Profile.");
          return;
        }

        if (!isBookAlreadyInCollections(collections, bookTitle)) {
          collections.push({
            title: bookTitle,
            author: bookData.author,
            category: bookData.category,
            image: bookData.image,
            access: getBookAccess(bookTitle)
          });
          saveCollections(collections);
        }

        removeFromWishlistStorage(bookTitle);
        article.classList.add("is-removing");

        setTimeout(function () {
          article.remove();
          showEmptyWishlistIfNeeded();
        }, 220);

        const displayTitle = getDisplayBookTitle(bookTitle);
        showFeedback(`Great choice. "${displayTitle}" is now in your collection. Open Collections to continue reading.`, {
          showGoToCollection: true,
          duration: 5000
        });
      });
    }

    wishlistContainer.appendChild(article);
  });
});


