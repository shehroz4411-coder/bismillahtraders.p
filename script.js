/* =========================================================
   SPANISH FAST FOOD
   COMPLETE CART + BRANCH + PAYMENT + WHATSAPP SYSTEM
========================================================= */

"use strict";


/* =========================================================
   BRANCHES
========================================================= */

const BRANCHES = {
    taxila: {
        name: "Spanish Taxila",
        whatsapp: "923173664422"
    },
    "hassan-abdal": {
        name: "Spanish Hassan Abdal",
        whatsapp: "923155494443"
    }
};


/* =========================================================
   SETTINGS
========================================================= */

const CART_STORAGE_KEY = "spanishCart";


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initMobileMenu();
    initSlider();
    initCart();
});


/* =========================================================
   PRELOADER
========================================================= */

function initPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;
    window.addEventListener("load", function () {
        setTimeout(function () {
            preloader.classList.add("hide");
        }, 500);
    });
}


/* =========================================================
   MOBILE MENU
========================================================= */

function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
        const opened = navLinks.classList.contains("active");
        menuToggle.textContent = opened ? "×" : "☰";
    });

    navLinks.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            navLinks.classList.remove("active");
            menuToggle.textContent = "☰";
        }
    });
}


/* =========================================================
   HERO SLIDER
========================================================= */

function initSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");
    const nextButton = document.getElementById("nextSlide");
    const prevButton = document.getElementById("prevSlide");
    if (!slides.length) return;

    let currentSlide = 0;
    let sliderTimer = null;

    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        currentSlide = index;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === currentSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function previousSlide() { showSlide(currentSlide - 1); }
    function restartSlider() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, 5000);
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            nextSlide();
            restartSlider();
        });
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            previousSlide();
            restartSlider();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            restartSlider();
        });
    });

    const hero = document.querySelector(".hero");
    let touchStartX = 0;
    if (hero) {
        hero.addEventListener("touchstart", function (event) {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });
        hero.addEventListener("touchend", function (event) {
            const touchEndX = event.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) < 50) return;
            if (difference > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
            restartSlider();
        }, { passive: true });
    }

    showSlide(0);
    restartSlider();
}


/* =========================================================
   CART SYSTEM
========================================================= */

