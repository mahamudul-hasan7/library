document.addEventListener("DOMContentLoaded", function () {
  if (!window.brainrootAuth || !window.brainrootAuth.requireLogin("Please login to access your wishlist.")) {
    return;
  }

  const collectionsKey = "brainrootCollections";
  const wishlistContainer = document.querySelector(".wish-list");
  const wishlist = JSON.parse(localStorage.getItem("brainrootWishlist") || "[]");
  let feedbackTimer = null;

  function showFeedback(message) {
    let feedback = document.getElementById("wishlistFeedback");

    if (!feedback) {
      feedback = document.createElement("p");
      feedback.id = "wishlistFeedback";
      feedback.setAttribute("aria-live", "polite");
      feedback.style.margin = "0 0 18px";
      feedback.style.padding = "12px 14px";
      feedback.style.borderLeft = "3px solid #0b56b2";
      feedback.style.background = "#eef5fc";
      feedback.style.color = "#24476b";
      feedback.style.borderRadius = "4px";
      wishlistContainer.parentElement.insertBefore(feedback, wishlistContainer);
    }

    feedback.textContent = message;
    feedback.style.display = "block";

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }

    feedbackTimer = setTimeout(function () {
      feedback.style.display = "none";
    }, 2600);
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

  if (wishlist.length === 0) {
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

  wishlist.forEach((bookTitle, index) => {
    const bookData = defaultBooks[bookTitle] || { image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=320&q=80", category: "General", year: "2023", author: "Unknown" };
    
    const article = document.createElement("article");
    article.innerHTML = `
      <b>${String(index + 1).padStart(2, "0")}</b>
      <img src="${bookData.image}" alt="${bookTitle}">
      <div>
        <small>${bookData.category} · ${bookData.year}</small>
        <h3>${bookTitle}</h3>
        <p>${bookData.author}</p>
        <a href="../collections/collections.html">Add to Collection</a>
        <a href="#" class="remove-btn">Remove</a>
      </div>
    `;
    
    const removeBtn = article.querySelector(".remove-btn");
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const updatedWishlist = JSON.parse(localStorage.getItem("brainrootWishlist") || "[]");
      const idx = updatedWishlist.indexOf(bookTitle);
      if (idx > -1) {
        updatedWishlist.splice(idx, 1);
        localStorage.setItem("brainrootWishlist", JSON.stringify(updatedWishlist));
      }
      article.remove();
      showFeedback(`Removed "${bookTitle}" from wishlist.`);
    });

    const addBtn = article.querySelector("a:not(.remove-btn)");
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

        setAddedState(addBtn, true);
        showFeedback(`"${bookTitle}" added to your collection.`);
        window.location.href = "../collections/collections.html";
      });
    }

    wishlistContainer.appendChild(article);
  });
});
