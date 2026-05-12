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
  name: "Profile User",
  email: "reader@brainroot.local",
  institution: "BrainRoot Library"
};

const defaultSecuritySettings = {
  emailNotifications: true,
  twoFactor: false
};

const storage = window.brainrootStorage;

let selectedPlan = { ...subscriptionPlans.free };

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
    const toastText = document.createElement("div");
    toastText.className = "profile-toast-text";
    const toastTitle = document.createElement("p");
    toastTitle.id = "profileToastTitle";
    toastTitle.className = "profile-toast-title";
    const toastMessage = document.createElement("p");
    toastMessage.id = "profileToastMessage";
    toastMessage.className = "profile-toast-message";
    toastText.appendChild(toastTitle);
    toastText.appendChild(toastMessage);
    toast.appendChild(toastText);
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

function createDefaultFreeSubscription(updatedAt) {
  return {
    plan: subscriptionPlans.free.name,
    billingCycle: "monthly",
    price: 0,
    planType: "free",
    updatedAt: updatedAt || new Date().toISOString()
  };
}

function getSubscriptionForDisplay() {
  const storedSubscription = window.brainrootAuth?.getSubscription?.() || readStoredValue("brainrootSubscription");
  if (storedSubscription && typeof storedSubscription === "object") {
    return storedSubscription;
  }

  const currentUser = getCurrentUser();
  const planType = String(currentUser.planType || currentUser.plan_type || "free").toLowerCase();
  const configuredPlan = subscriptionPlans[planType] || subscriptionPlans.free;

  if (configuredPlan.type === "free") {
    return createDefaultFreeSubscription(currentUser.loggedInAt);
  }

  return {
    plan: configuredPlan.name,
    billingCycle: "monthly",
    price: configuredPlan.price,
    planType: configuredPlan.type,
    updatedAt: currentUser.loggedInAt || new Date().toISOString()
  };
}

