const EXPLORE_FALLBACK_BOOK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='1000' viewBox='0 0 700 1000'%3E%3Crect width='700' height='1000' fill='%23dfe8ea'/%3E%3Crect x='70' y='80' width='560' height='840' rx='24' fill='%23ffffff'/%3E%3Ctext x='350' y='470' font-family='Segoe UI, Arial' font-size='54' font-weight='700' text-anchor='middle' fill='%232d3435'%3EBrainRoot%3C/text%3E%3Ctext x='350' y='540' font-family='Segoe UI, Arial' font-size='30' text-anchor='middle' fill='%23596061'%3EBook Cover%3C/text%3E%3C/svg%3E";

function setExploreBookImage(image, source, title) {
  if (!image) return;
  image.onerror = function () {
    image.onerror = null;
    image.src = EXPLORE_FALLBACK_BOOK_IMAGE;
  };
  image.src = String(source || "").trim() || EXPLORE_FALLBACK_BOOK_IMAGE;
  image.alt = title || "Book cover";
}

const exploreBookLibrary = {
  trending: [
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      category: "Design",
      status: "Available",
      access: "paid",
      description: "A classic guide to user-centered design and why everyday objects succeed or fail.",
      coverAlt: "Cover inspired by product design sketches and clean industrial forms"
    },
    {
      title: "A Pattern Language",
      author: "Christopher Alexander",
      category: "Architecture",
      status: "Available",
      access: "paid",
      description: "A foundational book on architecture and urban planning through reusable design patterns.",
      coverAlt: "Cover inspired by architectural pattern diagrams"
    },
    {
      title: "Delirious New York",
      author: "Rem Koolhaas",
      category: "Urbanism",
      status: "Available",
      access: "free",
      description: "A manifesto on the architecture and culture of Manhattan as a modern city.",
      coverAlt: "Cover inspired by dense city blocks and skyline imagery"
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      category: "Psychology",
      status: "Available",
      access: "free",
      description: "A deep look at the two systems that shape human decision-making.",
      coverAlt: "Cover inspired by abstract cognitive and analytical imagery"
    },
    {
      title: "The Architecture of Happiness",
      author: "Alain de Botton",
      category: "Architecture",
      status: "Available",
      access: "free",
      description: "An exploration of how buildings shape mood, identity, and the way we live.",
      coverAlt: "Cover inspired by elegant interior spaces and daylight"
    },
    {
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      category: "Drama",
      status: "Available",
      access: "free",
      description: "A moving story of friendship, guilt, and redemption across decades.",
      coverAlt: "Cover inspired by a dramatic literary novel"
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      category: "Sci-Fi",
      status: "Available",
      access: "paid",
      description: "A landmark science fiction novel of ecology, power, and survival.",
      coverAlt: "Cover inspired by a sci-fi desert planet"
    }
  ],
  topReading: [
    {
      title: "The Power of Habit",
      author: "Charles Duhigg",
      category: "Productivity",
      status: "Available",
      access: "free",
      description: "How habits work and how they can be changed through simple loops.",
      coverAlt: "Cover inspired by a notebook and daily routine planning"
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Productivity",
      status: "Available",
      access: "paid",
      description: "Tiny improvements that compound into meaningful change over time.",
      coverAlt: "Cover inspired by habit tracking and desk planning"
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      category: "Productivity",
      status: "Available",
      access: "free",
      description: "A guide to focused work in a distracted digital world.",
      coverAlt: "Cover inspired by a quiet desk and focused study"
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Mystery",
      status: "Available",
      access: "free",
      description: "A psychological thriller centered on silence, secrets, and revelation.",
      coverAlt: "Cover inspired by a dark mystery novel mood"
    },
    {
      title: "Educated",
      author: "Tara Westover",
      category: "Memoir",
      status: "Available",
      access: "free",
      description: "A memoir about self-education, resilience, and transformation.",
      coverAlt: "Cover inspired by a memoir notebook and light portrait"
    }
  ],
  mostLiked: [
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      category: "History",
      status: "Available",
      access: "paid",
      description: "A broad history of humanity from ancient hunter-gatherers to the present.",
      coverAlt: "Cover inspired by an ancient manuscript and human history"
    },
    {
      title: "Why We Sleep",
      author: "Matthew Walker",
      category: "Health",
      status: "Available",
      access: "free",
      description: "Why sleep matters and how it affects health, learning, and longevity.",
      coverAlt: "Cover inspired by wellness, rest, and bedtime imagery"
    },
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      category: "Business",
      status: "Available",
      access: "free",
      description: "A practical framework for building businesses through experimentation.",
      coverAlt: "Cover inspired by startup strategy and office planning"
    },
    {
      title: "Hidden Figures",
      author: "Margot Lee Shetterly",
      category: "Biography",
      status: "Available",
      access: "free",
      description: "The true story of the women mathematicians behind NASA's success.",
      coverAlt: "Cover inspired by biography and archival photo aesthetics"
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      category: "Finance",
      status: "Available",
      access: "paid",
      description: "Lessons on money, behavior, and long-term thinking.",
      coverAlt: "Cover inspired by finance charts and thoughtful planning"
    }
  ],
  collection: [
    {
      title: "The Death and Life of Great American Cities",
      author: "Jane Jacobs",
      category: "Urbanism",
      status: "Available",
      access: "paid",
      description: "A landmark critique of urban planning and a defense of lively city streets.",
      coverAlt: "Cover inspired by city streets and neighborhood life"
    },
    {
      title: "How Buildings Learn",
      author: "Stewart Brand",
      category: "Architecture",
      status: "Borrowed",
      access: "free",
      description: "How buildings change over time and adapt to the people who use them.",
      coverAlt: "Cover inspired by building layers and construction detail"
    },
    {
      title: "The Story of Art",
      author: "E. H. Gombrich",
      category: "History",
      status: "Available",
      access: "free",
      description: "A clear and enduring introduction to the history of visual art.",
      coverAlt: "Cover inspired by museum art and historical texture"
    },
    {
      title: "On the Origin of Species",
      author: "Charles Darwin",
      category: "Science",
      status: "Available",
      access: "paid",
      description: "The foundational work that transformed how we understand life on Earth.",
      coverAlt: "Cover inspired by nature studies and scientific illustration"
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      status: "Available",
      access: "free",
      description: "A glittering novel of ambition, longing, and illusion.",
      coverAlt: "Cover inspired by jazz age style and nocturnal elegance"
    },
    {
      title: "The Book Thief",
      author: "Markus Zusak",
      category: "Drama",
      status: "Available",
      access: "free",
      description: "A moving story of words, loss, and survival in wartime Germany.",
      coverAlt: "Cover inspired by a literary drama with paper textures"
    }
  ]
};

const exploreBookCategories = Object.create(null);
const exploreBookAccessOverrides = Object.create(null);

Object.keys(exploreBookLibrary).forEach(function (sectionName) {
  exploreBookLibrary[sectionName].forEach(function (book) {
    exploreBookCategories[book.title] = book.category;
    if (book.access) {
      exploreBookAccessOverrides[normalizeTitleKey(book.title)] = book.access;
    }
  });
});

function refreshExploreLibraryMetadata() {
  Object.keys(exploreBookCategories).forEach(function (key) {
    delete exploreBookCategories[key];
  });
  Object.keys(exploreBookAccessOverrides).forEach(function (key) {
    delete exploreBookAccessOverrides[key];
  });

  Object.keys(exploreBookLibrary).forEach(function (sectionName) {
    exploreBookLibrary[sectionName].forEach(function (book) {
      exploreBookCategories[book.title] = book.category;
      if (book.access) {
        exploreBookAccessOverrides[normalizeTitleKey(book.title)] = book.access;
      }
    });
  });
}

function normalizeCatalogSection(value) {
  const section = String(value || "").trim().toLowerCase();
  if (section === "top_reading" || section === "topreading") {
    return "topReading";
  }
  if (section === "most_liked" || section === "mostliked") {
    return "mostLiked";
  }
  if (section === "trending") {
    return "trending";
  }
  return "collection";
}

function normalizeCatalogBook(book, index) {
  const title = String(book.title || book.book_name || "").trim();
  const category = String(book.category || "General").trim();
  const access = String(book.access || book.access_type || "free").trim().toLowerCase() === "paid" ? "paid" : "free";
  const imageUrl = String(book.image || book.image_url || book.imageUrl || "").trim();
  const ratingAverage = Number(book.rating_average ?? book.ratingAverage ?? book.rating ?? 0) || 0;
  const ratingCount = Number(book.rating_count ?? book.ratingCount ?? 0) || 0;

  return {
    id: book.id || index + 1,
    title: title || "Untitled Book",
    author: String(book.author || "Unknown Author").trim(),
    category: category,
    status: String(book.status || "Available").trim(),
    access: access,
    description: String(book.description || book.summary || "A curated work from the BrainRoot library.").trim(),
    imageUrl: imageUrl,
    ratingAverage: ratingAverage,
    ratingCount: ratingCount,
    publishedYear: book.published_year || book.publishedYear || "",
    createdAt: book.created_at || book.createdAt || "",
    language: book.language || "English",
    format: book.format || "Digital",
    pages: book.pages || "",
    sortIndex: Number(book.id || index + 1) || index + 1,
    sectionName: normalizeCatalogSection(book.section_name || book.sectionName || book.section)
  };
}

