window.tailwind = {
  config: {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "on-tertiary-container": "#4a4f69",
          "primary-dim": "#00539a",
          "tertiary-fixed": "#dadefe",
          "primary": "#005faf",
          "on-surface-variant": "#596061",
          "inverse-primary": "#4e9af9",
          "error": "#9f403d",
          "surface-container-high": "#e4e9ea",
          "on-secondary-container": "#46545d",
          "surface": "#f9f9f9",
          "on-secondary": "#f4faff",
          "surface-container-lowest": "#ffffff",
          "on-tertiary-fixed": "#383c55",
          "primary-fixed-dim": "#bdd6ff",
          "inverse-on-surface": "#9c9d9d",
          "on-tertiary-fixed-variant": "#545873",
          "surface-container-low": "#f2f4f4",
          "secondary-container": "#d6e5ef",
          "background": "#f9f9f9",
          "on-surface": "#2d3435",
          "tertiary-dim": "#4d526c",
          "surface-dim": "#d3dbdd",
          "secondary-dim": "#47555e",
          "primary-container": "#d4e3ff",
          "outline-variant": "#acb3b4",
          "tertiary": "#595e78",
          "surface-bright": "#f9f9f9",
          "secondary-fixed-dim": "#c8d6e1",
          "on-primary-fixed": "#004079",
          "on-primary-container": "#005299",
          "secondary": "#53616a",
          "surface-variant": "#dde4e5",
          "tertiary-container": "#dadefe",
          "error-container": "#fe8983",
          "on-tertiary": "#faf8ff",
          "on-background": "#2d3435",
          "on-error-container": "#752121",
          "inverse-surface": "#0c0f0f",
          "surface-container": "#ebeeef",
          "surface-tint": "#005faf",
          "on-secondary-fixed": "#33414a",
          "outline": "#757c7d",
          "on-error": "#fff7f6",
          "secondary-fixed": "#d6e5ef",
          "tertiary-fixed-dim": "#ccd0ef",
          "on-secondary-fixed-variant": "#4f5d67",
          "error-dim": "#4e0309",
          "on-primary-fixed-variant": "#005caa",
          "on-primary": "#f6f7ff",
          "surface-container-highest": "#dde4e5",
          "primary-fixed": "#d4e3ff"
        },
        borderRadius: {
          "DEFAULT": "0px",
          "lg": "0px",
          "xl": "0px",
          "full": "9999px"
        }
      }
    }
  }
};

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

