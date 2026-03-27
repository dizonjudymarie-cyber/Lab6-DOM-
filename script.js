// ============================
// LAB 6: DOM SCRIPTING
// Author: Angel
// ============================

// ===== TASK 1: DATA STRUCTURE =====
class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

// Sample product array (10 products)
const products = [
    new Product(1, "Wireless Headphones", 59.99, "img1.jpg"),
    new Product(2, "Smart Watch", 129.99, "img2.jpg"),
    new Product(3, "Leather Handbag", 499.99, "3.jpg"),
    new Product(4, "High Heels", 399.99, "4.jpg"),
    new Product(5, "Kids Toy", 100.00, "6.jpg"),
    new Product(6, "Makeup Kit", 150.00, "7.jpg"),
    new Product(7, "Gaming Mouse", 59.99, "14.jpg"),
    new Product(8, "Smart Watch Series 5", 299.00, "15.jpg"),
    new Product(9, "Dress", 149.99, "shein1.jpg"),
    new Product(10, "Casual Sneakers", 199.99, "img10.jpg")
];

// Cart array
let cart = [];

// Mock user
const currentUser = {
    name: "Janice Reyes",
    orderHistory: [
        { id: 2026001, date: "2026-03-01", total: 500, items: ["High Heels", "Kids Toy"] },
        { id: 2026002, date: "2026-03-15", total: 149.99, items: ["Dress"] }
    ]
};

// ===== TASK 2: DYNAMIC PRODUCT RENDERING =====
function renderProducts() {
    const container = document.querySelector('.product-grid');
    if (!container) return;

    container.innerHTML = ""; // clear container

    products.forEach(product => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        const h3 = document.createElement('h3');
        h3.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = `Php ${product.price.toFixed(2)}`;

        const btn = document.createElement('button');
        btn.textContent = "Add to Cart";
        btn.dataset.id = product.id;

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(price);
        card.appendChild(btn);

        container.appendChild(card);
    });
}

// ===== TASK 3: EVENT HANDLING & CART =====
function setupCart() {
    document.body.addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.id) {
            const id = parseInt(event.target.dataset.id);
            const product = products.find(p => p.id === id);
            if (!product) return;

            const cartItem = cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            // Add animation
            const card = event.target.parentElement;
            card.classList.add('fade-in');
            setTimeout(() => card.classList.remove('fade-in'), 500);

            renderCart();
        }
    });
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const subtotalEl = document.getElementById('subtotal');
    if (!cartList || !subtotalEl) return;

    cartList.innerHTML = "";

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Php ${item.price.toFixed(2)} x ${item.quantity} = Php ${(item.price * item.quantity).toFixed(2)}`;

        const qtyInput = document.createElement('input');
        qtyInput.type = "number";
        qtyInput.min = 0;
        qtyInput.value = item.quantity;
        qtyInput.style.width = "50px";
        qtyInput.setAttribute('aria-label', `Quantity of ${item.name}`);

        qtyInput.addEventListener('change', e => {
            const newQty = parseInt(e.target.value);
            if (newQty <= 0) {
                cart = cart.filter(ci => ci.id !== item.id);
            } else {
                item.quantity = newQty;
            }
            renderCart();
        });

        li.appendChild(qtyInput);
        cartList.appendChild(li);
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotalEl.textContent = `Php ${subtotal.toFixed(2)}`;

    const emptyMessage = document.getElementById('empty-message');
    if (emptyMessage) emptyMessage.style.display = cart.length === 0 ? 'block' : 'none';
}

// ===== TASK 4: FORM VALIDATION (checkout.html) =====
function setupCheckoutForm() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        let valid = true;

        form.querySelectorAll('input[required]').forEach(input => {
            input.classList.remove('error');
            const errorEl = input.nextElementSibling;
            if (input.value.trim() === "") {
                input.classList.add('error');
                if (errorEl) errorEl.textContent = "This field is required";
                valid = false;
            } else if (errorEl) {
                errorEl.textContent = "";
            }
        });

        if (valid) {
            console.log("Checkout successful!");
            alert("Order placed successfully!");
            window.location.href = "thankyou.html";
        } else {
            alert("Please fill in all required fields.");
        }
    });
}

// ===== TASK 5: USER ACCOUNT & ORDER HISTORY =====
function renderAccount() {
    const header = document.querySelector('header h1');
    if (header) header.textContent = `Welcome, ${currentUser.name}`;

    const orderDetails = document.querySelectorAll('details');
    orderDetails.forEach((detail, index) => {
        const summary = detail.querySelector('summary');
        if (!summary) return;

        summary.addEventListener('click', () => {
            if (detail.querySelector('div')) return; // prevent duplicates
            detail.appendChild(summary); // keep summary

            const order = currentUser.orderHistory[index];
            if (order) {
                const div = document.createElement('div');
                div.innerHTML = `
                    <p>Date: ${order.date}</p>
                    <p>Total: Php ${order.total}</p>
                    <p>Items: ${order.items.join(', ')}</p>
                `;
                detail.appendChild(div);
            }
        });
    });
}

// ===== TASK 6: INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupCart();
    setupCheckoutForm();
    renderAccount();
});