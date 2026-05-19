document.addEventListener("DOMContentLoaded", async function () {
  const api = window.brainrootAPI;

  if (!window.brainrootAuth) {
    return;
  }

  const canAccessCollections = typeof window.brainrootAuth.requireBackendLogin === "function"
    ? await window.brainrootAuth.requireBackendLogin("Please login to access collections.")
    : window.brainrootAuth.requireLogin("Please login to access collections.");

  if (!canAccessCollections) {
    return;
  }

  const toastId = "collectionsToast";
  const collectionsList = document.getElementById("collectionsList");
  const recommendationsList = document.getElementById("recommendationsList");
  const collectionsEmptyState = document.getElementById("collectionsEmptyState");
  const historyFilters = document.getElementById("collectionsHistoryFilters");
  let recommendationsExpanded = false;
  let currentView = "active";
  const fallbackBookImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='1000' viewBox='0 0 700 1000'%3E%3Crect width='700' height='1000' fill='%23dfe8ea'/%3E%3Crect x='70' y='80' width='560' height='840' rx='24' fill='%23ffffff'/%3E%3Ctext x='350' y='470' font-family='Segoe UI, Arial' font-size='54' font-weight='700' text-anchor='middle' fill='%232d3435'%3EBrainRoot%3C/text%3E%3Ctext x='350' y='540' font-family='Segoe UI, Arial' font-size='30' text-anchor='middle' fill='%23596061'%3EBook Cover%3C/text%3E%3C/svg%3E";

  const viewConfig = {
    active: {
      empty: "Your collection is empty. Add a book from Recommendations or browse the archive to build it."
    },
    history: {
      empty: "No returned or expired book history yet."
    },
    returned: {
      empty: "No returned books yet."
    },
    expired: {
      empty: "No expired books right now."
    }
  };

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setBookImage(image, source, title) {
    if (!image) return;
    image.onerror = function () {
      image.onerror = null;
      image.src = fallbackBookImage;
    };
    image.src = String(source || "").trim() || fallbackBookImage;
    image.alt = title || "Book cover";
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(String(value).replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function updateViewButtons() {
    document.querySelectorAll("[data-collection-view]").forEach(function (button) {
      const view = button.getAttribute("data-collection-view");
      const isHistoryView = currentView === "history" || currentView === "returned" || currentView === "expired";
      button.classList.toggle("is-active", view === currentView || (view === "history" && isHistoryView));
    });

    document.querySelectorAll("[data-collection-filter]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-collection-filter") === currentView);
    });

    if (historyFilters) {
      const shouldShowFilters = currentView === "history" || currentView === "returned" || currentView === "expired";
      historyFilters.classList.toggle("hidden", !shouldShowFilters);
    }
  }

  async function getBooksForCurrentView() {
    if (currentView === "history" && typeof api.getReturnedBooks === "function" && typeof api.getExpiredBooks === "function") {
      const [returnedBooks, expiredBooks] = await Promise.all([
        api.getReturnedBooks(),
        api.getExpiredBooks()
      ]);

      return [
        ...(Array.isArray(returnedBooks) ? returnedBooks.map(function (book) {
          return { ...book, history_type: "returned" };
        }) : []),
        ...(Array.isArray(expiredBooks) ? expiredBooks.map(function (book) {
          return { ...book, history_type: "expired" };
        }) : [])
      ].sort(function (first, second) {
        return getHistoryTime(second) - getHistoryTime(first);
      });
    }

    if (currentView === "returned" && typeof api.getReturnedBooks === "function") {
      const books = await api.getReturnedBooks();
      return Array.isArray(books) ? books.map(function (book) {
        return { ...book, history_type: "returned" };
      }) : [];
    }

    if (currentView === "expired" && typeof api.getExpiredBooks === "function") {
      const books = await api.getExpiredBooks();
      return Array.isArray(books) ? books.map(function (book) {
        return { ...book, history_type: "expired" };
      }) : [];
    }

    return api.getCollections();
  }

  function getHistoryTime(book) {
    const value = book.returned_at || book.due_at || book.borrowed_at || "";
    const date = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  function getBookHistoryType(book) {
    if (book.history_type) return book.history_type;
    if (currentView === "returned" || currentView === "expired") return currentView;
    if (Number(book.is_expired) === 1) return "expired";
    if (book.returned_at) return "returned";
    return "";
  }

  function normalizeTitle(value) {
    return String(value || "").trim().toLowerCase();
  }

  async function borrowRecommendedBook(book) {
    if (window.brainrootAuth) {
      const canBorrow = typeof window.brainrootAuth.requireBackendLogin === "function"
        ? await window.brainrootAuth.requireBackendLogin("Please login to borrow books.")
        : window.brainrootAuth.requireLogin("Please login to borrow books.");

      if (!canBorrow) {
        return;
      }
    }

    try {
      const payload = {
        title: book.title || "",
        author: book.author || "Unknown Author",
        category: book.category || "General",
        image: book.image || book.imageUrl || "",
        description: book.description || book.summary || "",
        access: book.access || "free"
      };

      const success = await api.borrowBook(payload);

      if (success) {
        showToast('"' + (book.title || "Book") + '" has been added to your collection.');
        await rerender();
      } else {
        showToast("Error borrowing book. Try again.");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      showToast("Error borrowing book. Try again.");
    }
  }

  function openReaderForBook(book) {
    if (!book || !book.title) {
      return;
    }

    const params = new URLSearchParams({
      title: book.title,
      author: book.author || "",
      category: book.category || "",
      access: book.access || book.access_type || "free",
      image: book.image || book.imageUrl || book.image_url || "",
      description: book.description || book.summary || "",
      fileUrl: book.file_url || book.fileUrl || "",
      sampleUrl: book.sample_url || book.sampleUrl || ""
    });

    window.location.href = "../reader/reader.html?" + params.toString();
  }

  function getBorrowConfirmModal() {
    let overlay = document.getElementById("borrowConfirmOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "borrowConfirmOverlay";
      overlay.className = "return-modal-overlay";

      const modal = document.createElement("div");
      modal.className = "return-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");

      const body = document.createElement("div");
      body.className = "return-modal-body";
      const coverWrap = document.createElement("div");
      coverWrap.className = "return-modal-cover";
      const cover = document.createElement("img");
      cover.id = "borrowConfirmCover";
      cover.alt = "Book cover";
      coverWrap.appendChild(cover);

      const copy = document.createElement("div");
      copy.className = "return-modal-copy";
      const title = document.createElement("h3");
      title.id = "borrowConfirmTitle";
      title.textContent = "Add this book?";
      const author = document.createElement("p");
      author.id = "borrowConfirmAuthor";
      author.style.margin = "5px 0 0 0";
      author.style.color = "#666";
      author.style.fontSize = "14px";
      const message = document.createElement("p");
      message.id = "borrowConfirmMessage";
      message.style.margin = "8px 0 0 0";
      message.style.fontSize = "13px";
      copy.appendChild(title);
      copy.appendChild(author);
      copy.appendChild(message);
      body.appendChild(coverWrap);
      body.appendChild(copy);

      const actions = document.createElement("div");
      actions.className = "return-modal-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "return-modal-action return-modal-action-cancel";
      cancel.textContent = "Cancel";
      cancel.id = "borrowConfirmCancel";
      const confirm = document.createElement("button");
      confirm.type = "button";
      confirm.className = "return-modal-action return-modal-action-confirm";
      confirm.textContent = "Add to Collection";
      confirm.id = "borrowConfirmBtn";
      actions.appendChild(cancel);
      actions.appendChild(confirm);

      modal.appendChild(body);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
          overlay.classList.remove("show");
        }
      });

      cancel.addEventListener("click", function () {
        overlay.classList.remove("show");
      });
    }

    return overlay;
  }

  function openBorrowConfirmModal(book, onConfirm) {
    const overlay = getBorrowConfirmModal();
    const cover = document.getElementById("borrowConfirmCover");
    const title = document.getElementById("borrowConfirmTitle");
    const author = document.getElementById("borrowConfirmAuthor");
    const message = document.getElementById("borrowConfirmMessage");
    const confirmBtn = document.getElementById("borrowConfirmBtn");

    setBookImage(cover, book.image || book.imageUrl || book.image_url, book.title);
    title.textContent = book.title || "Untitled Book";
    author.textContent = (book.author || "Unknown Author") + " - " + (book.category || "General");
    message.textContent = book.description || book.summary || "A book from BrainRoot library.";

    // Remove old event listeners and add new one
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener("click", async function () {
      overlay.classList.remove("show");
      await onConfirm();
    });

    overlay.classList.add("show");
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
      cancel.textContent = "Keep in Collection";
      const confirm = document.createElement("button");
      confirm.type = "button";
      confirm.className = "return-modal-btn return-modal-btn--primary";
      confirm.textContent = "Return Book";
      actions.appendChild(cancel);
      actions.appendChild(confirm);

      modal.appendChild(body);
      modal.appendChild(actions);
      overlay.appendChild(modal);

      cancel.addEventListener("click", function () {
        overlay.classList.remove("show");
      });
      confirm.addEventListener("click", function () {
        overlay.classList.remove("show");
        if (overlay.__confirmHandler) {
          overlay.__confirmHandler();
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

    if (cover) setBookImage(cover, book.image || book.imageUrl || book.image_url, book.title);
    if (title) title.textContent = 'Return "' + book.title + '"?';
    if (message) message.textContent = "This will move the book to Returned Books history.";

    overlay.__confirmHandler = onConfirm;
    overlay.classList.add("show");
  }

  async function returnBookFlow(book, cardElement) {
    if (cardElement) cardElement.classList.add("is-returning");
    const overlay = document.getElementById("returnModalOverlay");
    if (overlay) overlay.classList.remove("show");

    showFakeLoading("Processing return...", 950, async function () {
      const success = await api.returnBook(book.title);
      if (success) {
        if (cardElement) {
          cardElement.remove();
        }
        await rerender();
        showToast('Returned "' + book.title + '" from your collection.');
      } else {
        if (cardElement) cardElement.classList.remove("is-returning");
        showToast(api.lastError || "Error returning book.");
      }
    });
  }

  async function renewBookFlow(book, cardElement) {
    if (cardElement) cardElement.classList.add("is-returning");

    showFakeLoading("Renewing book...", 850, async function () {
      const success = typeof api.renewBook === "function"
        ? await api.renewBook(book)
        : await api.borrowBook(book);

      if (success) {
        if (cardElement) {
          cardElement.remove();
        }
        currentView = "active";
        await rerender();
        showToast('Renewed "' + book.title + '" and added it to Current.');
      } else {
        if (cardElement) cardElement.classList.remove("is-returning");
        showToast(api.lastError || "Error renewing book.");
      }
    });
  }

  async function removeHistoryItemFlow(book, cardElement) {
    const confirmed = window.confirm('Remove "' + book.title + '" from history?');
    if (!confirmed) return;

    if (cardElement) cardElement.classList.add("is-returning");

    showFakeLoading("Removing history item...", 700, async function () {
      const success = typeof api.removeFromBorrowHistory === "function"
        ? await api.removeFromBorrowHistory(book)
        : false;

      if (success) {
        if (cardElement) {
          cardElement.remove();
        }
        await rerender();
        showToast('Removed "' + book.title + '" from history.');
      } else {
        if (cardElement) cardElement.classList.remove("is-returning");
        showToast(api.lastError || "Error removing history item.");
      }
    });
  }

  async function clearHistoryFlow() {
    const confirmed = window.confirm("Clear all returned and expired book history?");
    if (!confirmed) return;

    showFakeLoading("Clearing history...", 800, async function () {
      const success = typeof api.clearBorrowHistory === "function"
        ? await api.clearBorrowHistory()
        : false;

      if (success) {
        await rerender();
        showToast("History cleared.");
      } else {
        showToast(api.lastError || "Error clearing history.");
      }
    });
  }

  function showFakeLoading(message, duration, onDone) {
    let overlay = document.getElementById("collectionsLoadingOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "collectionsLoadingOverlay";
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
    if (textNode) textNode.textContent = message || "Loading...";
    overlay.classList.add("show");

    setTimeout(function () {
      overlay.classList.remove("show");
      if (typeof onDone === "function") onDone();
    }, duration || 1200);
  }

  function renderCollections(books) {
    if (!collectionsList) return;
    collectionsList.replaceChildren();
    if (collectionsEmptyState) {
      collectionsEmptyState.textContent = (viewConfig[currentView] || viewConfig.active).empty;
      collectionsEmptyState.classList.toggle("hidden", books.length > 0);
    }

    books.forEach(function (book, index) {
      const historyType = getBookHistoryType(book);
      const article = document.createElement("article");
      article.className = "collection-card";
      if (historyType === "expired") {
        article.classList.add("collection-card--expired");
      }
      if (historyType === "returned") {
        article.classList.add("collection-card--returned");
      }
      article.setAttribute("data-book-title", book.title);

      const number = document.createElement("b");
      number.className = "collection-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const cover = document.createElement("div");
      cover.className = "collection-cover";
      const image = document.createElement("img");
      setBookImage(image, book.image || book.image_url || book.imageUrl, book.title);
      cover.appendChild(image);

      const body = document.createElement("div");
      body.className = "collection-body";
      const topLine = document.createElement("div");
      topLine.className = "collection-topline";
      const titleGroup = document.createElement("div");
      const category = document.createElement("span");
      category.className = "collection-category";
      category.textContent = (book.category || "General") + " | " + (book.access || "FREE").toUpperCase();
      const title = document.createElement("h3");
      title.className = "collection-title";
      title.textContent = book.title;
      titleGroup.appendChild(category);
      titleGroup.appendChild(title);

      const saved = document.createElement("span");
      saved.className = "collection-category";
      if (historyType === "returned") {
        saved.textContent = "Returned";
      } else if (historyType === "expired") {
        saved.textContent = "Expired";
      } else if (Number(book.is_borrowed) === 1) {
        saved.textContent = "Borrowed";
      } else {
        saved.textContent = "Saved " + String(index + 1).padStart(2, "0");
      }
      topLine.appendChild(titleGroup);
      topLine.appendChild(saved);

      const summary = document.createElement("p");
      summary.className = "collection-copy";
      summary.textContent = book.author || "Unknown Author";

      const meta = document.createElement("div");
      meta.className = "collection-meta";
      let metaLabel = "";
      let metaClass = "";
      if (historyType === "returned") {
        metaLabel = "Returned " + (formatDate(book.returned_at) || "recently");
        metaClass = "collection-meta-badge--returned";
      } else if (historyType === "expired") {
        metaLabel = "Expired " + (formatDate(book.due_at) || "recently");
        metaClass = "collection-meta-badge--expired";
      } else if (book.due_at) {
        metaLabel = "Due " + (formatDate(book.due_at) || "soon");
      }

      if (metaLabel) {
        const metaBadge = document.createElement("span");
        metaBadge.className = "collection-meta-badge";
        if (metaClass) metaBadge.classList.add(metaClass);
        metaBadge.textContent = metaLabel;
        meta.appendChild(metaBadge);
      }

      const progress = document.createElement("div");
      progress.className = "collection-progress";
      const progressFill = document.createElement("span");
      const progressValue = Math.max(0, Math.min(100, Number(book.progress || 0)));
      progressFill.style.width = progressValue + "%";
      progress.appendChild(progressFill);

      const actions = document.createElement("div");
      actions.className = "collection-actions";

      if (historyType === "returned" || historyType === "expired") {
        const renewButton = document.createElement("button");
        renewButton.type = "button";
        renewButton.dataset.collectionAction = "renew";
        renewButton.className = "collection-action";
        renewButton.textContent = historyType === "expired" ? "Renew Loan" : "Renew";
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.dataset.collectionAction = "remove-history";
        removeButton.className = "collection-action collection-action--danger";
        removeButton.textContent = "Remove";
        actions.appendChild(renewButton);
        actions.appendChild(removeButton);
      } else if (Number(book.is_borrowed) === 1) {
        const readButton = document.createElement("button");
        readButton.type = "button";
        readButton.dataset.collectionAction = "read";
        readButton.className = "collection-action";
        readButton.textContent = "Read Book";
        const returnButton = document.createElement("button");
        returnButton.type = "button";
        returnButton.dataset.collectionAction = "return";
        returnButton.className = "collection-action collection-action--ghost";
        returnButton.textContent = "Return Book";
        actions.appendChild(readButton);
        actions.appendChild(returnButton);
      } else {
        const borrowButton = document.createElement("button");
        borrowButton.type = "button";
        borrowButton.dataset.collectionAction = "borrow";
        borrowButton.className = "collection-action";
        borrowButton.textContent = "Borrow Book";
        actions.appendChild(borrowButton);
      }

      body.appendChild(topLine);
      body.appendChild(summary);
      if (meta.childNodes.length > 0) {
        body.appendChild(meta);
      }
      body.appendChild(progress);
      body.appendChild(actions);
      article.appendChild(number);
      article.appendChild(cover);
      article.appendChild(body);
      collectionsList.appendChild(article);
    });
  }

  async function getRecommendationsFromAPI() {
    try {
      if (!api || typeof api.getBooks !== "function") {
        return [];
      }

      const allBooks = await api.getBooks();
      if (!Array.isArray(allBooks)) {
        return [];
      }

      let collectionBooks = [];
      let borrowedBooks = [];
      try {
        const [collectionsResult, borrowedResult] = await Promise.all([
          api.getCollections(),
          typeof api.getBorrowedBooks === "function" ? api.getBorrowedBooks() : Promise.resolve([])
        ]);
        collectionBooks = Array.isArray(collectionsResult) ? collectionsResult : [];
        borrowedBooks = Array.isArray(borrowedResult) ? borrowedResult : [];
      } catch (err) {
        console.warn("Could not fetch borrowed titles:", err);
      }

      const seedBooks = borrowedBooks.length ? borrowedBooks : collectionBooks.filter(function (book) {
        return Number(book.is_borrowed) === 1 || book.due_at;
      });

      if (seedBooks.length === 0) {
        return [];
      }

      const borrowedTitles = new Set();
      collectionBooks.concat(borrowedBooks).forEach(function (book) {
        const title = normalizeTitle(book.title);
        if (title) borrowedTitles.add(title);
      });

      const preferredCategories = new Set(seedBooks.map(function (book) {
        return String(book.category || "").trim().toLowerCase();
      }).filter(Boolean));
      const preferredAuthors = new Set(seedBooks.map(function (book) {
        return String(book.author || "").trim().toLowerCase();
      }).filter(Boolean));

      const availableBooks = allBooks.filter(function (book) {
        const title = normalizeTitle(book.title);
        return title && !borrowedTitles.has(title);
      });

      const recommendations = availableBooks
        .map(function (book, index) {
          const category = String(book.category || "").trim().toLowerCase();
          const author = String(book.author || "").trim().toLowerCase();
          let score = 0;
          if (preferredCategories.has(category)) score += 100;
          if (preferredAuthors.has(author)) score += 25;
          score += Math.min(10, Number(book.rating || 0));
          score += Math.min(10, Number(book.likes || book.like_count || 0) / 20);
          return { book: book, score: score, index: index };
        })
        .sort(function (first, second) {
          if (second.score !== first.score) return second.score - first.score;
          return first.index - second.index;
        })
        .slice(0, 5)
        .map(function (entry) {
          return entry.book;
        });

      return recommendations;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  }

  async function getRecommendedBooks() {
    return getRecommendationsFromAPI();
  }

  function renderRecommendationPrompt() {
    if (!recommendationsList) return;
    const note = document.createElement("div");
    note.className = "recommendations-note";
    const title = document.createElement("h3");
    title.textContent = "Borrow a book first";
    const copy = document.createElement("p");
    copy.textContent = "Your recommendations will appear here after you borrow a book. BrainRoot will match five related books from the archive.";
    const link = document.createElement("a");
    link.href = "../explore/explore.html";
    link.textContent = "Explore Books";
    note.append(title, copy, link);
    recommendationsList.replaceChildren(note);
  }

  async function renderRecommendations() {
    if (!recommendationsList) return;
    
    const allRecommendations = await getRecommendedBooks();
    
    recommendationsList.replaceChildren();
    if (!allRecommendations.length) {
      renderRecommendationPrompt();
      return;
    }

    const visibleCount = recommendationsExpanded ? allRecommendations.length : 5;
    allRecommendations.slice(0, visibleCount).forEach(function (book) {
      const article = document.createElement("article");
      article.className = "recommendation-card";
      article.style.cursor = "pointer";
      article.setAttribute("role", "button");
      article.setAttribute("tabindex", "0");
      
      const cover = document.createElement("div");
      cover.className = "recommendation-cover";
      const image = document.createElement("img");
      setBookImage(image, book.image || book.imageUrl || book.image_url, book.title);
      cover.appendChild(image);
      
      const body = document.createElement("div");
      body.className = "recommendation-body";
      
      const category = document.createElement("span");
      category.className = "recommendation-category";
      category.textContent = (book.category || "General").toUpperCase();
      
      const title = document.createElement("h4");
      title.className = "recommendation-title";
      title.textContent = book.title || "Untitled Book";
      
      const meta = document.createElement("p");
      meta.className = "recommendation-meta";
      meta.textContent = book.author || "Unknown Author";
      
      body.appendChild(category);
      body.appendChild(title);
      body.appendChild(meta);
      
      article.appendChild(cover);
      article.appendChild(body);
      
      // Add click handler to show confirmation modal
      article.addEventListener("click", function() {
        openBorrowConfirmModal(book, async function() {
          await borrowRecommendedBook(book);
        });
      });
      
      // Add keyboard support
      article.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBorrowConfirmModal(book, async function() {
            await borrowRecommendedBook(book);
          });
        }
      });
      
      recommendationsList.appendChild(article);
    });
  }

  async function rerender() {
    try {
      updateViewButtons();
      const books = await getBooksForCurrentView();
      renderCollections(books || []);
      await renderRecommendations();
    } catch (error) {
      console.error("Error loading:", error);
      showToast("Error loading collections.");
    }
  }

  document.addEventListener("click", async function (event) {
    const viewButton = event.target.closest("[data-collection-view]");
    if (viewButton && document.body.contains(viewButton)) {
      currentView = viewButton.getAttribute("data-collection-view") || "active";
      await rerender();
      return;
    }

    const filterButton = event.target.closest("[data-collection-filter]");
    if (filterButton && document.body.contains(filterButton)) {
      currentView = filterButton.getAttribute("data-collection-filter") || "history";
      await rerender();
      return;
    }

    const actionButton = event.target.closest("[data-collection-action]");
    if (!actionButton || !document.body.contains(actionButton)) return;

    const action = actionButton.getAttribute("data-collection-action");
    const card = actionButton.closest("[data-book-title]");
    const title = card ? card.getAttribute("data-book-title") : "book";

    if (action === "clear-history") {
      await clearHistoryFlow();
      return;
    }

    if (action === "recommendations-toggle") {
      recommendationsExpanded = !recommendationsExpanded;
      await renderRecommendations();
      return;
    }

    if (action === "return") {
      const books = await getBooksForCurrentView();
      const book = books.find(b => normalizeKey(b.title) === normalizeKey(title));
      if (book) {
        openReturnModal(book, function () {
          returnBookFlow(book, card);
        });
      }
      return;
    }

    if (action === "read") {
      const books = await getBooksForCurrentView();
      const book = books.find(b => normalizeKey(b.title) === normalizeKey(title));
      if (book && Number(book.is_borrowed) === 1) {
        openReaderForBook(book);
      } else {
        showToast("Only borrowed books can be read. Borrow this book first.");
      }
      return;
    }

    if (action === "borrow") {
      const books = await getBooksForCurrentView();
      const book = books.find(b => normalizeKey(b.title) === normalizeKey(title));
      if (book) {
        openBorrowConfirmModal(book, async function () {
          await borrowRecommendedBook(book);
        });
      }
      return;
    }

    if (action === "renew") {
      const books = await getBooksForCurrentView();
      const book = books.find(b => normalizeKey(b.title) === normalizeKey(title));
      if (book) {
        await renewBookFlow(book, card);
      }
    }

    if (action === "remove-history") {
      const books = await getBooksForCurrentView();
      const book = books.find(b => normalizeKey(b.title) === normalizeKey(title));
      if (book) {
        await removeHistoryItemFlow(book, card);
      }
    }
  });

  // Load initial data
  await rerender();
});
