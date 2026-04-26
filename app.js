const products = [
  {
    id: "cricket-bat",
    name: "Pro English Willow Cricket Bat",
    price: 4599,
    category: "Cricket",
    description: "Lightweight profile with thick edges for power hitting.",
    image:
      "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "football",
    name: "Match Grip Football",
    price: 1299,
    category: "Football",
    description: "Durable stitched football for turf and grass training.",
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "basketball",
    name: "Indoor/Outdoor Basketball",
    price: 1899,
    category: "Basketball",
    description: "Deep-channel grip and balanced bounce for better control.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "badminton-racket",
    name: "Carbon Badminton Racket",
    price: 2299,
    category: "Badminton",
    description: "Graphite frame with excellent swing speed and stability.",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "yoga-mat",
    name: "Anti-Slip Yoga Mat",
    price: 899,
    category: "Fitness",
    description: "Sweat-resistant 8mm cushioning for home and studio workouts.",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dumbbell-set",
    name: "Adjustable Dumbbell Set",
    price: 5499,
    category: "Fitness",
    description: "Space-saving dumbbell kit with comfortable anti-slip grip.",
    image:
      "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80",
  },
];

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

function formatPrice(value) {
  return INR.format(value);
}

function getCart() {
  return JSON.parse(localStorage.getItem("sports_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("sports_cart", JSON.stringify(cart));
  updateCartCount();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  showToast("Added to cart");
}

function removeFromCart(productId) {
  const updated = getCart().filter((item) => item.id !== productId);
  saveCart(updated);
  renderCartPage();
}

function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = String(total);
  });
}

function createProductCard(product) {
  return `
    <article class="card product-card">
      <img src="${product.image}" alt="${product.name}" data-product="${product.id}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">${formatPrice(product.price)}</div>
      <button class="btn primary" data-add="${product.id}">Add to Cart</button>
    </article>
  `;
}

function renderFeatured() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;
  container.innerHTML = products.slice(0, 4).map(createProductCard).join("");
}

function renderCatalog() {
  const grid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  if (!grid || !searchInput || !categoryFilter || !sortFilter) return;

  const render = () => {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    let filtered = [...products].filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesCategory;
    });

    if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

    grid.innerHTML = filtered.length
      ? filtered.map(createProductCard).join("")
      : `<p class="card">No products found.</p>`;
  };

  [searchInput, categoryFilter, sortFilter].forEach((el) =>
    el.addEventListener("input", render)
  );
  sortFilter.addEventListener("change", render);
  render();
}

function renderProductDetails() {
  const container = document.getElementById("productDetail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((item) => item.id === id);

  if (!product) {
    container.innerHTML = `<div class="card"><h2>Product not found</h2><p>Please go back to the catalog.</p></div>`;
    return;
  }

  container.innerHTML = `
    <article class="card product-detail">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <h1>${product.name}</h1>
        <p class="price">${formatPrice(product.price)}</p>
        <p>${product.description}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <br />
        <button class="btn primary" data-add="${product.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderCartPage() {
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!list || !totalEl) return;

  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<div class="card"><p>Your cart is empty. Explore products and add your gear!</p></div>`;
    totalEl.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  list.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      return `
        <article class="card cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)} each</p>
            <p class="price">Subtotal: ${formatPrice(itemTotal)}</p>
          </div>
          <div>
            <input class="input quantity-input" type="number" min="1" data-qty="${product.id}" value="${item.quantity}" />
            <button class="btn danger" data-remove="${product.id}">Remove</button>
          </div>
        </article>
      `;
    })
    .join("");

  totalEl.textContent = formatPrice(total);
}

function setupFAQ() {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      question.parentElement.classList.toggle("open");
    });
  });
}

function setupAuth() {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  if (!signupForm || !loginForm) return;

  const signupMsg = document.getElementById("signupMsg");
  const loginMsg = document.getElementById("loginMsg");

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;

    if (name.length < 2 || !email.includes("@") || password.length < 6) {
      signupMsg.textContent = "Please provide valid details.";
      signupMsg.className = "helper-text error-text";
      return;
    }

    const users = JSON.parse(localStorage.getItem("sports_users") || "[]");
    const exists = users.some((user) => user.email === email);
    if (exists) {
      signupMsg.textContent = "Email already registered.";
      signupMsg.className = "helper-text error-text";
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("sports_users", JSON.stringify(users));
    signupMsg.textContent = "Account created. You can now login.";
    signupMsg.className = "helper-text success-text";
    signupForm.reset();
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const users = JSON.parse(localStorage.getItem("sports_users") || "[]");
    const user = users.find((account) => account.email === email && account.password === password);

    if (!user) {
      loginMsg.textContent = "Invalid email or password.";
      loginMsg.className = "helper-text error-text";
      return;
    }

    localStorage.setItem("sports_current_user", JSON.stringify(user));
    loginMsg.textContent = `Welcome back, ${user.name}!`;
    loginMsg.className = "helper-text success-text";
    showToast("Login successful");
    loginForm.reset();
  });
}

function setupGlobalClicks() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const addId = target.getAttribute("data-add");
    if (addId) addToCart(addId);

    const productId = target.getAttribute("data-product");
    if (productId) window.location.href = `product.html?id=${productId}`;

    const removeId = target.getAttribute("data-remove");
    if (removeId) {
      removeFromCart(removeId);
      showToast("Item removed");
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const id = target.getAttribute("data-qty");
    if (!id) return;
    const qty = Math.max(1, Number(target.value) || 1);
    target.value = String(qty);

    const cart = getCart();
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity = qty;
    saveCart(cart);
    renderCartPage();
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
}

function setupProductNavigationFromText() {
  document.querySelectorAll(".product-card h3").forEach((title) => {
    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
      const card = title.closest(".product-card");
      const image = card ? card.querySelector("img") : null;
      if (image instanceof HTMLElement) image.click();
    });
  });
}

function init() {
  updateCartCount();
  renderFeatured();
  renderCatalog();
  renderProductDetails();
  renderCartPage();
  setupFAQ();
  setupAuth();
  setupMobileMenu();
  setupGlobalClicks();
  setupProductNavigationFromText();
}

init();
