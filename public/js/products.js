// Products page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializeCart();
    initializeAuth();
    initializeProducts();
    setupAddToCartButtons();
    setupEventListeners();
    setupModalHandlers();
    updateCartCount();
    
    // Store original product order
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        originalProducts = Array.from(productsGrid.children);
        console.log('Original products stored:', originalProducts.length);
    }
    
    // Set up category filter handlers
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilter);
    });

    // Set up sort select handler
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        console.log('Sort select found, adding event listener');
        sortSelect.addEventListener('change', function(e) {
            console.log('Sort value changed to:', e.target.value);
            sortProductsNew(e.target.value);
        });
    } else {
        console.log('Sort select not found!');
    }
});

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const categoryButtons = document.querySelectorAll('.category-btn');
const sortSelect = document.getElementById('sort');
const loadingSpinner = document.querySelector('.loading-spinner');
const cartModal = document.getElementById('cartModal');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');

// State
let products = [];
let currentCategory = 'all';
let currentSort = 'name';
let cart = [];
let isLoggedIn = false;
let currentUser = null;
let originalProducts = [];

// Initialize cart from localStorage
function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartCount();
}

function initializeAuth() {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
        // Verify token with backend
        fetch('/api/users/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                isLoggedIn = true;
                currentUser = JSON.parse(savedUser);
                updateUIForLoggedInState();
            } else {
                // Token invalid, clear storage
                handleLogout();
            }
        })
        .catch(error => {
            console.error('Auth verification error:', error);
            handleLogout();
        });
    }
}

function setupModalHandlers() {
    // Login Modal Handler
    document.getElementById('loginBtn').addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    // Signup Link Handler
    document.getElementById('signupLink').addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
        
        // Store original button text
        const submitBtn = signupModal.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.setAttribute('data-original-text', submitBtn.textContent);
        }
    });

    // Login Link Handler
    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
        
        // Store original button text
        const submitBtn = loginModal.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.setAttribute('data-original-text', submitBtn.textContent);
        }
    });

    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            cartModal.style.display = 'none';
            
            // Reset forms when closing modals
            document.getElementById('loginForm').reset();
            document.getElementById('signupForm').reset();
        });
    });

    // Cart Modal Handler
    document.getElementById('cartBtn').addEventListener('click', () => {
        updateCartDisplay();
        cartModal.style.display = 'block';
    });

    // Handle form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    // Disable form while processing
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    // Show loading state
    showLoadingState(form);

    // Make API call to login endpoint
    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Update state
            isLoggedIn = true;
            currentUser = data.user;
            
            // Update UI
            loginModal.style.display = 'none';
            showPopup('Login successful!');
            updateUIForLoggedInState();
            
            // Clear form
            form.reset();
        } else {
            throw new Error(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showPopup(error.message || 'Invalid email or password', 'error');
    })
    .finally(() => {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        hideLoadingState(form);
    });
}

function handleLogout() {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Update state
    isLoggedIn = false;
    currentUser = null;
    
    // Update UI
    updateUIForLoggedOutState();
    showPopup('Logged out successfully');
}

function updateUIForLoggedInState() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = currentUser.name || 'Profile';
        
        // Replace click handler
        loginBtn.removeEventListener('click', showLoginModal);
        loginBtn.addEventListener('click', showProfileDropdown);
    }
}

function updateUIForLoggedOutState() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = 'sign in';
        
        // Replace click handler
        loginBtn.removeEventListener('click', showProfileDropdown);
        loginBtn.addEventListener('click', showLoginModal);
    }
}

function showProfileDropdown(e) {
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
            <span>${currentUser.email}</span>
        </div>
        <div class="dropdown-items">
            <a href="#" class="dropdown-item" id="viewProfile">View Profile</a>
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
    
    // Add event listeners
    document.body.appendChild(dropdown);
    
    // Handle logout
    dropdown.querySelector('#logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
        dropdown.remove();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== loginBtn) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function showLoginModal() {
    loginModal.style.display = 'block';
}

function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
        submitBtn.disabled = true;
    }
}

function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
        submitBtn.disabled = false;
    }
}

function setupAddToCartButtons() {
    document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            if (card) {
                addToCart(card);
            }
        });
    });
}

function setupEventListeners() {
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterByCategory(category);
            updateActiveCategory(button);
        });
    });

    // Sorting
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            sortProducts();
        });
    }

    // Quick view button clicks
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            if (card) {
                showQuickView(card);
            }
        });
    });
}

function initializeProducts() {
    // Show loading spinner
    loadingSpinner.classList.add('active');

    // Simulate loading delay
    setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card');
        products = Array.from(productCards);
        
        // Hide loading spinner
        loadingSpinner.classList.remove('active');
        
        // Show products with animation
        products.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.display = 'flex';
                
                // Trigger reflow
                card.offsetHeight;
                
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 1000);
}

function filterByCategory(category) {
    currentCategory = category;
    
    products.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        }
    });
}

function updateActiveCategory(clickedButton) {
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
}

