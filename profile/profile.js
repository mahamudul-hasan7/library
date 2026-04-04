// Keep profile-related console behavior in the same script file.
(function () {
  var originalWarn = console.warn;
  console.warn = function () {
    var firstArg = arguments[0];
    if (typeof firstArg === "string" && firstArg.indexOf("cdn.tailwindcss.com should not be used in production") !== -1) {
      return;
    }
    return originalWarn.apply(console, arguments);
  };
})();

const subscriptionPlans = {
  free: {
    name: "Free Book",
    price: 0,
    type: "free",
    info: "Free plan activated (no billing)."
  },
  basic: {
    name: "Basic",
    price: 199,
    type: "basic",
    info: "Charged monthly"
  },
  standard: {
    name: "Standard",
    price: 299,
    type: "standard",
    info: "Charged monthly"
  },
  premium: {
    name: "Premium",
    price: 399,
    type: "premium",
    info: "Charged monthly"
  }
};

const defaultProfile = {
  firstName: "Mahamudul",
  lastName: "Hasan",
  email: "mahamudul@arch-institute.org",
  institution: "Metropolitan School of Architecture"
};

const defaultSecuritySettings = {
  emailNotifications: true,
  twoFactor: false
};

let selectedPlan = { ...subscriptionPlans.standard };

let toastHideTimer = null;

function pulseMembershipPanel() {
  const panel = document.querySelector(".profile-membership-panel");
  if (!panel) {
    return;
  }

  panel.classList.add("profile-panel-highlight");
  setTimeout(function () {
    panel.classList.remove("profile-panel-highlight");
  }, 2200);
}

function updatePageScrollLock() {
  const plansSection = document.getElementById("subscriptionPlansSection");
  const subscriptionModal = document.getElementById("subscriptionModal");
  const isPlansOpen = plansSection && !plansSection.classList.contains("hidden");
  const isSubscriptionModalOpen = subscriptionModal && !subscriptionModal.classList.contains("hidden");

  document.body.classList.toggle("modal-locked", Boolean(isPlansOpen || isSubscriptionModalOpen));
}

function showToast(title, message, variant) {
  let toast = document.getElementById("profileToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "profileToast";
    toast.className = "profile-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = ""
      + '<div class="profile-toast-text">'
      + '  <p id="profileToastTitle" class="profile-toast-title"></p>'
      + '  <p id="profileToastMessage" class="profile-toast-message"></p>'
      + '</div>';
    document.body.appendChild(toast);
  }

  const titleEl = document.getElementById("profileToastTitle");
  const messageEl = document.getElementById("profileToastMessage");
  if (titleEl) {
    titleEl.textContent = title;
  }
  if (messageEl) {
    messageEl.textContent = message;
  }

  toast.classList.remove("profile-toast-success", "profile-toast-neutral");
  toast.classList.add(variant === "neutral" ? "profile-toast-neutral" : "profile-toast-success");

  toast.classList.add("show");

  if (toastHideTimer) {
    clearTimeout(toastHideTimer);
  }

  toastHideTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3800);
}

function formatPrice(amount) {
  return amount === 0 ? "BDT 0" : "BDT " + amount;
}

function formatReadableDate(dateValue) {
  return dateValue.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function getRenewalDateText(subscription) {
  if (!subscription || subscription.planType === "free") {
    return "Not Applicable";
  }

  const baseDate = subscription.updatedAt ? new Date(subscription.updatedAt) : new Date();
  if (isNaN(baseDate.getTime())) {
    return formatReadableDate(new Date());
  }

  const nextRenewal = new Date(baseDate);
  if (subscription.billingCycle === "annual") {
    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
  } else {
    nextRenewal.setMonth(nextRenewal.getMonth() + 1);
  }

  return formatReadableDate(nextRenewal);
}

function readStoredValue(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "null");
  } catch (error) {
    return null;
  }
}

function getSecuritySettings() {
  return Object.assign({}, defaultSecuritySettings, readStoredValue("brainrootSecuritySettings") || {});
}

function saveSecuritySettings(settings) {
  localStorage.setItem("brainrootSecuritySettings", JSON.stringify(settings));
}

