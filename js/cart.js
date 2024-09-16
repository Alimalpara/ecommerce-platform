// Add to Cart Function
function addToCart(productId, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartPreview();
}

// Update Cart Preview
function updateCartPreview() {
  const cartPreview = document.getElementById("cartPreview");
  if (cartPreview) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartPreview.innerText = `Cart (${totalItems})`;
  }

  // Update cart items if on cart.html
  if (window.location.pathname.endsWith("cart.html")) {
    loadCartItems();
  }
}

// Load Cart Items on Cart Page
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");
  container.innerHTML = "";

  let total = 0;

  // Fetch products from products.json
  fetch("data/products.json")
    .then((response) => response.json())
    .then((products) => {
      cart.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const itemTotal = product.price * item.quantity;
          total += itemTotal;
          const cartItem = document.createElement("div");
          cartItem.className = "cart-item";
          cartItem.innerHTML = `
                        <img src="${product.images[0]}" alt="${
            product.name
          }" class="product-placeholder">
                        <div class="cart-item-details">
                            <h3>${product.name}</h3>
                            <p class="price">$${product.price.toFixed(2)}</p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                        </div>
                        <button onclick="removeFromCart(${
                          product.id
                        })">Remove</button>
                    `;
          container.appendChild(cartItem);
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
      totalElement.innerText = `${symbol}${total.toFixed(2)}`;
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Remove from Cart Function
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartPreview();
}

// Get Currency Symbol
function getCurrencySymbol(currency) {
  const symbols = { USD: "$", EUR: "€" };
  return symbols[currency] || "$";
}

// Initialize Cart Preview on Page Load
document.addEventListener("DOMContentLoaded", updateCartPreview);
