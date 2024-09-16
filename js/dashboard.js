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
    ? wishlist.map((item) => `<li>${item.name} - ${item.price}</li>`).join("")
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
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
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
