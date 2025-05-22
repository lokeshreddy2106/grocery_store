// API Base URL
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const categoryList = document.getElementById('categoryList');
const productGrid = document.getElementById('productGrid');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const cartModal = document.getElementById('cartModal');
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const ordersBtn = document.getElementById('ordersBtn');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupLink = document.getElementById('signupLink');
const loginLink = document.getElementById('loginLink');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const userNameDisplay = document.querySelector('.sign-in');

// Category Images hello
const categoryImages = {
    'Electronics': 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png',
    'Mobiles': 'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png',
    'Fashion': 'https://rukminim2.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png',
    'Home & Furniture': 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg',
    'Appliances': 'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png'
};

// Product Images
const productImages = {
    'Fastrack Smartwatch Pro': 'https://rukminim2.flixcart.com/image/200/200/kpsnzww0/smartwatch/v/q/n/bsw004-android-ios-fire-boltt-original-imag3xrnqtrahzqr.jpeg',
    'ViewSonic 27" Gaming Monitor': 'https://rukminim2.flixcart.com/image/200/200/xif0q/monitor/v/i/j/-original-imaghgphdj7bvbcm.jpeg',
    'Sony Alpha Mirrorless Camera': 'https://rukminim2.flixcart.com/image/200/200/kw9krrk0/dslr-camera/q/l/w/-original-imag8z5wwaqtq9bz.jpeg',
    'Mini LED Projector': 'https://rukminim2.flixcart.com/image/200/200/xif0q/projector/k/6/y/-original-imagrr7uhhkv4hgf.jpeg',
    'JBL Portable Speaker': 'https://rukminim2.flixcart.com/image/200/200/l0sgyvk0/speaker/mobile-tablet-speaker/0/p/r/-original-imagcg5gufty2zrp.jpeg',
    'Nothing Phone (3a)': 'https://rukminim2.flixcart.com/image/200/200/xif0q/mobile/h/a/k/-original-imagqx45wnzbh25s.jpeg',
    'Samsung 4K Smart TV': 'https://rukminim2.flixcart.com/image/200/200/xif0q/television/k/h/g/-original-imagtq4hqqt37tgx.jpeg',
    'Apple MacBook Air': 'https://rukminim2.flixcart.com/image/200/200/kuyf8nk0/computer/g/z/q/mk183hn-a-laptop-apple-original-imag7yzmv57cvg3d.jpeg'
};

