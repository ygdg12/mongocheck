const API_BASE = ""; // same origin

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const messageEl = document.getElementById("message");
const profileCard = document.getElementById("profile");
const profileEmailEl = document.getElementById("profile-email");
const logoutBtn = document.getElementById("logout-btn");

const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const signupEmailInput = document.getElementById("signup-email");
const signupPasswordInput = document.getElementById("signup-password");

function setMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = "message";
  if (type) {
    messageEl.classList.add(type);
  }
}

function setActiveTab(tab) {
  if (tab === "login") {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  } else {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  }
  setMessage("");
}

function saveToken(token) {
  localStorage.setItem("authToken", token);
}

function getToken() {
  return localStorage.getItem("authToken");
}

function clearToken() {
  localStorage.removeItem("authToken");
}

async function callApi(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

tabLogin.addEventListener("click", () => setActiveTab("login"));
tabSignup.addEventListener("click", () => setActiveTab("signup"));

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;

  setMessage("Creating account...", "success");
  try {
    const data = await callApi("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveToken(data.token);
    setMessage("Account created! You are signed in.", "success");
    showProfile();
  } catch (err) {
    setMessage(err.message, "error");
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  setMessage("Signing in...", "success");
  try {
    const data = await callApi("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveToken(data.token);
    setMessage("Signed in successfully.", "success");
    showProfile();
  } catch (err) {
    setMessage(err.message, "error");
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  profileCard.classList.add("hidden");
  setMessage("You have been logged out.", "success");
});

async function showProfile() {
  const token = getToken();
  if (!token) {
    profileCard.classList.add("hidden");
    return;
  }

  try {
    const data = await callApi("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    profileEmailEl.textContent = `Signed in as: ${data.email}`;
    profileCard.classList.remove("hidden");
  } catch (err) {
    clearToken();
    profileCard.classList.add("hidden");
    setMessage("Session expired. Please sign in again.", "error");
  }
}

// Try to load profile on page load
showProfile();