function parseProfileDate(value) {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim().replace(" ", "T");
  const parsedDate = new Date(normalizedValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getMemberSinceYear() {
  const currentUser = getCurrentUser();
  const memberDate = parseProfileDate(currentUser.created_at || currentUser.createdAt || currentUser.loggedInAt);
  return (memberDate || new Date()).getFullYear();
}

function updateMemberSinceDisplay() {
  const memberSinceEl = document.querySelector(".profile-member-since");
  if (memberSinceEl) {
    memberSinceEl.textContent = "Member since " + getMemberSinceYear();
  }
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
  return storage.readJson(storageKey, null);
}

function getSecuritySettings() {
  return Object.assign({}, defaultSecuritySettings, readStoredValue("brainrootSecuritySettings") || {});
}

function saveSecuritySettings(settings) {
  storage.writeJson("brainrootSecuritySettings", settings);
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

function getCurrentUser() {
  const currentUser = window.brainrootAuth?.getCurrentUser?.() || readStoredValue("brainrootCurrentUser");
  return currentUser && typeof currentUser === "object" ? currentUser : {};
}

function getCurrentUserEmail() {
  return getCurrentUser().email || "";
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

function normalizeProfileKey(value) {
  return String(value || "").trim().toLowerCase();
}

function getProfileStorageKey(email) {
  const emailKey = normalizeProfileKey(email || getCurrentUserEmail());
  return emailKey ? "brainrootProfile:" + emailKey : "brainrootProfile";
}

function splitFullName(name) {
  return String(name || "").trim();
}

function readStoredProfileForUser(email) {
  const keyedProfile = readStoredValue(getProfileStorageKey(email));
  if (keyedProfile && typeof keyedProfile === "object") {
    return keyedProfile;
  }

  const legacyProfile = readStoredValue("brainrootProfile");
  if (
    legacyProfile &&
    typeof legacyProfile === "object" &&
    normalizeProfileKey(legacyProfile.email) === normalizeProfileKey(email)
  ) {
    return legacyProfile;
  }

  return {};
}

function getMergedProfile() {
  const currentUser = getCurrentUser();
  const currentEmail = String(currentUser.email || "").trim();
  const storedProfile = readStoredProfileForUser(currentEmail);

  return {
    name: storedProfile.name || currentUser.name || defaultProfile.name,
    email: storedProfile.email || currentEmail || defaultProfile.email,
    institution: storedProfile.institution || currentUser.institution || currentUser.institute || defaultProfile.institution,
    role: storedProfile.role || currentUser.role || "Reader"
  };
}

function saveProfileForCurrentUser(profile) {
  const fullName = profile.name || "";
  const currentUser = getCurrentUser();
  const nextUser = Object.assign({}, currentUser, {
    email: profile.email,
    name: fullName || currentUser.name || profile.email,
    institution: profile.institution,
    role: profile.role || currentUser.role || "Reader"
  });

  storage.writeJson("brainrootCurrentUser", nextUser);
  storage.writeJson(getProfileStorageKey(profile.email), profile);
  storage.writeJson("brainrootProfile", profile);
}

function getFullNameFromProfile(profile) {
  return profile.name || "";
}

function buildProfileFromApiUser(user) {
  return {
    name: user?.name || defaultProfile.name,
    email: user?.email || defaultProfile.email,
    institution: user?.institution || defaultProfile.institution,
    role: user?.role || "Reader"
  };
}

function mergeApiUserIntoLocalProfile(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const profile = buildProfileFromApiUser(user);
  storage.writeJson("brainrootCurrentUser", {
    id: user.id,
    email: user.email,
    name: user.name || getFullNameFromProfile(profile),
    institution: profile.institution,
    role: profile.role,
    plan_type: user.plan_type || user.planType || "free",
    planType: user.planType || user.plan_type || "free",
    created_at: user.created_at || user.createdAt || getCurrentUser().created_at || getCurrentUser().createdAt || new Date().toISOString(),
    createdAt: user.createdAt || user.created_at || getCurrentUser().createdAt || getCurrentUser().created_at || new Date().toISOString(),
    loggedInAt: getCurrentUser().loggedInAt || new Date().toISOString()
  });
  storage.writeJson(getProfileStorageKey(profile.email), profile);
  storage.writeJson("brainrootProfile", profile);
  return profile;
}

async function refreshProfileFromDatabase() {
  if (!window.brainrootAPI || typeof window.brainrootAPI.getProfile !== "function") {
    return null;
  }

  const result = await window.brainrootAPI.getProfile();
  if (!result.success || !result.user) {
    return null;
  }

  return mergeApiUserIntoLocalProfile(result.user);
}

function getDisplayName(profile) {
  if (profile.name) {
    return profile.name;
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
    name: '[data-profile-field="name"]',
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
    profileDisplayName.textContent = profile.name || getDisplayName(profile);
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
    button.classList.toggle("profile-plan-button-active", isActive);
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

async function confirmSubscription() {
  console.log("confirmSubscription() called");
  
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

  console.log("Subscription data:", nextSubscription);

  // Save to local storage
  if (window.brainrootAuth && typeof window.brainrootAuth.setSubscription === "function") {
    window.brainrootAuth.setSubscription(nextSubscription);
  } else {
    storage.writeJson("brainrootSubscription", nextSubscription);
  }

  // Update in database via API
  let dbUpdateSuccess = false;
  let apiError = null;

  try {
    // Try to use brainrootAPI if available
    if (window.brainrootAPI && typeof window.brainrootAPI.updateSubscription === "function") {
      console.log("Using brainrootAPI.updateSubscription()");
      const result = await window.brainrootAPI.updateSubscription(nextSubscription);
      console.log("API response:", result);
      if (result.success) {
        dbUpdateSuccess = true;
        if (result.user) {
          storage.writeJson("brainrootCurrentUser", result.user);
        }
      } else {
        apiError = result.error;
      }
    } else {
      // Fallback: Make direct API call with proper credentials
      console.log("Using direct fetch to subscription.php");
      const response = await fetch("../backend/api/subscription.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nextSubscription)
      });
      
      const result = await response.json();
      console.log("API response:", result);
      if (result.success) {
        dbUpdateSuccess = true;
        if (result.user) {
          storage.writeJson("brainrootCurrentUser", result.user);
        }
      } else {
        apiError = result.error;
      }
    }
  } catch (error) {
    console.error("Subscription database sync error:", error);
    apiError = error.message;
  }

  // Refresh from database to ensure UI is synced
  if (dbUpdateSuccess) {
    console.log("DB update successful, refreshing from database");
    await refreshProfileFromDatabase();
  }

  window.dispatchEvent(new CustomEvent("brainroot:subscription-updated"));

  if (!dbUpdateSuccess && apiError) {
    console.warn("Subscription database update failed:", apiError);
    showToast("Partial Update", "Local update successful. Database sync failed - please refresh.", "neutral");
  } else if (isFree) {
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
  const memberBadge = document.querySelector(".profile-member-badge");
  const storedSubscription = getSubscriptionForDisplay();

  if (!currentPlanName || !currentPlanMeta) {
    return;
  }

  currentPlanName.textContent = storedSubscription.plan + " Subscriber";
  if (storedSubscription.planType === "free") {
    currentPlanMeta.textContent = "Free access active - No payment required";
  } else {
    currentPlanMeta.textContent = "Billing cycle: " + storedSubscription.billingCycle + " - " + formatPrice(storedSubscription.price);
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
  if (memberBadge) {
    memberBadge.textContent = paidUser ? storedSubscription.plan + " Member" : "Free Member";
  }

  const activePlanType = subscriptionPlans[storedSubscription.planType] ? storedSubscription.planType : "free";
  selectedPlan = { ...subscriptionPlans[activePlanType] };
  setActivePlanButton(activePlanType);
}

function syncProfilePageState() {
  populateProfileFields();
  updateCurrentPlanDisplay();
  updateMemberSinceDisplay();
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
  refreshProfileFromDatabase().then(function () {
    syncProfilePageState();
  });

  if (!settingsForm) {
    return;
  }

  togglePlansSection(false);

  const billingCycleSelect = document.getElementById("billingCycle");
  if (billingCycleSelect) {
    billingCycleSelect.addEventListener("change", updateBillingCycle);
  }

  const openPlanSelectorBtn = document.getElementById("openPlanSelectorBtn");
  if (openPlanSelectorBtn) {
    openPlanSelectorBtn.addEventListener("click", openPlanSelector);
  }

  document.querySelectorAll("[data-plan-close]").forEach(function (button) {
    button.addEventListener("click", closePlanSelector);
  });

  document.querySelectorAll("[data-plan-button]").forEach(function (button) {
    button.addEventListener("click", function () {
      const planType = button.getAttribute("data-plan-button") || "standard";
      const planPrice = Number(button.getAttribute("data-plan-price") || 0);
      selectPlan(planType, planPrice);
    });
  });

  document.querySelectorAll("[data-subscription-close]").forEach(function (button) {
    button.addEventListener("click", closeSubscriptionModal);
  });

  const confirmSubscriptionBtn = document.getElementById("confirmSubscriptionBtn");
  if (confirmSubscriptionBtn) {
    confirmSubscriptionBtn.addEventListener("click", confirmSubscription);
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

  settingsForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const currentProfile = getMergedProfile();
    const nameInput = settingsForm.querySelector('[data-profile-field="name"]');
    const emailInput = settingsForm.querySelector('[data-profile-field="email"]');
    const institutionInput = settingsForm.querySelector('[data-profile-field="institution"]');

    const formData = {
      name: nameInput?.value?.trim() || currentProfile.name,
      email: emailInput?.value?.trim() || currentProfile.email,
      institution: institutionInput?.value?.trim() || currentProfile.institution,
      role: currentProfile.role || "Reader"
    };

    const fullName = formData.name || formData.email;

    if (window.brainrootAPI && typeof window.brainrootAPI.updateProfile === "function") {
      const result = await window.brainrootAPI.updateProfile({
        name: fullName,
        email: formData.email,
        institution: formData.institution,
        role: formData.role
      });

      if (!result.success) {
        showToast("Update Failed", result.error || "Profile could not be saved to database.", "neutral");
        return;
      }

      mergeApiUserIntoLocalProfile(result.user);
    } else {
      saveProfileForCurrentUser(formData);
    }

    populateProfileFields();
    showToast("Profile Updated", "Your profile changes were saved to the database.", "success");
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      storage.removeItem("brainrootCurrentUser");
      showToast("Logged Out", "You have been signed out.", "neutral");
      window.location.href = "../login/login.html";
    });
  }
});

window.addEventListener("pageshow", function () {
  if (window.brainrootAuth && window.brainrootAuth.isLoggedIn()) {
    syncProfilePageState();
    refreshProfileFromDatabase().then(function () {
      syncProfilePageState();
    });
  }
});