// State Management
let currentUser = null;
let cart = [];
let categories = [];
let products = [
    {
        product_id: 1,
        name: 'Aashirvaad Atta',
        description: 'Superior MP Atta Whole Wheat Flour, 10kg',
        price: 449.00,
        image_url: 'https://m.media-amazon.com/images/I/61mzHAjEqZL._SX522_.jpg'
    },
    {
        product_id: 2,
        name: 'Toor Dal',
        description: 'Unpolished Toor Dal, Premium Quality, 1kg',
        price: 139.00,
        image_url: 'https://m.media-amazon.com/images/I/71mus9xJJOL._SX522_.jpg'
    },
    {
        product_id: 3,
        name: 'Fortune Oil',
        description: 'Refined Sunflower Oil, 5L',
        price: 699.00,
        image_url: 'https://m.media-amazon.com/images/I/51WwF8Cl8IL._SX522_.jpg'
    },
    {
        product_id: 4,
        name: 'Maggi Noodles',
        description: '2-Minute Masala Noodles, 12 Pack',
        price: 144.00,
        image_url: 'https://m.media-amazon.com/images/I/81clZbj6kKL._SX522_.jpg'
    },
    {
        product_id: 5,
        name: 'Red Label Tea',
        description: 'Natural Care Tea, Premium Quality, 1kg',
        price: 549.00,
        image_url: 'https://m.media-amazon.com/images/I/61ZhWr0ypCL._SX522_.jpg'
    },
    {
        product_id: 6,
        name: 'Surf Excel',
        description: 'Easy Wash Detergent Powder, 4kg',
        price: 639.00,
        image_url: 'https://m.media-amazon.com/images/I/61bPx7i5vEL._SX522_.jpg'
    },
    {
        product_id: 7,
        name: 'Saffola Oats',
        description: 'Masala & Herbs Instant Oats, 1kg',
        price: 199.00,
        image_url: 'https://m.media-amazon.com/images/I/71JtUMDkWyL._SX522_.jpg'
    },
    {
        product_id: 8,
        name: 'Dairy Milk Silk',
        description: 'Premium Chocolate Bar Pack of 3, 150g',
        price: 299.00,
        image_url: 'https://m.media-amazon.com/images/I/61mzgJvwjYL._SX522_.jpg'
    },
    {
        product_id: 9,
        name: 'Tata Salt',
        description: 'Iodized Salt, 1kg',
        price: 28.00,
        image_url: 'https://m.media-amazon.com/images/I/61ZiLkaX4YL._SX522_.jpg'
    },
    {
        product_id: 10,
        name: 'Good Day Cookies',
        description: 'Butter Cookies, Family Pack, 600g',
        price: 129.00,
        image_url: 'https://m.media-amazon.com/images/I/81l7thl5AQL._SX522_.jpg'
    },
    {
        product_id: 11,
        name: 'MTR Rava Idli Mix',
        description: 'Instant Breakfast Mix, 500g',
        price: 89.00,
        image_url: 'https://m.media-amazon.com/images/I/81Gl+V+wIxL._SX522_.jpg'
    },
    {
        product_id: 12,
        name: 'Kissan Mixed Fruit Jam',
        description: 'Mixed Fruit Jam, 700g',
        price: 159.00,
        image_url: 'https://m.media-amazon.com/images/I/61D+RVJY3jL._SX522_.jpg'
    },
    {
        product_id: 13,
        name: 'Colgate MaxFresh',
        description: 'Toothpaste with Cooling Crystals, 300g',
        price: 189.00,
        image_url: 'https://m.media-amazon.com/images/I/61u4owVE3IL._SX522_.jpg'
    },
    {
        product_id: 14,
        name: 'Dove Shampoo',
        description: 'Daily Shine Shampoo, 650ml',
        price: 399.00,
        image_url: 'https://m.media-amazon.com/images/I/51KvlJGgc8L._SX522_.jpg'
    },
    {
        product_id: 15,
        name: 'Lizol Disinfectant',
        description: 'Surface Cleaner Citrus, 2L',
        price: 319.00,
        image_url: 'https://m.media-amazon.com/images/I/61GnUc9e7OL._SX522_.jpg'
    }
];

// Add this variable to track current sort order
let currentSortOrder = 'default';

function handleSort(sortOrder) {
    currentSortOrder = sortOrder;
    renderProducts();
}

// Helper function to safely toggle modal display
function toggleModal(modal, display) {
    if (modal && modal.style) {
        modal.style.display = display;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modals
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
    if (cartModal) cartModal.style.display = 'none';
    
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    } else {
        // Ensure login button shows "sign in" if not logged in
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.textContent = 'sign in';
            loginBtn.addEventListener('click', () => {
                loginModal.style.display = 'block';
            });
        }
    }
    
    setupEventListeners();
    renderProducts();
    loadCart();
});

function setupEventListeners() {
    // Login button click
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && !currentUser) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    // Signup link click
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }

    // Login link click
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (signupModal) signupModal.style.display = 'none';
            if (cartModal) cartModal.style.display = 'none';
        });
    });

    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submit
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === signupModal) {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        }
    });
}

