const exploreBookCategories = {
  "Concrete Poetry": "Theory",
  "Structure & Light": "Architecture",
  "Urban Metabolism": "Urbanism",
  "The Modular Man": "Design",
  "Nordic Pavilions": "Architecture",
  "The Kite Runner": "Drama",
  "Dune": "Sci-Fi",
  "Spatial Dialectics": "Theory",
  "Bauhaus Theory": "History",
  "Organic Forms": "Design",
  "Atomic Habits": "Productivity",
  "The Silent Patient": "Mystery",
  "Curvature": "Design",
  "Zen Planning": "Wellness",
  "Kinetic Cities": "Urbanism",
  "Educated": "Memoir",
  "Why We Sleep": "Health"
};

function getBookAccess(title) {
  if (window.brainrootAuth && typeof window.brainrootAuth.getBookAccess === "function") {
    return window.brainrootAuth.getBookAccess(title);
  }

  return "free";
}

function isPaidSubscriber() {
  if (window.brainrootAuth && typeof window.brainrootAuth.isPaidSubscriber === "function") {
    return window.brainrootAuth.isPaidSubscriber();
  }

  return false;
}

let exploreToastTimer = null;

function showExploreToast(message) {
  let toast = document.getElementById("exploreToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "exploreToast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "24px";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "60";
    toast.style.maxWidth = "min(92vw, 540px)";
    toast.style.padding = "14px 18px";
    toast.style.borderRadius = "10px";
    toast.style.background = "rgba(15, 23, 42, 0.96)";
    toast.style.color = "#fff";
    toast.style.boxShadow = "0 18px 40px rgba(15, 23, 42, 0.22)";
    toast.style.fontSize = "14px";
    toast.style.lineHeight = "1.5";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 180ms ease, transform 180ms ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  requestAnimationFrame(function () {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  if (exploreToastTimer) {
    clearTimeout(exploreToastTimer);
  }

  exploreToastTimer = setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(8px)";
  }, 2600);
}

function openBookModal(title, author, description, status, imageUrl) {
  document.getElementById("modalBookTitle").textContent = title;
  document.getElementById("modalBookAuthor").textContent = "By " + author;
  document.getElementById("modalBookDescription").textContent = description;
  document.getElementById("modalStatus").textContent = status.toUpperCase();
  document.getElementById("modalBookImage").src = imageUrl;

  if (window.brainrootLibraryBehavior) {
    window.brainrootLibraryBehavior.recordBookView({
      title: title,
      author: author,
      category: exploreBookCategories[title] || "",
      source: "explore"
    });
  }

  const borrowBtn = document.getElementById("borrowBtn");
  const loginMsg = document.getElementById("loginMessage");
  const paidLocked = getBookAccess(title) === "paid" && !isPaidSubscriber();

  if (status === "Borrowed") {
    borrowBtn.textContent = "ON HOLD (Coming Soon)";
    borrowBtn.disabled = true;
    borrowBtn.classList.add("opacity-50", "cursor-not-allowed");
    loginMsg.classList.add("hidden");
  } else if (paidLocked) {
    borrowBtn.textContent = "Subscription Required";
    borrowBtn.disabled = true;
    borrowBtn.classList.add("opacity-50", "cursor-not-allowed");
    loginMsg.classList.remove("hidden");
    loginMsg.textContent = "This is a paid book. Upgrade your plan from Profile to borrow.";
  } else {
    borrowBtn.textContent = "Borrow Book";
    borrowBtn.disabled = false;
    borrowBtn.classList.remove("opacity-50", "cursor-not-allowed");
    loginMsg.classList.add("hidden");
  }

  document.getElementById("bookModal").classList.remove("hidden");
}

function showInlineExploreMessage(message) {
  const loginMsg = document.getElementById("loginMessage");
  if (!loginMsg) {
    return;
  }

  loginMsg.classList.remove("hidden");
  loginMsg.textContent = message;
}

function closeBookModal() {
  document.getElementById("bookModal").classList.add("hidden");
}

function borrowBook() {
  if (window.brainrootAuth && !window.brainrootAuth.requireLogin("Please login to add books to your collection.")) {
    return;
  }

  const title = document.getElementById("modalBookTitle").textContent;
  if (getBookAccess(title) === "paid" && !isPaidSubscriber()) {
    showInlineExploreMessage("This is a paid book. Upgrade your plan from Profile to borrow it.");
    return;
  }

  const borrowed = JSON.parse(localStorage.getItem("brainrootBorrowed") || "[]");
  if (!borrowed.includes(title)) {
    borrowed.push(title);
    localStorage.setItem("brainrootBorrowed", JSON.stringify(borrowed));
  }

  showExploreToast(title + " has been added to your borrowed books. Due date: 14 days from now.");
  closeBookModal();
}

function addToWishlist() {
  if (window.brainrootAuth && !window.brainrootAuth.requireLogin("Please login to add books to your wishlist.")) {
    return;
  }

  const title = document.getElementById("modalBookTitle").textContent;
  const wishlist = JSON.parse(localStorage.getItem("brainrootWishlist") || "[]");
  if (!wishlist.includes(title)) {
    wishlist.push(title);
    localStorage.setItem("brainrootWishlist", JSON.stringify(wishlist));
  }

  showExploreToast(title + " has been added to your wishlist.");
  closeBookModal();
}

window.openBookModal = openBookModal;
window.closeBookModal = closeBookModal;
window.borrowBook = borrowBook;
window.addToWishlist = addToWishlist;

document.addEventListener("click", function (event) {
  const modal = document.getElementById("bookModal");
  if (event.target === modal) {
    closeBookModal();
  }
});