function initCart() {
    let cart = loadCart();
    let selectedPayment = "easypaisa";

    /* DOM ELEMENTS */
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const openCartButton = document.getElementById("openCart");
    const closeCartButton = document.getElementById("closeCart");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutBtn");
    const branchSelect = document.getElementById("branchSelect");
    const paymentOptions = document.querySelectorAll(".payment-option");

    /* =====================================================
       PAYMENT SELECTION
    ===================================================== */
    if (paymentOptions.length) {
        paymentOptions.forEach(function (btn) {
            btn.addEventListener("click", function () {
                paymentOptions.forEach(function (b) {
                    b.classList.remove("active");
                });
                this.classList.add("active");
                selectedPayment = this.dataset.method;
                console.log("Payment method selected:", selectedPayment);
            });
        });
    }

    /* =====================================================
       OPEN CART
    ===================================================== */
    function openCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.add("active");
        if (cartOverlay) cartOverlay.classList.add("active");
        document.body.classList.add("cart-open");
    }

    /* =====================================================
       CLOSE CART
    ===================================================== */
    function closeCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.remove("active");
        if (cartOverlay) cartOverlay.classList.remove("active");
        document.body.classList.remove("cart-open");
    }

    /* =====================================================
       SAVE CART
    ===================================================== */
    function saveCart() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error("Cart save error:", error);
        }
    }

    /* =====================================================
       ADD ITEM
    ===================================================== */
    function addItem(button) {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!id || !name || isNaN(price)) {
            console.error("Invalid cart button:", button);
            notification("This item cannot be added");
            return;
        }

        const existingItem = cart.find(function (item) {
            return item.id === id;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();
        renderCart();
        openCart();
        notification(name + " added to cart");
    }

    /* =====================================================
       CHANGE QUANTITY
    ===================================================== */
    function changeQuantity(id, amount) {
        const item = cart.find(function (product) {
            return product.id === id;
        });
        if (!item) return;
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(function (product) {
                return product.id !== id;
            });
        }
        saveCart();
        renderCart();
    }

    /* =====================================================
       REMOVE ITEM
    ===================================================== */
    function removeItem(id) {
        cart = cart.filter(function (item) {
            return item.id !== id;
        });
        saveCart();
        renderCart();
    }

    /* =====================================================
       GET TOTAL
    ===================================================== */
    function getTotal() {
        return cart.reduce(function (total, item) {
            return total + (Number(item.price) * Number(item.quantity));
        }, 0);
    }

    /* =====================================================
       GET CART QUANTITY
    ===================================================== */
    function getCartQuantity() {
        return cart.reduce(function (total, item) {
            return total + Number(item.quantity);
        }, 0);
    }

    /* =====================================================
       RENDER CART
    ===================================================== */
    function renderCart() {
        const quantity = getCartQuantity();
        const total = getTotal();

        if (cartCount) cartCount.textContent = quantity;
        if (cartTotal) cartTotal.textContent = formatPrice(total);

        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add something delicious!</p>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(function (item) {
            const subtotal = Number(item.price) * Number(item.quantity);
            return `
                <div class="cart-item" data-cart-id="${escapeHTML(item.id)}">
                    <div class="cart-item-info">
                        <h3>${escapeHTML(item.name)}</h3>
                        <strong>${formatPrice(item.price)}</strong>
                        <div class="cart-controls">
                            <button type="button" class="quantity-minus" data-id="${escapeHTML(item.id)}">−</button>
                            <span class="quantity-number">${item.quantity}</span>
                            <button type="button" class="quantity-plus" data-id="${escapeHTML(item.id)}">+</button>
                            <button type="button" class="remove-item" data-id="${escapeHTML(item.id)}">Remove</button>
                        </div>
                    </div>
                    <strong class="cart-item-subtotal">${formatPrice(subtotal)}</strong>
                </div>
            `;
        }).join("");
    }

    /* =====================================================
       ADD TO CART BUTTONS
    ===================================================== */
    document.addEventListener("click", function (event) {
        const button = event.target.closest(".add-cart");
        if (!button) return;
        event.preventDefault();
        addItem(button);
    });

    /* =====================================================
       OPEN CART BUTTON
    ===================================================== */
    if (openCartButton) {
        openCartButton.addEventListener("click", function (event) {
            event.preventDefault();
            openCart();
        });
    }

    /* =====================================================
       CLOSE CART
    ===================================================== */
    if (closeCartButton) {
        closeCartButton.addEventListener("click", function () {
            closeCart();
        });
    }

    /* =====================================================
       OVERLAY CLOSE
    ===================================================== */
    if (cartOverlay) {
        cartOverlay.addEventListener("click", function () {
            closeCart();
        });
    }

    /* =====================================================
       QUANTITY / REMOVE
    ===================================================== */
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", function (event) {
            const plusButton = event.target.closest(".quantity-plus");
            const minusButton = event.target.closest(".quantity-minus");
            const removeButton = event.target.closest(".remove-item");

            if (plusButton) {
                changeQuantity(plusButton.dataset.id, 1);
                return;
            }
            if (minusButton) {
                changeQuantity(minusButton.dataset.id, -1);
                return;
            }
            if (removeButton) {
                removeItem(removeButton.dataset.id);
                return;
            }
        });
    }

    /* =====================================================
       GET SELECTED BRANCH
    ===================================================== */
    function getSelectedBranch() {
        if (!branchSelect) {
            console.error("branchSelect not found");
            return null;
        }
        const value = String(branchSelect.value || "").trim().toLowerCase();
        console.log("Branch value:", value);

        if (BRANCHES[value]) return BRANCHES[value];

        const selectedOption = branchSelect.options[branchSelect.selectedIndex];
        if (selectedOption) {
            const text = selectedOption.textContent.trim().toLowerCase();
            if (text.includes("taxila")) return BRANCHES.taxila;
            if (text.includes("hassan") && text.includes("abdal")) return BRANCHES["hassan-abdal"];
        }
        return null;
    }

    /* =====================================================
       CHECKOUT BUTTON - WITH PAYMENT
    ===================================================== */
    if (checkoutButton) {
        checkoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            checkoutWhatsApp();
        });
    }

    /* =====================================================
       WHATSAPP CHECKOUT - PAYMENT FIRST!
    ===================================================== */
    function checkoutWhatsApp() {
        /* EMPTY CART */
        if (cart.length === 0) {
            notification("Your cart is empty");
            return;
        }

        /* BRANCH */
        const branch = getSelectedBranch();
        if (!branch) {
            notification("Please select your branch");
            return;
        }

        /* PAYMENT - FORCE PAYMENT FIRST */
        const paymentMethod = selectedPayment || "easypaisa";
        const paymentLabel = paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash";

        /* SHOW PAYMENT POPUP / CONFIRMATION */
        const confirmPayment = confirm(
            `💳 PAYMENT REQUIRED BEFORE ORDER\n\n` +
            `Payment Method: ${paymentLabel}\n` +
            `Total Amount: ${formatPrice(getTotal())}\n\n` +
            `📱 Send payment to:\n` +
            `EasyPaisa/JazzCash: 0317 3664422\n\n` +
            `✅ Press OK after you have made the payment.\n` +
            `❌ Press Cancel to cancel order.`
        );

        if (!confirmPayment) {
            notification("Order cancelled. Payment not confirmed.");
            return;
        }

        /* =====================================================
           PAYMENT CONFIRMED - SEND WHATSAPP ORDER
        ===================================================== */
        const total = getTotal();

        let message = "🍔 SPANISH FAST FOOD ORDER\n\n";
        message += "📍 BRANCH: " + branch.name + "\n\n";
        message += "🛒 ORDER DETAILS\n";
        message += "--------------------------\n";

        cart.forEach(function (item, index) {
            const subtotal = Number(item.price) * Number(item.quantity);
            message += `${index + 1}. ${item.name}\n`;
            message += `Quantity: ${item.quantity}\n`;
            message += `Price: Rs. ${Number(item.price).toLocaleString("en-PK")}\n`;
            message += `Subtotal: Rs. ${Number(subtotal).toLocaleString("en-PK")}\n\n`;
        });

        message += "--------------------------\n";
        message += "💰 TOTAL: Rs. " + Number(total).toLocaleString("en-PK") + "\n\n";
        message += "💳 PAYMENT METHOD: " + paymentLabel + "\n";
        message += "✅ PAYMENT CONFIRMED: Yes\n\n";
        message += "👤 CUSTOMER DETAILS\n";
        message += "Name: \n";
        message += "Phone: \n";
        message += "Address: \n\n";
        message += "Please confirm my order. ❤️";

        const whatsappURL = "https://wa.me/" + branch.whatsapp + "?text=" + encodeURIComponent(message);

        console.log("Branch:", branch.name);
        console.log("WhatsApp:", branch.whatsapp);
        console.log("Payment:", paymentLabel);

        /* OPEN WHATSAPP */
        window.open(whatsappURL, "_blank");

        /* CLEAR CART AFTER ORDER */
        cart = [];
        saveCart();
        renderCart();
        closeCart();

        notification("✅ Order sent! Thank you!");
    }

    /* =====================================================
       ESCAPE KEY
    ===================================================== */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeCart();
        }
    });

    /* =====================================================
       FIRST RENDER
    ===================================================== */
    renderCart();
}


