(function () {
  const AUTH_KEY = "brainrootCurrentUser";
  const BEHAVIOR_KEY = "brainrootBookBehavior";
  const SUBSCRIPTION_KEY = "brainrootSubscription";
  const SUBSCRIPTIONS_BY_USER_KEY = "brainrootSubscriptionsByUser";
  const BOOK_ACCESS = {
    "The Form of Space": "free",
    "Urban Rhythms": "paid",
    "The Digital Archive": "free",
    "Lost Collections": "paid",
    "Minimalist Logic": "paid",
    "Future Structures": "free",
    "Green Horizons": "free",
    "Cities in Motion": "paid",
    "Building Tomorrow": "free",
    "Structure & Form": "paid",
    "Virtual Spaces": "free",
    "Preservation Arts": "paid",
    "Metropolitan Tunnels": "free",
    "Concrete Poetry": "free",
    "Vascular Cities": "free",
    "Silent Archives": "free",
    "The Geometry of Silence": "paid",
    "Structure & Light": "paid",
    "Urban Metabolism": "paid",
    "The Modular Man": "paid",
    "Nordic Pavilions": "paid",
    "The Grid System in Digital Ethics": "free",
    "The Alexandrian Echo": "free",
    "Machine Learning for Curators": "free",
    "Spatial Dialectics": "paid",
    "Bauhaus Theory": "paid",
    "Organic Forms": "free",
    "Curvature": "paid",
    "Zen Planning": "free",
    "Kinetic Cities": "free",
    "Atomic Habits": "free",
    "The Silent Patient": "paid",
    "Educated": "free",
    "Why We Sleep": "free",
    "The Kite Runner": "free",
    "Dune": "paid"
  };

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function isLoggedIn() {
    return Boolean(getCurrentUser());
  }

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getCurrentUserEmail() {
    const user = getCurrentUser();
    return normalizeKey(user && user.email);
  }

  function readSubscriptionsByUser() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_BY_USER_KEY) || "null");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function writeSubscriptionsByUser(store) {
    localStorage.setItem(SUBSCRIPTIONS_BY_USER_KEY, JSON.stringify(store || {}));
  }

  function migrateLegacySubscription(emailKey) {
    if (!emailKey) {
      return;
    }

    const store = readSubscriptionsByUser();
    if (store[emailKey]) {
      return;
    }

    try {
      const legacy = JSON.parse(localStorage.getItem(SUBSCRIPTION_KEY) || "null");
      if (legacy && typeof legacy === "object") {
        store[emailKey] = legacy;
        writeSubscriptionsByUser(store);
      }
    } catch (error) {
      // ignore migration errors
    }
  }

  function getSubscription() {
    const emailKey = getCurrentUserEmail();
    migrateLegacySubscription(emailKey);

    const store = readSubscriptionsByUser();
    if (emailKey && store[emailKey] && typeof store[emailKey] === "object") {
      return store[emailKey];
    }

    try {
      const parsed = JSON.parse(localStorage.getItem(SUBSCRIPTION_KEY) || "null");
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function setSubscription(subscription) {
    const emailKey = getCurrentUserEmail();
    if (emailKey) {
      const store = readSubscriptionsByUser();
      store[emailKey] = subscription;
      writeSubscriptionsByUser(store);
    }

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  }

  function isPaidSubscriber() {
    const subscription = getSubscription();
    if (!subscription) {
      return false;
    }

    const type = String(subscription.planType || "").toLowerCase();
    const plan = String(subscription.plan || "").toLowerCase();
    return type === "basic" || type === "standard" || type === "premium" ||
      plan.includes("basic") || plan.includes("standard") || plan.includes("premium");
  }

  function getBookAccess(title) {
    return BOOK_ACCESS[String(title || "").trim()] || "free";
  }

  function isPaidBook(title) {
    return getBookAccess(title) === "paid";
  }

  function readBehavior() {
    try {
      const parsed = JSON.parse(localStorage.getItem(BEHAVIOR_KEY) || "null");
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (error) {
      // Ignore malformed behavior data and rebuild from scratch.
    }

    return { views: [] };
  }

  function writeBehavior(behavior) {
    localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(behavior));
  }

  function recordBookView(book) {
    if (!book || !book.title) {
      return;
    }

    const behavior = readBehavior();
    const views = Array.isArray(behavior.views) ? behavior.views : [];
    const normalizedEntry = {
      title: String(book.title).trim(),
      author: String(book.author || "").trim(),
      category: String(book.category || "").trim(),
      source: String(book.source || "browse").trim(),
      timestamp: Date.now()
    };

    behavior.views = [normalizedEntry].concat(
      views.filter(function (view) {
        return view && view.title !== normalizedEntry.title;
      })
    ).slice(0, 30);

    writeBehavior(behavior);
  }

  function getBookBehavior() {
    return readBehavior();
  }

  function buildLoginUrl(returnTo) {
    const target = returnTo || window.location.href;
    return "../login/login.html?returnTo=" + encodeURIComponent(target);
  }

  function redirectToLogin(returnTo) {
    window.location.replace(buildLoginUrl(returnTo));
  }

  function isSecurePage() {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    return (
      path.includes("/wishlist/") ||
      path.includes("/collections/") ||
      path.includes("/profile/") ||
      path.endsWith("/wishlist.html") ||
      path.endsWith("/collections.html") ||
      path.endsWith("/profile.html")
    );
  }

  function setProfileLinks() {
    const profileLinks = document.querySelectorAll('a[href*="../profile/profile.html"], a[href*="./profile.html"]');

    profileLinks.forEach(function (link) {
      if (isLoggedIn()) {
        if (link.dataset.authOriginalHref) {
          link.setAttribute("href", link.dataset.authOriginalHref);
        }
        link.setAttribute("title", "Profile");
      } else {
        if (!link.dataset.authOriginalHref) {
          link.dataset.authOriginalHref = link.getAttribute("href") || "../profile/profile.html";
        }

        const resolvedHref = new URL(link.dataset.authOriginalHref, window.location.href).href;
        link.setAttribute("href", buildLoginUrl(resolvedHref));
        link.setAttribute("title", "Login");
      }
    });
  }

  function gateSecureLinks() {
    if (isLoggedIn()) {
      return;
    }

    const secureLinks = document.querySelectorAll(
      'a[href*="../wishlist/wishlist.html"], a[href*="../collections/collections.html"], a[href*="../profile/profile.html"]'
    );

    secureLinks.forEach(function (link) {
      if (!link.dataset.authOriginalHref) {
        link.dataset.authOriginalHref = link.getAttribute("href") || "";
      }

      const originalHref = link.dataset.authOriginalHref || link.getAttribute("href") || "";
      if (originalHref) {
        const resolvedHref = new URL(originalHref, window.location.href).href;
        link.setAttribute("href", buildLoginUrl(resolvedHref));
      }
    });
  }

  function requireLogin(message) {
    if (isLoggedIn()) {
      return true;
    }

    redirectToLogin(window.location.href);
    return false;
  }

  function renderNavigation() {
    const loggedIn = isLoggedIn();
    const privateLinks = document.querySelectorAll('[data-auth="private"]');
    const publicLinks = document.querySelectorAll('[data-auth="public"]');
    const loginLinks = document.querySelectorAll('[data-auth="login"]');
    const profileLinks = document.querySelectorAll('[data-auth="profile"]');

    publicLinks.forEach(function (link) {
      link.style.display = "";
    });

    privateLinks.forEach(function (link) {
      link.style.display = loggedIn ? "" : "none";
    });

    loginLinks.forEach(function (link) {
      link.style.display = loggedIn ? "none" : "inline-flex";
    });

    profileLinks.forEach(function (link) {
      link.style.display = loggedIn ? "inline-flex" : "none";
    });

    if (!loggedIn) {
      document.querySelectorAll('[data-auth-login-slot="true"]').forEach(function (slot) {
        slot.style.display = "inline-flex";
      });
    }
  }

  if (isSecurePage() && !isLoggedIn()) {
    redirectToLogin(window.location.href);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setProfileLinks();
    gateSecureLinks();
    renderNavigation();
  });

  window.brainrootAuth = {
    getCurrentUser: getCurrentUser,
    getSubscription: getSubscription,
    setSubscription: setSubscription,
    isLoggedIn: isLoggedIn,
    isPaidSubscriber: isPaidSubscriber,
    getBookAccess: getBookAccess,
    isPaidBook: isPaidBook,
    requireLogin: requireLogin,
    buildLoginUrl: buildLoginUrl,
    redirectToLogin: redirectToLogin,
    renderNavigation: renderNavigation
  };

  window.brainrootLibraryBehavior = {
    getBookBehavior: getBookBehavior,
    recordBookView: recordBookView
  };
})();