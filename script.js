const products = [
  {
    id: 1,
    name: "Classic Tailored Suit",
    category: "men",
    price: 260.00,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600",
    description: "Slim-fit two-piece suit crafted from Italian virgin wool.",
    sizes: ["38R", "40R", "42R"],
    colors: ["#1A1A2E", "#D4AF37"]
  },
  {
    id: 2,
    name: "Oxford Cotton Button Shirt",
    category: "men",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    description: "Crisp white 100% organic cotton shirt with structured collar.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FFFFFF", "#1A1A2E"]
  },
  {
    id: 3,
    name: "Tailored Stretch Trousers",
    category: "men",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
    description: "Smart flat-front trousers with comfortable stretch fabric.",
    sizes: ["30", "32", "34"],
    colors: ["#1A1A2E"]
  },

  {
    id: 4,
    name: "Silk Evening Gown",
    category: "women",
    price: 290.00,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
    description: "Full-length flowing pink silk gown featuring delicate strap details.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#E91E63", "#D4AF37"]
  },
  {
    id: 5,
    name: "Pleated Midi Skirt",
    category: "women",
    price: 90.00,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600",
    description: "Metallic shimmer accordion pleat skirt with elastic waistband.",
    sizes: ["S", "M", "L"],
    colors: ["#D4AF37", "#1A1A2E"]
  },
  {
    id: 6,
    name: "Chiffon Wrap Blouse",
    category: "women",
    price: 70.00,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
    description: "Lightweight airy chiffon blouse with adjustable side tie.",
    sizes: ["S", "M", "L"],
    colors: ["#FFFFFF", "#E91E63"]
  },

  {
    id: 7,
    name: "Junior Cable-Knit Sweater",
    category: "kids",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600",
    description: "Cozy wool blend pullover for cold weather comfort.",
    sizes: ["3T", "4T", "5T"],
    colors: ["#FFFFFF", "#D4AF37"]
  },
  {
    id: 8,
    name: "Infant Cotton Onesie Set",
    category: "kids",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600",
    description: "Hypoallergenic organic cotton everyday newborn and infant wear.",
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: ["#E91E63", "#FFFFFF"]
  },
  {
    id: 9,
    name: "Kids Celebration Blazer",
    category: "kids",
    price: 60.00,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600",
    description: "Smart tailored jacket for parties and family occasions.",
    sizes: ["4T", "5T", "6T"],
    colors: ["#1A1A2E"]
  }
];

let cart = []; 
let wishlist = []; 
let registeredUsers = [
    {
        name: "Demo Customer",
        email: "demo@stylehub.com",
        password: "password123",
        address: "742 Evergreen Terrace, New York, NY",
        orders: 1
    }
];

let currentUser = null;
let currentAuthTab = "login";
let activeProduct = null;
let selectedSize = null;
let selectedColor = null;

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600";

document.addEventListener("DOMContentLoaded", () => {
    ensureModalDOM();
    ensureCartDOM();
    ensureAccountDOM();
    ensureProductGrids();

    renderCategoryProducts("men");
    renderCategoryProducts("women");
    renderCategoryProducts("kids");
    updateCartUI();
});

function ensureProductGrids() {
    ["men", "women", "kids"].forEach(cat => {
        let grid = document.getElementById(`${cat}-products`);
        if (!grid) {
            const section = document.getElementById(cat);
            if (section) {
                grid = document.createElement("div");
                grid.id = `${cat}-products`;
                grid.className = "product-grid";
                section.appendChild(grid);
            }
        }
    });
}