/* =========================================================
   LOAD CART
========================================================= */

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(function (item) {
            return item && item.id && item.name && !isNaN(Number(item.price)) && Number(item.quantity) > 0;
        });
    } catch (error) {
        console.error("Could not load cart:", error);
        return [];
    }
}


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(amount) {
    return "Rs. " + Number(amount || 0).toLocaleString("en-PK");
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value);
    return div.innerHTML;
}


/* =========================================================
   NOTIFICATION
========================================================= */

function notification(message) {
    const old = document.querySelector(".cart-notification");
    if (old) old.remove();

    const box = document.createElement("div");
    box.className = "cart-notification";
    box.textContent = "✓ " + message;
    document.body.appendChild(box);

    setTimeout(function () {
        box.classList.add("hide");
    }, 1800);

    setTimeout(function () {
        if (box) box.remove();
    }, 2200);
}


/* =========================================================
   NOTIFICATION CSS
========================================================= */

(function addNotificationCSS() {
    if (document.getElementById("spanishNotificationCSS")) return;
    const style = document.createElement("style");
    style.id = "spanishNotificationCSS";
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 95px;
            right: 20px;
            z-index: 999999;
            background: #151515;
            color: #ffffff;
            border: 1px solid rgba(255,59,32,.4);
            border-left: 4px solid #ff3b20;
            border-radius: 10px;
            padding: 13px 18px;
            font-size: 12px;
            font-weight: 700;
            box-shadow: 0 15px 40px rgba(0,0,0,.5);
            animation: spanishNotificationIn .3s ease;
            max-width: 90vw;
        }
        .cart-notification.hide {
            opacity: 0;
            transform: translateX(20px);
            transition: .3s ease;
        }
        @keyframes spanishNotificationIn {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
})();