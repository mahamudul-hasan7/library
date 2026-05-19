document.addEventListener("DOMContentLoaded", function () {
  const forms = Array.from(document.querySelectorAll(".site-nav-search")).filter(function (form) {
    return !form.classList.contains("site-nav-search--live");
  });

  if (!forms.length) return;

  const fallbackBookImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='320' viewBox='0 0 240 320'%3E%3Crect width='240' height='320' fill='%23dfe8ea'/%3E%3Crect x='24' y='28' width='192' height='264' rx='12' fill='%23ffffff'/%3E%3Ctext x='120' y='150' font-family='Segoe UI, Arial' font-size='20' font-weight='700' text-anchor='middle' fill='%232d3435'%3EBrainRoot%3C/text%3E%3Ctext x='120' y='180' font-family='Segoe UI, Arial' font-size='13' text-anchor='middle' fill='%23596061'%3EBook Cover%3C/text%3E%3C/svg%3E";
  let booksPromise = null;

  function getPageBookTargets() {
    if (document.body.classList.contains("wishlist-page")) {
      return Array.from(document.querySelectorAll(".wish-list article"));
    }

    if (document.body.classList.contains("collections-page")) {
      return Array.from(document.querySelectorAll("#collectionsList .collection-card"));
    }

    return [];
  }

  function getLocalBooksFromPage() {
    const targets = getPageBookTargets();
    return targets.map(function (target) {
      const titleNode = target.querySelector("h3, h4, .collection-title, .wishlist-title");
      const authorNode = target.querySelector(".author, .collection-copy, p");
      const categoryNode = target.querySelector("small, .collection-category, .recommendation-category");
      const imageNode = target.querySelector("img");
      const title = String((titleNode && titleNode.textContent) || "").trim();
      if (!title) return null;

      return {
        title: title,
        author: String((authorNode && authorNode.textContent) || "Unknown Author").trim(),
        category: String((categoryNode && categoryNode.textContent) || "Current Page").trim(),
        image: imageNode ? imageNode.getAttribute("src") : "",
        description: String(target.textContent || "")
      };
    }).filter(Boolean);
  }

  function setImage(image, source, title) {
    image.onerror = function () {
      image.onerror = null;
      image.src = fallbackBookImage;
    };
    image.src = String(source || "").trim() || fallbackBookImage;
    image.alt = title || "Book cover";
  }

  async function getBooks() {
    if (booksPromise) return booksPromise;
    booksPromise = (async function () {
      try {
        if (!window.brainrootAPI || typeof window.brainrootAPI.getBooks !== "function") {
          return [];
        }

        const books = await window.brainrootAPI.getBooks();
        const apiBooks = Array.isArray(books) ? books : [];
        return apiBooks.length ? apiBooks : getLocalBooksFromPage();
      } catch (error) {
        return getLocalBooksFromPage();
      }
    })();
    return booksPromise;
  }

  function buildSearchText(book) {
    return [
      book.title,
      book.author,
      book.category,
      book.description,
      book.summary,
      book.access,
      book.access_type
    ].join(" ").toLowerCase();
  }

  function ensurePanel(form) {
    let panel = form.querySelector(".site-nav-search-panel");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.className = "site-nav-search-panel is-hidden";
    panel.setAttribute("role", "listbox");
    panel.setAttribute("aria-label", "Search results");
    form.appendChild(panel);
    return panel;
  }

  function hidePanel(form) {
    const panel = ensurePanel(form);
    panel.classList.add("is-hidden");
    panel.replaceChildren();
  }

  function renderMessage(form, message) {
    const panel = ensurePanel(form);
    const empty = document.createElement("div");
    empty.className = "site-nav-search-empty";
    empty.textContent = message;
    panel.replaceChildren(empty);
    panel.classList.remove("is-hidden");
  }

  function renderResults(form, input, books) {
    const query = String(input.value || "").trim();
    if (!query) {
      hidePanel(form);
      return;
    }

    const normalized = query.toLowerCase();
    const sourceBooks = books.length ? books : getLocalBooksFromPage();
    const matches = sourceBooks.filter(function (book) {
      return buildSearchText(book).indexOf(normalized) !== -1;
    }).slice(0, 6);

    const panel = ensurePanel(form);
    panel.replaceChildren();

    if (!matches.length) {
      renderMessage(form, "No result found");
      return;
    }

    matches.forEach(function (book) {
      const title = String(book.title || "Untitled Book");
      const author = String(book.author || "Unknown Author");
      const category = String(book.category || "General");
      const access = String(book.access || book.access_type || "free").toLowerCase() === "paid" ? "Paid" : "Free";
      const button = document.createElement("button");
      const image = document.createElement("img");
      const copy = document.createElement("span");
      const titleNode = document.createElement("strong");
      const meta = document.createElement("span");

      button.type = "button";
      button.className = "site-nav-search-result";
      button.setAttribute("role", "option");
      setImage(image, book.image || book.image_url || book.imageUrl, title);
      titleNode.textContent = title;
      meta.textContent = author + " - " + category + " - " + access;
      copy.append(titleNode, meta);
      button.append(image, copy);
      button.addEventListener("click", function () {
        input.value = title;
        hidePanel(form);
        openBookDetails(book);
      });
      panel.appendChild(button);
    });
    panel.classList.remove("is-hidden");
  }

  function getDetailsModal() {
    let overlay = document.getElementById("sharedBookDetailsOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "sharedBookDetailsOverlay";
    overlay.className = "shared-book-details-overlay";

    const card = document.createElement("section");
    card.className = "shared-book-details-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "sharedBookDetailsTitle");

    const close = document.createElement("button");
    close.type = "button";
    close.className = "shared-book-details-close";
    close.setAttribute("aria-label", "Close book details");
    close.textContent = "x";

    const image = document.createElement("img");
    image.id = "sharedBookDetailsImage";
    image.className = "shared-book-details-image";
    image.alt = "Book cover";

    const content = document.createElement("div");
    content.className = "shared-book-details-content";

    const category = document.createElement("p");
    category.id = "sharedBookDetailsCategory";
    category.className = "shared-book-details-category";

    const title = document.createElement("h2");
    title.id = "sharedBookDetailsTitle";

    const author = document.createElement("p");
    author.id = "sharedBookDetailsAuthor";
    author.className = "shared-book-details-author";

    const description = document.createElement("p");
    description.id = "sharedBookDetailsDescription";
    description.className = "shared-book-details-description";

    const meta = document.createElement("div");
    meta.className = "shared-book-details-meta";
    meta.id = "sharedBookDetailsMeta";

    const actions = document.createElement("div");
    actions.className = "shared-book-details-actions";
    const borrowButton = document.createElement("button");
    borrowButton.type = "button";
    borrowButton.id = "sharedBookBorrowBtn";
    borrowButton.className = "shared-book-details-action shared-book-details-action-primary";
    borrowButton.textContent = "Borrow Book";
    const wishlistButton = document.createElement("button");
    wishlistButton.type = "button";
    wishlistButton.id = "sharedBookWishlistBtn";
    wishlistButton.className = "shared-book-details-action";
    wishlistButton.textContent = "Add to Wishlist";
    actions.append(borrowButton, wishlistButton);

    content.append(category, title, author, description, meta, actions);
    card.append(close, image, content);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    close.addEventListener("click", function () {
      overlay.classList.remove("show");
    });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        overlay.classList.remove("show");
      }
    });

    return overlay;
  }

  async function ensureCanUseLibrary(message) {
    if (!window.brainrootAuth) return true;
    return typeof window.brainrootAuth.requireBackendLogin === "function"
      ? await window.brainrootAuth.requireBackendLogin(message)
      : window.brainrootAuth.requireLogin(message);
  }

  function getBookPayload(book) {
    return {
      title: book.title || "",
      author: book.author || "Unknown Author",
      category: book.category || "General",
      image: book.image || book.image_url || book.imageUrl || "",
      access: book.access || book.access_type || "free",
      description: book.description || book.summary || ""
    };
  }

  function setActionFeedback(button, message, restoreText) {
    if (!button) return;
    button.textContent = message;
    window.setTimeout(function () {
      button.textContent = restoreText;
      button.disabled = false;
    }, 1600);
  }

  function openBookDetails(book) {
    const overlay = getDetailsModal();
    const title = String(book.title || "Untitled Book");
    const author = String(book.author || "Unknown Author");
    const category = String(book.category || "General");
    const access = String(book.access || book.access_type || "free").toLowerCase() === "paid" ? "Paid" : "Free";
    const description = String(book.description || book.summary || "A curated work from the BrainRoot archive.");

    setImage(document.getElementById("sharedBookDetailsImage"), book.image || book.image_url || book.imageUrl, title);
    document.getElementById("sharedBookDetailsCategory").textContent = category + " | " + access;
    document.getElementById("sharedBookDetailsTitle").textContent = title;
    document.getElementById("sharedBookDetailsAuthor").textContent = author;
    document.getElementById("sharedBookDetailsDescription").textContent = description;

    const meta = document.getElementById("sharedBookDetailsMeta");
    const borrowButton = document.getElementById("sharedBookBorrowBtn");
    const wishlistButton = document.getElementById("sharedBookWishlistBtn");
    meta.replaceChildren();
    [
      book.published_year || book.year ? "Published: " + (book.published_year || book.year) : "",
      book.pages ? "Pages: " + book.pages : "",
      book.language ? "Language: " + book.language : ""
    ].filter(Boolean).forEach(function (value) {
      const chip = document.createElement("span");
      chip.textContent = value;
      meta.appendChild(chip);
    });

    const payload = getBookPayload(book);
    if (borrowButton) {
      borrowButton.disabled = false;
      borrowButton.textContent = "Borrow Book";
      borrowButton.onclick = async function () {
        const canBorrow = await ensureCanUseLibrary("Please login to borrow books.");
        if (!canBorrow) return;
        if (!window.brainrootAPI || typeof window.brainrootAPI.borrowBook !== "function") {
          setActionFeedback(borrowButton, "Unavailable", "Borrow Book");
          return;
        }

        borrowButton.disabled = true;
        borrowButton.textContent = "Borrowing...";
        const success = await window.brainrootAPI.borrowBook(payload);
        if (success) {
          setActionFeedback(borrowButton, "Borrowed", "Borrow Book");
        } else {
          setActionFeedback(borrowButton, window.brainrootAPI.lastError || "Try Again", "Borrow Book");
        }
      };
    }

    if (wishlistButton) {
      wishlistButton.disabled = false;
      wishlistButton.textContent = "Add to Wishlist";
      wishlistButton.onclick = async function () {
        const canAdd = await ensureCanUseLibrary("Please login to add books to wishlist.");
        if (!canAdd) return;
        if (!window.brainrootAPI || typeof window.brainrootAPI.addToWishlist !== "function") {
          setActionFeedback(wishlistButton, "Unavailable", "Add to Wishlist");
          return;
        }

        wishlistButton.disabled = true;
        wishlistButton.textContent = "Adding...";
        const success = await window.brainrootAPI.addToWishlist(payload);
        if (success) {
          setActionFeedback(wishlistButton, "Added", "Add to Wishlist");
        } else {
          setActionFeedback(wishlistButton, window.brainrootAPI.lastError || "Try Again", "Add to Wishlist");
        }
      };
    }

    overlay.classList.add("show");
  }

  forms.forEach(function (form) {
    const input = form.querySelector(".site-nav-search-input, .explore-search-input");
    if (!input) return;

    form.setAttribute("autocomplete", "off");

    let requestToken = 0;
    input.addEventListener("input", async function () {
      const token = ++requestToken;
      const query = String(input.value || "").trim();
      if (!query) {
        hidePanel(form);
        return;
      }

      renderMessage(form, "Searching archive...");
      const books = await getBooks();
      if (token !== requestToken) return;
      renderResults(form, input, books);
    });

    input.addEventListener("focus", async function () {
      if (!String(input.value || "").trim()) return;
      renderResults(form, input, await getBooks());
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hidePanel(form);
        input.blur();
      }
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      renderResults(form, input, await getBooks());
    });
  });

  document.addEventListener("click", function (event) {
    forms.forEach(function (form) {
      if (!form.contains(event.target)) {
        hidePanel(form);
      }
    });
  });
});