function ensureModalDOM() {
    if (document.getElementById("product-modal")) return;

    const modalHTML = `
        <div id="product-modal" class="modal">
            <div class="modal-dialog">
                <span class="close-modal" onclick="closeProductModal()">&times;</span>
                <div class="modal-body">
                    <div class="modal-image-wrapper">
                        <img id="modal-img" src="" alt="Product Detail">
                    </div>
                    <div class="modal-details-wrapper">
                        <h3 id="modal-title"></h3>
                        <p class="modal-price" id="modal-price"></p>
                        <p class="modal-desc" id="modal-desc"></p>
                        <div class="variant-option">
                            <label><strong>Size:</strong></label>
                            <div class="variant-pills" id="modal-sizes"></div>
                        </div>
                        <div class="variant-option">
                            <label><strong>Color:</strong></label>
                            <div class="variant-colors" id="modal-colors"></div>
                        </div>
                        <button type="button" class="btn btn-primary btn-block" style="margin-top: 20px;" onclick="addProductToCart()">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function ensureCartDOM() {
    const cartSec = document.getElementById("cart");
    if (cartSec && !document.getElementById("cart-items-container")) {
        cartSec.innerHTML = `
            <div class="container">
                <h2 class="section-title">Your Shopping Cart</h2>
                <div class="cart-wrapper">
                    <div class="cart-items" id="cart-items-container"></div>
                    <div class="cart-summary-card">
                        <h3>Order Summary</h3>
                        <div class="summary-line"><span>Subtotal:</span> <span id="cart-subtotal">$0.00</span></div>
                        <div class="summary-line"><span>Shipping:</span> <span>Free</span></div>
                        <div class="summary-line total"><span>Total:</span> <span id="cart-total">$0.00</span></div>
                        <a href="#checkout" class="btn btn-primary btn-block">Proceed to Checkout</a>
                    </div>
                </div>
            </div>
        `;
    }
}

function ensureAccountDOM() {
    const accountSec = document.getElementById("account");
    if (accountSec && !document.getElementById("auth-form")) {
        accountSec.innerHTML = `
            <div class="container">
                <h2 class="section-title">User Account</h2>
                <div class="auth-box" id="auth-container">
                    <div class="auth-tabs">
                        <button type="button" class="tab-btn active" id="tab-login" onclick="switchAuthTab('login')">Sign In</button>
                        <button type="button" class="tab-btn" id="tab-register" onclick="switchAuthTab('register')">Register</button>
                    </div>
                    <form id="auth-form" novalidate onsubmit="handleAuthSubmit(event)">
                        <div id="auth-alert" class="auth-alert hidden"></div>
                        <div class="form-group" id="group-name" style="display: none;">
                            <label>Full Name</label>
                            <input type="text" id="auth-name" placeholder="John Doe">
                            <small class="field-error" id="error-name"></small>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="auth-email" placeholder="you@example.com">
                            <small class="field-error" id="error-email"></small>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="auth-password" placeholder="Min. 6 characters">
                            <small class="field-error" id="error-password"></small>
                        </div>
                        <div class="form-group" id="group-confirm-password" style="display: none;">
                            <label>Confirm Password</label>
                            <input type="password" id="auth-confirm-password" placeholder="Repeat your password">
                            <small class="field-error" id="error-confirm-password"></small>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" id="auth-submit-btn">Sign In</button>
                    </form>
                </div>
                <div class="profile-box hidden" id="profile-container">
                    <div class="profile-header">
                        <div class="avatar-circle" id="profile-avatar">U</div>
                        <div>
                            <h3 id="profile-user-name">User</h3>
                            <p id="profile-user-email" style="color: var(--text-muted);"></p>
                        </div>
                    </div>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border-light, #eee);">
                    <div class="profile-details">
                        <p><strong>Shipping Address:</strong> <span id="profile-address">123 Fashion Ave</span></p>
                        <p><strong>Wishlist Items:</strong> <span id="profile-wishlist-count">0 items</span></p>
                        <p><strong>Completed Orders:</strong> <span id="profile-orders-count">0 orders</span></p>
                    </div>
                    <button type="button" class="btn btn-secondary btn-block" style="margin-top: 20px;" onclick="logoutUser()">Sign Out</button>
                </div>
            </div>
        `;
    }
}

function renderCategoryProducts(category) {
    const container = document.getElementById(`${category}-products`);
    if (!container) return;

    const filtered = products.filter(p => p.category === category);
    if (filtered.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); padding: 10px;">No products available.</p>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-item">
            <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}';" onclick="openProductModal(${p.id})">
            <div class="product-meta">
                <h4>${p.name}</h4>
                <p class="price">$${p.price.toFixed(2)}</p>
                <div style="display: flex; gap: 8px;">
                    <button type="button" class="btn btn-secondary btn-block" onclick="openProductModal(${p.id})">Select Options</button>
                    <button type="button" class="btn" style="background:#f0f0f0; border:1px solid #ddd;" title="Wishlist" onclick="toggleWishlist(${p.id})">
                        <i class="${wishlist.includes(p.id) ? 'fas' : 'far'} fa-heart" style="color:${wishlist.includes(p.id) ? 'var(--primary-pink, #E91E63)' : '#333'}"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function openProductModal(productId) {
    activeProduct = products.find(p => p.id === productId);
    if (!activeProduct) return;

    selectedSize = activeProduct.sizes[0];
    selectedColor = activeProduct.colors[0];

    const modalImg = document.getElementById("modal-img");
    if (modalImg) {
        modalImg.src = activeProduct.image;
        modalImg.onerror = () => { modalImg.src = DEFAULT_IMAGE; };
    }

    const titleEl = document.getElementById("modal-title");
    if (titleEl) titleEl.innerText = activeProduct.name;

    const priceEl = document.getElementById("modal-price");
    if (priceEl) priceEl.innerText = `$${activeProduct.price.toFixed(2)}`;

    const descEl = document.getElementById("modal-desc");
    if (descEl) descEl.innerText = "High-quality, durable fabric tailored for a modern aesthetic.";

    const sizesContainer = document.getElementById("modal-sizes");
    if (sizesContainer) {
        sizesContainer.innerHTML = activeProduct.sizes.map((s, idx) => `
            <button type="button" class="variant-pill ${idx === 0 ? 'active' : ''}" onclick="pickSize('${s}', this)">${s}</button>
        `).join("");
    }

    const colorsContainer = document.getElementById("modal-colors");
    if (colorsContainer) {
        colorsContainer.innerHTML = activeProduct.colors.map((c, idx) => `
            <div class="color-circle ${idx === 0 ? 'active' : ''}" 
                 style="background-color: ${c.toLowerCase()}; border: 1px solid #ccc; width: 22px; height: 22px; border-radius: 50%; cursor: pointer;" 
                 title="${c}" 
                 onclick="pickColor('${c}', this)">
            </div>
        `).join("");
    }

    document.getElementById("product-modal")?.classList.add("active");
}

function pickSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll(".variant-pill").forEach(el => el.classList.remove("active"));
    btn.classList.add("active");
}

function pickColor(color, circle) {
    selectedColor = color;
    document.querySelectorAll(".color-circle").forEach(el => el.classList.remove("active"));
    circle.classList.add("active");
}

function closeProductModal() {
    document.getElementById("product-modal")?.classList.remove("active");
}

function addProductToCart() {
    const existingIndex = cart.findIndex(
        item => item.id === activeProduct.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: activeProduct.id,
            name: activeProduct.name,
            price: activeProduct.price,
            image: activeProduct.image,
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        });
    }

    closeProductModal();
    updateCartUI();
    window.location.hash = "#cart";
}

function adjustQuantity(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-items-container");
    const countBadge = document.querySelector(".cart-count");
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");
    const checkoutSummary = document.getElementById("checkout-items-summary");
    const checkoutFinal = document.getElementById("checkout-final-total");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countBadge) countBadge.innerText = totalCount;

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="padding: 20px 0; color: var(--text-muted, #777);">Your cart is empty.</p>`;
        if (subtotalEl) subtotalEl.innerText = "$0.00";
        if (totalEl) totalEl.innerText = "$0.00";
        if (checkoutSummary) checkoutSummary.innerHTML = `<p style="color: var(--text-muted, #777);">No items in order.</p>`;
        if (checkoutFinal) checkoutFinal.innerText = "$0.00";
        return;
    }

    let subtotal = 0;
    cartContainer.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item-row">
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}';">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted, #777);">
                        Size: <strong>${item.size}</strong> | Color: <strong>${item.color}</strong>
                    </p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="cart-qty-ctrls">
                        <button type="button" onclick="adjustQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" onclick="adjustQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    const formattedTotal = `$${subtotal.toFixed(2)}`;
    if (subtotalEl) subtotalEl.innerText = formattedTotal;
    if (totalEl) totalEl.innerText = formattedTotal;

    if (checkoutSummary) {
        checkoutSummary.innerHTML = cart.map(item => `
            <div class="summary-line">
                <span>${item.name} (${item.size}, ${item.color}) x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join("");
    }
    if (checkoutFinal) checkoutFinal.innerText = formattedTotal;
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    renderCategoryProducts("men");
    renderCategoryProducts("women");
    renderCategoryProducts("kids");

    const wishlistDisplay = document.getElementById("profile-wishlist-count");
    if (wishlistDisplay) wishlistDisplay.innerText = `${wishlist.length} item(s)`;
}

function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
    }

    if (currentUser) {
        currentUser.orders = (currentUser.orders || 0) + 1;
        const ordersCountEl = document.getElementById("profile-orders-count");
        if (ordersCountEl) ordersCountEl.innerText = `${currentUser.orders} completed orders`;
    }

    alert("Order placed successfully! Thank you for purchasing from StyleHub.");
    cart = [];
    updateCartUI();
    document.getElementById("checkout-form")?.reset();
    window.location.hash = "#home";
}

function switchAuthTab(tab) {
    currentAuthTab = tab;
    clearAuthErrors();

    const isRegister = tab === "register";
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const nameGroup = document.getElementById("group-name");
    const confirmGroup = document.getElementById("group-confirm-password");
    const submitBtn = document.getElementById("auth-submit-btn");

    if (tabLogin) tabLogin.classList.toggle("active", !isRegister);
    if (tabRegister) tabRegister.classList.toggle("active", isRegister);
    if (nameGroup) nameGroup.style.display = isRegister ? "block" : "none";
    if (confirmGroup) confirmGroup.style.display = isRegister ? "block" : "none";
    if (submitBtn) submitBtn.innerText = isRegister ? "Create Account" : "Sign In";
}

function handleAuthSubmit(event) {
    if (event) event.preventDefault();
    clearAuthErrors();

    const nameInput = document.getElementById("auth-name");
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    const confirmPasswordInput = document.getElementById("auth-confirm-password");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError("error-email", emailInput, "Email address is required.");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError("error-email", emailInput, "Please enter a valid email format.");
        isValid = false;
    }

    if (!password) {
        showFieldError("error-password", passwordInput, "Password is required.");
        isValid = false;
    } else if (password.length < 6) {
        showFieldError("error-password", passwordInput, "Password must be at least 6 characters.");
        isValid = false;
    }

    if (currentAuthTab === "register") {
        const name = nameInput ? nameInput.value.trim() : "";
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

        if (!name) {
            showFieldError("error-name", nameInput, "Full name is required.");
            isValid = false;
        }

        if (!confirmPassword) {
            showFieldError("error-confirm-password", confirmPasswordInput, "Confirm your password.");
            isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError("error-confirm-password", confirmPasswordInput, "Passwords do not match.");
            isValid = false;
        }

        if (!isValid) return;

        const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            setAuthAlert("An account with this email already exists.", "error");
            return;
        }

        const newUser = {
            name,
            email,
            password,
            address: "123 Fashion Ave, Suite 400",
            orders: 0
        };
        registeredUsers.push(newUser);
        alert(`Account created successfully! Logged in as ${newUser.name}.`);
        loginUserSession(newUser);
    } 
    else {
        if (!isValid) return;

        const foundUser = registeredUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!foundUser) {
            setAuthAlert("Invalid email or password. (Try demo@stylehub.com / password123)", "error");
            return;
        }

        alert(`Signed in successfully! Welcome back, ${foundUser.name}.`);
        loginUserSession(foundUser);
    }
}



function loginUserSession(user) {
    currentUser = user;

    const userNameEl = document.getElementById("profile-user-name");
    const userEmailEl = document.getElementById("profile-user-email");
    const userAddressEl = document.getElementById("profile-address");
    const userOrdersEl = document.getElementById("profile-orders-count");
    const userWishlistEl = document.getElementById("profile-wishlist-count");

    if (userNameEl) userNameEl.innerText = user.name;
    if (userEmailEl) userEmailEl.innerText = user.email;
    if (userAddressEl) userAddressEl.innerText = user.address || "123 Fashion Ave";
    if (userOrdersEl) userOrdersEl.innerText = `${user.orders || 0} completed orders`;
    if (userWishlistEl) userWishlistEl.innerText = `${wishlist.length} item(s)`;

    const authBox = document.getElementById("auth-container");
    const profileBox = document.getElementById("profile-container");
    if (authBox) authBox.style.display = "none";
    if (profileBox) profileBox.style.display = "block";

    const form = document.getElementById("auth-form");
    if (form) form.reset();
    clearAuthErrors();
}

function logoutUser() {
    currentUser = null;
    const authBox = document.getElementById("auth-container");
    const profileBox = document.getElementById("profile-container");

    if (profileBox) profileBox.style.display = "none";
    if (authBox) authBox.style.display = "block";

    switchAuthTab("login");
    setAuthAlert("You have been signed out.", "success");
}

function showFieldError(id, inputEl, message) {
    const errorEl = document.getElementById(id);
    if (errorEl) errorEl.innerText = message;
    if (inputEl) inputEl.style.borderColor = "#d32f2f";
}

function clearAuthErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.innerText = "");
    document.querySelectorAll("#auth-form input").forEach(el => el.style.borderColor = "#ccc");
    const alertBox = document.getElementById("auth-alert");
    if (alertBox) {
        alertBox.style.display = "none";
        alertBox.innerText = "";
    }
}

function setAuthAlert(message, type) {
    const alertBox = document.getElementById("auth-alert");
    if (alertBox) {
        alertBox.innerText = message;
        alertBox.style.display = "block";
        alertBox.style.backgroundColor = type === "error" ? "#ffebee" : "#e8f5e9";
        alertBox.style.color = type === "error" ? "#c62828" : "#2e7d32";
        alertBox.style.border = `1px solid ${type === "error" ? "#ffcdd2" : "#c8e6c9"}`;
    } else {
        alert(message);
    }
}