function setExploreBookLibraryFromCatalog(catalogBooks) {
  const books = (Array.isArray(catalogBooks) ? catalogBooks : [])
    .map(normalizeCatalogBook)
    .filter(function (book) {
      return Boolean(book.title);
    });

  if (!books.length) {
    return false;
  }

  const bySection = {
    trending: books.filter(function (book) { return book.sectionName === "trending"; }),
    topReading: books.filter(function (book) { return book.sectionName === "topReading"; }),
    mostLiked: books.filter(function (book) { return book.sectionName === "mostLiked"; }),
    collection: books
  };

  const ratingSorted = books.slice().sort(function (left, right) {
    return (right.ratingAverage || 0) - (left.ratingAverage || 0);
  });

  exploreBookLibrary.trending = bySection.trending.length ? bySection.trending : books.slice(0, 7);
  exploreBookLibrary.topReading = bySection.topReading.length ? bySection.topReading : books.slice(7, 12);
  exploreBookLibrary.mostLiked = bySection.mostLiked.length ? bySection.mostLiked : ratingSorted.slice(0, 5);
  exploreBookLibrary.collection = bySection.collection;

  refreshExploreLibraryMetadata();
  resetExploreSearchIndex();
  return true;
}

const allBooksState = {
  filter: "all",
  sort: "newest",
  visibleCount: 8,
  pageSize: 8
};

const allBooksSortLabels = {
  newest: "Newest",
  oldest: "Oldest",
  "title-asc": "Title A-Z",
  "title-desc": "Title Z-A",
  "author-asc": "Author A-Z",
  "rating-desc": "Highest Rated"
};

function renderAllBooksCollection() {
  syncAllBooksCollectionBadges();
}

function getAllBooksSection() {
  return document.getElementById("allBooksSection");
}

function getAllBooksRowsContainer() {
  const section = getAllBooksSection();
  return section ? section.querySelector(".all-books-list") : null;
}

function getAllBooksLoadMoreButton() {
  const section = getAllBooksSection();
  return section ? section.querySelector("#allBooksLoadMoreBtn") : null;
}

function getFilteredAndSortedAllBooks() {
  const books = Array.isArray(exploreBookLibrary.collection) ? exploreBookLibrary.collection.slice() : [];
  const filter = allBooksState.filter;

  const filteredBooks = books.filter(function (book) {
    if (filter === "available") {
      return String(book.status || "").trim().toLowerCase() !== "borrowed";
    }

    if (filter === "borrowed") {
      return String(book.status || "").trim().toLowerCase() === "borrowed";
    }

    if (filter === "free") {
      return String(getBookAccess(book.title) || "").trim().toLowerCase() !== "paid";
    }

    if (filter === "paid") {
      return String(getBookAccess(book.title) || "").trim().toLowerCase() === "paid";
    }

    return true;
  });

  filteredBooks.sort(function (left, right) {
    const leftTitle = String(left.title || "").trim();
    const rightTitle = String(right.title || "").trim();
    const leftAuthor = String(left.author || "").trim();
    const rightAuthor = String(right.author || "").trim();
    const leftYear = Number(left.publishedYear) || 0;
    const rightYear = Number(right.publishedYear) || 0;
    const leftRating = Number(left.ratingAverage) || 0;
    const rightRating = Number(right.ratingAverage) || 0;
    const leftSortIndex = Number(left.sortIndex) || 0;
    const rightSortIndex = Number(right.sortIndex) || 0;
    const leftCreated = Date.parse(left.createdAt || "") || 0;
    const rightCreated = Date.parse(right.createdAt || "") || 0;

    if (allBooksState.sort === "title-asc") {
      return leftTitle.localeCompare(rightTitle);
    }

    if (allBooksState.sort === "title-desc") {
      return rightTitle.localeCompare(leftTitle);
    }

    if (allBooksState.sort === "author-asc") {
      return leftAuthor.localeCompare(rightAuthor) || leftTitle.localeCompare(rightTitle);
    }

    if (allBooksState.sort === "rating-desc") {
      return rightRating - leftRating || rightSortIndex - leftSortIndex || rightTitle.localeCompare(leftTitle);
    }

    if (leftCreated !== rightCreated) {
      return allBooksState.sort === "oldest" ? leftCreated - rightCreated : rightCreated - leftCreated;
    }

    if (leftSortIndex !== rightSortIndex) {
      return allBooksState.sort === "oldest" ? leftSortIndex - rightSortIndex : rightSortIndex - leftSortIndex;
    }

    if (leftYear !== rightYear) {
      return allBooksState.sort === "oldest" ? leftYear - rightYear : rightYear - leftYear;
    }

    return allBooksState.sort === "oldest"
      ? leftTitle.localeCompare(rightTitle)
      : rightTitle.localeCompare(leftTitle);
  });

  return filteredBooks;
}

function updateAllBooksControlLabels() {
  const filterBtn = document.getElementById("allBooksFilterBtn");
  const sortBtn = document.getElementById("allBooksSortBtn");
  const countText = document.getElementById("allBooksCount");

  if (filterBtn) {
    const labelMap = {
      all: "All",
      available: "Available",
      borrowed: "Borrowed",
      free: "Free",
      paid: "Paid"
    };
    filterBtn.textContent = "Filter: " + (labelMap[allBooksState.filter] || "All");
  }

  if (sortBtn) {
    sortBtn.textContent = "Sort: " + (allBooksSortLabels[allBooksState.sort] || "Newest");
  }

  if (countText) {
    const count = getFilteredAndSortedAllBooks().length;
    const visible = Math.min(allBooksState.visibleCount, count);
    countText.textContent = "Showing " + visible + " of " + count + (count === 1 ? " book" : " books");
  }

  updateAllBooksLoadMore();
}

function closeAllBooksMenus() {
  const filterBtn = document.getElementById("allBooksFilterBtn");
  const sortBtn = document.getElementById("allBooksSortBtn");
  const filterMenu = document.getElementById("allBooksFilterMenu");
  const sortMenu = document.getElementById("allBooksSortMenu");

  if (filterBtn) {
    filterBtn.setAttribute("aria-expanded", "false");
  }
  if (sortBtn) {
    sortBtn.setAttribute("aria-expanded", "false");
  }
  if (filterMenu) {
    filterMenu.classList.add("is-hidden");
  }
  if (sortMenu) {
    sortMenu.classList.add("is-hidden");
  }
}

function setAllBooksFilter(filterValue) {
  allBooksState.filter = filterValue || "all";
  allBooksState.visibleCount = allBooksState.pageSize;
  updateAllBooksControlLabels();
  renderAllBooksCollection();
}

function setAllBooksSort(sortValue) {
  allBooksState.sort = sortValue || "newest";
  allBooksState.visibleCount = allBooksState.pageSize;
  updateAllBooksControlLabels();
  renderAllBooksCollection();
}

function updateAllBooksLoadMore() {
  const button = getAllBooksLoadMoreButton();
  if (!button) return;

  const wrapper = button.closest(".load-more-wrap");
  const total = getFilteredAndSortedAllBooks().length;
  const visible = Math.min(allBooksState.visibleCount, total);
  const remaining = Math.max(0, total - visible);
  const shouldHide = total === 0 || remaining === 0;

  button.classList.remove("is-loading");
  button.classList.toggle("is-hidden", shouldHide);
  button.disabled = remaining === 0;
  button.textContent = remaining > 0
    ? "Load " + Math.min(allBooksState.pageSize, remaining) + " More From Archive"
    : "All Books Loaded";

  if (wrapper) {
    wrapper.classList.toggle("is-hidden", shouldHide);
  }
}

function loadMoreAllBooks() {
  const button = getAllBooksLoadMoreButton();
  const total = getFilteredAndSortedAllBooks().length;

  if (!button || allBooksState.visibleCount >= total) {
    updateAllBooksLoadMore();
    return;
  }

  button.disabled = true;
  button.classList.add("is-loading");
  button.textContent = "Loading...";

  window.setTimeout(function () {
    allBooksState.visibleCount = Math.min(total, allBooksState.visibleCount + allBooksState.pageSize);
    renderAllBooksCollection();
  }, 160);
}

async function loadExploreBookLibraryFromDatabase() {
  if (!window.brainrootAPI || typeof window.brainrootAPI.getBooks !== "function") {
    return false;
  }

  const books = await window.brainrootAPI.getBooks();
  return setExploreBookLibraryFromCatalog(books);
}

