document.addEventListener("DOMContentLoaded", function () {
  const storage = window.brainrootStorage;
  // Select the register form (not the search form)
  const form = document.querySelector("form:not(.site-nav-search)");
  if (!form) {
    return;
  }

  const nameInput = form.querySelector('input[name="fullName"]');
  const emailInput = form.querySelector('input[name="emailAddress"]');
  const instituteSelect = form.querySelector('select[name="institute"]');
  const customInstituteInput = form.querySelector('input[name="customInstitute"]');
  const roleSelect = form.querySelector('select[name="role"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const termsCheckbox = form.querySelector('input[name="termsAccepted"]');
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

  function saveDefaultSubscriptionForUser(email) {
    const emailKey = String(email || "").trim().toLowerCase();
    if (!emailKey) {
      return;
    }

    const subscriptionsByUser = storage.readJson("brainrootSubscriptionsByUser", {});
    subscriptionsByUser[emailKey] = createDefaultFreeSubscription();
    storage.writeJson("brainrootSubscriptionsByUser", subscriptionsByUser);
  }

  function setFieldState(field, hasError) {
    if (!field) {
      return;
    }

    field.classList.toggle("is-invalid", Boolean(hasError));
  }

  function toggleCustomInstitute() {
    const wantsCustom = instituteSelect && instituteSelect.value === "Other";
    if (!customInstituteInput) {
      return;
    }

    customInstituteInput.classList.toggle("is-hidden", !wantsCustom);
    if (!wantsCustom) {
      customInstituteInput.value = "";
      setFieldState(customInstituteInput, false);
    }
  }

  if (instituteSelect) {
    instituteSelect.addEventListener("change", function () {
      setFieldState(instituteSelect, false);
      clearMessage();
      toggleCustomInstitute();
    });
  }

  [nameInput, emailInput, customInstituteInput, passwordInput].forEach(function (field) {
    if (!field) {
      return;
    }

    field.addEventListener("input", function () {
      setFieldState(field, false);
      clearMessage();
    });
  });

  [roleSelect, termsCheckbox].forEach(function (field) {
    if (!field) {
      return;
    }

    field.addEventListener("change", function () {
      setFieldState(field, false);
      clearMessage();
    });
  });

  toggleCustomInstitute();

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim().toLowerCase();
    const selectedInstitute = instituteSelect?.value || "";
    const customInstitute = (customInstituteInput?.value || "").trim();
    const role = roleSelect?.value || "Reader";
    const password = passwordInput?.value || "";
    const acceptedTerms = Boolean(termsCheckbox?.checked);

    const institute = selectedInstitute === "Other" ? customInstitute : selectedInstitute;

    setFieldState(nameInput, false);
    setFieldState(emailInput, false);
    setFieldState(instituteSelect, false);
    setFieldState(customInstituteInput, false);
    setFieldState(roleSelect, false);
    setFieldState(passwordInput, false);
    setFieldState(termsCheckbox, false);

    if (!name || !email || !password || !selectedInstitute) {
      setFieldState(nameInput, !name);
      setFieldState(emailInput, !email);
      setFieldState(instituteSelect, !selectedInstitute);
      setFieldState(passwordInput, !password);
      showMessage("error", "Please fill in all fields.");
      return;
    }

    if (selectedInstitute === "Other" && !customInstitute) {
      setFieldState(customInstituteInput, true);
      showMessage("error", "Please type your institute name.");
      return;
    }

    if (!email.includes("@")) {
      setFieldState(emailInput, true);
      showMessage("error", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setFieldState(passwordInput, true);
      showMessage("error", "Password must be at least 8 characters.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setFieldState(passwordInput, true);
      showMessage("error", "Password must include at least one number.");
      return;
    }

    if (!acceptedTerms) {
      setFieldState(termsCheckbox, true);
      showMessage("error", "Please accept the archive access terms.");
      return;
    }

    // Disable button and show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Creating account...";
    }

    showMessage("success", "Creating your account...");

    // Call backend API to register user
    const result = await window.brainrootAPI.register({
      name: name,
      email: email,
      password: password,
      institution: institute,
      role: role
    });

    // Re-enable button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }

    if (result.success) {
      const planType = result.user.plan_type || result.user.planType || "free";
      const createdAt = result.user.created_at || result.user.createdAt || new Date().toISOString();
      // Store user data locally
      const currentUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        institution: institute,
        role: role,
        plan_type: planType,
        planType: planType,
        created_at: createdAt,
        createdAt: createdAt,
        loggedInAt: new Date().toISOString()
      };
      const profileNameParts = String(result.user.name || name).trim().split(/\s+/).filter(Boolean);
      const profileData = {
        firstName: profileNameParts[0] || name,
        lastName: profileNameParts.slice(1).join(" "),
        email: result.user.email,
        institution: institute,
        role: role
      };

      storage.writeJson("brainrootCurrentUser", currentUser);
      storage.writeJson("brainrootProfile:" + String(result.user.email || email).trim().toLowerCase(), profileData);
      saveDefaultSubscriptionForUser(result.user.email || email);

      showMessage("success", "Account created successfully. Redirecting to login...");
      window.setTimeout(function () {
        window.location.href = "../login/login.html";
      }, 650);
    } else {
      // Handle specific error types
      let errorMsg = result.error || "Failed to create account. Please try again.";
      
      if (result.error && result.error.includes("Server is not responding")) {
        errorMsg = "Server is not responding. Please try again in a few moments. Make sure the backend server is running.";
      } else if (result.error && result.error.includes("Unable to connect")) {
        errorMsg = "Unable to connect to the server. Please check your internet connection or contact support.";
      } else if (result.error && result.error.includes("already exists") || result.error && result.error.includes("already registered")) {
        errorMsg = "This email is already registered. Please try logging in or use a different email.";
      }
      
      showMessage("error", errorMsg);
    }
  });
});


