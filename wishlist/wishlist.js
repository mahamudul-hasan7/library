document.addEventListener("DOMContentLoaded", function () {
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
    try {
      const parsed = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveWishlistItems(items) {
    localStorage.setItem(wishlistKey, JSON.stringify(items));
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
        ctaLink.style.display = "inline-block";
      } else {
        ctaLink.style.display = "none";
      }
    }

    feedback.classList.add("show");

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }

    feedbackTimer = setTimeout(function () {
      feedback.classList.remove("show");
    }, typeof config.duration === "number" ? config.duration : 4200);
  }

  function removeFromWishlistStorage(bookTitle) {
    const updatedWishlist = readWishlistItems();
    const idx = findWishlistItemIndex(updatedWishlist, bookTitle);
    if (idx > -1) {
      updatedWishlist.splice(idx, 1);
      saveWishlistItems(updatedWishlist);
    }
  }

  function showEmptyWishlistIfNeeded() {
    if (!wishlistContainer.querySelector("article")) {
      wishlistContainer.innerHTML = "<p style='text-align: center; padding: 40px; color: #596061;'>Your wishlist is empty. <a href='../explore/explore.html' style='color: #005faf;'>Explore books</a></p>";
    }
  }

  function getCollections() {
    try {
      const parsed = JSON.parse(localStorage.getItem(collectionsKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCollections(items) {
    localStorage.setItem(collectionsKey, JSON.stringify(items));
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
      button.style.opacity = "0.65";
      button.style.pointerEvents = "none";
      return;
    }

    button.textContent = isAdded ? "Added" : "Add to Collection";
    button.style.opacity = isAdded ? "0.65" : "1";
    button.style.pointerEvents = isAdded ? "none" : "auto";
  }

  // Clear existing items and reload from storage
  wishlistContainer.innerHTML = "";

  if (wishlistItems.length === 0) {
    wishlistContainer.innerHTML = "<p style='text-align: center; padding: 40px; color: #596061;'>Your wishlist is empty. <a href='../explore/explore.html' style='color: #005faf;'>Explore books</a></p>";
    return;
  }

  // Default book data for display
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
    article.innerHTML = `
      <b>${String(index + 1).padStart(2, "0")}</b>
      <img src="${bookData.image}" alt="${bookTitle}">
      <div>
        <small>${bookData.category} · ${bookData.year}</small>
        <h3>${bookTitle}</h3>
        <p>${bookData.author}</p>
        <a href="#" class="add-btn">Add to Collection</a>
        <a href="#" class="remove-btn">Remove</a>
      </div>
    `;
    
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
      setAddedState(addBtn, getCollections().includes(bookTitle), paidLocked);

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
        if (!collections.includes(bookTitle)) {
          collections.push(bookTitle);
          saveCollections(collections);
        }

        removeFromWishlistStorage(bookTitle);
        article.classList.add("is-removing");

        setTimeout(function () {
          article.remove();
          showEmptyWishlistIfNeeded();
        }, 220);

        const displayTitle = getDisplayBookTitle(bookTitle);
        showFeedback(`Added "${displayTitle}" to your collection. You can view it anytime in Collections.`, {
          showGoToCollection: true,
          duration: 5600
        });
      });
    }

    wishlistContainer.appendChild(article);
  });
});