async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    try {
        // Disable form while processing
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing up...';
        
        const formData = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            password: form.querySelector('input[name="password"]').value
        };

        // Make API call to register endpoint
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        if (data.success) {
            // Show signup success message first
            showPopup('Sign up successful!', 'success');

            // Automatically log in after successful registration
            const loginResponse = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const loginData = await loginResponse.json();

            if (loginData.token) {
                // Store auth data
                localStorage.setItem('authToken', loginData.token);
                localStorage.setItem('currentUser', JSON.stringify(loginData.user));
                
                // Update state
                currentUser = loginData.user;
                
                // Update UI
                signupModal.style.display = 'none';
                updateUIForLoggedInUser();
                
                // Clear form
                form.reset();
            } else {
                throw new Error('Auto-login failed after registration');
            }
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showPopup(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    try {
        // Disable form while processing
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        
        const formData = {
            email: form.querySelector('input[name="email"]').value,
            password: form.querySelector('input[name="password"]').value
        };

        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
        }

        if (data.token) {
            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Update current user state
            currentUser = data.user;
            
            // Update UI
            loginModal.style.display = 'none';
            showPopup('Sign in successful!', 'success');
            
            // Update login button text and add profile functionality
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.textContent = currentUser.name || 'Profile';
                loginBtn.classList.add('user-profile');
                
                // Remove old event listeners and add profile dropdown handler
                const oldBtn = loginBtn.cloneNode(true);
                loginBtn.parentNode.replaceChild(oldBtn, loginBtn);
                oldBtn.addEventListener('click', toggleProfileDropdown);
            }
            
            // Clear form
            form.reset();
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showPopup(error.message, 'error');
    } finally {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && currentUser) {
        loginBtn.textContent = currentUser.name || 'Profile';
        loginBtn.classList.add('user-profile');
        
        // Remove old event listeners
        const oldBtn = loginBtn.cloneNode(true);
        loginBtn.parentNode.replaceChild(oldBtn, loginBtn);
        
        // Add new click handler for dropdown
        oldBtn.addEventListener('click', toggleProfileDropdown);
    }
}

function toggleProfileDropdown(e) {
    e.preventDefault();
    
    // Remove existing dropdown if any
    const existingDropdown = document.querySelector('.profile-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <span>Hello, ${currentUser.name}</span>
            <span>Have a nice day</span>
        </div>
        <div class="dropdown-items">
            <a href="#" class="dropdown-item" id="viewOrders">My Orders</a>
            <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
        </div>
    `;
    
    // Position dropdown
    const loginBtn = document.getElementById('loginBtn');
    const rect = loginBtn.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.right = '20px';
    
    // Add to document
    document.body.appendChild(dropdown);
    
    // Handle logout click
    dropdown.querySelector('#logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
        dropdown.remove();
    });
    
    // Handle orders click
    dropdown.querySelector('#viewOrders').addEventListener('click', (e) => {
        e.preventDefault();
        // You can implement the orders view functionality here
        showPopup('Orders feature coming soon!', 'info');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== loginBtn) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function handleLogout() {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Update state
    currentUser = null;
    
    // Update UI
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = 'sign in';
        loginBtn.classList.remove('user-profile');
        
        // Restore login click handler
        loginBtn.removeEventListener('click', toggleProfileDropdown);
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }
    
    showPopup('Logged out successfully', 'success');
}

// Update the showPopup function to be the single source for all notifications
function showPopup(message, type = 'success') {
    // Remove any existing popups
    const existingPopup = document.querySelector('.popup-message');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = `popup-message ${type}`;
    popup.textContent = message;
    
    // Add icon based on message type
    const icon = document.createElement('span');
    icon.className = 'popup-icon';
    icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    popup.insertBefore(icon, popup.firstChild);
    
    document.body.appendChild(popup);
    
    // Force a reflow to trigger the animation
    popup.offsetHeight;
    
    // Add show class to trigger animation
    popup.classList.add('show');
    
    // Remove popup after animation
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

// Remove any duplicate style elements and consolidate styles
if (document.getElementById('message-styles')) {
    document.getElementById('message-styles').remove();
}

// Add the consolidated styles
const popupStyles = document.createElement('style');
popupStyles.id = 'popup-styles';
popupStyles.textContent = `
    .popup-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 30px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-weight: 500;
        min-width: 300px;
        text-align: center;
        transform: translateX(120%);
        transition: transform 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .popup-message.show {
        transform: translateX(0);
    }

    .popup-icon {
        font-size: 18px;
        font-weight: bold;
    }

    .popup-message.success {
        background-color: #388e3c;
        color: white;
        border-left: 5px solid #2e7d32;
    }

    .popup-message.error {
        background-color: #d32f2f;
        color: white;
        border-left: 5px solid #b71c1c;
    }

    .popup-message.info {
        background-color: #1976d2;
        color: white;
        border-left: 5px solid #1565c0;
    }
`;
document.head.appendChild(popupStyles);

// API Functions
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function searchProducts(query) {
    try {
        const response = await fetch(`${API_URL}/products/search?query=${query}`);
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

// Render Functions
function renderCategories() {
    categoryList.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory(${category.category_id})">
            <img src="${categoryImages[category.name] || category.image_url}" alt="${category.name}">
            <h3>${category.name}</h3>
        </div>
    `).join('');
}