function applySecurityToggleState(toggle, isActive) {
  const knob = toggle.querySelector(".profile-toggle-knob");
  toggle.classList.toggle("profile-toggle-on", isActive);
  toggle.classList.toggle("profile-toggle-off", !isActive);
  toggle.setAttribute("aria-pressed", String(isActive));

  if (knob) {
    knob.classList.toggle("profile-toggle-knob-on", isActive);
    knob.classList.toggle("profile-toggle-knob-off", !isActive);
  }
}

function renderSecuritySettings() {
  const settings = getSecuritySettings();
  document.querySelectorAll("[data-security-toggle]").forEach(function (toggle) {
    const settingName = toggle.getAttribute("data-security-toggle");
    applySecurityToggleState(toggle, Boolean(settings[settingName]));
  });
}

function toggleSecuritySetting(settingName) {
  const settings = getSecuritySettings();
  settings[settingName] = !settings[settingName];
  saveSecuritySettings(settings);
  renderSecuritySettings();
}

function getCurrentUserEmail() {
  const currentUser = window.brainrootAuth?.getCurrentUser?.() || readStoredValue("brainrootCurrentUser");
  return currentUser?.email || "";
}

function capitalizeWords(value) {
  return String(value || "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function getMergedProfile() {
  const storedProfile = readStoredValue("brainrootProfile") || {};
  const currentEmail = getCurrentUserEmail() || defaultProfile.email;

  return {
    firstName: storedProfile.firstName || defaultProfile.firstName,
    lastName: storedProfile.lastName || defaultProfile.lastName,
    email: storedProfile.email || currentEmail,
    institution: storedProfile.institution || defaultProfile.institution
  };
}

function getDisplayName(profile) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  if (fullName) {
    return fullName;
  }

  if (profile.email) {
    const localPart = profile.email.split("@")[0] || "Profile User";
    return capitalizeWords(localPart.replace(/[._-]+/g, " "));
  }

  return "Profile User";
}

function ensureSubscriptionBadge() {
  const nameHeading = document.getElementById("profileDisplayName");
  if (!nameHeading) {
    return null;
  }

  let badge = document.getElementById("subscriptionPaidBadge");
  if (!badge) {
    badge = document.createElement("img");
    badge.id = "subscriptionPaidBadge";
    badge.className = "hidden profile-name-badge";
    badge.src = "../Assets/verify badge.png";
    badge.alt = "Paid subscriber verified";
    nameHeading.appendChild(badge);
  }

  return badge;
}

function isPaidSubscription(subscription) {
  if (!subscription) {
    return false;
  }

  const paidPlanTypes = ["basic", "standard", "premium"];
  const type = String(subscription.planType || "").toLowerCase();
  const plan = String(subscription.plan || "").toLowerCase();

  return paidPlanTypes.includes(type) || paidPlanTypes.some(function (name) {
    return plan.includes(name);
  });
}

function populateProfileFields() {
  const profile = getMergedProfile();
  const fieldSelectors = {
    firstName: '[data-profile-field="firstName"]',
    lastName: '[data-profile-field="lastName"]',
    email: '[data-profile-field="email"]',
    institution: '[data-profile-field="institution"]'
  };

  Object.keys(fieldSelectors).forEach(function (fieldName) {
    const input = document.querySelector(fieldSelectors[fieldName]);
    if (input) {
      input.value = profile[fieldName] || "";
    }
  });

  const profileDisplayName = document.getElementById("profileDisplayName");

  if (profileDisplayName) {
    profileDisplayName.textContent = getDisplayName(profile);
  }
}

function renderSelectedPlan() {
  document.getElementById("modalPlanName").textContent = selectedPlan.name;
  document.getElementById("modalPrice").textContent = formatPrice(selectedPlan.price);
  document.getElementById("billingCycle").value = "monthly";
  updateBillingCycle();
}

