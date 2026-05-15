(function () {
  const FALLBACK_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='1000' viewBox='0 0 700 1000'%3E%3Crect width='700' height='1000' fill='%23dfe8ea'/%3E%3Crect x='70' y='80' width='560' height='840' rx='24' fill='%23ffffff'/%3E%3Ctext x='350' y='470' font-family='Segoe UI, Arial' font-size='54' font-weight='700' text-anchor='middle' fill='%232d3435'%3EBrainRoot%3C/text%3E%3Ctext x='350' y='540' font-family='Segoe UI, Arial' font-size='30' text-anchor='middle' fill='%23596061'%3EReader%3C/text%3E%3C/svg%3E";
  const PROGRESS_KEY = "brainrootReadingProgress";
  const PREFS_KEY = "brainrootReaderPrefs";
  const MIN_FONT_SIZE = 15;
  const MAX_FONT_SIZE = 24;

  const storage = window.brainrootStorage || {
    readJson(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        return fallback;
      }
    },
    writeJson(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  let activeBook = null;
  let activeBookFileUrlIsTrusted = false;
  let activeBookHasFullAccess = false;
  let progressSaveTimer = null;
  let remoteProgressSaveTimer = null;
  let restoreProgressAfterRender = false;

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getUrlData() {
    const params = new URLSearchParams(window.location.search);
    return {
      title: params.get("title") || params.get("book") || "",
      author: params.get("author") || "",
      category: params.get("category") || "General",
      access: params.get("access") || "",
      image: params.get("image") || "",
      description: params.get("description") || "",
      fileUrl: params.get("fileUrl") || params.get("file_url") || params.get("pdf") || params.get("url") || "",
      sampleUrl: params.get("sampleUrl") || params.get("sample_url") || ""
    };
  }

  function setImage(image, source, altText) {
    if (!image) return;
    image.onerror = function () {
      image.onerror = null;
      image.src = FALLBACK_COVER;
    };
    image.src = source || FALLBACK_COVER;
    image.alt = altText || "Book cover";
  }

  async function loadCatalogBook(title) {
    if (!window.brainrootAPI || typeof window.brainrootAPI.getBooks !== "function") {
      return null;
    }

    try {
      const books = await window.brainrootAPI.getBooks();
      const titleKey = normalizeKey(title);
      return books.find(function (book) {
        return normalizeKey(book.title) === titleKey;
      }) || null;
    } catch (error) {
      console.error("Reader catalog load failed:", error);
      return null;
    }
  }

  function mergeBookData(urlData, catalogBook) {
    const book = Object.assign({}, catalogBook || {});
    const hasCatalogBook = Boolean(catalogBook && catalogBook.title);
    return {
      id: book.id || book.book_id || null,
      title: book.title || urlData.title || "Selected Book",
      author: book.author || urlData.author || "BrainRoot Library",
      category: book.category || urlData.category || "General",
      access: book.access || book.access_type || urlData.access || "free",
      image: book.image || book.image_url || book.imageUrl || urlData.image || "",
      description: book.description || urlData.description || "A curated reading edition from the BrainRoot library.",
      fileUrl: book.file_url || book.fileUrl || book.reader_url || book.readerUrl || urlData.fileUrl || "",
      sampleUrl: book.sample_url || book.sampleUrl || urlData.sampleUrl || "",
      publishedYear: book.published_year || book.publishedYear || "Unknown",
      pages: book.pages || "Unknown",
      language: book.language || "English",
      hasCatalogBook: hasCatalogBook
    };
  }

  function getAppRootUrl() {
    const marker = "/reader/";
    const pathname = window.location.pathname;
    const markerIndex = pathname.toLowerCase().lastIndexOf(marker);

    if (markerIndex !== -1) {
      return window.location.origin + pathname.slice(0, markerIndex + 1);
    }

    return new URL("../", window.location.href).href;
  }

  function isSafeLocalReaderUrl(url) {
    const appRoot = new URL(getAppRootUrl());
    let path = "";

    try {
      path = decodeURIComponent(url.pathname).toLowerCase();
    } catch (error) {
      return false;
    }

    const appPath = appRoot.pathname.toLowerCase();
    const hasReaderFileExtension = /\.(pdf|txt|epub)$/i.test(path);

    return url.origin === window.location.origin &&
      path.startsWith(appPath) &&
      path.indexOf("/assets/books/") !== -1 &&
      path.indexOf("..") === -1 &&
      hasReaderFileExtension;
  }

  function resolveReaderFileUrl(fileUrl, isTrustedSource) {
    const value = String(fileUrl || "").trim();

    if (!value) {
      return "";
    }

    if (/^(data|blob):/i.test(value) || /^\/\//.test(value)) {
      return "";
    }

    let resolvedUrl;

    if (/^https?:\/\//i.test(value)) {
      resolvedUrl = new URL(value);
      return isTrustedSource || isSafeLocalReaderUrl(resolvedUrl) ? resolvedUrl.href : "";
    }

    if (value.startsWith("/")) {
      const appRoot = new URL(getAppRootUrl());
      const normalizedPath = value.toLowerCase().startsWith(appRoot.pathname.toLowerCase())
        ? value
        : appRoot.pathname.replace(/\/$/, "") + value;
      resolvedUrl = new URL(normalizedPath, window.location.origin);
      return isTrustedSource || isSafeLocalReaderUrl(resolvedUrl) ? resolvedUrl.href : "";
    }

    if (value.startsWith("./") || value.startsWith("../")) {
      resolvedUrl = new URL(value, window.location.href);
      return isTrustedSource || isSafeLocalReaderUrl(resolvedUrl) ? resolvedUrl.href : "";
    }

    resolvedUrl = new URL(value, getAppRootUrl());
    return isTrustedSource || isSafeLocalReaderUrl(resolvedUrl) ? resolvedUrl.href : "";
  }

  function isPdfUrl(fileUrl) {
    return /\.pdf(?:[?#].*)?$/i.test(String(fileUrl || "").trim());
  }

  function resetPdfSurfaces() {
    const content = document.getElementById("readerContent");
    const pdfViewer = document.getElementById("pdfViewer");
    const pdfControls = document.getElementById("pdfControls");

    if (content) {
      content.style.display = "block";
    }

    if (pdfViewer) {
      pdfViewer.style.display = "none";
    }

    if (pdfControls) {
      pdfControls.style.display = "none";
    }
  }

  function renderFileFrame(book, fileUrl, noticeMessage) {
    const content = document.getElementById("readerContent");

    resetPdfSurfaces();

    if (!content) {
      return;
    }

    const frame = document.createElement("iframe");
    frame.className = "reader-file-frame";
    frame.src = fileUrl;
    frame.title = book.title + " reading file";
    frame.setAttribute("sandbox", "allow-same-origin");

    content.classList.add("reader-content--file");
    content.replaceChildren(frame);
    restoreProgressAfterRender = true;
    setNotice(noticeMessage || "PDF opened with the browser reader.", true);
    updateProgressDisplay();
    restoreProgressPosition();
  }

  function waitForPdfViewer() {
    if (window.PDFViewer && typeof window.PDFViewer.loadPDF === "function") {
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
      let isSettled = false;
      const timeout = window.setTimeout(function () {
        if (isSettled) {
          return;
        }

        isSettled = true;
        window.removeEventListener("brainroot:pdfviewer-ready", handleReady);
        resolve(Boolean(window.PDFViewer && typeof window.PDFViewer.loadPDF === "function"));
      }, 2500);

      function handleReady() {
        if (isSettled) {
          return;
        }

        isSettled = true;
        window.clearTimeout(timeout);
        resolve(true);
      }

      window.addEventListener("brainroot:pdfviewer-ready", handleReady, { once: true });
    });
  }

  function openPdfFile(book, pdfUrl) {
    if (!pdfUrl) {
      renderContent(book, activeBookHasFullAccess);
      return;
    }

    setNotice("Opening PDF...", true);

    waitForPdfViewer().then(function (isReady) {
      if (!isReady) {
        renderFileFrame(book, pdfUrl, "PDF.js is unavailable, so the browser PDF reader opened this file instead.");
        return;
      }

      const progressRecord = getProgressRecord(book.title) || {};
      window.PDFViewer.loadPDF(pdfUrl, {
        initialPage: Number(progressRecord.pdfPage || 1)
      }).then(function (success) {
        if (success) {
          setNotice("PDF loaded successfully. Use the controls to navigate.", true);
          return;
        }

        renderFileFrame(book, pdfUrl, "PDF.js could not render this file, so the browser PDF reader opened it instead.");
      }).catch(function (error) {
        console.error("PDF viewer failed:", error);
        renderFileFrame(book, pdfUrl, "PDF.js could not render this file, so the browser PDF reader opened it instead.");
      });
    });
  }

  function getProgressStore() {
    const parsed = storage.readJson(PROGRESS_KEY, {});
    return parsed && typeof parsed === "object" ? parsed : {};
  }

  function writeProgressStore(store) {
    storage.writeJson(PROGRESS_KEY, store || {});
  }

  function getProgressRecord(title) {
    return getProgressStore()[normalizeKey(title)] || null;
  }

  function saveProgress(extra) {
    if (!activeBook) return;

    const store = getProgressStore();
    const key = normalizeKey(activeBook.title);
    const current = store[key] && typeof store[key] === "object" ? store[key] : {};
    const next = Object.assign({}, current, extra || {}, {
      title: activeBook.title,
      author: activeBook.author,
      category: activeBook.category,
      updatedAt: new Date().toISOString()
    });

    store[key] = next;
    writeProgressStore(store);
    scheduleRemoteProgressSave(next);
  }

  function mergeProgressRecord(title, remoteRecord) {
    if (!title || !remoteRecord) {
      return;
    }

    const store = getProgressStore();
    const key = normalizeKey(title);
    const current = store[key] && typeof store[key] === "object" ? store[key] : {};
    store[key] = Object.assign({}, current, remoteRecord, {
      title: title,
      updatedAt: remoteRecord.updatedAt || remoteRecord.updated_at || current.updatedAt
    });
    writeProgressStore(store);
  }

  function scheduleRemoteProgressSave(record) {
    if (!window.brainrootAPI || typeof window.brainrootAPI.saveReadingProgress !== "function" || !activeBook) {
      return;
    }

    window.clearTimeout(remoteProgressSaveTimer);
    remoteProgressSaveTimer = window.setTimeout(function () {
      window.brainrootAPI.saveReadingProgress({
        book_id: activeBook.id || activeBook.book_id || null,
        title: activeBook.title,
        progress: record.progress || 0,
        scrollY: record.scrollY || 0,
        pdfPage: record.pdfPage || null,
        pdfPageCount: record.pdfPageCount || null,
        bookmarkScrollY: record.bookmarkScrollY || null
      });
    }, 700);
  }

  async function loadRemoteReadingProgress(book) {
    if (!window.brainrootAPI || typeof window.brainrootAPI.getReadingProgress !== "function" || !book || !book.title) {
      return;
    }

    try {
      const record = await window.brainrootAPI.getReadingProgress({
        id: book.id || book.book_id || null,
        title: book.title
      });
      if (record) {
        mergeProgressRecord(book.title, record);
      }
    } catch (error) {
      console.error("Reader progress sync failed:", error);
    }
  }

  function getPrefs() {
    const prefs = storage.readJson(PREFS_KEY, {});
    return prefs && typeof prefs === "object" ? prefs : {};
  }

  function savePrefs(prefs) {
    storage.writeJson(PREFS_KEY, prefs || {});
  }

  function applyPrefs() {
    const prefs = getPrefs();
    const fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, Number(prefs.fontSize || 18)));
    const lineHeight = 1.8 + (fontSize - 18) * 0.02; // Dynamic line-height based on font size
    const letterSpacing = 0.3 + (fontSize - 18) * 0.02; // Dynamic letter-spacing

    document.documentElement.style.setProperty("--reader-font-size", fontSize + "px");
    document.documentElement.style.setProperty("--reader-line-height", lineHeight);
    document.documentElement.style.setProperty("--reader-letter-spacing", letterSpacing + "px");

    document.body.classList.toggle("reader-dark", prefs.theme === "dark");
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
      themeBtn.textContent = prefs.theme === "dark" ? "Light" : "Dark";
    }
  }

  function setNotice(message, isVisible) {
    const notice = document.getElementById("readerNotice");
    if (!notice) return;
    notice.textContent = message;
    notice.classList.toggle("is-hidden", !isVisible);
  }

  function isPaidBook(book) {
    return String(book.access || "").toLowerCase() === "paid";
  }

  function canReadFullBook(book) {
    if (!isPaidBook(book)) {
      return true;
    }

    return Boolean(window.brainrootAuth && typeof window.brainrootAuth.isPaidSubscriber === "function" && window.brainrootAuth.isPaidSubscriber());
  }

  async function canOpenBorrowedReader(book) {
    if (!book || !book.title) {
      return false;
    }

    // Allow free books to be read without login or borrowing
    if (!isPaidBook(book)) {
      return true;
    }

    // For paid books, check if user is logged in
    if (window.brainrootAuth && typeof window.brainrootAuth.isLoggedIn === "function" && !window.brainrootAuth.isLoggedIn()) {
      return false;
    }

    // Check if book is borrowed
    if (window.brainrootAPI && typeof window.brainrootAPI.isBookBorrowed === "function") {
      return await window.brainrootAPI.isBookBorrowed(book.title);
    }

    // Check if book is in collections
    const collections = storage.readJson("brainrootCollections", []);
    if (!Array.isArray(collections)) {
      return false;
    }

    const key = normalizeKey(book.title);
    return collections.some(function (item) {
      return normalizeKey(typeof item === "string" ? item : item && item.title) === key;
    });
  }

  function canUseCatalogFileUrl(book) {
    return Boolean(book && book.hasCatalogBook);
  }

  function createReaderSections(book, fullAccess) {
    const title = book.title;
    const author = book.author;
    const category = book.category || "General";
    const description = book.description || "This work is part of the BrainRoot archive.";
    const year = book.publishedYear || "Unknown";
    const sections = [
      {
        heading: "Opening Note",
        paragraphs: [
          title + " enters this reader as a guided BrainRoot edition: a readable study text built from the catalog record, subject context, and library metadata. It is designed to help you start reading immediately while the archive can later attach a licensed PDF or ePub file.",
          description,
          "The first pass is simple: read for the central problem. Notice what the subject asks you to compare, what kind of evidence it values, and how the authorial voice frames the reader's attention."
        ]
      },
      {
        heading: "Context and Direction",
        paragraphs: [
          "Author: " + author + ". Category: " + category + ". Published: " + year + ". These metadata points are more than labels; they set up expectations about pace, vocabulary, and the kind of questions worth carrying through the text.",
          "A strong reading session begins by naming the field of tension. In " + category.toLowerCase() + ", that tension might be between form and use, memory and change, habit and choice, or system and individual experience.",
          "As you read, keep a notebook beside this page. Capture one sentence of summary, one question, and one connection to another book in your archive."
        ]
      },
      {
        heading: "Close Reading",
        paragraphs: [
          "The book's central idea can be approached as a chain: observation, interpretation, consequence. Observation asks what is happening. Interpretation asks why it matters. Consequence asks what changes once the idea is accepted.",
          "When a passage feels dense, slow down and translate it into ordinary language. The goal is not to flatten the thought, but to make it available for use in your own research and design decisions.",
          "Look for recurring nouns. In many BrainRoot texts, words such as city, pattern, habit, memory, structure, system, and attention quietly organize the argument."
        ]
      },
      {
        heading: "Research Notes",
        paragraphs: [
          "Use this section as a working desk. If the book is theoretical, identify the claim. If it is narrative, identify the turning point. If it is practical, identify the method and the condition where it might fail.",
          "A useful archive note has three layers: what the text says, what the text assumes, and what the text helps you see elsewhere.",
          "For " + title + ", begin with this prompt: what would become easier to notice after reading this book carefully?"
        ]
      },
      {
        heading: "Application",
        paragraphs: [
          "Bring the reading back to a real site, room, habit, street, collection, or decision. A book becomes readable in the deepest sense when it changes the way you look at something outside the page.",
          "Try pairing this book with another item in your BrainRoot library. Compare their methods rather than only their topics. One may argue by example, another by system, another by memory.",
          "End the session with a practical output: a sketch, a question list, a paragraph of critique, or a small change in how you organize your collection."
        ]
      },
      {
        heading: "Reflection",
        paragraphs: [
          "Before closing, write down one line you would want to explain to a friend. If you can explain it simply, the reading has started to become yours.",
          "Progress is saved automatically in this reader. Return later and continue from the same position, or use the bookmark button to mark a more precise place.",
          "This BrainRoot edition is a readable archive layer. To make it a full source-text reader, attach licensed book files to the catalog and let this page render those files directly."
        ]
      }
    ];

    return fullAccess ? sections : sections.slice(0, 2);
  }

  function renderContent(book, fullAccess) {
    const content = document.getElementById("readerContent");
    if (!content) return;

    const sourceUrl = fullAccess ? book.fileUrl : (book.sampleUrl || "");
    if (sourceUrl) {
      const resolvedUrl = resolveReaderFileUrl(sourceUrl, activeBookFileUrlIsTrusted);
      if (resolvedUrl) {
        renderFileFrame(book, resolvedUrl, "Reading file opened with the browser reader.");
        return;
      }

      setNotice("This reading file could not be opened because its source is not trusted.", true);
    }

    resetPdfSurfaces();
    content.classList.remove("reader-content--file");
    const sections = createReaderSections(book, fullAccess);
    content.replaceChildren();

    sections.forEach(function (section, index) {
      const heading = document.createElement("h2");
      heading.textContent = (index + 1) + ". " + section.heading;
      content.appendChild(heading);

      section.paragraphs.forEach(function (text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        content.appendChild(paragraph);
      });

      if (index === 1 && !fullAccess) {
        const quote = document.createElement("blockquote");
        quote.textContent = "Sample access ends here. Upgrade to a paid plan from Profile to read paid archive editions fully.";
        content.appendChild(quote);
      }
    });

    restoreProgressAfterRender = true;
  }

  function renderBook(book, fullAccess) {
    activeBook = book;
    activeBookHasFullAccess = Boolean(fullAccess);
    activeBookFileUrlIsTrusted = canUseCatalogFileUrl(book);

    document.title = book.title + " - BrainRoot Reader";
    document.getElementById("readerTitle").textContent = book.title;
    document.getElementById("readerAuthor").textContent = book.author;
    document.getElementById("readerCategory").textContent = book.category + " - " + book.language;
    document.getElementById("readerAccessBadge").textContent = isPaidBook(book) ? (fullAccess ? "Paid Access" : "Paid Sample") : "Free Access";
    document.getElementById("readerYear").textContent = book.publishedYear || "—";
    document.getElementById("readerPages").textContent = book.pages || "—";
    document.getElementById("readerLanguage").textContent = book.language || "English";
    setImage(document.getElementById("readerCover"), book.image, book.title + " cover");

    if (isPaidBook(book) && !fullAccess) {
      setNotice("This is a paid book. You can read a sample now; upgrade your plan in Profile for the full BrainRoot reading edition.", true);
    } else {
      setNotice("Reading progress saves automatically on this device.", true);
    }

    const readerFileUrl = fullAccess ? book.fileUrl : (book.sampleUrl || "");
    const resolvedReaderFileUrl = resolveReaderFileUrl(readerFileUrl, activeBookFileUrlIsTrusted);
    if (readerFileUrl && !resolvedReaderFileUrl) {
      setNotice("This reading file could not be opened because its source is not trusted.", true);
    } else if (isPdfUrl(readerFileUrl)) {
      openPdfFile(book, resolvedReaderFileUrl);
      return;
    }

    // Fall back to text-based reader
    renderContent(book, fullAccess);
    restoreProgressPosition();
  }

  function renderLockedReader(book) {
    activeBook = book;
    document.title = book.title + " - BrainRoot Reader";
    document.getElementById("readerTitle").textContent = book.title;
    document.getElementById("readerAuthor").textContent = book.author;
    document.getElementById("readerCategory").textContent = book.category + " - " + book.language;
    document.getElementById("readerAccessBadge").textContent = "Borrow Required";
    document.getElementById("readerYear").textContent = book.publishedYear || "—";
    document.getElementById("readerPages").textContent = book.pages || "—";
    document.getElementById("readerLanguage").textContent = book.language || "English";
    setImage(document.getElementById("readerCover"), book.image, book.title + " cover");
    setNotice("Only borrowed books are readable. Borrow this book first, then open it from Collections.", true);

    const content = document.getElementById("readerContent");
    if (!content) {
      return;
    }

    const heading = document.createElement("h2");
    heading.textContent = "Borrow this book to read";
    const paragraph = document.createElement("p");
    paragraph.textContent = "BrainRoot keeps reading access inside your current borrowed collection. Go to Explore, borrow the book, then use Collections to continue reading.";
    const action = document.createElement("p");
    const link = document.createElement("a");
    link.className = "reader-inline-link";
    link.href = "../explore/explore.html?search=" + encodeURIComponent(book.title);
    link.textContent = "Find this book in Explore";
    action.appendChild(link);
    content.replaceChildren(heading, paragraph, action);
  }

  function getScrollProgress() {
    const content = document.getElementById("readerContent");
    if (!content) return 0;

    const start = Math.max(0, content.offsetTop - 110);
    const end = Math.max(start + 1, content.offsetTop + content.offsetHeight - window.innerHeight + 40);
    const value = (window.scrollY - start) / (end - start);
    return Math.max(0, Math.min(100, Math.round(value * 100)));
  }

  function updateProgressDisplay() {
    const pdfProgress = window.PDFViewer && typeof window.PDFViewer.getCurrentPage === "function" && window.PDFViewer.getPageCount && window.PDFViewer.getPageCount();
    if (pdfProgress) {
      saveProgress({
        pdfPage: window.PDFViewer.getCurrentPage(),
        pdfPageCount: window.PDFViewer.getPageCount()
      });
      return;
    }

    const progress = getScrollProgress();
    const valueEl = document.getElementById("readerProgressValue");
    const barEl = document.getElementById("readerProgressBar");

    if (valueEl) valueEl.textContent = progress + "%";
    if (barEl) barEl.style.width = progress + "%";

    window.clearTimeout(progressSaveTimer);
    progressSaveTimer = window.setTimeout(function () {
      saveProgress({
        progress: progress,
        scrollY: window.scrollY
      });
    }, 160);
  }

  function restoreProgressPosition() {
    if (!restoreProgressAfterRender || !activeBook) return;
    const record = getProgressRecord(activeBook.title);
    restoreProgressAfterRender = false;

    if (!record || !Number(record.scrollY)) {
      return;
    }

    window.requestAnimationFrame(function () {
      window.scrollTo({ top: Number(record.scrollY), behavior: "smooth" });
      updateProgressDisplay();
    });
  }

  function bindControls() {
    const decreaseFontBtn = document.getElementById("decreaseFontBtn");
    const increaseFontBtn = document.getElementById("increaseFontBtn");
    const themeBtn = document.getElementById("themeBtn");
    const bookmarkBtn = document.getElementById("bookmarkBtn");

    if (decreaseFontBtn) {
      decreaseFontBtn.addEventListener("click", function () {
        const prefs = getPrefs();
        prefs.fontSize = Math.max(MIN_FONT_SIZE, Number(prefs.fontSize || 18) - 1);
        savePrefs(prefs);
        applyPrefs();
      });
    }

    if (increaseFontBtn) {
      increaseFontBtn.addEventListener("click", function () {
        const prefs = getPrefs();
        prefs.fontSize = Math.min(MAX_FONT_SIZE, Number(prefs.fontSize || 18) + 1);
        savePrefs(prefs);
        applyPrefs();
      });
    }

    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const prefs = getPrefs();
        prefs.theme = prefs.theme === "dark" ? "light" : "dark";
        savePrefs(prefs);
        applyPrefs();
      });
    }

    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", function () {
        saveProgress({
          bookmarkScrollY: window.scrollY,
          progress: getScrollProgress()
        });
        bookmarkBtn.classList.add("is-active");
        bookmarkBtn.textContent = "Bookmarked";
        window.setTimeout(function () {
          bookmarkBtn.classList.remove("is-active");
          bookmarkBtn.textContent = "Bookmark";
        }, 1500);
      });
    }

    window.addEventListener("scroll", updateProgressDisplay, { passive: true });
    window.addEventListener("resize", updateProgressDisplay);
  }

  async function initializeReader() {
    applyPrefs();
    bindControls();

    const urlData = getUrlData();
    const catalogBook = await loadCatalogBook(urlData.title);
    const book = mergeBookData(urlData, catalogBook);
    await loadRemoteReadingProgress(book);
    const canRead = await canOpenBorrowedReader(book);
    const fullAccess = canReadFullBook(book) || (isPaidBook(book) && canRead);

    if (!canRead) {
      renderLockedReader(book);
      return;
    }

    renderBook(book, fullAccess);
  }

  window.BrainRootReader = Object.assign({}, window.BrainRootReader || {}, {
    getProgressRecord: getProgressRecord,
    saveProgress: saveProgress,
    updateProgressDisplay: updateProgressDisplay
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeReader, { once: true });
  } else {
    initializeReader();
  }
})();
