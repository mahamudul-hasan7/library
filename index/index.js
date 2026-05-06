document.addEventListener("DOMContentLoaded", async function () {
  const api = window.brainrootAPI;
  
  // Load books from database via API
  async function loadAndDisplayBooks() {
    try {
      const books = await api.getCollections();
      
      if (!books || books.length === 0) {
        console.log("No books found in database");
        return;
      }

      // Shuffle books for variety
      const shuffled = [...books].sort(() => Math.random() - 0.5);
      
      // Create book card HTML
      function createBookCard(book) {
        const article = document.createElement("article");
        article.className = "book-card";
        article.innerHTML = `
          <div class="book-image">
            <img src="${book.image || ''}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&q=80'">
            <span class="badge ${book.access === 'paid' ? 'paid' : 'free'}">${book.access === 'paid' ? 'PAID' : 'FREE'}</span>
          </div>
          <div class="book-info">
            <p class="category">${book.category || 'General'}</p>
            <h3>${book.title}</h3>
            <p class="author">${book.author || 'Unknown Author'}</p>
          </div>
        `;
        article.addEventListener("click", function() {
          showBookModal(book);
        });
        return article;
      }

      // Populate Trending Books (first 6)
      const trendingCarousel = document.getElementById("trendingCarousel");
      if (trendingCarousel) {
        trendingCarousel.replaceChildren();
        shuffled.slice(0, 6).forEach(book => {
          trendingCarousel.appendChild(createBookCard(book));
        });
      }

      // Populate Top Reading (books 6-12)
      const topReadingCarousel = document.getElementById("topReadingCarousel");
      if (topReadingCarousel) {
        topReadingCarousel.replaceChildren();
        shuffled.slice(6, 12).forEach(book => {
          topReadingCarousel.appendChild(createBookCard(book));
        });
      }

      // Populate Most Liked (books 12-18)
      const mostLikedCarousel = document.getElementById("mostLikedCarousel");
      if (mostLikedCarousel) {
        mostLikedCarousel.replaceChildren();
        shuffled.slice(12, 18).forEach(book => {
          mostLikedCarousel.appendChild(createBookCard(book));
        });
      }

      // Populate All Books Grid
      const allBooksGrid = document.getElementById("allBooksGrid");
      if (allBooksGrid) {
        allBooksGrid.replaceChildren();
        books.forEach(book => {
          allBooksGrid.appendChild(createBookCard(book));
        });
      }

    } catch (error) {
      console.error("Error loading books from API:", error);
      // Fallback: load featured books from HTML
      loadFeaturedBooksFromHTML();
    }
  }

  // Fallback: Load featured books from static HTML
  function loadFeaturedBooksFromHTML() {
    const featuredBooks = Array.from(document.querySelectorAll(".featured .book"));
    if (featuredBooks.length > 0) {
      const allBooksGrid = document.getElementById("allBooksGrid");
      if (allBooksGrid) {
        allBooksGrid.replaceChildren(...featuredBooks);
      }
    }
  }

  // Show book modal
  function showBookModal(book) {
    const modal = document.getElementById("bookModal");
    if (!modal) return;

    document.getElementById("modalBookImage").src = book.image || "";
    document.getElementById("modalBookCategory").textContent = book.category || "General";
    document.getElementById("modalBookTitle").textContent = book.title;
    document.getElementById("modalBookAuthor").textContent = book.author || "Unknown";
    document.getElementById("modalBookDesc").textContent = book.summary || "A curated work from the BrainRoot library.";

    const accessBadge = document.getElementById("modalAccessBadge");
    if (accessBadge) {
      accessBadge.textContent = book.access === "paid" ? "PAID" : "FREE";
    }

    modal.classList.remove("hidden");
  }

  // Close modal
  const modal = document.getElementById("bookModal");
  const modalClose = document.querySelector(".modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", function() {
      modal?.classList.add("hidden");
    });
  }

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Handle Add to Collection button
  const addToCollectionBtn = document.getElementById("addToCollectionBtn");
  if (addToCollectionBtn) {
    addToCollectionBtn.addEventListener("click", async function() {
      const title = document.getElementById("modalBookTitle").textContent;
      if (window.brainrootAuth && !window.brainrootAuth.requireLogin("Please login to add books.")) {
        return;
      }
      
      try {
        const success = await api.addToCollection({ title: title });
        if (success) {
          alert(`"${title}" added to your collection!`);
          modal?.classList.add("hidden");
        }
      } catch (error) {
        console.error("Error adding to collection:", error);
      }
    });
  }

  // Handle Add to Wishlist button
  const addToWishlistBtn = document.getElementById("addToWishlistBtn");
  if (addToWishlistBtn) {
    addToWishlistBtn.addEventListener("click", async function() {
      const title = document.getElementById("modalBookTitle").textContent;
      if (window.brainrootAuth && !window.brainrootAuth.requireLogin("Please login to add to wishlist.")) {
        return;
      }
      
      try {
        const success = await api.addToWishlist({ title: title });
        if (success) {
          alert(`"${title}" added to your wishlist!`);
          modal?.classList.add("hidden");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    });
  }

  // Load books on page load
  await loadAndDisplayBooks();
});