const exploreCoverPools = {
  Architecture: [
    "https://images.unsplash.com/photo-1480714378408-67cf0d5c46f6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80"
  ],
  Urbanism: [
    "https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80"
  ],
  Design: [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
  ],
  Productivity: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
  ],
  Mystery: [
    "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80"
  ],
  Memoir: [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=80"
  ],
  Health: [
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1512936127315-4a9f5a3d0d5d?auto=format&fit=crop&w=900&q=80"
  ],
  History: [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80"
  ],
  Psychology: [
    "https://images.unsplash.com/photo-1495427513693-3f82f2e7f1e2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80"
  ],
  Business: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80"
  ],
  Biography: [
    "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80"
  ],
  Finance: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
  ],
  Fiction: [
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80"
  ],
  Drama: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=900&q=80"
  ],
  Science: [
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80"
  ],
  "Sci-Fi": [
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80"
  ]
};

function getBookAccess(title) {
  const normalizedTitle = normalizeTitleKey(title);
  if (normalizedTitle && exploreBookAccessOverrides[normalizedTitle]) {
    return exploreBookAccessOverrides[normalizedTitle];
  }

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

function getBookCategory(title) {
  return exploreBookCategories[String(title || "").trim()] || "General";
}

function getBookAvailability(status) {
  const normalizedStatus = String(status || "").trim().toLowerCase();
  if (normalizedStatus === "borrowed") {
    return "Not Available";
  }
  return "Available";
}

function hashBookKey(value) {
  const text = String(value || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getRelatableCoverImage(category, title) {
  const pool = exploreCoverPools[category] || exploreCoverPools.Fiction || [];
  if (!pool.length) {
    return RECOMMENDED_FALLBACK_IMAGE;
  }

  return pool[hashBookKey(title) % pool.length];
}

function getBookCoverUrl(book) {
  const directCover = String(book?.imageUrl || book?.image || book?.image_url || "").trim();
  if (directCover) {
    return directCover;
  }

  return getRelatableCoverImage(book?.category, book?.title);
}

function getBookDefinitionByTitle(title) {
  const normalizedTitle = normalizeTitleKey(title);

  for (const sectionBooks of Object.values(exploreBookLibrary)) {
    const match = sectionBooks.find(function (book) {
      return normalizeTitleKey(book.title) === normalizedTitle;
    });

    if (match) {
      return match;
    }
  }

  return null;
}

function resetExploreSearchIndex() {
  exploreSearchIndex = null;
}

function createClassedElement(tagName, className) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  return element;
}

function getBookActionPayload(element) {
  if (!element || !element.dataset || element.dataset.bookAction !== "open") {
    return null;
  }

  if (!element.dataset.bookTitle) {
    return null;
  }

  return {
    title: element.dataset.bookTitle,
    author: element.dataset.bookAuthor || "",
    description: element.dataset.bookDescription || "",
    status: element.dataset.bookStatus || "Available",
    imageUrl: element.dataset.bookImage || RECOMMENDED_FALLBACK_IMAGE
  };
}

function openBookActionFromElement(element) {
  const metadata = getBookActionPayload(element);
  if (!metadata) {
    return;
  }
  openBookModal(metadata.title, metadata.author, metadata.description, metadata.status, metadata.imageUrl);
}

function handleBookActionClick(event) {
  openBookActionFromElement(event.currentTarget);
}

function handleBookActionKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  openBookActionFromElement(event.currentTarget);
}

function setBookAction(element, book) {
  if (!element || !book) {
    return;
  }

  const category = book.category || getBookCategory(book.title);
  const imageUrl = book.imageUrl || getRelatableCoverImage(category, book.title);
  element.dataset.bookAction = "open";
  element.dataset.bookTitle = book.title || "";
  element.dataset.bookAuthor = book.author || "";
  element.dataset.bookDescription = book.description || "";
  element.dataset.bookStatus = book.status || "Available";
  element.dataset.bookImage = imageUrl;

  const tagName = String(element.tagName || "").toLowerCase();
  const needsKeyboardBinding = tagName !== "button" && tagName !== "a";
  if (needsKeyboardBinding) {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "button");
    }

    if (!element.hasAttribute("tabindex")) {
      element.tabIndex = 0;
    }
  }

  if (element.dataset.bookActionBound !== "true") {
    element.addEventListener("click", handleBookActionClick);
    if (needsKeyboardBinding) {
      element.addEventListener("keydown", handleBookActionKeydown);
    }
    element.dataset.bookActionBound = "true";
  }

  resetExploreSearchIndex();
}

let exploreToastTimer = null;
let exploreSearchIndex = null;
let exploreSearchPanel = null;
let exploreSearchResults = null;
let exploreSearchCount = null;
const EXPLORE_SEARCH_RESULT_LIMIT = 5;
const EXPLORE_BOOK_RATINGS_KEY = "brainrootBookRatings";
const RECOMMENDED_ROTATE_MS = 7000;
const RECOMMENDED_HERO_TRANSITION_MS = 220;
const RECOMMENDED_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80";

let recommendedHeroItems = [];
let recommendedHeroIndex = 0;
let recommendedHeroTimer = null;
let recommendedHeroRenderToken = 0;

function normalizeTitleKey(value) {
  return String(value || "").trim().toLowerCase();
}

function getExploreSearchIndex() {
  if (exploreSearchIndex) {
    return exploreSearchIndex;
  }

  const seenTitles = new Set();
  exploreSearchIndex = Array.from(document.querySelectorAll('[data-book-action="open"]'))
    .map(function (element) {
      const metadata = getBookActionPayload(element);
      if (!metadata) {
        return null;
      }

      const titleKey = normalizeTitleKey(metadata.title);
      if (!titleKey || seenTitles.has(titleKey)) {
        return null;
      }

      seenTitles.add(titleKey);

      return {
        element: element,
        title: metadata.title,
        author: metadata.author,
        description: metadata.description,
        status: metadata.status,
        imageUrl: metadata.imageUrl,
        searchText: [metadata.title, metadata.author, metadata.description, metadata.status, element.textContent || ""].join(" ").toLowerCase()
      };
    })
    .filter(Boolean);

  return exploreSearchIndex;
}

function upsertExploreAccessBadge(card, title) {
  if (!card) {
    return;
  }

  const access = getBookAccess(title) === "paid" ? "paid" : "free";
  const imageDiv = card.querySelector(".book-card-media");

  if (!imageDiv) {
    return;
  }

  let badge = imageDiv.querySelector("[data-access-badge]");

  if (!badge) {
    badge = document.createElement("div");
    badge.setAttribute("data-access-badge", "true");
    imageDiv.appendChild(badge);
  }

  const accessText = access === "paid" ? "Paid" : "Free";
  badge.className = "access-badge " + (access === "paid" ? "access-badge-paid" : "access-badge-free");
  badge.textContent = accessText;
}

function upsertExploreCardMeta(item) {
  if (!item || !item.element) {
    return;
  }

  const card = item.element;
  const section = card.closest("section");
  const heading = section ? section.querySelector("h2") : null;
  const sectionName = heading ? String(heading.textContent || "").trim().toLowerCase() : "";

  if (sectionName !== "trending books" && sectionName !== "most liked") {
    return;
  }

  const category = getBookCategory(item.title);
  const availability = getBookAvailability(item.status);
  const detailsWrap = card.querySelector("h3") ? card.querySelector("h3").parentElement : null;

  if (!detailsWrap) {
    return;
  }

  let metaEl = detailsWrap.querySelector("[data-card-meta]");
  if (!metaEl) {
    const detailParagraphs = Array.from(detailsWrap.querySelectorAll("p"));

    if (sectionName === "trending books" && detailParagraphs.length >= 2) {
      metaEl = detailParagraphs[1];
    } else {
      metaEl = document.createElement("p");
      const anchorEl = detailParagraphs.length ? detailParagraphs[detailParagraphs.length - 1] : detailsWrap.querySelector("h3");

      if (anchorEl) {
        anchorEl.insertAdjacentElement("afterend", metaEl);
      } else {
        detailsWrap.appendChild(metaEl);
      }
    }

    metaEl.setAttribute("data-card-meta", "true");
  }

  metaEl.className = "card-meta";
  metaEl.textContent = category + " - " + availability;
}

function markExploreCardsByAccess() {
  getExploreSearchIndex().forEach(function (item) {
    upsertExploreAccessBadge(item.element, item.title);
  });
}

