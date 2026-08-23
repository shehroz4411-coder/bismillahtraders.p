"use strict";

/* =========================================================
   SPANISH CART SYSTEM
========================================================= */

const CART_KEY = "spanishCart";

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   ADD ITEM
========================================================= */

function addToCart(name, price) {

    price = Number(price);

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }

    saveCart();

    updateCartCount();

    showCartMessage(`${name} added to cart`);

}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeFromCart(name) {

    cart = cart.filter(
        item => item.name !== name
    );

    saveCart();

    updateCartCount();

    renderCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(name, amount) {

    const item = cart.find(
        item => item.name === name
    );

    if (!item) return;

    item.quantity += amount;


    if (item.quantity <= 0) {

        removeFromCart(name);

        return;

    }

    saveCart();

    updateCartCount();

    renderCart();

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const countElement =
        document.getElementById("cartCount");

    const headerCount =
        document.querySelector(".cart-button span");


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    if (countElement) {

        countElement.textContent =
            totalQuantity;

    }


    if (
        headerCount &&
        headerCount !== countElement
    ) {

        headerCount.textContent =
            totalQuantity;

    }

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

    return cart.reduce(

        (total, item) => {

            return total +
                item.price *
                item.quantity;

        },

        0

    );

}


/* =========================================================
   CART ITEMS
========================================================= */

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something delicious!
                </p>

            </div>

        `;

    }

    else {

        cartItems.innerHTML = cart.map(
            item => `

            <div class="cart-item">

                <div class="cart-item-details">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        Rs. ${item.price.toLocaleString()}
                    </p>

                </div>


                <div class="cart-controls">

                    <button
                        onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', -1)">

                        −

                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', 1)">

                        +

                    </button>

                </div>


                <strong class="cart-item-total">

                    Rs.
                    ${(
                        item.price *
                        item.quantity
                    ).toLocaleString()}

                </strong>


                <button
                    class="remove-cart-item"
                    onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">

                    ×

                </button>

            </div>

        `).join("");

    }


    if (cartTotal) {

        cartTotal.textContent =
            `Rs. ${getCartTotal().toLocaleString()}`;

    }

}


/* =========================================================
   ADD BUTTONS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".add-cart-btn"
            );


        if (!button) return;


        const name =
            button.dataset.name;

        const price =
            button.dataset.price;


        addToCart(
            name,
            price
        );

    }
);


/* =========================================================
   CART NOTIFICATION
========================================================= */

function showCartMessage(message) {

    let notification =
        document.getElementById(
            "cartNotification"
        );


    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "cartNotification";

        notification.className =
            "cart-notification";

        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        `✓ ${message}`;

    notification.classList.add(
        "show"
    );


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 1800);

}


/* =========================================================
   INITIALIZE
========================================================= */

updateCartCount();

renderCart();