function handleSort(value) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const products = Array.from(productsGrid.children);
    productsGrid.innerHTML = '';

    if (value === 'default') {
        // Restore original order
        originalProducts.forEach(product => {
            productsGrid.appendChild(product.cloneNode(true));
        });
    } else {
        // Sort products
        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            
            if (value === 'price-high') {
                return priceB - priceA;
            } else if (value === 'price-low') {
                return priceA - priceB;
            } else if (value === 'name') {
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            }
        });

        // Add sorted products back to grid
        products.forEach(product => {
            productsGrid.appendChild(product.cloneNode(true));
        });
    }

    // Reattach event listeners
    setupAddToCartButtons();

    // Show feedback message
    const messages = {
        'default': 'Products restored to default order',
        'price-high': 'Products sorted by price: High to Low',
        'price-low': 'Products sorted by price: Low to High',
        'name': 'Products sorted by name'
    };
    showPopup(messages[value] || 'Products sorted', 'info');
}

function addToCart(card) {
    const name = card.querySelector('h3').textContent;
    const price = parseFloat(card.querySelector('.price').textContent.replace('₹', ''));
    const productId = card.dataset.productId;

    // Find if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Animate the button
    const button = card.querySelector('.add-to-cart');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);

    updateCartCount();
    showPopup(`Added ${name} to cart - ₹${price}`);
}

function showQuickView(card) {
    // Implementation for quick view modal
    // This can be expanded based on requirements
    console.log('Quick view:', card.querySelector('h3').textContent);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₹0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>₹${item.price} × ${item.quantity}</span>
                <span>₹${itemTotal.toFixed(2)}</span>
                <button onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showPopup('Item removed from cart');
}

// Show popup message with type (success/error)
function showPopup(message, type = 'success') {
    // Remove any existing popup
    const existingPopup = document.querySelector('.popup-message');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = `popup-message ${type}`;
    
    // Create icon element
    const icon = document.createElement('span');
    icon.className = 'popup-icon';
    icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    // Create message element
    const messageText = document.createElement('span');
    messageText.textContent = message;
    
    // Add icon and message to popup
    popup.appendChild(icon);
    popup.appendChild(messageText);
    
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

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
    .add-to-cart {
        width: 100%;
        padding: 10px;
        border: none;
        background: #4CAF50;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 16px;
        transition: background-color 0.2s, transform 0.2s;
    }

    .add-to-cart:hover {
        background: #45a049;
    }

    .add-to-cart:active {
        transform: scale(0.98);
    }

    .cart-icon {
        font-size: 18px;
    }

    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .popup-message.error {
        background: #f44336;
    }
`;

// Add these styles to the existing style element
const additionalStyles = `
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
    }

    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

// Update the style element
const styleElement = document.createElement('style');
styleElement.textContent = `
    ${style.textContent}
    ${additionalStyles}
`;
document.head.appendChild(styleElement); 

// handleSignup is now handled in main.js

// Update initializeAuth to handle token verification
function initializeAuth() {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
        // Verify token with backend
        fetch('/api/users/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                isLoggedIn = true;
                currentUser = JSON.parse(savedUser);
                updateUIForLoggedInState();
            } else {
                // Token invalid, clear storage
                handleLogout();
            }
        })
        .catch(error => {
            console.error('Auth verification error:', error);
            handleLogout();
        });
    }
}

function handleCategoryFilter(event) {
    const selectedCategory = event.target.dataset.category;
    const products = document.querySelectorAll('.product-card');
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter products
    products.forEach(product => {
        if (selectedCategory === 'all' || product.dataset.category === selectedCategory) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}

function sortProductsNew(sortType) {
    console.log('Starting sort with type:', sortType);
    
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.log('Products grid not found!');
        return;
    }

    // Get all products
    let products = Array.from(productsGrid.children);
    console.log('Number of products to sort:', products.length);

    // Clear the grid
    productsGrid.innerHTML = '';
    
    if (sortType === 'default') {
        console.log('Restoring original order');
        originalProducts.forEach(product => {
            productsGrid.appendChild(product.cloneNode(true));
        });
    } else {
        console.log('Sorting products');
        products.sort((a, b) => {
            if (sortType === 'price-high' || sortType === 'price-low') {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('₹', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('₹', ''));
                console.log(`Comparing prices: ${priceA} vs ${priceB}`);
                return sortType === 'price-high' ? priceB - priceA : priceA - priceB;
            }
            return 0;
        });

        // Add sorted products back
        products.forEach(product => {
            productsGrid.appendChild(product.cloneNode(true));
        });
    }

    // Reattach event listeners
    document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            if (card) addToCart(card);
        });
    });

    // Show feedback
    const message = {
        'default': 'Products restored to default order',
        'price-high': 'Products sorted by price: High to Low',
        'price-low': 'Products sorted by price: Low to High'
    }[sortType] || 'Products sorted';
    
    showPopup(message, 'info');
    console.log('Sort complete:', message);
}

// ... rest of the existing code ... 
