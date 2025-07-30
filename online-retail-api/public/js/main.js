document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('products-container');
    const loadingElement = document.getElementById('loading');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    
    let products = [];
    let categories = [];
    
    // Fetch products from API
    async function fetchProducts() {
    try {
        loadingElement.classList.remove('hidden');
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate the response data
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received from server');
        }
        
        products = data;
        displayProducts(products);
        populateCategoryFilter(products);
    } catch (error) {
        console.error('Error:', error);
        productsContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load products</p>
                <p>${error.message}</p>
            </div>
        `;
    } finally {
        loadingElement.classList.add('hidden');
    }
    }
    
    // Display products in the grid
    function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = productsToDisplay
        .map(product => {
            // Ensure unit_price is treated as a number
            const price = Number(product.unit_price);
            return `
                <div class="product-card">
                    <h3>${product.description || 'No description'}</h3>
                    <p>Category: ${product.category_name || 'Uncategorized'}</p>
                    <p class="product-price">$${isNaN(price) ? 'N/A' : price.toFixed(2)}</p>
                    <p>Stock: ${product.stock_quantity || 0}</p>
                    <p>SKU: ${product.stock_code || 'N/A'}</p>
                </div>
            `;
        })
        .join('');
    }
    
    // Populate category filter dropdown
    function populateCategoryFilter(products) {
        // Get unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category_name))];
        
        // Add options to select
        uniqueCategories.forEach(category => {
            if (category) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            }
        });
    }
    
    // Filter products based on search and category
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        
        const filtered = products.filter(product => {
            const matchesSearch = product.description.toLowerCase().includes(searchTerm) || 
                                 product.stock_code.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        displayProducts(filtered);
    }
    
    // Event listeners for filtering
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    
    // Initial load
    await fetchProducts();
});