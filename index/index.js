document.addEventListener("DOMContentLoaded", function () {
  const api = window.brainrootAPI;
  const modal = document.getElementById("bookModal");
  
  // Show book modal
  function showBookModal(book) {
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

  // Click handlers for featured books
  const featuredBooks = document.querySelectorAll(".featured .book");
  featuredBooks.forEach(bookElement => {
    bookElement.addEventListener("click", function() {
      const title = this.querySelector("h3").textContent;
      const author = this.querySelector(".author").textContent;
      const image = this.querySelector("img").src;
      const category = this.querySelector(".cat").textContent;
      const badge = this.querySelector(".badge");
      const access = badge.textContent === "PAID" ? "paid" : "free";
      
      const book = { title, author, image, category, access };
      showBookModal(book);
    });
  });

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
});
