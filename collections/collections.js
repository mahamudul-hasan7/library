document.addEventListener("DOMContentLoaded", async function () {
  const api = window.brainrootAPI;

  if (!window.brainrootAuth || !window.brainrootAuth.requireLogin("Please login to access collections.")) {
    return;
  }

  const toastId = "collectionsToast";
  const collectionsList = document.getElementById("collectionsList");
  const recommendationsList = document.getElementById("recommendationsList");
  const collectionsEmptyState = document.getElementById("collectionsEmptyState");
  let recommendationsExpanded = false;

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
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

    if (cover) cover.src = book.image || "";
    if (title) title.textContent = 'Return "' + book.title + '"?';
    if (message) message.textContent = "This will remove the book from your collection.";

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
        await rerender();
        showToast('Returned "' + book.title + '" from your collection.');
      } else {
        showToast("Error returning book.");
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
      collectionsEmptyState.classList.toggle("hidden", books.length > 0);
    }

    books.forEach(function (book, index) {
      const article = document.createElement("article");
      article.className = "collection-card";
      article.setAttribute("data-book-title", book.title);

      const cover = document.createElement("div");
      cover.className = "collection-cover";
      const image = document.createElement("img");
      image.alt = book.title;
      image.src = book.image || "";
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
      saved.textContent = "Saved " + String(index + 1).padStart(2, "0");
      topLine.appendChild(titleGroup);
      topLine.appendChild(saved);

      const summary = document.createElement("p");
      summary.className = "collection-copy";
      summary.textContent = book.summary || "A book in your collection.";

      const progress = document.createElement("div");
      progress.className = "collection-progress";
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
    });
  }

  function renderRecommendations() {
    if (!recommendationsList) return;
    const allRecommendations = [
      { title: "Atomic Habits", author: "James Clear", category: "Productivity", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80" },
      { title: "The Kite Runner", author: "Khaled Hosseini", category: "Drama", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80" },
      { title: "Dune", author: "Frank Herbert", category: "Sci-Fi", image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80" }
    ];

    recommendationsList.replaceChildren();
    const visibleCount = recommendationsExpanded ? allRecommendations.length : 3;
    allRecommendations.slice(0, visibleCount).forEach(function (book) {
      const article = document.createElement("article");
      article.className = "recommendation-card";
      const image = document.createElement("img");
      image.src = book.image;
      image.alt = book.title;
      const content = document.createElement("div");
      content.className = "recommendation-content";
      const title = document.createElement("h4");
      title.textContent = book.title;
      const author = document.createElement("p");
      author.textContent = book.author;
      content.appendChild(title);
      content.appendChild(author);
      article.appendChild(image);
      article.appendChild(content);
      recommendationsList.appendChild(article);
    });
  }

  async function rerender() {
    try {
      const books = await api.getCollections();
      renderCollections(books || []);
      renderRecommendations();
    } catch (error) {
      console.error("Error loading:", error);
      showToast("Error loading collections.");
    }
  }

  document.addEventListener("click", async function (event) {
    const actionButton = event.target.closest("[data-collection-action]");
    if (!actionButton || !document.body.contains(actionButton)) return;

    const action = actionButton.getAttribute("data-collection-action");
    const card = actionButton.closest("[data-book-title]");
    const title = card ? card.getAttribute("data-book-title") : "book";

    if (action === "recommendations-toggle") {
      recommendationsExpanded = !recommendationsExpanded;
      renderRecommendations();
      return;
    }

    if (action === "return") {
      const books = await api.getCollections();
      const book = books.find(b => normalizeKey(b.title) === normalizeKey(title));
      if (book) {
        openReturnModal(book, function () {
          returnBookFlow(book, card);
        });
      }
    }
  });

  // Load initial data
  await rerender();
});
