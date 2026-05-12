document.addEventListener("DOMContentLoaded", function () {
  const storage = window.brainrootStorage;
  // Select the login form (not the search form)
  const form = document.querySelector("form:not(.site-nav-search)");
  if (!form) {
    return;
  }

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const messageNode = document.createElement("p");
  messageNode.className = "form-message";
  messageNode.setAttribute("aria-live", "polite");
  form.appendChild(messageNode);

  function showMessage(type, message) {
    messageNode.textContent = message;
    messageNode.classList.remove("is-error", "is-success");
    messageNode.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function clearMessage() {
    messageNode.textContent = "";
    messageNode.classList.remove("is-error", "is-success");
  }

  function createDefaultFreeSubscription() {
    return {
      plan: "Free Book",
      billingCycle: "monthly",
      price: 0,
      planType: "free",
      updatedAt: new Date().toISOString()
    };
  }

  function ensureDefaultSubscriptionForUser(email, planType) {
    const emailKey = String(email || "").trim().toLowerCase();
    if (!emailKey || String(planType || "free").toLowerCase() !== "free") {
      return;
    }

    const subscriptionsByUser = storage.readJson("brainrootSubscriptionsByUser", {});
    if (!subscriptionsByUser[emailKey]) {
      subscriptionsByUser[emailKey] = createDefaultFreeSubscription();
      storage.writeJson("brainrootSubscriptionsByUser", subscriptionsByUser);
    }
  }

  function setFieldState(field, hasError) {
    if (!field) {
      return;
    }

    field.classList.toggle("is-invalid", Boolean(hasError));
  }

  if (emailInput) {
    emailInput.addEventListener("input", function () {
      setFieldState(emailInput, false);
      clearMessage();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      setFieldState(passwordInput, false);
      clearMessage();
    });
  }

  const alreadyLoggedIn = storage.readJson("brainrootCurrentUser", null);
  if (alreadyLoggedIn) {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    window.location.href = returnTo || "../index/index.html";
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = (emailInput?.value || "").trim();
    const password = passwordInput?.value || "";

    setFieldState(emailInput, false);
    setFieldState(passwordInput, false);

    if (!email || !password) {
      setFieldState(emailInput, !email);
      setFieldState(passwordInput, !password);
      showMessage("error", "Please enter email and password.");
      return;
    }

    if (!email.includes("@")) {
      setFieldState(emailInput, true);
      showMessage("error", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setFieldState(passwordInput, true);
      showMessage("error", "Password must be at least 6 characters.");
      return;
    }

    // Disable button and show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Signing in...";
    }

    showMessage("success", "Signing you in...");

    // Call backend API to login user
    const result = await window.brainrootAPI.login(email, password);

    // Re-enable button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }

    if (result.success) {
      const planType = result.user.plan_type || result.user.planType || "free";
      const createdAt = result.user.created_at || result.user.createdAt || new Date().toISOString();
      // Store user data locally
      storage.writeJson("brainrootCurrentUser", {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        institution: result.user.institution || "",
        role: result.user.role || "Reader",
        plan_type: planType,
        planType: planType,
        created_at: createdAt,
        createdAt: createdAt,
        loggedInAt: new Date().toISOString()
      });
      ensureDefaultSubscriptionForUser(result.user.email, planType);

      showMessage("success", "Login successful. Redirecting...");
      const returnTo = new URLSearchParams(window.location.search).get("returnTo");
      window.setTimeout(function () {
        window.location.href = returnTo || "../index/index.html";
      }, 500);
    } else {
      // Handle specific error types
      let errorMsg = result.error || "Login failed. Please try again.";
      
      if (result.error && result.error.includes("Server is not responding")) {
        errorMsg = "Server is not responding. Please try again in a few moments. Make sure the backend server is running.";
      } else if (result.error && result.error.includes("Unable to connect")) {
        errorMsg = "Unable to connect to the server. Please check your internet connection or contact support.";
      } else if (result.error && result.error.includes("Invalid") || result.error && result.error.includes("not found")) {
        errorMsg = "Invalid email or password. Please try again.";
      }
      
      showMessage("error", errorMsg);
    }
  });
});