function setActivePlanButton(planType) {
  const planButtons = document.querySelectorAll("[data-plan-button]");
  planButtons.forEach(function (button) {
    const isActive = button.getAttribute("data-plan-button") === planType;
    button.classList.toggle("ring-2", isActive);
    button.classList.toggle("ring-primary", isActive);
    button.classList.toggle("ring-offset-2", isActive);
  });
}

function selectPlan(plan, price) {
  const configuredPlan = subscriptionPlans[plan];
  selectedPlan = configuredPlan ? { ...configuredPlan } : { name: "Standard", price: price, type: plan || "standard" };

  if (!configuredPlan) {
    selectedPlan.price = price;
  }

  renderSelectedPlan();
  setActivePlanButton(selectedPlan.type);
  closePlanSelector();
  openSubscriptionModal();
}

function updateBillingCycle() {
  const billingCycleSelect = document.getElementById("billingCycle");
  const annualOption = billingCycleSelect.querySelector('option[value="annual"]');
  let billingCycle = billingCycleSelect.value;
  let total;
  let info;

  if (selectedPlan.type === "free") {
    if (annualOption) {
      annualOption.disabled = true;
    }
    billingCycleSelect.value = "monthly";
    billingCycle = "monthly";
    total = 0;
    info = subscriptionPlans.free.info;
  } else if (billingCycle === "annual") {
    if (annualOption) {
      annualOption.disabled = false;
    }
    total = Math.round(selectedPlan.price * 12 * 0.75);
    info = "Charged once per year (25% discount applied)";
  } else {
    if (annualOption) {
      annualOption.disabled = false;
    }
    total = selectedPlan.price;
    info = subscriptionPlans[selectedPlan.type]?.info || "Charged monthly";
  }

  document.getElementById("modalTotal").textContent = formatPrice(total);
  document.getElementById("billingInfo").textContent = info;
}

function openSubscriptionModal() {
  renderSelectedPlan();
  document.getElementById("subscriptionModal").classList.remove("hidden");
  updatePageScrollLock();
}

function togglePlansSection(shouldShow) {
  const plansSection = document.getElementById("subscriptionPlansSection");
  if (!plansSection) {
    return;
  }

  if (shouldShow) {
    plansSection.classList.remove("hidden");
  } else {
    plansSection.classList.add("hidden");
  }

  updatePageScrollLock();
}

function openPlanSelector() {
  const plansSection = document.getElementById("subscriptionPlansSection");
  if (plansSection) {
    togglePlansSection(true);
  }
}

function closePlanSelector() {
  togglePlansSection(false);
}

function closeSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.add("hidden");
  updatePageScrollLock();
}

function confirmSubscription() {
  const planName = document.getElementById("modalPlanName").textContent;
  const billingCycle = document.getElementById("billingCycle").value;
  const isFree = selectedPlan.type === "free";
  const finalPrice = isFree ? 0 : billingCycle === "annual" ? Math.round(selectedPlan.price * 12 * 0.75) : selectedPlan.price;

  const nextSubscription = {
    plan: planName,
    billingCycle: billingCycle,
    price: finalPrice,
    planType: selectedPlan.type,
    updatedAt: new Date().toISOString()
  };

  if (window.brainrootAuth && typeof window.brainrootAuth.setSubscription === "function") {
    window.brainrootAuth.setSubscription(nextSubscription);
  } else {
    localStorage.setItem("brainrootSubscription", JSON.stringify(nextSubscription));
  }

  window.dispatchEvent(new CustomEvent("brainroot:subscription-updated"));

  if (isFree) {
    showToast("Plan Updated", "Free Book plan activated successfully.", "neutral");
  } else {
    showToast("Payment Successful", "Subscription to " + planName + " (" + billingCycle + ") confirmed.", "success");
  }

  updateCurrentPlanDisplay();
  pulseMembershipPanel();
  closeSubscriptionModal();
  togglePlansSection(false);
}