function escapeOnclickValue(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
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

function createBookOnclick(book) {
  return "openBookModal('" + escapeOnclickValue(book.title) + "', '" + escapeOnclickValue(book.author) + "', '" + escapeOnclickValue(book.description) + "', '" + escapeOnclickValue(book.status || 'Available') + "', '" + escapeOnclickValue(book.imageUrl || getRelatableCoverImage(book.category, book.title)) + "')";
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

function decodeHtmlEntities(value) {
  const decoder = document.createElement("textarea");
  decoder.innerHTML = String(value || "");
  return decoder.value;
}

function normalizeTitleKey(value) {
  return String(value || "").trim().toLowerCase();
}

function parseOpenBookModalArgs(onclickValue) {
  const callStart = String(onclickValue || "").indexOf("openBookModal(");
  if (callStart === -1) {
    return null;
  }

  const argumentString = String(onclickValue).slice(callStart + "openBookModal(".length, -1);
  const args = [];
  let index = 0;

  function skipWhitespaceAndCommas() {
    while (index < argumentString.length && /[\s,]/.test(argumentString[index])) {
      index += 1;
    }
  }

  while (index < argumentString.length) {
    skipWhitespaceAndCommas();
    if (index >= argumentString.length) {
      break;
    }

    if (argumentString[index] !== "'") {
      return null;
    }

    index += 1;
    let value = "";

    while (index < argumentString.length) {
      const char = argumentString[index];

      if (char === "\\" && index + 1 < argumentString.length) {
        value += argumentString[index + 1];
        index += 2;
        continue;
      }

      if (char === "'") {
        index += 1;
        break;
      }

      value += char;
      index += 1;
    }

    args.push(decodeHtmlEntities(value));
    skipWhitespaceAndCommas();
  }

  if (args.length < 5) {
    return null;
  }

  return {
    title: args[0],
    author: args[1],
    description: args[2],
    status: args[3],
    imageUrl: args[4]
  };
}

function getExploreSearchIndex() {
  if (exploreSearchIndex) {
    return exploreSearchIndex;
  }

  exploreSearchIndex = Array.from(document.querySelectorAll('[onclick*="openBookModal("]'))
    .map(function (element) {
      const metadata = parseOpenBookModalArgs(element.getAttribute("onclick"));
      if (!metadata) {
        return null;
      }

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
  const imageDiv = card.querySelector(".aspect-\\[3\\/4\\], [class*='aspect']");
  
  if (!imageDiv) {
    return;
  }

  card.classList.add("group");
  imageDiv.classList.add("relative");

  let badge = imageDiv.querySelector("[data-access-badge]");

  if (!badge) {
    badge = document.createElement("div");
    badge.setAttribute("data-access-badge", "true");
    imageDiv.appendChild(badge);
  }

  const accessText = access === "paid" ? "Paid" : "Free";
  badge.className = "absolute top-2 left-2 text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-opacity-95 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none " + (access === "paid" ? "bg-primary text-on-primary" : "bg-surface-container-lowest border border-primary text-primary");
  badge.style.position = "absolute";
  badge.style.top = "8px";
  badge.style.left = "8px";
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

  metaEl.className = "text-[0.7rem] text-on-surface-variant mt-1";
  metaEl.textContent = category + " · " + availability;
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

  const scrollContainer = section.querySelector(".flex.overflow-x-auto");
  if (!scrollContainer) {
    return;
  }

  let cards = Array.from(scrollContainer.children).filter(function (child) {
    return child.classList && child.classList.contains("flex-none");
  });

  if (!cards.length) {
    scrollContainer.innerHTML = "";
    books.forEach(function (book) {
      const card = document.createElement("div");
      card.className = "flex-none w-64 group cursor-pointer hover-lift";

      card.innerHTML =
        '<div class="relative aspect-[3/4] bg-surface-container-highest mb-4 overflow-hidden rounded-sm">' +
        '<img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="' + (book.coverAlt || book.title + ' cover') + '" />' +
        '<span class="absolute right-2 top-2 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide bg-white/90 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" data-image-rating="true"></span>' +
        '<span class="absolute right-2 bottom-2 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide bg-black/65 text-white" data-image-category="true"></span>' +
        '</div>' +
        '<div class="relative pl-4 border-l-2 border-transparent group-hover:border-primary transition-colors">' +
        '<h3 class="text-sm font-semibold mb-1 truncate"></h3>' +
        '<p class="text-[0.75rem] text-on-surface-variant uppercase tracking-wider"></p>' +
        '</div>';

      scrollContainer.appendChild(card);
    });

    cards = Array.from(scrollContainer.children).filter(function (child) {
      return child.classList && child.classList.contains("flex-none");
    });
  }

  cards.forEach(function (card, index) {
    const book = books[index];
    if (!book) {
      return;
    }

    card.className = "flex-none w-52 group cursor-pointer hover-lift";

    const imageEl = card.querySelector("img");
    const imageWrap = imageEl ? imageEl.parentElement : null;
    const titleEl = card.querySelector("h3");
    const detailsWrap = titleEl ? titleEl.parentElement : card;

    if (!imageEl || !titleEl || !detailsWrap || !imageWrap) {
      return;
    }

    const coverUrl = getRelatableCoverImage(book.category, book.title);
    const onclickValue = createBookOnclick({
      title: book.title,
      author: book.author,
      description: book.description,
      status: book.status,
      imageUrl: coverUrl,
      category: book.category
    });

    card.setAttribute("onclick", onclickValue);
    imageEl.src = coverUrl;
    imageEl.alt = book.coverAlt || (book.title + " cover");

    let imageCategoryEl = imageWrap.querySelector("[data-image-category]");
    if (!imageCategoryEl) {
      imageCategoryEl = document.createElement("span");
      imageCategoryEl.setAttribute("data-image-category", "true");
      imageCategoryEl.className = "absolute right-2 bottom-2 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide bg-black/65 text-white";
      imageWrap.appendChild(imageCategoryEl);
    }
    imageCategoryEl.textContent = book.category;

    let imageRatingEl = imageWrap.querySelector("[data-image-rating]");
    if (!imageRatingEl) {
      imageRatingEl = document.createElement("span");
      imageRatingEl.setAttribute("data-image-rating", "true");
      imageRatingEl.className = "absolute right-2 top-2 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide bg-white/90 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none";
      imageWrap.appendChild(imageRatingEl);
    }
    const cardRatingChip = getBookRatingChip(book.title);
    imageRatingEl.textContent = cardRatingChip;
    imageRatingEl.classList.toggle("hidden", !cardRatingChip);

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
    authorEl.className = "text-[0.75rem] text-on-surface-variant uppercase tracking-wider";
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
  
  carouselSections.forEach(function(section) {
    const prevBtn = section.querySelector(".carousel-prev-btn");
    const nextBtn = section.querySelector(".carousel-next-btn");
    const scrollContainer = section.querySelector(".flex.overflow-x-auto");
    
    if (!prevBtn || !nextBtn || !scrollContainer) {
      return;
    }
    
    function updateButtonStates() {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      
      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
    }
    
    prevBtn.addEventListener("click", function() {
      const cardWidth = 220;
      const gap = 32;
      scrollContainer.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth"
      });
      setTimeout(updateButtonStates, 300);
    });
    
    nextBtn.addEventListener("click", function() {
      const cardWidth = 220;
      const gap = 32;
      scrollContainer.scrollBy({
        left: cardWidth + gap,
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
  let rows = Array.from(section.querySelectorAll(".space-y-4 > div"));

  if (!rows.length) {
    const listContainer = section.querySelector(".space-y-4");
    if (!listContainer) {
      return;
    }

    listContainer.innerHTML = "";

    collectionBooks.forEach(function (book) {
      const row = document.createElement("div");
      row.className = "flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 group hover-lift";
      row.innerHTML =
        '<div class="flex items-center gap-7 flex-1">' +
        '<div class="relative w-20 h-24 bg-surface-container-highest shrink-0">' +
        '<img class="w-full h-full object-cover" alt="' + (book.coverAlt || book.title + ' cover') + '" />' +
        '<span class="absolute right-1.5 bottom-1.5 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide bg-black/65 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" data-all-books-image-rating="true"></span>' +
        '</div>' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">' +
        '<div><h4 class="font-semibold text-[1rem] mb-1 group-hover:text-primary transition-colors"></h4><p class="text-sm text-on-surface-variant"></p></div>' +
        '<div class="flex items-center"></div>' +
        '</div>' +
        '</div>' +
        '<button class="border border-outline-variant/30 px-6 py-2 text-sm font-medium hover:bg-primary hover:text-on-primary transition-colors">Details</button>';
      listContainer.appendChild(row);
    });

    rows = Array.from(section.querySelectorAll(".space-y-4 > div"));
  }

  rows.forEach(function (row, index) {
    const book = collectionBooks[index];
    if (!row || !book) {
      return;
    }

    const metadata = book;
    const detailsButton = row.querySelector("button");
    const titleEl = row.querySelector("h4");
    const authorEl = row.querySelector(".grid div p");
    const imageEl = row.querySelector("img");
    const badgeWrap = row.querySelector(".grid .flex.items-center");
    const titleWrap = row.querySelector(".grid > div");
    if (!badgeWrap || !titleWrap || !detailsButton || !titleEl || !authorEl || !imageEl) {
      return;
    }

    row.className = "flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 group hover-lift";
    const rowContent = row.querySelector("div.flex.items-center");
    if (rowContent) {
      rowContent.className = "flex items-center gap-7 flex-1";
    }
    if (imageEl.parentElement) {
      imageEl.parentElement.className = "relative w-20 h-24 bg-surface-container-highest shrink-0";
    }
    const gridWrap = row.querySelector(".grid");
    if (gridWrap) {
      gridWrap.className = "grid grid-cols-1 md:grid-cols-2 gap-4 w-full";
    }
    titleEl.className = "font-semibold text-[1rem] mb-1 group-hover:text-primary transition-colors";
    authorEl.className = "text-sm text-on-surface-variant";
    detailsButton.className = "border border-outline-variant/30 px-6 py-2 text-sm font-medium hover:bg-primary hover:text-on-primary transition-colors";

    const coverUrl = getRelatableCoverImage(metadata.category, metadata.title);
    const availability = getBookAvailability(metadata.status);
    const access = getBookAccess(metadata.title) === "paid" ? "Paid" : "Free";

    const availabilityBadge = document.createElement("span");
    availabilityBadge.className = "px-3 py-1 text-[0.72rem] font-medium " + (availability === "Available" ? "bg-secondary-container text-on-secondary-fixed" : "bg-surface-container-highest text-on-surface-variant");
    availabilityBadge.textContent = availability;

    const accessBadge = document.createElement("span");
    accessBadge.className = "ml-2 px-3 py-1 text-[0.72rem] font-medium " + (access === "Paid" ? "bg-primary text-on-primary" : "border border-primary text-primary");
    accessBadge.textContent = access;

    let imageRatingEl = imageEl.parentElement ? imageEl.parentElement.querySelector("[data-all-books-image-rating]") : null;
    if (!imageRatingEl && imageEl.parentElement) {
      imageRatingEl = document.createElement("span");
      imageRatingEl.setAttribute("data-all-books-image-rating", "true");
      imageRatingEl.className = "absolute right-1.5 bottom-1.5 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide bg-black/65 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none";
      imageEl.parentElement.appendChild(imageRatingEl);
    }
    if (imageRatingEl) {
      const listRatingChip = getBookRatingChip(metadata.title);
      imageRatingEl.textContent = listRatingChip;
      imageRatingEl.classList.toggle("hidden", !listRatingChip);
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

    categoryText.className = "text-[0.78rem] text-on-surface-variant mt-1";
    categoryText.textContent = "Category: " + metadata.category;

    titleEl.textContent = metadata.title;
    authorEl.textContent = metadata.author;
    imageEl.src = coverUrl;
    imageEl.alt = metadata.coverAlt || (metadata.title + " cover");
    detailsButton.setAttribute("onclick", createBookOnclick({
      title: metadata.title,
      author: metadata.author,
      description: metadata.description,
      status: metadata.status,
      imageUrl: coverUrl,
      category: metadata.category
    }));
    detailsButton.textContent = "Details";

    badgeWrap.innerHTML = "";
    badgeWrap.appendChild(availabilityBadge);
    badgeWrap.appendChild(accessBadge);
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

  return {
    title: cleanedTitle || "Untitled Book",
    author: "Unknown Author",
    description: "A curated book from your collection in " + category + ".",
    status: "Available",
    imageUrl: RECOMMENDED_FALLBACK_IMAGE
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
  imageEl.src = book.imageUrl || RECOMMENDED_FALLBACK_IMAGE;
  imageEl.alt = book.title + " cover";
  badgeEl.textContent = "";
  badgeEl.className = "hidden";

  // Check if already borrowed and update borrow button state
  const borrowedTitles = JSON.parse(localStorage.getItem("brainrootBorrowed")) || [];
  const alreadyBorrowed = borrowedTitles.indexOf(book.title) !== -1 || book.status === "Borrowed";
  if (alreadyBorrowed) {
    borrowBtn.textContent = "Already Borrowed ✓";
    borrowBtn.disabled = true;
  } else {
    borrowBtn.textContent = "Borrow";
    borrowBtn.disabled = false;
  }

  function openCurrentRecommendedBook() {
    openBookModal(book.title, book.author, book.description, book.status || "Available", book.imageUrl || RECOMMENDED_FALLBACK_IMAGE);
  }

  function borrowRecommendedBook() {
    const title = book.title;
    const status = book.status || "Available";
    
    // Check if already borrowed
    const borrowedTitles = JSON.parse(localStorage.getItem("brainrootBorrowed")) || [];
    if (borrowedTitles.indexOf(title) !== -1 || status === "Borrowed") {
      showExploreToast("This book is already in your borrowed collection.", "neutral");
      return;
    }
    
    // Check if available
    if (status !== "Available") {
      showExploreToast("This book is not available for borrowing.", "neutral");
      return;
    }
    
    // Add to borrowed list
    borrowedTitles.push(title);
    localStorage.setItem("brainrootBorrowed", JSON.stringify(borrowedTitles));
    
    // Update button state
    borrowBtn.textContent = "Already Borrowed ✓";
    borrowBtn.disabled = true;
    
    // Show success message
    showExploreToast("Successfully borrowed: " + title, "success");
  }

  reserveBtn.onclick = openCurrentRecommendedBook;
  borrowBtn.onclick = borrowRecommendedBook;
  detailsBtn.onclick = openCurrentRecommendedBook;
}

function setRecommendedHeroVisibility(isVisible) {
  const heroSection = document.getElementById("recommendedHeroSection");
  if (!heroSection) {
    return;
  }

  heroSection.classList.toggle("hidden", !isVisible);
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

function refreshRecommendedHeroFromCollections() {
  const recommended = getRecommendedBooksFromCollections();
  recommendedHeroItems = recommended.length ? recommended : getDefaultRecommendedBooks();
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

  panel.classList.add("hidden");
  if (exploreSearchResults) {
    exploreSearchResults.innerHTML = "";
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

  exploreSearchResults.innerHTML = "";
  exploreSearchCount.textContent = matches.length + (matches.length === 1 ? " result" : " results");

  if (matches.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "explore-search-empty";
    emptyState.textContent = 'No books matched "' + query.trim() + '". Try a different title, author, or category.';
    exploreSearchResults.appendChild(emptyState);
    panel.classList.remove("hidden");
    return;
  }

  matches.forEach(function (item) {
    const access = getBookAccess(item.title) === "paid" ? "Paid" : "Free";
    const category = getBookCategory(item.title);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "explore-search-item";
    button.innerHTML =
      '<div class="explore-search-item-layout">' +
      '<img class="explore-search-item-thumb" src="' + item.imageUrl + '" alt="' + item.title + '">' +
      '<div class="explore-search-item-copy">' +
      '<p class="explore-search-item-title">' + item.title + '</p>' +
      '<p class="explore-search-item-meta">' + item.author + ' · ' + category + ' · ' + access + '</p>' +
      '</div>' +
      '</div>';
    button.addEventListener("click", function () {
      openSearchResult(item);
    });
    exploreSearchResults.appendChild(button);
  });

  panel.classList.remove("hidden");
}

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

  return "★ " + record.average.toFixed(1);
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
  const borrowedTitles = JSON.parse(localStorage.getItem("brainrootBorrowed") || "[]");
  const alreadyBorrowed = borrowedTitles.indexOf(title) !== -1;

  if (alreadyBorrowed || status === "Borrowed") {
    borrowBtn.textContent = "Already Borrowed ✓";
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
  const borrowed = JSON.parse(localStorage.getItem("brainrootBorrowed") || "[]");

  if (borrowed.includes(title)) {
    showInlineExploreMessage("This book is already in your borrowed list.");
    const borrowBtn = document.getElementById("borrowBtn");
    if (borrowBtn) {
      borrowBtn.textContent = "Already Borrowed ✓";
      borrowBtn.disabled = true;
      borrowBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
    return;
  }

  if (getBookAccess(title) === "paid" && !isPaidSubscriber()) {
    showInlineExploreMessage("This is a paid book. Upgrade your plan from Profile to borrow it.");
    return;
  }

  borrowed.push(title);
  localStorage.setItem("brainrootBorrowed", JSON.stringify(borrowed));

  showExploreToast(title + " has been added to your borrowed books. Due date: 14 days from now.");
  closeBookModal();
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