function renderProducts() {
    if (!productGrid) return;
    
    // Create a copy of products array to sort
    let sortedProducts = [...products];
    
    // Sort products based on current sort order
    switch (currentSortOrder) {
        case 'lowToHigh':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'highToLow':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // Keep original order
            break;
    }
    
    productGrid.innerHTML = sortedProducts.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">₹${product.price.toFixed(2)}</div>
            <button onclick="addToCart(${product.product_id})">Add to Cart</button>
        </div>
    `).join('');

    // Show sorting feedback
    if (currentSortOrder !== 'default') {
        const message = currentSortOrder === 'lowToHigh' 
            ? 'Products sorted by price: Low to High'
            : 'Products sorted by price: High to Low';
        showPopup(message, 'info');
    }
}

function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₹0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.product_id === item.product_id);
        total += product.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${product.image_url}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>₹${product.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${product.product_id})">Remove</button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.product_id === productId);
    const existingItem = cart.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product_id: productId, quantity: 1 });
    }
    saveCart();
    updateCart();
    // Show popup message
    showPopup(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

async function processCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    if (!currentUser) {
        alert('Please login to checkout');
        cartModal.style.display = 'none';
        loginModal.style.display = 'block';
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.product_id === item.product_id);
            return sum + (product.price * item.quantity);
        }, 0);

        const orderItems = cart.map(item => {
            const product = products.find(p => p.product_id === item.product_id);
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price
            };
        });

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                items: orderItems,
                total_amount: total,
                delivery_address: 'Default Address' // You can add an address input field later
            })
        });

        const data = await response.json();
        if (data.order_id) {
            alert('Order placed successfully!');
            cart = [];
            saveCart();
            updateCart();
            toggleModal(cartModal, 'none');
        } else if (data.error) {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error processing checkout:', error);
        alert('Error processing your order. Please try again.');
    }
}

// Filter Functions
function filterByCategory(categoryId) {
    const filteredProducts = products.filter(product => product.category_id === categoryId);
    productGrid.innerHTML = '';
    renderProducts(filteredProducts);
}

// UI Update
function updateUI() {
    if (currentUser) {
        loginBtn.textContent = currentUser.name || currentUser.email;
        ordersBtn.style.display = 'block';
    } else {
        loginBtn.textContent = 'Login';
        ordersBtn.style.display = 'none';
    }
}

// Helper Functions
function login(email, name = email.split('@')[0]) {
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedInUser();
}

// Add message styles
const style = document.createElement('style');
style.textContent = `
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 30px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .message.show {
        transform: translateX(0);
    }
    
    .message.success {
        background-color: #4CAF50;
    }
    
    .message.error {
        background-color: #f44336;
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }
    
    .modal-content {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .close {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 24px;
        cursor: pointer;
    }
    
    .modal h2 {
        margin-bottom: 20px;
        color: #4CAF50;
    }
    
    .modal form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .modal input {
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }
    
    .modal button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }
    
    .modal button:hover {
        background-color: #45a049;
    }
    
    .modal p {
        margin-top: 20px;
        text-align: center;
    }
    
    .modal a {
        color: #4CAF50;
        text-decoration: none;
    }
    
    .logged-in {
        background-color: #4CAF50 !important;
    }
`;
document.head.appendChild(style);

// Add the styles for dropdown
const dropdownStyles = document.createElement('style');
dropdownStyles.textContent = `
    .profile-dropdown {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        min-width: 200px;
        z-index: 1000;
    }

    .dropdown-header {
        padding: 15px;
        border-bottom: 1px solid #eee;
    }

    .dropdown-header span {
        display: block;
        color: #333;
    }

    .dropdown-header span:first-child {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .dropdown-items {
        padding: 10px 0;
    }

    .dropdown-item {
        display: block;
        padding: 10px 15px;
        color: #333;
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .dropdown-item:hover {
        background-color: #f5f5f5;
        cursor: pointer;
    }

    .user-profile {
        cursor: pointer;
    }
`;
document.head.appendChild(dropdownStyles); 