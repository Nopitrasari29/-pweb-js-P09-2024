const apiURL = 'https://dummyjson.com/products';
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let itemsPerPage = 5;
let currentCategory = 'all';

// Fetch Products from API
async function fetchProducts() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        products = data.products;
        displayCategories();
        displayProducts();
    } catch (error) {
        alert('Error fetching product data');
        console.error(error);
    }
}

// Display Product Categories
function displayCategories() {
    const categorySelect = document.getElementById('category');
    const categories = ['all', ...new Set(products.map(product => product.category))];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Display Products with Pagination
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    let filteredProducts = products.filter(product => currentCategory === 'all' || product.category === currentCategory);
    filteredProducts = filteredProducts.slice(0, itemsPerPage);

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Update Cart Display
function updateCart() {
    const cartTable = document.querySelector('#cartTable tbody');
    cartTable.innerHTML = '';
    
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'cart-item';
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${item.price * item.quantity}</td>
            <td>
                <button onclick="removeFromCart(${item.id})">Remove</button>
                <button onclick="increaseQuantity(${item.id})">+</button>
                <button onclick="decreaseQuantity(${item.id})">-</button>
            </td>
        `;
        cartTable.appendChild(row);

        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

// Remove Product from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Increase Quantity of a Product in Cart
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Decrease Quantity of a Product in Cart
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    } else {
        removeFromCart(productId);
    }
}

// Event Listeners for Filters
document.getElementById('category').addEventListener('change', (event) => {
    currentCategory = event.target.value;
    displayProducts();
});

document.getElementById('itemsPerPage').addEventListener('change', (event) => {
    itemsPerPage = parseInt(event.target.value);
    displayProducts();
});

// Initial Load
fetchProducts();
updateCart();
