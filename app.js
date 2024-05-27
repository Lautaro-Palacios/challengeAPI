// Variables globales para el carrito y el total
let cart = [];
let totalPrice = 0;

// Función principal para cargar el carrito y las categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    fetchCategories();
    updateCartCount();

    // Agregar evento para el botón de vaciar carrito
    const clearCartBtn = document.getElementById('clear-cart-btn');
    clearCartBtn.addEventListener('click', clearCart);
});

// Función para cargar el carrito desde el localStorage al cargar la página
function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        displayCart();
    }
}

// Función para cargar las categorías de productos
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Función para mostrar las categorías en el menú de navegación
function displayCategories(categories) {
    const categoriesList = document.getElementById('categories');
    categoriesList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.href = 'javascript:void(0);';
        a.textContent = category;
        a.className = 'nav-link';
        a.addEventListener('click', () => fetchProductsByCategory(category));
        li.appendChild(a);
        categoriesList.appendChild(li);
    });
}

// Función para obtener y mostrar los productos de una categoría
async function fetchProductsByCategory(category) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
    }
}

// Función para mostrar los productos en la página
function displayProducts(products) {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary" onclick="displayProductDetails(${product.id})">Ver Detalles</button>
                </div>
            </div>
        `;
        productsDiv.appendChild(productCard);
    });
}

// Función para mostrar los detalles de un producto
async function displayProductDetails(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const product = await response.json();
        const productDetailsDiv = document.getElementById('product-details');
        productDetailsDiv.style.display = 'block';
        productDetailsDiv.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h2 class="card-title">${product.title}</h2>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: $${product.price}</p>
                    <button class="btn btn-success" onclick="addToCart(${product.id}, '${product.title}', ${product.price},'${product.image}')">Agregar al Carrito</button>
                </div>
            </div>
        `;
        scrollToElement(productDetailsDiv); // Scroll hacia abajo para mostrar los detalles del producto
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Función para agregar un producto al carrito
function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    saveCartToLocalStorage();
    displayCart();
    updateCartCount();
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    saveCartToLocalStorage();
    displayCart();
    updateCartCount();
}

// Función para guardar el carrito en el localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para mostrar el contenido del carrito en la página
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItems.innerHTML = '';
    totalPrice = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${item.title} - $${item.price} x ${item.quantity}
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartItems.appendChild(li);
        totalPrice += item.price * item.quantity;
    });
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Función para eliminar un producto del carrito
function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity -= 1;
        if (cart[itemIndex].quantity === 0) {
            cart.splice(itemIndex, 1);
        }
        saveCartToLocalStorage();
        displayCart();
        updateCartCount();
    }
}

// Función para actualizar el contador del carrito en la barra de navegación
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Mostrar el número de elementos del carrito en la barra de navegación
    const navbarCartCount = document.getElementById('navbar-cart-count');
    if (navbarCartCount) { // Comprobar si el elemento existe en la barra de navegación
        navbarCartCount.textContent = totalItems;
    }
}

// Función para hacer scroll hasta un elemento
function scrollToElement(element) {
    window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
    });
}
