document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
  setupAccountForm();
  setupSettings();
  updateCartPreview();
});

// Load User Data
function loadUserData() {
  // Load order history
  const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const orderList = document.getElementById("orderHistorySection");
  orderList.innerHTML = orders.length
    ? orders
        .map(
          (order) =>
            `<li>Order #${order.id} - ${order.total} - ${order.date}</li>`
        )
        .join("")
    : "<li>No orders yet.</li>";

  // Load wishlist
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistList = document.getElementById("wishlistSection");
  wishlistList.innerHTML = wishlist.length
    ? wishlist.map((item) => `<li>${item.name} - $${item.price}</li>`).join("")
    : "<li>Your wishlist is empty.</li>";

  // Load account info
  const username = localStorage.getItem("username") || "";
  const email = localStorage.getItem("email") || "";
  document.getElementById("username").value = username;
  document.getElementById("email").value = email;

  // Load settings
  const currency = localStorage.getItem("currency") || "USD";
  const language = localStorage.getItem("language") || "en";
  const notifications =
    JSON.parse(localStorage.getItem("notifications")) || false;
  document.getElementById("currency").value = currency;
  document.getElementById("language").value = language;
  document.getElementById("notifications").checked = notifications;
}

// Setup Account Form
function setupAccountForm() {
  const form = document.getElementById("accountForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    if (username === "" || email === "") {
      alert("Please fill in all fields.");
      return;
    }
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    alert("Account information saved.");
  });
}

// Setup Settings
function setupSettings() {
  const currency = document.getElementById("currency");
  const language = document.getElementById("language");
  const notifications = document.getElementById("notifications");

  currency.addEventListener("change", () => {
    localStorage.setItem("currency", currency.value);
    alert("Currency preference saved.");
    displayPrices();
    updateCartPageTotal();
  });

  language.addEventListener("change", () => {
    localStorage.setItem("language", language.value);
    alert("Language preference saved.");
    // Implement language change functionality as needed
  });

  notifications.addEventListener("change", () => {
    localStorage.setItem("notifications", notifications.checked);
    alert("Notification preference saved.");
  });
}

// Toggle Collapsible Sections
function toggleSection(id) {
  const section = document.getElementById(id);
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}

// Display Prices Based on Selected Currency
function displayPrices() {
  const currency = localStorage.getItem("currency") || "USD";
  const symbol = getCurrencySymbol(currency);
  const priceElements = document.querySelectorAll(".price");

  priceElements.forEach((el) => {
    const price = parseFloat(el.getAttribute("data-price"));
    el.innerText = `${symbol}${price.toFixed(2)}`;
  });
}

// Get Currency Symbol
function getCurrencySymbol(currency) {
  const symbols = { USD: "$", EUR: "€" };
  return symbols[currency] || "$";
}

// Update Cart Page Total if on Cart Page
function updateCartPageTotal() {
  if (window.location.pathname.endsWith("cart.html")) {
    loadCartItems();
  }
}

// Initialize Cart Preview on Page Load
function updateCartPreview() {
  const cartPreview = document.getElementById("cartPreview");
  if (cartPreview) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartPreview.innerText = `Cart (${totalItems})`;
  }
}
