document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
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

  form.addEventListener("submit", function (event) {
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

    const users = JSON.parse(localStorage.getItem("brainrootUsers") || "[]");
    const exists = users.some(function (user) {
      return user.email === email;
    });

    if (exists) {
      setFieldState(emailInput, true);
      showMessage("error", "An account with this email already exists.");
      return;
    }

    users.push({
      name: name,
      email: email,
      institute: institute,
      role: role,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem("brainrootUsers", JSON.stringify(users));
    showMessage("success", "Account created successfully. Redirecting to login...");
    window.setTimeout(function () {
      window.location.href = "../login/login.html";
    }, 650);
  });
});