function syncHorizontalShowcaseSection(sectionTitle, books) {
  const section = Array.from(document.querySelectorAll("section")).find(function (sectionElement) {
    const heading = sectionElement.querySelector("h2");
    return heading && String(heading.textContent || "").trim().toLowerCase() === String(sectionTitle || "").trim().toLowerCase();
  });

  if (!section) {
    return;
  }

  const scrollContainer = section.querySelector(".carousel-track");
  if (!scrollContainer) {
    return;
  }

  let cards = Array.from(scrollContainer.children).filter(function (child) {
    return child.classList && child.classList.contains("book-card");
  });

  if (!cards.length) {
    scrollContainer.replaceChildren();
    books.forEach(function (book) {
      const card = createClassedElement("div", "book-card hover-lift");
      const imageWrap = createClassedElement("div", "book-card-media");
      const image = createClassedElement("img", "book-card-cover");
      const rating = createClassedElement("span", "book-rating-chip");
      const category = createClassedElement("span", "book-category-chip");
      const details = createClassedElement("div", "book-card-details");
      const title = createClassedElement("h3", "book-card-title");
      const author = createClassedElement("p", "book-card-author");
      image.alt = book.coverAlt || book.title + " cover";
      rating.setAttribute("data-image-rating", "true");
      category.setAttribute("data-image-category", "true");

      imageWrap.append(image, rating, category);
      details.append(title, author);
      card.append(imageWrap, details);

      scrollContainer.appendChild(card);
    });

    cards = Array.from(scrollContainer.children).filter(function (child) {
      return child.classList && child.classList.contains("book-card");
    });
  }

  cards.forEach(function (card, index) {
    const book = books[index];
    if (!book) {
      return;
    }

    card.className = "book-card hover-lift";

    const imageEl = card.querySelector("img");
    const imageWrap = imageEl ? imageEl.parentElement : null;
    const titleEl = card.querySelector("h3");
    const detailsWrap = titleEl ? titleEl.parentElement : card;

    if (!imageEl || !titleEl || !detailsWrap || !imageWrap) {
      return;
    }

    const coverUrl = getBookCoverUrl(book);
    setBookAction(card, {
      title: book.title,
      author: book.author,
      description: book.description,
      status: book.status,
      imageUrl: coverUrl,
      category: book.category
    });
    setExploreBookImage(imageEl, coverUrl, book.coverAlt || (book.title + " cover"));

    let imageCategoryEl = imageWrap.querySelector("[data-image-category]");
    if (!imageCategoryEl) {
      imageCategoryEl = document.createElement("span");
      imageCategoryEl.setAttribute("data-image-category", "true");
      imageCategoryEl.className = "book-category-chip";
      imageWrap.appendChild(imageCategoryEl);
    }
    imageCategoryEl.textContent = book.category;

    let imageRatingEl = imageWrap.querySelector("[data-image-rating]");
    if (!imageRatingEl) {
      imageRatingEl = document.createElement("span");
      imageRatingEl.setAttribute("data-image-rating", "true");
      imageRatingEl.className = "book-rating-chip";
      imageWrap.appendChild(imageRatingEl);
    }
    const cardRatingChip = getBookRatingChip(book.title);
    imageRatingEl.textContent = cardRatingChip;
    imageRatingEl.classList.toggle("is-hidden", !cardRatingChip);

    titleEl.textContent = book.title;

    let authorEl = detailsWrap.querySelector("[data-book-author]");
    if (!authorEl) {
      const existingParagraphs = Array.from(detailsWrap.querySelectorAll("p"));
      authorEl = existingParagraphs[0] || document.createElement("p");
      if (!authorEl.parentElement) {
        titleEl.insertAdjacentElement("afterend", authorEl);
      }
      authorEl.setAttribute("data-book-author", "true");
    }
    authorEl.className = "book-card-author";
    authorEl.textContent = book.author;

    const ratingEl = detailsWrap.querySelector("[data-book-rating]");
    if (ratingEl) {
      ratingEl.remove();
    }

    const categoryEl = detailsWrap.querySelector("[data-book-category]");
    if (categoryEl) {
      categoryEl.remove();
    }

    Array.from(detailsWrap.querySelectorAll("span")).forEach(function (span) {
      if (span.getAttribute("data-access-badge") !== "true") {
        span.remove();
      }
    });
  });
}

// Load featured sections from API
async function loadFeaturedSections() {
  try {
    const sections = ['trending', 'top_reading', 'most_liked'];

    for (const section of sections) {
      try {
        const response = await fetch(`../backend/api/books-crud.php?section=${section}`);
        if (!response.ok) throw new Error('Failed to fetch featured books');

        const data = await response.json();

        if (!data.success || !data.books || data.books.length === 0) {
          continue;
        }

        // Convert API response to exploreBookLibrary format
        const convertedBooks = data.books.map(book => ({
          title: book.title || '',
          author: book.author || 'Unknown',
          category: book.category || 'General',
          status: book.status || 'Available',
          access: (book.access_type || 'free').toLowerCase() === 'paid' ? 'paid' : 'free',
          description: book.description || '',
          coverAlt: book.title + ' cover',
          imageUrl: book.image_url || book.image || ''
        }));

        // Update library based on section
        if (section === 'trending') {
          exploreBookLibrary.trending = convertedBooks;
        } else if (section === 'top_reading') {
          exploreBookLibrary.topReading = convertedBooks;
        } else if (section === 'most_liked') {
          exploreBookLibrary.mostLiked = convertedBooks;
        }
      } catch (sectionError) {
        console.error(`Error loading ${section} books:`, sectionError);
        // Continue with next section
      }
    }
  } catch (error) {
    console.error('Error loading featured sections:', error);
  }
}

function syncExploreBookLibrary() {
  syncHorizontalShowcaseSection("Trending Books", exploreBookLibrary.trending);
  syncHorizontalShowcaseSection("Top Reading", exploreBookLibrary.topReading);
  syncHorizontalShowcaseSection("Most Liked", exploreBookLibrary.mostLiked);
  renderAllBooksCollection();
  setupCarouselNavigation();
}

function initializeAllBooksControls() {
  const filterBtn = document.getElementById("allBooksFilterBtn");
  const sortBtn = document.getElementById("allBooksSortBtn");
  const filterMenu = document.getElementById("allBooksFilterMenu");
  const sortMenu = document.getElementById("allBooksSortMenu");

  if (filterBtn && filterBtn.dataset.menuBound !== "true") {
    filterBtn.dataset.menuBound = "true";
    filterBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      const isOpen = !filterMenu.classList.contains("is-hidden");
      closeAllBooksMenus();
      if (!isOpen) {
        filterMenu.classList.remove("is-hidden");
        filterBtn.setAttribute("aria-expanded", "true");
      }
    });
  }

  if (sortBtn && sortBtn.dataset.menuBound !== "true") {
    sortBtn.dataset.menuBound = "true";
    sortBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      const isOpen = !sortMenu.classList.contains("is-hidden");
      closeAllBooksMenus();
      if (!isOpen) {
        sortMenu.classList.remove("is-hidden");
        sortBtn.setAttribute("aria-expanded", "true");
      }
    });
  }

  if (filterMenu && filterMenu.dataset.menuBound !== "true") {
    filterMenu.dataset.menuBound = "true";
    filterMenu.addEventListener("click", function (event) {
      const target = event.target.closest("[data-all-books-filter]");
      if (!target) {
        return;
      }

      const filterValue = target.getAttribute("data-all-books-filter") || "all";
      filterMenu.querySelectorAll(".control-menu-item").forEach(function (item) {
        item.classList.toggle("is-active", item === target);
      });
      setAllBooksFilter(filterValue);
      closeAllBooksMenus();
    });
  }

  if (sortMenu && sortMenu.dataset.menuBound !== "true") {
    sortMenu.dataset.menuBound = "true";
    sortMenu.addEventListener("click", function (event) {
      const target = event.target.closest("[data-all-books-sort]");
      if (!target) {
        return;
      }

      const sortValue = target.getAttribute("data-all-books-sort") || "newest";
      setAllBooksSort(sortValue);
      sortMenu.querySelectorAll(".control-menu-item").forEach(function (item) {
        item.classList.toggle("is-active", item === target);
      });
      closeAllBooksMenus();
    });
  }

  if (!document.body.dataset.allBooksMenuBound) {
    document.body.dataset.allBooksMenuBound = "true";
    document.addEventListener("click", function (event) {
      const loadMoreTarget = event.target.closest("[data-all-books-action='load-more']");
      if (loadMoreTarget) {
        loadMoreAllBooks();
        return;
      }

      closeAllBooksMenus();
    });
  }

  updateAllBooksControlLabels();
}

function setupCarouselNavigation() {
  const carouselSections = document.querySelectorAll(".carousel-section");

  carouselSections.forEach(function (section) {
    const prevBtn = section.querySelector(".carousel-prev-btn");
    const nextBtn = section.querySelector(".carousel-next-btn");
    const scrollContainer = section.querySelector(".carousel-track");

    if (!prevBtn || !nextBtn || !scrollContainer) {
      return;
    }

    if (section.dataset.carouselBound === "true") {
      return;
    }
    section.dataset.carouselBound = "true";

    function getScrollStep() {
      const firstCard = scrollContainer.querySelector(".book-card");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 220;
      const styles = window.getComputedStyle(scrollContainer);
      const gapValue = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return Math.max(160, Math.round(cardWidth + gapValue));
    }

    function updateButtonStates() {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;

      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
    }

    prevBtn.addEventListener("click", function () {
      const step = getScrollStep();
      scrollContainer.scrollBy({
        left: -step,
        behavior: "smooth"
      });
      setTimeout(updateButtonStates, 300);
    });

    nextBtn.addEventListener("click", function () {
      const step = getScrollStep();
      scrollContainer.scrollBy({
        left: step,
        behavior: "smooth"
      });
      setTimeout(updateButtonStates, 300);
    });

    scrollContainer.addEventListener("scroll", updateButtonStates);
    window.addEventListener("resize", updateButtonStates);

    setTimeout(updateButtonStates, 100);
  });
}

