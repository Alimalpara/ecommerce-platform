// Initialize page loaded state for smooth transitions
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  loadRecommendedProducts();
  setupSearchBar();
  updateCartPreview();
  setupAddToCartButtons();
  if (window.location.pathname.endsWith("products.html")) {
    loadProductDetails();
  }
});

// Fetch and display recommended products
function loadRecommendedProducts() {
  fetch("data/products.json")
    .then((response) => response.json())
    .then((products) => {
      const recommended = products.slice(0, 3); // Example: first 3 products as recommendations
      const container = document.getElementById("recommendedProducts");
      container.innerHTML = "";

      recommended.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
                    <a href="products.html?id=${product.id}">
                        <img src="${product.images[0]}" alt="${
          product.name
        }" class="product-placeholder">
                        <h3>${product.name}</h3>
                        <p class="price" data-price="${
                          product.price
                        }">$${product.price.toFixed(2)}</p>
                    </a>
                    <button class="add-to-cart-btn" data-id="${
                      product.id
                    }">Add to Cart</button>
                `;
        container.appendChild(card);
      });

      displayPrices();
      setupAddToCartButtons();
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Live Product Search
function setupSearchBar() {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      filterProducts(query);
    });
  }
}

function filterProducts(query) {
  fetch("data/products.json")
    .then((response) => response.json())
    .then((products) => {
      const container = document.getElementById("recommendedProducts");
      container.innerHTML = "";

      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );

      filtered.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
                    <a href="products.html?id=${product.id}">
                        <img src="${product.images[0]}" alt="${
          product.name
        }" class="product-placeholder">
                        <h3>${product.name}</h3>
                        <p class="price" data-price="${
                          product.price
                        }">$${product.price.toFixed(2)}</p>
                    </a>
                    <button class="add-to-cart-btn" data-id="${
                      product.id
                    }">Add to Cart</button>
                `;
        container.appendChild(card);
      });

      displayPrices();
      setupAddToCartButtons();
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Display Prices Based on Selected Currency
function getCurrencySymbol(currency) {
  const symbols = { USD: "$", EUR: "€" };
  return symbols[currency] || "$";
}

function displayPrices() {
  const currency = localStorage.getItem("currency") || "USD";
  const symbol = getCurrencySymbol(currency);
  const priceElements = document.querySelectorAll(".price");

  priceElements.forEach((el) => {
    const price = parseFloat(el.getAttribute("data-price"));
    el.innerText = `${symbol}${price.toFixed(2)}`;
  });
}

// Setup Add to Cart Buttons
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      addToCart(productId, 1);
      alert("Product added to cart!");
    });
  });
}

// Load Product Details on Product Page
function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  if (!productId) return;

  fetch("data/products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        displayProduct(product);
      } else {
        document.getElementById("productDetail").innerHTML =
          "<p>Product not found.</p>";
      }
    })
    .catch((error) => console.error("Error fetching products:", error));
}

function displayProduct(product) {
  const container = document.getElementById("productDetail");
  container.innerHTML = `
        <div class="product-images">
            <img src="${product.images[0]}" alt="${product.name}">
            ${
              product.images.length > 1
                ? product.images
                    .slice(1)
                    .map((img) => `<img src="${img}" alt="${product.name}">`)
                    .join("")
                : ""
            }
        </div>
        <div class="product-info">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="price" data-price="${
              product.price
            }">$${product.price.toFixed(2)}</p>
            <div>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" value="1" min="1">
            </div>
            <button id="addToCartBtn">Add to Cart</button>
            <p id="dynamicPrice"></p>
        </div>
    `;

  displayPrices();

  const quantityInput = document.getElementById("quantity");
  const priceDisplay = document.getElementById("dynamicPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");

  function calculatePrice() {
    const quantity = parseInt(quantityInput.value);
    let price = product.price * quantity;

    // Apply discount (e.g., 10% off)
    const discount = 0.1;
    price -= price * discount;

    // Apply tax (e.g., 8%)
    const tax = 0.08;
    price += price * tax;

    // Add shipping fee (e.g., $5)
    const shipping = 5.0;
    price += shipping;

    const currency = localStorage.getItem("currency") || "USD";
    const symbol = getCurrencySymbol(currency);

    priceDisplay.innerText = `Total Price: ${symbol}${price.toFixed(
      2
    )} (Including discounts, taxes, and shipping)`;
  }

  quantityInput.addEventListener("input", calculatePrice);
  calculatePrice();

  addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }
    addToCart(product.id, quantity);
    alert("Product added to cart!");
  });

  // Load and display reviews
  const reviewsList = document.getElementById("reviewsList");
  const addReviewSection = document.getElementById("addReviewSection");
  const submitReviewBtn = document.getElementById("submitReview");

  function loadReviews() {
    reviewsList.innerHTML = "";
    if (product.reviews.length > 0) {
      const ul = document.createElement("ul");
      product.reviews.forEach((review) => {
        const li = document.createElement("li");
        li.innerText = review;
        ul.appendChild(li);
      });
      reviewsList.appendChild(ul);
    } else {
      reviewsList.innerHTML = "<p>No reviews yet.</p>";
    }
  }

  loadReviews();

  submitReviewBtn.addEventListener("click", () => {
    const newReview = document.getElementById("newReview").value.trim();
    if (newReview) {
      product.reviews.push(newReview);
      // Update the products.json would require backend; here we update localStorage for demonstration
      let products = JSON.parse(localStorage.getItem("products")) || [];
      const prodIndex = products.findIndex((p) => p.id === product.id);
      if (prodIndex !== -1) {
        products[prodIndex].reviews = product.reviews;
        localStorage.setItem("products", JSON.stringify(products));
      }
      loadReviews();
      document.getElementById("newReview").value = "";
      alert("Review added successfully.");
    } else {
      alert("Please write a review before submitting.");
    }
  });
}
