document.addEventListener("DOMContentLoaded", function () {
  const storage = window.brainrootStorage;
  const form = document.querySelector("form");
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

  form.addEventListener("submit", function (event) {
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

    storage.writeJson("brainrootCurrentUser", {
      email: email,
      loggedInAt: new Date().toISOString()
    });

    showMessage("success", "Login successful. Redirecting...");
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    window.setTimeout(function () {
      window.location.href = returnTo || "../index/index.html";
    }, 500);
  });
});