function syncAllBooksCollectionBadges() {
  const listContainer = getAllBooksRowsContainer();
  if (!listContainer) {
    return;
  }

  const collectionBooks = getFilteredAndSortedAllBooks();
  listContainer.replaceChildren();

  if (!collectionBooks.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "explore-search-empty";
    emptyState.textContent = "No books match the selected filter.";
    listContainer.appendChild(emptyState);
    updateAllBooksControlLabels();
    return;
  }

  collectionBooks.slice(0, allBooksState.visibleCount).forEach(function (metadata) {
    const row = createClassedElement("div", "all-books-row");
    const rowContent = createClassedElement("div", "all-books-row-main");
    const imageWrap = createClassedElement("div", "all-books-cover-wrap");
    const image = createClassedElement("img", "all-books-cover");
    const imageRating = createClassedElement("span", "all-books-rating-chip");
    const grid = createClassedElement("div", "all-books-info-grid");
    const titleWrap = createClassedElement("div", "all-books-copy");
    const title = createClassedElement("h4", "all-books-row-title");
    const author = createClassedElement("p", "all-books-author");
    const categoryText = createClassedElement("p", "all-books-category");
    const badgeWrap = createClassedElement("div", "all-books-badges");
    const detailsButton = createClassedElement("button", "all-books-details-btn");

    image.alt = metadata.coverAlt || metadata.title + " cover";
    imageRating.setAttribute("data-all-books-image-rating", "true");
    detailsButton.type = "button";
    detailsButton.textContent = "View Details";

    const coverUrl = getBookCoverUrl(metadata);
    const availability = getBookAvailability(metadata.status);
    const access = getBookAccess(metadata.title) === "paid" ? "Paid" : "Free";

    const availabilityBadge = document.createElement("span");
    availabilityBadge.className = "status-badge " + (availability === "Available" ? "status-badge-available" : "status-badge-unavailable");
    availabilityBadge.textContent = availability;

    const accessBadge = document.createElement("span");
    accessBadge.className = "access-badge " + (access === "Paid" ? "access-badge-paid" : "access-badge-free");
    accessBadge.textContent = access;

    const listRatingChip = getBookRatingChip(metadata.title);
    imageRating.textContent = listRatingChip;
    imageRating.classList.toggle("is-hidden", !listRatingChip);

    title.textContent = metadata.title;
    author.textContent = metadata.author;
    categoryText.className = "all-books-category";
    categoryText.textContent = "Category: " + metadata.category;

    setExploreBookImage(image, coverUrl, metadata.coverAlt || (metadata.title + " cover"));
    setBookAction(detailsButton, {
      title: metadata.title,
      author: metadata.author,
      description: metadata.description,
      status: metadata.status,
      imageUrl: coverUrl,
      category: metadata.category
    });
    detailsButton.textContent = "View Details";

    imageWrap.append(image, imageRating);
    titleWrap.append(title, author, categoryText);
    grid.append(titleWrap, badgeWrap);
    rowContent.append(imageWrap, grid);
    row.append(rowContent, detailsButton);
    badgeWrap.replaceChildren(availabilityBadge, accessBadge);
    listContainer.appendChild(row);
  });

  updateAllBooksControlLabels();
}