function updateCurrentPlanDisplay() {
  const currentPlanName = document.getElementById("currentPlanName");
  const currentPlanMeta = document.getElementById("currentPlanMeta");
  const renewalDateValue = document.getElementById("renewalDateValue");
  const paidBadge = ensureSubscriptionBadge();
  const billingVerifiedIcon = document.querySelector(".profile-verification-icon");
  const storedSubscription = window.brainrootAuth?.getSubscription?.() || readStoredValue("brainrootSubscription");

  if (!currentPlanName || !currentPlanMeta) {
    return;
  }

  if (!storedSubscription) {
    currentPlanName.textContent = "Premium Subscriber";
    currentPlanMeta.textContent = "Payment Method: Mastercard **** 4242";
    if (renewalDateValue) {
      renewalDateValue.textContent = formatReadableDate(new Date());
    }
    if (paidBadge) {
      paidBadge.classList.add("hidden");
    }
    if (billingVerifiedIcon) {
      billingVerifiedIcon.classList.add("hidden");
    }
    return;
  }

  currentPlanName.textContent = storedSubscription.plan + " Subscriber";
  if (storedSubscription.planType === "free") {
    currentPlanMeta.textContent = "Free access active · No payment required";
  } else {
    currentPlanMeta.textContent = "Billing cycle: " + storedSubscription.billingCycle + " · " + formatPrice(storedSubscription.price);
  }

  if (renewalDateValue) {
    renewalDateValue.textContent = getRenewalDateText(storedSubscription);
  }

  const paidUser = isPaidSubscription(storedSubscription);
  if (paidBadge) {
    paidBadge.classList.toggle("hidden", !paidUser);
  }
  if (billingVerifiedIcon) {
    billingVerifiedIcon.classList.toggle("hidden", !paidUser);
  }
}

function syncProfilePageState() {
  populateProfileFields();
  updateCurrentPlanDisplay();
  renderSecuritySettings();
  updatePageScrollLock();
}

window.selectPlan = selectPlan;
window.updateBillingCycle = updateBillingCycle;
window.openSubscriptionModal = openSubscriptionModal;
window.openPlanSelector = openPlanSelector;
window.closePlanSelector = closePlanSelector;
window.closeSubscriptionModal = closeSubscriptionModal;
window.confirmSubscription = confirmSubscription;

document.addEventListener("DOMContentLoaded", function () {
  if (!window.brainrootAuth || !window.brainrootAuth.requireLogin("Please login to view your profile.")) {
    return;
  }

  const settingsForm = document.getElementById("profileSettingsForm");
  const logoutBtn = document.getElementById("logoutBtn");
  syncProfilePageState();

  if (!settingsForm) {
    return;
  }

  togglePlansSection(false);

  const billingCycleSelect = document.getElementById("billingCycle");
  if (billingCycleSelect) {
    billingCycleSelect.addEventListener("change", updateBillingCycle);
  }

  const plansSection = document.getElementById("subscriptionPlansSection");
  if (plansSection) {
    plansSection.addEventListener("click", function (event) {
      if (event.target === plansSection) {
        closePlanSelector();
      }
    });
  }

  document.querySelectorAll("[data-security-toggle]").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      toggleSecuritySetting(toggle.getAttribute("data-security-toggle"));
    });
  });

  settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstNameInput = settingsForm.querySelector('[data-profile-field="firstName"]');
    const lastNameInput = settingsForm.querySelector('[data-profile-field="lastName"]');
    const emailInput = settingsForm.querySelector('[data-profile-field="email"]');
    const institutionInput = settingsForm.querySelector('[data-profile-field="institution"]');

    const formData = {
      firstName: firstNameInput?.value?.trim() || defaultProfile.firstName,
      lastName: lastNameInput?.value?.trim() || defaultProfile.lastName,
      email: emailInput?.value?.trim() || defaultProfile.email,
      institution: institutionInput?.value?.trim() || defaultProfile.institution
    };

    localStorage.setItem("brainrootProfile", JSON.stringify(formData));
    populateProfileFields();
    showToast("Profile Updated", "Your profile changes were saved successfully.", "success");
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("brainrootCurrentUser");
      showToast("Logged Out", "You have been signed out.", "neutral");
      window.location.href = "../login/login.html";
    });
  }
});

window.addEventListener("pageshow", function () {
  if (window.brainrootAuth && window.brainrootAuth.isLoggedIn()) {
    syncProfilePageState();
  }
});
