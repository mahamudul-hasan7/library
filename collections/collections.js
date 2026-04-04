document.addEventListener("DOMContentLoaded", function () {
  if (!window.brainrootAuth || !window.brainrootAuth.requireLogin("Please login to access collections.")) {
    return;
  }

  const collectionKey = "brainrootCollections";
  const wishlistKey = "brainrootWishlist";
  const removalKey = "brainrootCollectionRotations";
  const toastId = "collectionsToast";
  const recommendationLimit = 4;
  const defaultCollections = [
    "Metropolitan Tunnels",
    "Concrete Poetry",
    "Vascular Cities",
    "Silent Archives"
  ];
  const fallbackCollectionCovers = [
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
  ];

  const bookCatalog = [
    {
      title: "Metropolitan Tunnels",
      author: "Urban Systems Review",
      category: "Architecture",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQL6jcWXTbkZ-qr6cLdsCAr-1U-i8Tdv_aTE30Ela35Y1Ewl9Qay1U9U881DUQo_Y76Q0nkhQttRDoQm82DA7kYNhwSYJdWItOf_qP_lcO422Wt6qeO-PcHjd_JWM9OISmyebIz9RN_fcAnJuiwKA5Hse8Ixnyy20pl_n5zr87WjhbfHPA8HHyNQ9-W8dAoC2JrL2EZUFAXdc9C9wh3ZwZ-X1-s4wKGhxoZFy8C4xN-10EuLNtNdqxXRXaZF01P7t0BjfJKv-siVs",
      summary: "Exploration of underground infrastructure and transit systems in modern cities.",
      progress: 60,
      importance: 88,
      tags: ["architecture", "urbanism", "infrastructure"]
    },
    {
      title: "Concrete Poetry",
      author: "Tadao Ando",
      category: "Theory",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX8fh70OBv6XTWBoiyXnIHeSg4P0MKSIWlHRGB1X_lqvFw94twrIW0ZHxCt2AoG3VMKg4YG7QVVfkevN8soq_chf6Rp7BSRLEfqS0h1yZJ4I8F08hE4Apaeo1EozuxpOKuBG3y81QrYmqzmDn63DXTAImekDtgO_Bn1r8pBpqvAISCtpgTxWFVx205t-VPisA7v9ew7WLMOGaNxjXLUuvSK00Z8VJyvPbo_2t_y5bOR885_EamKfEPy7nwiGf3Q7tDEIy0RYKXoOg",
      summary: "Study of concrete as both material and metaphor in contemporary architecture.",
      progress: 40,
      importance: 86,
      tags: ["minimalism", "architecture", "theory"]
    },
    {
      title: "Vascular Cities",
      author: "Urban Planning Journal",
      category: "Urbanism",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiu2SIWHFt85iFuHBohcZj5CnXbF3N0nDdSA3cn-CgoFSQqvdcanUPzoRhi8fJ4zn2wFkxlnQ604uwPdNO3mjhSNF9ZzIz6O1O5DVcaxSI8LTsAQfViiuI9QQ5ngEoBdMBxn_Q4LYIOdWMNP7A8WOxeJMYZijyKAcXVyUbjyUCrgLZHvWb5hLuA1rLL-1EMaxiB_9CMU7lwZADTYeIMRBECcPi7P_HI6t5FP-IQBUmfkYm6eX2eFDX8y-lCmFUhCY2NShL8H2PtA0",
      summary: "Urban planning through the lens of organic systems and circulatory networks.",
      progress: 80,
      importance: 83,
      tags: ["urbanism", "systems", "architecture"]
    },
    {
      title: "Silent Archives",
      author: "Curation Lab",
      category: "History",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHoS6mMiYFZd6NZ4m2EOZh_wnT4KnkS35b4m_EQp2gfluc-1QhGDArytE5YRDdQxBXKmqtTbpL6kRyaDw8CpTe6Wl2SGjWoCwztSR1QJXSIbTJ0uecmE5FnZcuUQbF2bqU58KVupMB3nsFW7YMwp7hSKa1fjnLQkKSu6ds8z3GCI3YTGGQh-NWIE4TBX55pxYkCU0pw2m4omK4o4SE_mTMb9me615ZDbJLoCU98WDYzQdmhfL-TK92sMg3aJy8sXeA0cherWeZ3ng",
      summary: "Curation practices and archival theory in the digital age.",
      progress: 25,
      importance: 77,
      tags: ["history", "archives", "research"]
    },
    {
      title: "The Geometry of Silence",
      author: "Elena V. Kostova",
      category: "Architecture",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=80",
      summary: "A definitive exploration of minimalist structural design in post-war Europe.",
      progress: 56,
      importance: 98,
      tags: ["architecture", "minimalism", "design"]
    },
    {
      title: "Structure & Light",
      author: "Louis Kahn",
      category: "Architecture",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuYYgWRa7zpoBIFs2k8tY222LUw0mG4VKU5BPEXFQxd5A1La8wi0wHXsHOYEE-u_TQ4K6HDWkhvlsmjxFlezP1hNLN4JwgbCWsLQnvsFjvtwQCvkTN8C7wYOxC0QsSjgNOlfGSQz0ws5__AHYSS1tJacaXYF2nGzWKH4yDQbzWlTaqe4mSfbtO2pADem1FzJMiZcjd4ypf1Y3MuQkMGf2RGWQdp3XLr3VBFJrdkKt92QlXq0O1BvHVT4WVQYCDZpQ1LrE49elHiuE",
      summary: "The definitive study of structure, light, and spiritual form in architecture.",
      progress: 68,
      importance: 92,
      tags: ["architecture", "light", "theory"]
    },
    {
      title: "Urban Metabolism",
      author: "Kenzo Tange",
      category: "Urbanism",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMwtY1PcedjzXjUthZ6eKRmDKDVQhtjcxlXyOmUbWP618xvj__HkiMvvWB3rIe2eTPa-TxPod2oM9Syj8JIBpHN3o1soLNN5X-bDqv95Bd-uZp4JVItMt2YNwNMfCtabKJMJLg6eO9zGPsxcw_KzMuXT3DWcwrIW_hh-xes7oQNhtfMFKiScgU2O5M0fe5MOMUipQqfuKC-alXbRKNZ0hkq0A_agvixl5Fw4_TknaXM9znuRnl3tqNYeszJHxbKo0q2gAyrSWBpC8",
      summary: "A groundbreaking exploration of mega-structure design and urban renewal.",
      progress: 34,
      importance: 91,
      tags: ["urbanism", "systems", "design"]
    },
    {
      title: "The Modular Man",
      author: "Le Corbusier",
      category: "Design",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1IFmk4YJE_moKcvALJatTeiM8hNAxnq5Y4_AJGD2moL34N4zpvkw00cxdTZ0plyhA8ZIyzG2L4fEoR4qlhE1LM7upfQKPJcvCwrj-YEljWkuGizoAAUxNoY02xi0oFa8G3RUe6ZQRucyaou3gkJLgEyjiUXgoQEq_icNLR0e78KDC8aKupr-Z5w45joaqn6ehDCavrGL3YXlkgdadGUvxrpbySfIQzXCOJPN5uoASAnDjISWOW3BR-8TlRZN40K0YzAT5YKenFmU",
      summary: "A foundational text on proportion systems and the human scale in design.",
      progress: 47,
      importance: 89,
      tags: ["design", "proportion", "architecture"]
    },
    {
      title: "Nordic Pavilions",
      author: "Alvar Aalto",
      category: "Architecture",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU7qa0-P3Kbc3ht4Hvud0A3N-O0qo8gxp7lsW6Ud7hLZ42o9vxgjl8wvIcEifjqt42Dbo8GFRxtOL0ATvJRddGZ1pVwndL3q7ZS0RbOM7jLMpGWT2bFwgVWdoJUcvlKjpkvNVLBm8qvPeuo8wkw9Qs3g21Wx5vNCF9V4etjg4xirLhqdpqbzchkw6jLmfjdbuT0APJfJcJUl1M_LxwxxmuloRM3rv-AKswNETegvRR--evXwC341Q0fMwsFQQdwaXAmyK9bcfeSYw",
      summary: "A detailed study of pavilion design and humanistic modernism in the Nordic region.",
      progress: 72,
      importance: 85,
      tags: ["architecture", "humanism", "nature"]
    },
    {
      title: "The Grid System in Digital Ethics",
      author: "Mara Feld",
      category: "Design",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHoS6mMiYFZd6NZ4m2EOZh_wnT4KnkS35b4m_EQp2gfluc-1QhGDArytE5YRDdQxBXKmqtTbpL6kRyaDw8CpTe6Wl2SGjWoCwztSR1QJXSIbTJ0uecmE5FnZcuUQbF2bqU58KVupMB3nsFW7YMwp7hSKa1fjnLQkKSu6ds8z3GCI3YTGGQh-NWIE4TBX55pxYkCU0pw2m4omK4o4SE_mTMb9me615ZDbJLoCU98WDYzQdmhfL-TK92sMg3aJy8sXeA0cherWeZ3ng",
      summary: "A sharp look at digital order, visual systems, and ethical interface design.",
      progress: 29,
      importance: 84,
      tags: ["design", "digital", "ethics"]
    },
    {
      title: "The Alexandrian Echo",
      author: "Noura Khalil",
      category: "History",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALuxkvOy8zCxS4DII6nCTquKwVSHfTxkXjCQMB9KWUSAA8cN6c_vhjMONDzd-iuBkTgFfW6DWO7CbTtIGb4P5gEqaWSgPCjHsT8YxlSk3yndPPNhZ5WvuIPFtOgIw2mcrnrHhDtlqLA7WKMd2P3WNNv0rEP4EoZMnHVkG7SVm0vxLKpG5gnHUMeDlYF6ROcaEKTvab7j0F2jV_0FVcg2PPT647AQOP3cA6NsZp-4uAAun-jfPl3swZXu1WX4_672BT6rNijfvDVXc",
      summary: "A historical reconstruction of library culture, memory, and preservation.",
      progress: 53,
      importance: 79,
      tags: ["history", "archives", "research"]
    },
    {
      title: "Machine Learning for Curators",
      author: "J. H. Mercer",
      category: "Technology",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaYobZQoLUN709jJUOPMz4E9M09mgLkDfzxFPzw73VrCxAruWyU6II0iRRBqNpJ1IJeGJTjdbU7f0BoJwSNbQJIRmZbIa7JX2wj9Pz8I4q4VrvTLaJGudRXCNfo_14miP2Usb8ffBq3gpY3ldkQXiowMKOnsMlhOSSHgmNdtSm86N43wstocj6eW5A2Owvad_HBxO7rpZS1dk_ERWCU2ixmMhXDn-2nFYB2yHc_VZ3EOm-80keLd840Ffaa99YR7rnI3qrJCHn7Mw",
      summary: "How machine intelligence can support cataloging, discovery, and curation.",
      progress: 31,
      importance: 90,
      tags: ["technology", "curation", "research"]
    },
    {
      title: "Spatial Dialectics",
      author: "Unknown Author",
      category: "Theory",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbSU_gDoqLtdWBJfPEYZTv8M14R4nNeLzjI0W95kceALhoXXGag6-UVj6uQeDdycsqA8zxPmDBzC0zvrtxiE7iuUy9TEPQCI7ZPH552yVRsLdN5FFDMmg40Zk9gTAz-gku0oNVncDDDTUw0zXMv-V-1hFZWiW-hy2B_gPD4eKWbbgchOGOdhnkPDZSyvUFtarrc8J7VNSU_zakBZBmBbNOSajmNi-rYBpKLYatKy2JMIwkZo9oAKwd6pYX2AC_DfWbI3UiQwYeMmc",
      summary: "An exploration of spatial relationships through phenomenological lenses.",
      progress: 67,
      importance: 95,
      tags: ["theory", "space", "architecture"]
    },
    {
      title: "Bauhaus Theory",
      author: "Unknown Author",
      category: "History",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrfFFwGjY8yZdtI8tiPrqDHavC1r2F8kKC-JNcxVVjvujiB-VJSmBw85eiBTxiwoSS7z1ESpXRW-ZYMbSuYc31sgB9RX9B_vEimXHz4h5jZHUOosocoCiGZsoN1CkSY8FPpOmb7GGkRdr7v_cYVrZWPrPLlEfBWq53BdLObq7bbwWqt-CbnTEN0JW2Z3Xz3geAjv6_X4jEE9atphQ1W7-swmfjpjz8ypYEzMFi_vjkak3GKvIMvqnZWU4-HW1SYqGQvoh3FCeM8Zg",
      summary: "The revolutionary design philosophy that reshaped art, architecture, and industry.",
      progress: 44,
      importance: 87,
      tags: ["history", "design", "architecture"]
    },
    {
      title: "Organic Forms",
      author: "Unknown Author",
      category: "Design",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpPSX695zZOfQxjtcObLgERrRoWnGiJztNLeg4UIzvgjCxv3VyPzBJQgUZRrEkIbd8O3AmBRndJpedb9orTzxXqDoYSJnqK34OgIGEvg4t_-tO9X3YXz4auGSdc7gKiLk1DWsB_wGSFfcxk_m7H3yL4FiiTfUBmVrecLVrJhbFW87x0rSHpahF_g6Q-zjzuYgiMAhK8C4iPWeySppfthq4-2xcnLbHOum_Ycgmdb4RXcBRMInnSMGCy8Dv7uryAC_yC1CTVldDd-4",
      summary: "Biomorphic design language and the influence of natural forms on contemporary space.",
      progress: 55,
      importance: 81,
      tags: ["design", "nature", "architecture"]
    },
    {
      title: "Curvature",
      author: "Unknown Author",
      category: "Design",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARGJmWxXCb6HVBr4T_0ZxXhUPdECsrQ2-AeyFYS-zo9RxeEtwvI5mcZN7wO23-9047HhK2vG-MC9NXQEsud2H8uRxr2FUD4jxEff5djJSEXCTBOwxSJK852tyljnX3pKzBqaO0ZmpBclG8SsxPaKGYyTICxHoSSG8544rQ6DU-etoNpGh2MlvRnkmBCJe1H3kCwclhfizbQtp2VwmckF7caZ3_MFqHjTl1pl_-EkfyXaoKyRtmL_wBLnA6sTgLy_A67uE7VuI6Qzo",
      summary: "A visual exploration of curved form, movement, and architectural perception.",
      progress: 38,
      importance: 76,
      tags: ["design", "form", "architecture"]
    },
    {
      title: "Zen Planning",
      author: "Unknown Author",
      category: "Wellness",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXM6PqNxFc_CWpg6-gYoc7eTUIptZNU03BrkcP9lLfAXctI7wABHQR9hp_GkvQbHUYQO9niNiiwGl8pxvO2ngD_OZ83tI7FAttJoF9pRB27PElm1ZpxNbp9PB3uxlm0PtO91OrTHBa7PN22515x1lJEJz1UGE_ewfPHs2qKu14KycMYlQLk5bu-rIb7yzgMwRAF_QOZdhJ0pkZlLv3P-dXQdsQFUfGq0FeeyDPU0rSxW4vu-ckR1RVbpqPI0aR8SWDFphaaK9yMdU",
      summary: "Minimalism and balance applied to urban design and restorative environments.",
      progress: 49,
      importance: 74,
      tags: ["wellness", "design", "minimalism"]
    },
    {
      title: "Kinetic Cities",
      author: "Unknown Author",
      category: "Urbanism",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7_gfHisY0NForaVrI9Yw9gRxC0OsRkopqF6obMk8FA7XR1XfctL6k-tAH0s7JaADuj0OHzAXPBM8wUeGaz8alzOALIkz3IhXpZeh-1rWEGv361mcRcPEIa_u_eHazccBGsdm-GM_Db28_-5vPZmb3MfXaFHxMqUxdgehhtPs6gQZfxX-_-PVkZxnQPuHJNb4kUiYQ7XwqSzgh_Zq-B0NHDqN35rJ1q9CF6TlhKbgUt6WJc5ieMzmB8lZg5miHFs68BFmvFnpydj8",
      summary: "A study of movement, commerce, and cultural change inside living urban systems.",
      progress: 52,
      importance: 75,
      tags: ["urbanism", "movement", "systems"]
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Productivity",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
      summary: "Tiny changes that compound into remarkable results and stronger routines.",
      progress: 22,
      importance: 82,
      tags: ["productivity", "habits", "self-improvement"]
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Mystery",
      image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=500&q=80",
      summary: "A psychological thriller built around obsession, silence, and revelation.",
      progress: 18,
      importance: 80,
      tags: ["mystery", "thriller", "fiction"]
    },
    {
      title: "Educated",
      author: "Tara Westover",
      category: "Memoir",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=500&q=80",
      summary: "A story of self-determination, education, and transformation.",
      progress: 26,
      importance: 79,
      tags: ["memoir", "education", "growth"]
    },
    {
      title: "Why We Sleep",
      author: "Matthew Walker",
      category: "Health",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80",
      summary: "A practical look at sleep science, performance, and longevity.",
      progress: 28,
      importance: 78,
      tags: ["health", "science", "wellness"]
    },
    {
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      category: "Drama",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
      summary: "A powerful story of friendship, guilt, and redemption.",
      progress: 30,
      importance: 77,
      tags: ["drama", "fiction", "literature"]
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      category: "Sci-Fi",
      image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=500&q=80",
      summary: "Politics, ecology, and power on the desert planet Arrakis.",
      progress: 35,
      importance: 84,
      tags: ["sci-fi", "ecology", "fiction"]
    }
  ];

  bookCatalog.forEach(function (book) {
    book.access = window.brainrootAuth?.getBookAccess?.(book.title) || "free";
  });

  const catalogByTitle = bookCatalog.reduce(function (accumulator, book) {
    accumulator[normalizeKey(book.title)] = book;
    return accumulator;
  }, {});

  const collectionsList = document.getElementById("collectionsList");
  const recommendationsList = document.getElementById("recommendationsList");
  const collectionsEmptyState = document.getElementById("collectionsEmptyState");
  const collectionsRootColumn = collectionsList ? collectionsList.parentElement : null;

  function getPlanType() {
    if (window.brainrootAuth && typeof window.brainrootAuth.getPlanType === "function") {
      return window.brainrootAuth.getPlanType();
    }

    return "free";
  }

  function getCollectionLimit() {
    if (window.brainrootAuth && typeof window.brainrootAuth.getCollectionLimit === "function") {
      return window.brainrootAuth.getCollectionLimit();
    }

    return 8;
  }

  function getCollectionLimitLabel(limit) {
    return Number.isFinite(limit) ? String(limit) : "Unlimited";
  }

  function getPlanDisplay(planType) {
    const normalized = String(planType || "free").toLowerCase();

    if (normalized === "basic") {
      return "Basic";
    }

    if (normalized === "standard") {
      return "Standard";
    }

    if (normalized === "premium") {
      return "Premium";
    }

    return "Free";
  }

  function isCollectionLimitReached(collectionEntries) {
    const limit = getCollectionLimit();
    if (!Number.isFinite(limit)) {
      return false;
    }

    return collectionEntries.length >= limit;
  }

  function getLimitReachedMessage() {
    const planType = getPlanType();
    const limit = getCollectionLimit();
    return "Collection limit reached for " + getPlanDisplay(planType) + " plan (" + getCollectionLimitLabel(limit) + " books). Upgrade plan from Profile to add more.";
  }

  function renderCollectionLimitNote(collectionEntries) {
    if (!collectionsRootColumn || !collectionsEmptyState) {
      return;
    }

    let note = document.getElementById("collectionsLimitNote");
    if (!note) {
      note = document.createElement("div");
      note.id = "collectionsLimitNote";
      note.className = "collections-limit-note";
      collectionsRootColumn.insertBefore(note, collectionsEmptyState);
    }

    const planType = getPlanType();
    const limit = getCollectionLimit();
    const reached = isCollectionLimitReached(collectionEntries);
    const used = collectionEntries.length;

    note.classList.toggle("is-limit-reached", reached);
    note.textContent =
      "Plan: " + getPlanDisplay(planType) +
      " | Collections: " + used + " / " + getCollectionLimitLabel(limit) +
      (reached ? " | Limit Reached" : "");
  }

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function isPaidSubscriber() {
    if (window.brainrootAuth && typeof window.brainrootAuth.isPaidSubscriber === "function") {
      return window.brainrootAuth.isPaidSubscriber();
    }

    return false;
  }

  function isPaidBook(book) {
    return normalizeKey(book?.access) === "paid";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readJson(storageKey, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "null");
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function hashValue(value) {
    return String(value || "").split("").reduce(function (accumulator, char) {
      return (accumulator * 31 + char.charCodeAt(0)) >>> 0;
    }, 17);
  }

  function getFallbackCoverForTitle(title) {
    return fallbackCollectionCovers[hashValue(title) % fallbackCollectionCovers.length];
  }

  function getCollectionTitle(entry) {
    if (typeof entry === "string") {
      return String(entry).trim();
    }

    if (entry && typeof entry === "object") {
      return String(entry.title || "").trim();
    }

    return "";
  }

  function normalizeCollectionEntry(entry) {
    const title = getCollectionTitle(entry);
    if (!title) {
      return null;
    }

    const source = entry && typeof entry === "object" ? entry : {};
    const catalogMeta = catalogByTitle[normalizeKey(title)] || {};

    return {
      title: title,
      author: String(source.author || catalogMeta.author || "Unknown").trim(),
      category: String(source.category || catalogMeta.category || "General").trim(),
      image: String(source.image || source.imageUrl || catalogMeta.image || getFallbackCoverForTitle(title)).trim(),
      summary: String(source.summary || catalogMeta.summary || "A saved title from your library.").trim(),
      progress: Number(source.progress || catalogMeta.progress || 32),
      access: String(source.access || catalogMeta.access || window.brainrootAuth?.getBookAccess?.(title) || "free").trim(),
      tags: Array.isArray(source.tags) ? source.tags : (Array.isArray(catalogMeta.tags) ? catalogMeta.tags : ["general"]),
      importance: Number(source.importance || catalogMeta.importance || 60)
    };
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

    toast.innerHTML = "";
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
      overlay.innerHTML =
        '<div class="return-modal" role="dialog" aria-modal="true" aria-label="Return confirmation">' +
        '<div class="return-modal-body">' +
        '<div class="return-modal-cover"><img alt="Book cover" id="returnModalCover"></div>' +
        '<div class="return-modal-copy">' +
        '<h3 id="returnModalTitle">Return this book?</h3>' +
        '<p id="returnModalMessage"></p>' +
        '</div>' +
        '</div>' +
        '<div class="return-modal-actions">' +
        '<button type="button" class="return-modal-btn" data-return-modal="cancel">Keep in Collection</button>' +
        '<button type="button" class="return-modal-btn return-modal-btn--primary" data-return-modal="confirm">Return Book</button>' +
        '</div>' +
        '</div>';

      document.body.appendChild(overlay);
    }

    return overlay;
  }

  function openReturnModal(book, onConfirm) {
    const overlay = getReturnModal();
    const cover = overlay.querySelector("#returnModalCover");
    const title = overlay.querySelector("#returnModalTitle");
    const message = overlay.querySelector("#returnModalMessage");
    const confirmButton = overlay.querySelector('[data-return-modal="confirm"]');
    const cancelButton = overlay.querySelector('[data-return-modal="cancel"]');

    if (cover) {
      cover.src = book.image || "";
    }

    if (title) {
      title.textContent = 'Return "' + book.title + '"?';
    }

    if (message) {
      message.textContent = "This will remove the book from your collection list. You can still add it again later anytime.";
    }

    function closeModal() {
      overlay.classList.remove("show");
      confirmButton.onclick = null;
      cancelButton.onclick = null;
      overlay.onclick = null;
    }

    confirmButton.onclick = function () {
      closeModal();
      if (typeof onConfirm === "function") {
        onConfirm();
      }
    };

    cancelButton.onclick = closeModal;
    overlay.onclick = function (event) {
      if (event.target === overlay) {
        closeModal();
      }
    };

    overlay.classList.add("show");
  }

  function restoreReturnedBook(book) {
    const collectionEntries = getStoredCollections();
    const alreadyExists = collectionEntries.some(function (entry) {
      return normalizeKey(getCollectionTitle(entry)) === normalizeKey(book.title);
    });

    if (alreadyExists) {
      showToast('"' + book.title + '" is already in your collection.');
      return;
    }

    if (isCollectionLimitReached(collectionEntries)) {
      showToast(getLimitReachedMessage());
      return;
    }

    collectionEntries.unshift(normalizeCollectionEntry(book));
    saveStoredCollections(collectionEntries);
    clearRecentlyRemoved(book.title);
    
    // Add back to borrowed list if it was borrowed before
    const borrowedBooks = JSON.parse(localStorage.getItem("brainrootBorrowed")) || [];
    if (borrowedBooks.indexOf(book.title) === -1) {
      borrowedBooks.push(book.title);
      localStorage.setItem("brainrootBorrowed", JSON.stringify(borrowedBooks));
    }
    
    rerender();
    showToast('Restored "' + book.title + '" to your collection.');
  }

  function returnBookFlow(book, cardElement) {
    const collectionEntries = getStoredCollections();
    const filteredEntries = collectionEntries.filter(function (item) {
      return normalizeKey(getCollectionTitle(item)) !== normalizeKey(book.title);
    });

    if (cardElement) {
      cardElement.classList.add("is-returning");
    }

    showFakeLoading("Processing return...", 950, function () {
      saveStoredCollections(filteredEntries);
      markRecentlyRemoved(book.title);
      
      // Remove from borrowed list  
      const borrowedBooks = JSON.parse(localStorage.getItem("brainrootBorrowed")) || [];
      const filteredBorrowed = borrowedBooks.filter(function (title) {
        return title !== book.title;
      });
      localStorage.setItem("brainrootBorrowed", JSON.stringify(filteredBorrowed));
      
      rerender();
      showToast({
        text: 'Done. "' + book.title + '" was returned from your collection.',
        actionLabel: "Undo",
        onAction: function () {
          restoreReturnedBook(book);
        }
      });
    });
  }

  function showFakeLoading(message, duration, onDone) {
    let overlay = document.getElementById("collectionsLoadingOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "collectionsLoadingOverlay";
      overlay.setAttribute("aria-live", "polite");
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.background = "rgba(12, 15, 15, 0.34)";
      overlay.style.backdropFilter = "blur(6px)";
      overlay.style.webkitBackdropFilter = "blur(6px)";
      overlay.style.display = "grid";
      overlay.style.placeItems = "center";
      overlay.style.zIndex = "95";

      const card = document.createElement("div");
      card.style.background = "rgba(246, 247, 255, 0.9)";
      card.style.border = "1px solid rgba(172, 179, 180, 0.45)";
      card.style.borderRadius = "14px";
      card.style.padding = "14px 16px";
      card.style.minWidth = "220px";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.gap = "10px";
      card.style.color = "#2d3435";
      card.style.fontWeight = "700";

      const spinner = document.createElement("span");
      spinner.style.width = "16px";
      spinner.style.height = "16px";
      spinner.style.border = "2px solid rgba(0, 95, 175, 0.3)";
      spinner.style.borderTopColor = "#005faf";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "brainrootSpin 0.8s linear infinite";

      const text = document.createElement("span");
      text.id = "collectionsLoadingText";

      card.appendChild(spinner);
      card.appendChild(text);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }

    if (!document.getElementById("brainrootLoadingSpinStyle")) {
      const style = document.createElement("style");
      style.id = "brainrootLoadingSpinStyle";
      style.textContent = "@keyframes brainrootSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    const textNode = document.getElementById("collectionsLoadingText");
    if (textNode) {
      textNode.textContent = message || "Loading...";
    }

    overlay.style.display = "grid";
    setTimeout(function () {
      overlay.style.display = "none";
      if (typeof onDone === "function") {
        onDone();
      }
    }, typeof duration === "number" ? duration : 1200);
  }

  function getStoredCollections() {
    const savedValue = localStorage.getItem(collectionKey);

    if (savedValue === null) {
      const seeded = defaultCollections.map(normalizeCollectionEntry).filter(Boolean);
      localStorage.setItem(collectionKey, JSON.stringify(seeded));
      return seeded;
    }

    try {
      const parsed = JSON.parse(savedValue || "[]");
      if (!Array.isArray(parsed)) {
        return [];
      }

      const unique = [];
      const seen = new Set();

      parsed.forEach(function (item) {
        const normalized = normalizeCollectionEntry(item);
        if (!normalized) {
          return;
        }

        const key = normalizeKey(normalized.title);
        if (!key || seen.has(key)) {
          return;
        }

        seen.add(key);
        unique.push(normalized);
      });

      if (JSON.stringify(parsed) !== JSON.stringify(unique)) {
        saveStoredCollections(unique);
      }

      return unique;
    } catch (error) {
      return [];
    }
  }

  function saveStoredCollections(items) {
    const unique = [];
    const seen = new Set();

    (Array.isArray(items) ? items : []).forEach(function (item) {
      const normalized = normalizeCollectionEntry(item);
      if (!normalized) {
        return;
      }

      const key = normalizeKey(normalized.title);
      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      unique.push(normalized);
    });

    localStorage.setItem(collectionKey, JSON.stringify(unique));
  }

  function getWishlistTitles() {
    return readJson(wishlistKey, [])
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
  }

  function readRemovalHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(removalKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveRemovalHistory(items) {
    localStorage.setItem(removalKey, JSON.stringify(items));
  }

  function markRecentlyRemoved(title) {
    const cutoff = Date.now() - 1000 * 60 * 60 * 8;
    const history = readRemovalHistory().filter(function (entry) {
      return entry && entry.title && entry.timestamp >= cutoff;
    });

    history.unshift({ title: title, timestamp: Date.now() });
    saveRemovalHistory(history.slice(0, 12));
  }

  function clearRecentlyRemoved(title) {
    const normalizedTitle = normalizeKey(title);
    const history = readRemovalHistory().filter(function (entry) {
      return normalizeKey(entry?.title) !== normalizedTitle;
    });

    saveRemovalHistory(history);
  }

  function getPreferenceWeights(collectionEntries) {
    const weights = Object.create(null);
    const behavior = window.brainrootLibraryBehavior ? window.brainrootLibraryBehavior.getBookBehavior() : { views: [] };
    const recentViews = Array.isArray(behavior.views) ? behavior.views.slice(0, 12) : [];

    recentViews.forEach(function (view, index) {
      const weight = Math.max(1, 10 - index);
      const categoryKey = normalizeKey(view?.category);
      const titleKey = normalizeKey(view?.title);

      if (categoryKey) {
        weights[categoryKey] = (weights[categoryKey] || 0) + weight * 3;
      }

      if (titleKey) {
        weights[titleKey] = (weights[titleKey] || 0) + weight;
      }
    });

    collectionEntries.forEach(function (entry, index) {
      const book = normalizeCollectionEntry(entry);
      if (!book) {
        return;
      }

      const weight = Math.max(1, 5 - index);
      const categoryKey = normalizeKey(book.category);

      weights[categoryKey] = (weights[categoryKey] || 0) + weight * 2;

      (book.tags || []).forEach(function (tag) {
        const tagKey = normalizeKey(tag);
        weights[tagKey] = (weights[tagKey] || 0) + weight;
      });
    });

    return weights;
  }

  function getAvailableRecommendations(collectionEntries) {
    const collectionSet = new Set(
      collectionEntries
        .map(function (entry) {
          return normalizeKey(getCollectionTitle(entry));
        })
        .filter(Boolean)
    );
    const wishlistSet = new Set(getWishlistTitles().map(normalizeKey));
    const recentRemovalSet = new Set(
      readRemovalHistory()
        .filter(function (entry) {
          return entry && entry.timestamp >= Date.now() - 1000 * 60 * 60 * 8;
        })
        .map(function (entry) {
          return normalizeKey(entry.title);
        })
    );
    const preferenceWeights = getPreferenceWeights(collectionEntries);

    return bookCatalog
      .filter(function (book) {
        const titleKey = normalizeKey(book.title);
        return !collectionSet.has(titleKey) && !wishlistSet.has(titleKey) && !recentRemovalSet.has(titleKey);
      })
      .map(function (book) {
        const titleKey = normalizeKey(book.title);
        const categoryKey = normalizeKey(book.category);
        let score = book.importance || 0;

        score += (preferenceWeights[categoryKey] || 0) * 4;

        (book.tags || []).forEach(function (tag) {
          score += (preferenceWeights[normalizeKey(tag)] || 0) * 1.5;
        });

        score += (preferenceWeights[titleKey] || 0) * 1.2;

        return Object.assign({}, book, { score: score });
      })
      .sort(function (left, right) {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return (right.importance || 0) - (left.importance || 0);
      })
      .slice(0, recommendationLimit);
  }

  function getBookMeta(entryOrTitle) {
    const normalized = normalizeCollectionEntry(entryOrTitle);
    if (normalized) {
      return normalized;
    }

    const title = getCollectionTitle(entryOrTitle) || "Untitled Book";
    return {
      title: title,
      author: "Unknown",
      category: "General",
      image: getFallbackCoverForTitle(title),
      summary: "A saved title from your library.",
      progress: 32,
      importance: 60,
      tags: ["general"],
      access: window.brainrootAuth?.getBookAccess?.(title) || "free"
    };
  }

  function renderCollections(collectionEntries) {
    if (!collectionsList) {
      return;
    }

    collectionsList.innerHTML = "";
    collectionsEmptyState.classList.toggle("hidden", collectionEntries.length > 0);

    if (collectionEntries.length === 0) {
      return;
    }

    collectionEntries.forEach(function (entry, index) {
      const book = getBookMeta(entry);
      const article = document.createElement("article");
      article.className = "collection-card";
      article.setAttribute("data-book-title", book.title);
      article.innerHTML =
        '<div class="collection-cover"><img alt="' +
        escapeHtml(book.title) +
        '" src="' +
        escapeHtml(book.image) +
        '"></div>' +
        '<div class="collection-body">' +
        '<div class="collection-topline">' +
        '<div>' +
        '<span class="collection-category">' +
          escapeHtml(book.category) +
          ' | ' +
        escapeHtml(String(book.access || "free").toUpperCase()) +
        '</span>' +
        '<h3 class="collection-title">' +
        escapeHtml(book.title) +
        '</h3>' +
        '</div>' +
        '<span class="collection-category">Saved ' +
        String(index + 1).padStart(2, "0") +
        '</span>' +
        '</div>' +
        '<p class="collection-copy">' +
        escapeHtml(book.summary) +
        '</p>' +
        '<div class="collection-progress"><span style="width:' +
        Math.max(12, Math.min(100, book.progress || 36)) +
        '%"></span></div>' +
        '<div class="collection-actions">' +
        '<button type="button" data-collection-action="read" class="collection-action">View Book</button>' +
        '<button type="button" data-collection-action="return" class="collection-action collection-action--ghost">Return</button>' +
        '</div>' +
        '</div>';

      collectionsList.appendChild(article);
    });
  }

  function renderRecommendations(collectionEntries) {
    if (!recommendationsList) {
      return;
    }

    const recommendations = getAvailableRecommendations(collectionEntries);
    recommendationsList.innerHTML = "";

    if (recommendations.length === 0) {
      recommendationsList.innerHTML =
        '<div class="collections-empty">No fresh recommendations right now. Browse a few more books and we will refresh this list.</div>';
      return;
    }

    recommendations.forEach(function (book) {
      const lockedBySubscription = isPaidBook(book) && !isPaidSubscriber();
      const article = document.createElement("article");
      article.className = "recommendation-card";
      article.setAttribute("data-book-title", book.title);
      article.innerHTML =
        '<div class="recommendation-cover"><img alt="' +
        escapeHtml(book.title) +
        '" src="' +
        escapeHtml(book.image) +
        '"></div>' +
        '<div class="recommendation-body">' +
        '<span class="recommendation-meta">' +
        escapeHtml(book.category) +
          ' | ' +
        escapeHtml(String(book.access || "free").toUpperCase()) +
        '</span>' +
        '<div class="recommendation-topline">' +
        '<h4 class="recommendation-title">' +
        escapeHtml(book.title) +
        '</h4>' +
        '</div>' +
        '<p class="recommendation-copy">' +
        escapeHtml(book.summary) +
        '</p>' +
        '<button type="button" data-collection-action="add" class="recommendation-button" ' +
        (lockedBySubscription ? 'disabled="disabled"' : "") +
        '>' +
        (lockedBySubscription ? "Subscription Required" : "Add to Collection") +
        '</button>' +
        '</div>';

      recommendationsList.appendChild(article);
    });
  }

  function rerender() {
    const collectionEntries = getStoredCollections();
    renderCollectionLimitNote(collectionEntries);
    renderCollections(collectionEntries);
    renderRecommendations(collectionEntries);
  }

  document.addEventListener("click", function (event) {
    const actionButton = event.target.closest("[data-collection-action]");
    if (!actionButton || !document.body.contains(actionButton)) {
      return;
    }

    const action = actionButton.getAttribute("data-collection-action");
    const card = actionButton.closest("[data-book-title]");
    const title = card ? card.getAttribute("data-book-title") || "book" : "book";
    const book = getBookMeta(title);

    if (action === "read") {
      if (isPaidBook(book) && !isPaidSubscriber()) {
        showToast("This is a paid book. Upgrade subscription from Profile.");
        return;
      }

      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: book.title,
          author: book.author,
          category: book.category,
          source: "collections"
        });
      }

      showFakeLoading("Opening reader...", 1200, function () {
        showToast("Reader is ready for \"" + book.title + "\".");
      });
      return;
    }

    if (action === "add") {
      if (isPaidBook(book) && !isPaidSubscriber()) {
        showToast("Paid books require an active subscription.");
        return;
      }

      const collectionEntries = getStoredCollections();
      const existing = collectionEntries.some(function (entry) {
        return normalizeKey(getCollectionTitle(entry)) === normalizeKey(book.title);
      });

      if (!existing && isCollectionLimitReached(collectionEntries)) {
        showToast(getLimitReachedMessage());
        return;
      }

      if (!existing) {
        collectionEntries.push(normalizeCollectionEntry(book));
        saveStoredCollections(collectionEntries);
      }

      clearRecentlyRemoved(book.title);

      if (window.brainrootLibraryBehavior) {
        window.brainrootLibraryBehavior.recordBookView({
          title: book.title,
          author: book.author,
          category: book.category,
          source: "collection-add"
        });
      }

      rerender();
      showToast("Great choice. \"" + book.title + "\" is now in your collection.");
      return;
    }

    if (action === "return") {
      openReturnModal(book, function () {
        returnBookFlow(book, card);
      });
    }
  });

  window.addEventListener("storage", function (event) {
    if (event.key === "brainrootSubscription" || event.key === "brainrootSubscriptionsByUser") {
      rerender();
      showToast("Subscription status updated.");
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      rerender();
    }
  });

  window.addEventListener("brainroot:subscription-updated", function () {
    rerender();
  });

  rerender();
});