function getCollectionsTitles() {
  try {
    const parsed = JSON.parse(localStorage.getItem("brainrootCollections") || "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
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
  } catch (error) {
    return [];
  }
}

async function getCollectionsFromAPI() {
  try {
    if (!window.brainrootAPI || typeof window.brainrootAPI.getCollections !== "function") {
      return [];
    }

    const collections = await window.brainrootAPI.getCollections();
    if (!Array.isArray(collections)) {
      return [];
    }

    return collections
      .map(function (book) {
        return String(book.title || book.book_name || "").trim();
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching collections from API:", error);
    return [];
  }
}

async function getAllCollectionTitles() {
  // Try API first if user is logged in
  const isLoggedIn = window.brainrootAuth && window.brainrootAuth.isLoggedIn && window.brainrootAuth.isLoggedIn();
  
  if (isLoggedIn) {
    const apiTitles = await getCollectionsFromAPI();
    if (apiTitles.length > 0) {
      return apiTitles;
    }
  }

  // Fall back to localStorage
  return getCollectionsTitles();
}

function getExploreCatalogByTitle() {
  const catalog = new Map();

  getExploreSearchIndex().forEach(function (item) {
    const key = normalizeTitleKey(item.title);
    if (!key || catalog.has(key)) {
      return;
    }

    catalog.set(key, {
      title: item.title,
      author: item.author,
      description: item.description,
      status: item.status,
      imageUrl: item.imageUrl
    });
  });

  return catalog;
}

function buildFallbackRecommendedBook(title) {
  const cleanedTitle = String(title || "").trim();
  const category = exploreBookCategories[cleanedTitle] || "General";
  const computedImage = getRelatableCoverImage(category, cleanedTitle || "Untitled Book");

  return {
    title: cleanedTitle || "Untitled Book",
    author: "Unknown Author",
    description: "A curated book from your collection in " + category + ".",
    status: "Available",
    imageUrl: computedImage || RECOMMENDED_FALLBACK_IMAGE
  };
}

function getNormalizedRecommendedBook(book) {
  if (!book || typeof book !== "object") {
    return buildFallbackRecommendedBook("Untitled Book");
  }

  const normalizedTitle = String(book.title || "Untitled Book").trim();
  const category = getBookCategory(normalizedTitle);
  const resolvedImage = String(book.imageUrl || "").trim();

  return {
    title: normalizedTitle,
    author: String(book.author || "Unknown Author"),
    description: String(book.description || ("A curated book from your collection in " + category + ".")),
    status: String(book.status || "Available"),
    imageUrl: resolvedImage || getRelatableCoverImage(category, normalizedTitle) || RECOMMENDED_FALLBACK_IMAGE
  };
}

function getRecommendedBooksFromCollections(titles) {
  if (!titles || !titles.length) {
    return [];
  }

  const catalog = getExploreCatalogByTitle();
  const seen = new Set();

  return titles
    .map(function (title) {
      const key = normalizeTitleKey(title);
      if (!key || seen.has(key)) {
        return null;
      }

      seen.add(key);
      return catalog.get(key) || buildFallbackRecommendedBook(title);
    })
    .filter(Boolean);
}

function preloadRecommendedHeroImage(source) {
  const resolvedSource = String(source || "").trim() || RECOMMENDED_FALLBACK_IMAGE;

  return new Promise(function (resolve) {
    const image = new Image();

    image.onload = function () {
      resolve(resolvedSource);
    };

    image.onerror = function () {
      if (resolvedSource === RECOMMENDED_FALLBACK_IMAGE) {
        resolve(EXPLORE_FALLBACK_BOOK_IMAGE);
        return;
      }

      const fallbackImage = new Image();

      fallbackImage.onload = function () {
        resolve(RECOMMENDED_FALLBACK_IMAGE);
      };

      fallbackImage.onerror = function () {
        resolve(EXPLORE_FALLBACK_BOOK_IMAGE);
      };

      fallbackImage.src = RECOMMENDED_FALLBACK_IMAGE;
    };

    image.src = resolvedSource;
  });
}

function renderRecommendedHero(book) {
  const titleEl = document.getElementById("recommendedHeroTitle");
  const descriptionEl = document.getElementById("recommendedHeroDescription");
  const imageEl = document.getElementById("recommendedHeroImage");
  const badgeEl = document.getElementById("recommendedHeroAccessBadge");
  const reserveBtn = document.getElementById("recommendedHeroReserveBtn");
  const borrowBtn = document.getElementById("recommendedHeroBorrowBtn");
  const detailsBtn = document.getElementById("recommendedHeroDetailsBtn");
  const heroCard = imageEl ? imageEl.closest(".hero-card") : null;

  if (!titleEl || !descriptionEl || !imageEl || !badgeEl || !reserveBtn || !borrowBtn || !detailsBtn || !book) {
    return;
  }

  const renderToken = ++recommendedHeroRenderToken;
  const imageUrl = String(book.imageUrl || RECOMMENDED_FALLBACK_IMAGE).trim() || RECOMMENDED_FALLBACK_IMAGE;
  let displayedImageUrl = imageUrl;

  function openCurrentRecommendedBook() {
    openBookModal(book.title, book.author, book.description, book.status || "Available", displayedImageUrl);
  }

  async function borrowRecommendedBook() {
    const title = book.title;
    const status = book.status || "Available";

    if (window.brainrootAuth) {
      const canBorrow = typeof window.brainrootAuth.requireBackendLogin === "function"
        ? await window.brainrootAuth.requireBackendLogin("Please login to borrow books.")
        : window.brainrootAuth.requireLogin("Please login to borrow books.");

      if (!canBorrow) {
        return;
      }
    }

    if (status !== "Available") {
      showExploreToast("This book is not available for borrowing.", "neutral");
      return;
    }

    try {
      const isAlreadyBorrowed = window.brainrootAPI && typeof window.brainrootAPI.isBookBorrowed === "function"
        ? await window.brainrootAPI.isBookBorrowed(title)
        : false;
      if (isAlreadyBorrowed) {
        showExploreToast("This book is already in your borrowed collection.", "neutral");
        return;
      }

      const success = window.brainrootAPI && typeof window.brainrootAPI.borrowBook === "function" && await window.brainrootAPI.borrowBook({
        title: title,
        author: book.author || "Unknown Author",
        category: book.category || "General",
        image: displayedImageUrl,
        description: book.description || "",
        access: getBookAccess(title)
      });

      if (success) {
        borrowBtn.textContent = "Already Borrowed";
        borrowBtn.disabled = true;
        showExploreToast('Added "' + title + '" to your collection.', "success");
      } else {
        showExploreToast("Error borrowing book. Try again.", "error");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      showExploreToast("Error borrowing book. Try again.", "error");
    }
  }

  preloadRecommendedHeroImage(imageUrl).then(function (resolvedImageUrl) {
    if (renderToken !== recommendedHeroRenderToken) {
      return;
    }

    const hasRenderedHero = heroCard && heroCard.dataset.recommendedHeroReady === "true";
    const transitionDelay = hasRenderedHero ? RECOMMENDED_HERO_TRANSITION_MS : 0;

    if (hasRenderedHero) {
      heroCard.dataset.recommendedHeroToken = String(renderToken);
      heroCard.classList.add("is-transitioning");
    }

    window.setTimeout(function () {
      if (renderToken !== recommendedHeroRenderToken) {
        if (heroCard && heroCard.dataset.recommendedHeroToken === String(renderToken)) {
          heroCard.classList.remove("is-transitioning");
        }
        return;
      }

      displayedImageUrl = resolvedImageUrl;
      titleEl.textContent = book.title;
      descriptionEl.textContent = book.description;
      setExploreBookImage(imageEl, resolvedImageUrl, book.title + " cover");
      badgeEl.textContent = "";
      badgeEl.className = "hero-access-badge is-hidden";
      borrowBtn.textContent = book.status === "Borrowed" ? "Already Borrowed" : "Borrow";
      borrowBtn.disabled = book.status === "Borrowed";

      if (heroCard) {
        heroCard.dataset.recommendedHeroReady = "true";
        window.requestAnimationFrame(function () {
          heroCard.classList.remove("is-transitioning");
        });
      }

      setRecommendedHeroButtonAction(reserveBtn, openCurrentRecommendedBook);
      setRecommendedHeroButtonAction(borrowBtn, borrowRecommendedBook);
      setRecommendedHeroButtonAction(detailsBtn, openCurrentRecommendedBook);

      (async function () {
        try {
          const alreadyBorrowed = window.brainrootAPI && typeof window.brainrootAPI.isBookBorrowed === "function"
            ? await window.brainrootAPI.isBookBorrowed(book.title)
            : false;

          if (renderToken !== recommendedHeroRenderToken) {
            return;
          }

          if (alreadyBorrowed || book.status === "Borrowed") {
            borrowBtn.textContent = "Already Borrowed";
            borrowBtn.disabled = true;
          } else {
            borrowBtn.textContent = "Borrow";
            borrowBtn.disabled = false;
          }
        } catch (error) {
          console.error("Error checking borrow status:", error);
        }
      })();
    }, transitionDelay);
  });
}

function setRecommendedHeroVisibility(isVisible) {
  const heroSection = document.getElementById("recommendedHeroSection");
  if (!heroSection) {
    return;
  }

  heroSection.classList.toggle("is-hidden", !isVisible);
}

function stopRecommendedHeroRotation() {
  if (recommendedHeroTimer) {
    clearInterval(recommendedHeroTimer);
    recommendedHeroTimer = null;
  }
}

function startRecommendedHeroRotation() {
  stopRecommendedHeroRotation();

  if (recommendedHeroItems.length <= 1) {
    return;
  }

  recommendedHeroTimer = setInterval(function () {
    recommendedHeroIndex = (recommendedHeroIndex + 1) % recommendedHeroItems.length;
    renderRecommendedHero(recommendedHeroItems[recommendedHeroIndex]);
  }, RECOMMENDED_ROTATE_MS);
}

function getDefaultRecommendedBooks() {
  const catalogItems = Array.from(getExploreCatalogByTitle().values());
  if (catalogItems.length) {
    return catalogItems.slice(0, 3);
  }

  return [buildFallbackRecommendedBook("Concrete Poetry")];
}

function runRecommendedHeroButtonAction(event) {
  const action = event.currentTarget._recommendedHeroAction;
  if (typeof action === "function") {
    action();
  }
}

function setRecommendedHeroButtonAction(button, action) {
  button._recommendedHeroAction = action;

  if (button.dataset.recommendedActionBound === "true") {
    return;
  }

  button.addEventListener("click", runRecommendedHeroButtonAction);
  button.dataset.recommendedActionBound = "true";
}

async function refreshRecommendedHeroFromCollections() {
  const titles = await getAllCollectionTitles();
  const recommended = getRecommendedBooksFromCollections(titles);
  const sourceItems = recommended.length ? recommended : getDefaultRecommendedBooks();
  recommendedHeroItems = sourceItems.map(getNormalizedRecommendedBook);
  recommendedHeroIndex = 0;
  setRecommendedHeroVisibility(true);
  renderRecommendedHero(recommendedHeroItems[recommendedHeroIndex]);
  startRecommendedHeroRotation();
}

function ensureExploreSearchPanel() {
  if (exploreSearchPanel && exploreSearchResults && exploreSearchCount) {
    return exploreSearchPanel;
  }

  exploreSearchPanel = document.getElementById("exploreSearchPanel");
  exploreSearchResults = document.getElementById("exploreSearchResults");
  exploreSearchCount = document.getElementById("exploreSearchCount");

  return exploreSearchPanel;
}

function hideExploreSearchPanel() {
  const panel = ensureExploreSearchPanel();
  if (!panel) {
    return;
  }

  panel.classList.add("is-hidden");
  if (exploreSearchResults) {
    exploreSearchResults.replaceChildren();
  }
  if (exploreSearchCount) {
    exploreSearchCount.textContent = "0 results";
  }
}

function openSearchResult(item) {
  if (!item) {
    return;
  }

  openBookModal(item.title, item.author, item.description, item.status, item.imageUrl);
  hideExploreSearchPanel();
  const searchInput = document.getElementById("exploreSearchInput");
  if (searchInput) {
    searchInput.value = item.title;
  }
}

function renderExploreSearchResults(query) {
  const panel = ensureExploreSearchPanel();
  if (!panel || !exploreSearchResults || !exploreSearchCount) {
    return;
  }

  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    hideExploreSearchPanel();
    return;
  }

  const matches = getExploreSearchIndex().filter(function (item) {
    return item.searchText.indexOf(normalizedQuery) !== -1;
  }).slice(0, EXPLORE_SEARCH_RESULT_LIMIT);

  exploreSearchResults.replaceChildren();
  exploreSearchCount.textContent = matches.length + (matches.length === 1 ? " result" : " results");

  if (matches.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "explore-search-empty";
    emptyState.textContent = 'No books matched "' + query.trim() + '". Try a different title, author, or category.';
    exploreSearchResults.appendChild(emptyState);
    panel.classList.remove("is-hidden");
    return;
  }

  matches.forEach(function (item) {
    const access = getBookAccess(item.title) === "paid" ? "Paid" : "Free";
    const category = getBookCategory(item.title);
    const button = createClassedElement("button", "explore-search-item");
    const layout = createClassedElement("div", "explore-search-item-layout");
    const image = createClassedElement("img", "explore-search-item-thumb");
    const copy = createClassedElement("div", "explore-search-item-copy");
    const title = createClassedElement("p", "explore-search-item-title");
    const meta = createClassedElement("p", "explore-search-item-meta");

    button.type = "button";
    setExploreBookImage(image, item.imageUrl, item.title);
    image.alt = item.title;
    title.textContent = item.title;
    meta.textContent = item.author + " - " + category + " - " + access;
    copy.append(title, meta);
    layout.append(image, copy);
    button.appendChild(layout);
    button.addEventListener("click", function () {
      openSearchResult(item);
    });
    exploreSearchResults.appendChild(button);
  });

  panel.classList.remove("is-hidden");
}

function showExploreToast(message) {
  let toast = document.getElementById("exploreToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "exploreToast";
    toast.className = "explore-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  requestAnimationFrame(function () {
    toast.classList.add("is-visible");
  });

  if (exploreToastTimer) {
    clearTimeout(exploreToastTimer);
  }

  exploreToastTimer = setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 2600);
}

function readExploreRatingsStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(EXPLORE_BOOK_RATINGS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeExploreRatingsStore(store) {
  localStorage.setItem(EXPLORE_BOOK_RATINGS_KEY, JSON.stringify(store || {}));
}

function getCurrentRaterId() {
  if (window.brainrootAuth && typeof window.brainrootAuth.getCurrentUser === "function") {
    const user = window.brainrootAuth.getCurrentUser();
    if (user && user.email) {
      return "user:" + String(user.email).trim().toLowerCase();
    }
  }

  const guestKey = "brainrootGuestRatingId";
  let guestId = localStorage.getItem(guestKey) || "";
  if (!guestId) {
    guestId = "guest-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(guestKey, guestId);
  }

  return guestId;
}

function getRatingRecordByTitle(title) {
  const store = readExploreRatingsStore();
  const key = normalizeTitleKey(title);
  const record = store[key] || {};
  const users = record.users && typeof record.users === "object" ? record.users : {};
  const ratings = Object.values(users).filter(function (value) {
    return Number(value) >= 1 && Number(value) <= 5;
  });

  const count = ratings.length;
  const sum = ratings.reduce(function (acc, value) {
    return acc + Number(value);
  }, 0);
  const average = count ? (sum / count) : 0;

  return {
    key: key,
    users: users,
    count: count,
    average: average
  };
}

function getDatabaseRatingRecord(title) {
  const book = getBookDefinitionByTitle(title);
  const average = Number(book?.ratingAverage ?? book?.rating_average ?? 0) || 0;
  const count = Number(book?.ratingCount ?? book?.rating_count ?? 0) || 0;

  return {
    count: count,
    average: average
  };
}

function applyRemoteRatingSummary(title, summary) {
  if (!summary) {
    return;
  }

  const book = getBookDefinitionByTitle(title);
  if (book) {
    book.ratingAverage = Number(summary.average || 0) || 0;
    book.rating_average = book.ratingAverage;
    book.ratingCount = Number(summary.count || 0) || 0;
    book.rating_count = book.ratingCount;
  }

  if (summary.user_rating) {
    const store = readExploreRatingsStore();
    const key = normalizeTitleKey(title);
    const entry = store[key] && typeof store[key] === "object" ? store[key] : {};
    const users = entry.users && typeof entry.users === "object" ? entry.users : {};
    users[getCurrentRaterId()] = Number(summary.user_rating);
    store[key] = { users: users };
    writeExploreRatingsStore(store);
  }
}

async function loadRemoteRatingForTitle(title) {
  if (!window.brainrootAPI || typeof window.brainrootAPI.getBookRating !== "function" || !title) {
    return;
  }

  try {
    const summary = await window.brainrootAPI.getBookRating(title);
    applyRemoteRatingSummary(title, summary);
    renderModalRating(title);
    syncExploreBookLibrary();
  } catch (error) {
    console.error("Rating sync failed:", error);
  }
}

function getBookRatingLabel(title) {
  const record = getRatingRecordByTitle(title);
  const databaseRecord = getDatabaseRatingRecord(title);
  const ratingRecord = record.count ? record : databaseRecord;

  if (!ratingRecord.count) {
    return "Rating: New";
  }

  return "Rating: " + ratingRecord.average.toFixed(1) + " / 5";
}

function getBookRatingChip(title) {
  const record = getRatingRecordByTitle(title);
  const databaseRecord = getDatabaseRatingRecord(title);
  const ratingRecord = record.count ? record : databaseRecord;

  if (!ratingRecord.count) {
    return "";
  }

  return "* " + ratingRecord.average.toFixed(1);
}

function setUserRatingForTitle(title, ratingValue) {
  const value = Math.max(1, Math.min(5, Number(ratingValue) || 0));
  if (!value) {
    return;
  }

  const store = readExploreRatingsStore();
  const key = normalizeTitleKey(title);
  const userId = getCurrentRaterId();
  const entry = store[key] && typeof store[key] === "object" ? store[key] : {};
  const users = entry.users && typeof entry.users === "object" ? entry.users : {};

  users[userId] = value;
  store[key] = { users: users };
  writeExploreRatingsStore(store);

  if (window.brainrootAPI && typeof window.brainrootAPI.rateBook === "function") {
    window.brainrootAPI.rateBook(title, value).then(function (summary) {
      applyRemoteRatingSummary(title, summary);
      renderModalRating(title);
      syncExploreBookLibrary();
    }).catch(function (error) {
      console.error("Rating save failed:", error);
    });
  }
}

function renderModalRating(title) {
  const summaryEl = document.getElementById("modalBookRatingSummary");
  const userTextEl = document.getElementById("modalUserRatingText");
  const starsWrap = document.getElementById("modalUserRatingStars");

  if (!summaryEl || !userTextEl || !starsWrap) {
    return;
  }

  const record = getRatingRecordByTitle(title);
  const databaseRecord = getDatabaseRatingRecord(title);
  const summaryRecord = record.count ? record : databaseRecord;
  const averageText = summaryRecord.count ? summaryRecord.average.toFixed(1) : "0.0";
  summaryEl.textContent = "Book Rating: " + averageText + " (" + summaryRecord.count + (summaryRecord.count === 1 ? " rating" : " ratings") + ")";

  const userId = getCurrentRaterId();
  const userRating = Number(record.users[userId] || 0);
  userTextEl.textContent = userRating ? ("Your Rating: " + userRating + "/5") : "Your Rating: Not rated";

  Array.from(starsWrap.querySelectorAll(".rating-star")).forEach(function (star) {
    const value = Number(star.getAttribute("data-rating-value"));
    star.classList.toggle("is-active", value <= userRating);
  });
}

function initializeModalRatingControls() {
  const starsWrap = document.getElementById("modalUserRatingStars");
  if (!starsWrap || starsWrap.getAttribute("data-rating-ready") === "true") {
    return;
  }

  starsWrap.setAttribute("data-rating-ready", "true");

  Array.from(starsWrap.querySelectorAll(".rating-star")).forEach(function (star) {
    star.addEventListener("click", function () {
      const title = document.getElementById("modalBookTitle").textContent;
      const value = Number(star.getAttribute("data-rating-value"));
      if (!title || !value) {
        return;
      }

      setUserRatingForTitle(title, value);
      renderModalRating(title);
      syncExploreBookLibrary();
      showExploreToast("Thanks for rating \"" + title + "\" " + value + "/5.");
    });
  });
}

function openBookModal(title, author, description, status, imageUrl) {
  initializeModalRatingControls();
  const bookDefinition = getBookDefinitionByTitle(title) || {};
  const resolvedStatus = status || bookDefinition.status || "Available";
  const resolvedImage = imageUrl || getBookCoverUrl(bookDefinition);
  document.getElementById("modalBookTitle").textContent = title;
  document.getElementById("modalBookAuthor").textContent = author || bookDefinition.author || "Unknown Author";
  document.getElementById("modalBookDescription").textContent = description || bookDefinition.description || "A curated work from the BrainRoot library.";
  document.getElementById("modalStatus").textContent = resolvedStatus.toUpperCase();
  setExploreBookImage(document.getElementById("modalBookImage"), resolvedImage, title + " cover");

  const detailValues = document.querySelectorAll(".book-modal-details-grid .detail-value");
  if (detailValues.length >= 4) {
    detailValues[0].textContent = bookDefinition.publishedYear || bookDefinition.published_year || "Unknown";
    detailValues[1].textContent = bookDefinition.language || "English";
    detailValues[2].textContent = bookDefinition.format || "Digital";
    detailValues[3].textContent = bookDefinition.pages || "Unknown";
  }

  renderModalRating(title);
  loadRemoteRatingForTitle(title);

  if (window.brainrootLibraryBehavior) {
    window.brainrootLibraryBehavior.recordBookView({
      title: title,
      author: author,
      category: exploreBookCategories[title] || "",
      source: "explore"
    });
  }

  
  const borrowBtn = document.getElementById("borrowBtn");
  const wishlistBtn = document.getElementById("wishlistBtn");
  const loginMsg = document.getElementById("loginMessage");
  const paidLocked = getBookAccess(title) === "paid" && !isPaidSubscriber();

  if (wishlistBtn) {
    wishlistBtn.textContent = "+ Add to Wishlist";
    wishlistBtn.disabled = false;
    wishlistBtn.classList.remove("is-disabled");
  }

  // Check if already borrowed using API
  (async function() {
    try {
      const canCheckBorrowed = window.brainrootAPI && typeof window.brainrootAPI.isBookBorrowed === "function";
      const alreadyBorrowed = canCheckBorrowed ? await window.brainrootAPI.isBookBorrowed(title) : false;
      
      if (alreadyBorrowed || resolvedStatus === "Borrowed") {
        borrowBtn.textContent = "Already Borrowed";
        borrowBtn.disabled = true;
        borrowBtn.classList.add("is-disabled");
        if (wishlistBtn) {
          wishlistBtn.textContent = "Already Borrowed";
          wishlistBtn.disabled = true;
          wishlistBtn.classList.add("is-disabled");
        }
        loginMsg.classList.add("is-hidden");
      } else if (paidLocked) {
        borrowBtn.textContent = "Subscription Required";
        borrowBtn.disabled = true;
        borrowBtn.classList.add("is-disabled");
        loginMsg.classList.remove("is-hidden");
        loginMsg.textContent = "This is a paid book. Upgrade your plan from Profile to borrow.";
      } else {
        borrowBtn.textContent = "Borrow Book";
        borrowBtn.disabled = false;
        borrowBtn.classList.remove("is-disabled");
        loginMsg.classList.add("is-hidden");
      }
    } catch (error) {
      console.error("Error checking borrow status:", error);
    }
  })();

  document.getElementById("bookModal").classList.remove("is-hidden");
}

function showInlineExploreMessage(message) {
  const loginMsg = document.getElementById("loginMessage");
  if (!loginMsg) {
    return;
  }

  loginMsg.classList.remove("is-hidden");
  loginMsg.textContent = message;
}

function closeBookModal() {
  document.getElementById("bookModal").classList.add("is-hidden");
}

function getCurrentModalBookPayload() {
  const title = document.getElementById("modalBookTitle").textContent;
  const bookDefinition = getBookDefinitionByTitle(title) || {};
  const imageUrl = document.getElementById("modalBookImage").getAttribute("src") || getBookCoverUrl(bookDefinition);

  return {
    title: title,
    author: document.getElementById("modalBookAuthor").textContent || bookDefinition.author || "Unknown Author",
    category: bookDefinition.category || exploreBookCategories[title] || "General",
    image: imageUrl,
    imageUrl: imageUrl,
    description: document.getElementById("modalBookDescription").textContent || bookDefinition.description || "",
    access: getBookAccess(title)
  };
}

function getApiActionError(defaultMessage) {
  const error = window.brainrootAPI && window.brainrootAPI.lastError;
  if (!error) {
    return defaultMessage;
  }

  if (String(error).toLowerCase().includes("not authenticated")) {
    return "Please login again, then try this action.";
  }

  return error;
}

async function borrowBook() {
  if (window.brainrootAuth) {
    const canBorrow = typeof window.brainrootAuth.requireBackendLogin === "function"
      ? await window.brainrootAuth.requireBackendLogin("Please login to add books to your collection.")
      : window.brainrootAuth.requireLogin("Please login to add books to your collection.");

    if (!canBorrow) {
      return;
    }
  }

  const bookPayload = getCurrentModalBookPayload();
  const title = bookPayload.title;
  
  try {
    const canCheckBorrowed = window.brainrootAPI && typeof window.brainrootAPI.isBookBorrowed === "function";
    const canBorrowBook = window.brainrootAPI && typeof window.brainrootAPI.borrowBook === "function";
    const isAlreadyBorrowed = canCheckBorrowed ? await window.brainrootAPI.isBookBorrowed(title) : false;
    if (isAlreadyBorrowed) {
      showInlineExploreMessage("This book is already in your borrowed list.");
      const borrowBtn = document.getElementById("borrowBtn");
      if (borrowBtn) {
        borrowBtn.textContent = "Already Borrowed";
        borrowBtn.disabled = true;
        borrowBtn.classList.add("is-disabled");
      }
      return;
    }

    if (getBookAccess(title) === "paid" && !isPaidSubscriber()) {
      showInlineExploreMessage("This is a paid book. Upgrade your plan from Profile to borrow it.");
      return;
    }

    if (!canBorrowBook) {
      showInlineExploreMessage("Borrow service is not available right now. Try again.");
      return;
    }

    const success = await window.brainrootAPI.borrowBook(bookPayload);

    if (success) {
      showExploreToast(title + " has been added to your collection. Due date: 14 days.");
      closeBookModal();
    } else {
      showInlineExploreMessage(getApiActionError("Error borrowing book. Try again."));
    }
  } catch (error) {
    console.error("Error borrowing:", error);
    showInlineExploreMessage("Error borrowing book. Try again.");
  }
}

async function addToWishlist() {
  if (window.brainrootAuth) {
    const canUseWishlist = typeof window.brainrootAuth.requireBackendLogin === "function"
      ? await window.brainrootAuth.requireBackendLogin("Please login to add books to your wishlist.")
      : window.brainrootAuth.requireLogin("Please login to add books to your wishlist.");

    if (!canUseWishlist) {
      return;
    }
  }

  const bookPayload = getCurrentModalBookPayload();

  try {
    const canCheckBorrowed = window.brainrootAPI && typeof window.brainrootAPI.isBookBorrowed === "function";
    const canAddWishlist = window.brainrootAPI && typeof window.brainrootAPI.addToWishlist === "function";
    const alreadyBorrowed = canCheckBorrowed ? await window.brainrootAPI.isBookBorrowed(bookPayload.title) : false;
    if (alreadyBorrowed) {
      showInlineExploreMessage("This book is already borrowed, so it cannot be added to wishlist.");
      return;
    }

    if (!canAddWishlist) {
      showInlineExploreMessage("Wishlist service is not available right now. Try again.");
      return;
    }

    const success = await window.brainrootAPI.addToWishlist(bookPayload);
    if (!success) {
      showInlineExploreMessage(getApiActionError("Error adding book to wishlist. Try again."));
      return;
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    showInlineExploreMessage("Error adding book to wishlist. Try again.");
    return;
  }

  showExploreToast(bookPayload.title + " has been added to your wishlist.");
  closeBookModal();
}

function initializeExploreSearch() {
  const searchInput = document.getElementById("exploreSearchInput");
  const searchShell = document.getElementById("exploreSearchShell");
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", function (event) {
    renderExploreSearchResults(event.target.value);
  });

  searchInput.addEventListener("focus", function () {
    renderExploreSearchResults(searchInput.value);
  });

  document.addEventListener("click", function (event) {
    if (searchShell && !searchShell.contains(event.target)) {
      hideExploreSearchPanel();
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideExploreSearchPanel();
      searchInput.blur();
    }
  });

  renderExploreSearchResults(searchInput.value);
}

function initializeBookModalActions() {
  const closeBtn = document.getElementById("closeBookModalBtn");
  const borrowBtn = document.getElementById("borrowBtn");
  const wishlistBtn = document.getElementById("wishlistBtn");

  if (closeBtn && closeBtn.dataset.modalActionBound !== "true") {
    closeBtn.addEventListener("click", closeBookModal);
    closeBtn.dataset.modalActionBound = "true";
  }

  if (borrowBtn && borrowBtn.dataset.modalActionBound !== "true") {
    borrowBtn.addEventListener("click", borrowBook);
    borrowBtn.dataset.modalActionBound = "true";
  }

  if (wishlistBtn && wishlistBtn.dataset.modalActionBound !== "true") {
    wishlistBtn.addEventListener("click", addToWishlist);
    wishlistBtn.dataset.modalActionBound = "true";
  }
}

function initializeRecommendedHero() {
  refreshRecommendedHeroFromCollections();

  window.addEventListener("storage", function (event) {
    if (event.key === "brainrootCollections") {
      refreshRecommendedHeroFromCollections();
    }
  });
  
  // Also listen for collection updates from other tabs/API calls
  if (window.brainrootStorage && typeof window.brainrootStorage.onCollectionsChanged === "function") {
    window.brainrootStorage.onCollectionsChanged(function() {
      refreshRecommendedHeroFromCollections();
    });
  }
}

window.openBookModal = openBookModal;
window.closeBookModal = closeBookModal;
window.borrowBook = borrowBook;
window.addToWishlist = addToWishlist;

async function initializeExplorePage() {
  initializeBookModalActions();
  await loadExploreBookLibraryFromDatabase();
  await loadFeaturedSections();
  syncExploreBookLibrary();
  initializeAllBooksControls();
  initializeExploreSearch();
  initializeRecommendedHero();
  markExploreCardsByAccess();

  // Handle URL search parameters from index page
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search');
  const categoryFilter = params.get('category');
  
  if (searchQuery) {
    const searchInput = document.getElementById("exploreSearchInput");
    if (searchInput) {
      searchInput.value = decodeURIComponent(searchQuery);
      renderExploreSearchResults(searchInput.value);
    }
  }
  
  if (categoryFilter) {
    const searchInput = document.getElementById("exploreSearchInput");
    if (searchInput) {
      searchInput.value = decodeURIComponent(categoryFilter);
      renderExploreSearchResults(searchInput.value);
    }
  }

  document.addEventListener("click", function (event) {
    const modal = document.getElementById("bookModal");
    if (event.target === modal) {
      closeBookModal();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExplorePage, { once: true });
} else {
  initializeExplorePage();
}


