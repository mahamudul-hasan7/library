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
const RECOMMENDED_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80";

let recommendedHeroItems = [];
let recommendedHeroIndex = 0;
let recommendedHeroTimer = null;

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

    const coverUrl = getRelatableCoverImage(book.category, book.title);
    setBookAction(card, {
      title: book.title,
      author: book.author,
      description: book.description,
      status: book.status,
      imageUrl: coverUrl,
      category: book.category
    });
    imageEl.src = coverUrl;
    imageEl.alt = book.coverAlt || (book.title + " cover");

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

function syncExploreBookLibrary() {
  syncHorizontalShowcaseSection("Trending Books", exploreBookLibrary.trending);
  syncHorizontalShowcaseSection("Top Reading", exploreBookLibrary.topReading);
  syncHorizontalShowcaseSection("Most Liked", exploreBookLibrary.mostLiked);
  syncAllBooksCollectionBadges();
  setupCarouselNavigation();
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
  const allBooksHeading = Array.from(document.querySelectorAll("section h2")).find(function (heading) {
    return String(heading.textContent || "").trim().toLowerCase() === "all books collection";
  });

  if (!allBooksHeading) {
    return;
  }

  const section = allBooksHeading.closest("section");
  if (!section) {
    return;
  }

  const collectionBooks = exploreBookLibrary.collection;
  let rows = Array.from(section.querySelectorAll(".all-books-list > .all-books-row"));

  if (!rows.length) {
    const listContainer = section.querySelector(".all-books-list");
    if (!listContainer) {
      return;
    }

    listContainer.replaceChildren();

    collectionBooks.forEach(function (book) {
      const row = createClassedElement("div", "all-books-row");
      const rowContent = createClassedElement("div", "all-books-row-main");
      const imageWrap = createClassedElement("div", "all-books-cover-wrap");
      const image = createClassedElement("img", "all-books-cover");
      const imageRating = createClassedElement("span", "all-books-rating-chip");
      const grid = createClassedElement("div", "all-books-info-grid");
      const titleWrap = createClassedElement("div", "all-books-copy");
      const title = createClassedElement("h4", "all-books-row-title");
      const author = createClassedElement("p", "all-books-author");
      const badgeWrap = createClassedElement("div", "all-books-badges");
      const detailsButton = createClassedElement("button", "all-books-details-btn");

      image.alt = book.coverAlt || book.title + " cover";
      imageRating.setAttribute("data-all-books-image-rating", "true");
      detailsButton.type = "button";
      detailsButton.textContent = "Details";

      imageWrap.append(image, imageRating);
      titleWrap.append(title, author);
      grid.append(titleWrap, badgeWrap);
      rowContent.append(imageWrap, grid);
      row.append(rowContent, detailsButton);
      listContainer.appendChild(row);
    });

    rows = Array.from(section.querySelectorAll(".all-books-list > .all-books-row"));
  }

  rows.forEach(function (row, index) {
    const book = collectionBooks[index];
    if (!row || !book) {
      return;
    }

    const metadata = book;
    const detailsButton = row.querySelector(".all-books-details-btn");
    const titleEl = row.querySelector(".all-books-row-title");
    const authorEl = row.querySelector(".all-books-author");
    const imageEl = row.querySelector(".all-books-cover");
    const badgeWrap = row.querySelector(".all-books-badges");
    const titleWrap = row.querySelector(".all-books-copy");
    if (!badgeWrap || !titleWrap || !detailsButton || !titleEl || !authorEl || !imageEl) {
      return;
    }

    row.className = "all-books-row";
    const rowContent = row.querySelector(".all-books-row-main");
    if (rowContent) {
      rowContent.className = "all-books-row-main";
    }
    if (imageEl.parentElement) {
      imageEl.parentElement.className = "all-books-cover-wrap";
    }
    const gridWrap = row.querySelector(".all-books-info-grid");
    if (gridWrap) {
      gridWrap.className = "all-books-info-grid";
    }
    titleEl.className = "all-books-row-title";
    authorEl.className = "all-books-author";
    detailsButton.className = "all-books-details-btn";

    const coverUrl = getRelatableCoverImage(metadata.category, metadata.title);
    const availability = getBookAvailability(metadata.status);
    const access = getBookAccess(metadata.title) === "paid" ? "Paid" : "Free";

    const availabilityBadge = document.createElement("span");
    availabilityBadge.className = "status-badge " + (availability === "Available" ? "status-badge-available" : "status-badge-unavailable");
    availabilityBadge.textContent = availability;

    const accessBadge = document.createElement("span");
    accessBadge.className = "access-badge " + (access === "Paid" ? "access-badge-paid" : "access-badge-free");
    accessBadge.textContent = access;

    let imageRatingEl = imageEl.parentElement ? imageEl.parentElement.querySelector("[data-all-books-image-rating]") : null;
    if (!imageRatingEl && imageEl.parentElement) {
      imageRatingEl = document.createElement("span");
      imageRatingEl.setAttribute("data-all-books-image-rating", "true");
      imageRatingEl.className = "all-books-rating-chip";
      imageEl.parentElement.appendChild(imageRatingEl);
    }
    if (imageRatingEl) {
      const listRatingChip = getBookRatingChip(metadata.title);
      imageRatingEl.textContent = listRatingChip;
      imageRatingEl.classList.toggle("is-hidden", !listRatingChip);
    }

    const ratingText = titleWrap.querySelector("[data-all-books-rating]");
    if (ratingText) {
      ratingText.remove();
    }

    let categoryText = titleWrap.querySelector("[data-all-books-category]");
    if (!categoryText) {
      categoryText = document.createElement("p");
      categoryText.setAttribute("data-all-books-category", "true");

      if (authorEl) {
        authorEl.insertAdjacentElement("afterend", categoryText);
      } else {
        titleWrap.appendChild(categoryText);
      }
    }

    categoryText.className = "all-books-category";
    categoryText.textContent = "Category: " + metadata.category;

    titleEl.textContent = metadata.title;
    authorEl.textContent = metadata.author;
    imageEl.src = coverUrl;
    imageEl.alt = metadata.coverAlt || (metadata.title + " cover");
    setBookAction(detailsButton, {
      title: metadata.title,
      author: metadata.author,
      description: metadata.description,
      status: metadata.status,
      imageUrl: coverUrl,
      category: metadata.category
    });
    detailsButton.textContent = "Details";

    badgeWrap.replaceChildren(availabilityBadge, accessBadge);
  });
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

function getRecommendedBooksFromCollections() {
  const titles = getCollectionsTitles();
  if (!titles.length) {
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

function renderRecommendedHero(book) {
  const titleEl = document.getElementById("recommendedHeroTitle");
  const descriptionEl = document.getElementById("recommendedHeroDescription");
  const imageEl = document.getElementById("recommendedHeroImage");
  const badgeEl = document.getElementById("recommendedHeroAccessBadge");
  const reserveBtn = document.getElementById("recommendedHeroReserveBtn");
  const borrowBtn = document.getElementById("recommendedHeroBorrowBtn");
  const detailsBtn = document.getElementById("recommendedHeroDetailsBtn");

  if (!titleEl || !descriptionEl || !imageEl || !badgeEl || !reserveBtn || !borrowBtn || !detailsBtn || !book) {
    return;
  }

  titleEl.textContent = book.title;
  descriptionEl.textContent = book.description;
  const imageUrl = book.imageUrl || RECOMMENDED_FALLBACK_IMAGE;
  imageEl.src = imageUrl + (imageUrl.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now();
  imageEl.alt = book.title + " cover";
  badgeEl.textContent = "";
  badgeEl.className = "hero-access-badge is-hidden";

  // Check if already borrowed
  (async function() {
    try {
      const alreadyBorrowed = await window.brainrootAPI.isBookBorrowed(book.title) || book.status === "Borrowed";
      if (alreadyBorrowed) {
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
  }

  function openCurrentRecommendedBook() {
    openBookModal(book.title, book.author, book.description, book.status || "Available", book.imageUrl || RECOMMENDED_FALLBACK_IMAGE);
  }

  async function borrowRecommendedBook() {
    const title = book.title;
    const status = book.status || "Available";

    if (status !== "Available") {
      showExploreToast("This book is not available for borrowing.", "neutral");
      return;
    }

    try {
      const isAlreadyBorrowed = await window.brainrootAPI.isBookBorrowed(title);
      if (isAlreadyBorrowed) {
        showExploreToast("This book is already in your borrowed collection.", "neutral");
        return;
      }

      const success = await window.brainrootAPI.borrowBook({
        title: title,
        author: book.author || "Unknown Author",
        category: book.category || "General",
        image: book.imageUrl
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

    
    showExploreToast("Successfully borrowed: " + title, "success");
  }

  setRecommendedHeroButtonAction(reserveBtn, openCurrentRecommendedBook);
  setRecommendedHeroButtonAction(borrowBtn, borrowRecommendedBook);
  setRecommendedHeroButtonAction(detailsBtn, openCurrentRecommendedBook);
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

function refreshRecommendedHeroFromCollections() {
  const recommended = getRecommendedBooksFromCollections();
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
    image.src = item.imageUrl;
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

function getBookRatingLabel(title) {
  const record = getRatingRecordByTitle(title);
  if (!record.count) {
    return "Rating: New";
  }

  return "Rating: " + record.average.toFixed(1) + " / 5";
}

function getBookRatingChip(title) {
  const record = getRatingRecordByTitle(title);
  if (!record.count) {
    return "";
  }

  return "* " + record.average.toFixed(1);
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
}

function renderModalRating(title) {
  const summaryEl = document.getElementById("modalBookRatingSummary");
  const userTextEl = document.getElementById("modalUserRatingText");
  const starsWrap = document.getElementById("modalUserRatingStars");

  if (!summaryEl || !userTextEl || !starsWrap) {
    return;
  }

  const record = getRatingRecordByTitle(title);
  const averageText = record.count ? record.average.toFixed(1) : "0.0";
  summaryEl.textContent = "Book Rating: " + averageText + " (" + record.count + (record.count === 1 ? " rating" : " ratings") + ")";

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
  document.getElementById("modalBookTitle").textContent = title;
  document.getElementById("modalBookAuthor").textContent = author;
  document.getElementById("modalBookDescription").textContent = description;
  document.getElementById("modalStatus").textContent = status.toUpperCase();
  document.getElementById("modalBookImage").src = imageUrl;
  renderModalRating(title);

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

  // Check if already borrowed using API
  (async function() {
    try {
      const alreadyBorrowed = await window.brainrootAPI.isBookBorrowed(title);
      
      if (alreadyBorrowed || status === "Borrowed") {
        borrowBtn.textContent = "Already Borrowed";
        borrowBtn.disabled = true;
        borrowBtn.classList.add("is-disabled");
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

async function borrowBook() {
  if (window.brainrootAuth && !window.brainrootAuth.requireLogin("Please login to add books to your collection.")) {
    return;
  }

  const title = document.getElementById("modalBookTitle").textContent;
  
  try {
    const isAlreadyBorrowed = await window.brainrootAPI.isBookBorrowed(title);
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

    const author = document.getElementById("modalBookAuthor").textContent;
    const success = await window.brainrootAPI.borrowBook({
      title: title,
      author: author
    });

    if (success) {
      showExploreToast(title + " has been added to your collection. Due date: 14 days.");
      closeBookModal();
    } else {
      showInlineExploreMessage("Error borrowing book. Try again.");
    }
  } catch (error) {
    console.error("Error borrowing:", error);
    showInlineExploreMessage("Error borrowing book. Try again.");
  }
}

function addToWishlist() {
  if (window.brainrootAuth && !window.brainrootAuth.requireLogin("Please login to add books to your wishlist.")) {
    return;
  }

  const title = document.getElementById("modalBookTitle").textContent;
  const author = document.getElementById("modalBookAuthor").textContent;
  const imageUrl = document.getElementById("modalBookImage").getAttribute("src") || "";
  const category = exploreBookCategories[title] || "";
  const wishlist = JSON.parse(localStorage.getItem("brainrootWishlist") || "[]");

  const titleKey = normalizeTitleKey(title);
  const existingIndex = wishlist.findIndex(function (entry) {
    if (typeof entry === "string") {
      return normalizeTitleKey(entry) === titleKey;
    }

    if (entry && typeof entry === "object") {
      return normalizeTitleKey(entry.title) === titleKey;
    }

    return false;
  });

  const wishlistItem = {
    title: title,
    author: author,
    category: category,
    image: imageUrl
  };

  if (existingIndex === -1) {
    wishlist.push(wishlistItem);
    localStorage.setItem("brainrootWishlist", JSON.stringify(wishlist));
  } else if (typeof wishlist[existingIndex] === "string") {
    wishlist[existingIndex] = wishlistItem;
    localStorage.setItem("brainrootWishlist", JSON.stringify(wishlist));
  }

  showExploreToast(title + " has been added to your wishlist.");
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
}

window.openBookModal = openBookModal;
window.closeBookModal = closeBookModal;
window.borrowBook = borrowBook;
window.addToWishlist = addToWishlist;

function initializeExplorePage() {
  initializeBookModalActions();
  syncExploreBookLibrary();
  initializeExploreSearch();
  initializeRecommendedHero();
  markExploreCardsByAccess();

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


