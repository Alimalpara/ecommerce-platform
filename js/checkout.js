document.addEventListener("DOMContentLoaded", () => {
  loadOrderTotal();
  setupCheckoutForm();
  updateCartPreview();
});

// Load Order Total
function loadOrderTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  const products = getProducts(); // Use the same function from main.js

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  });

  // Apply discounts, taxes, shipping as in product page
  const discount = 0.1;
  total -= total * discount;
  const tax = 0.08;
  total += total * tax;
  const shipping = 5.0;
  total += shipping;

  const currency = localStorage.getItem("currency") || "USD";
  const symbol = getCurrencySymbol(currency);
  document.getElementById("orderTotal").innerText = `${symbol}${total.toFixed(
    2
  )}`;
}

// Setup Checkout Form
function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      processPayment();
    }
  });
}

// Validate Form
function validateForm() {
  // Simple validation
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postal = document.getElementById("postal").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!name || !address || !city || !postal || !cardNumber || !expiry || !cvv) {
    alert("Please fill in all required fields.");
    return false;
  }

  // Basic credit card validation
  const cardRegex = /^\d{16}$/;
  if (!cardRegex.test(cardNumber)) {
    alert("Please enter a valid 16-digit credit card number.");
    return false;
  }

  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) {
    alert("Please enter a valid expiry date (MM/YY).");
    return false;
  }

  const cvvRegex = /^\d{3}$/;
  if (!cvvRegex.test(cvv)) {
    alert("Please enter a valid 3-digit CVV.");
    return false;
  }

  return true;
}

// Process Payment
function processPayment() {
  // Simulate payment processing
  alert("Payment successful! Your order has been placed.");

  // Update order history
  const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const newOrder = {
    id: orders.length + 1,
    total: document.getElementById("orderTotal").innerText,
    date: new Date().toLocaleString(),
  };
  orders.push(newOrder);
  localStorage.setItem("orderHistory", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem("cart");

  // Redirect to dashboard
  window.location.href = "dashboard.html";
}

// Get Currency Symbol
function getCurrencySymbol(currency) {
  const symbols = { USD: "$", EUR: "€" };
  return symbols[currency] || "$";
}
