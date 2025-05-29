// Global variables to store data and chart instances
let vacuumData = null;
let priceChart = null;
let ratingChart = null;
let discountChart = null;
let featureChart = null;

// Colors for chart visualization
const brandColors = {
    'Dreame': 'rgba(54, 162, 235, 0.7)',
    'Roomba': 'rgba(255, 99, 132, 0.7)',
    'Shark': 'rgba(75, 192, 192, 0.7)',
    'Ecovacs': 'rgba(255, 159, 64, 0.7)'
};

// DOM elements
const brandFilter = document.getElementById('brand-filter');
const priceRangeFilter = document.getElementById('price-range');
const featureFilter = document.getElementById('feature-filter');
const cardsContainer = document.getElementById('cards-container');

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the robot vacuum data from the JSON file
        const response = await fetch('robot_vacuum_data.json');
        vacuumData = await response.json();
        
        // Initialize filters
        initializeFilters();
        
        // Create initial charts and product cards
        createCharts();
        createProductCards();
        
        // Add event listeners for filters
        addFilterEventListeners();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load robot vacuum data. Please try again later.');
    }
});

/**
 * Initialize filter dropdowns with options from the data
 */
function initializeFilters() {
    // Populate brand filter
    const brands = vacuumData.brands.map(brand => brand.name);
    populateFilterOptions(brandFilter, brands);
    
    // Populate feature filter with unique features across all products
    const allFeatures = new Set();
    vacuumData.brands.forEach(brand => {
        brand.products.forEach(product => {
            product.features.forEach(feature => allFeatures.add(feature));
        });
    });
    populateFilterOptions(featureFilter, Array.from(allFeatures));
}

/**
 * Populate a select element with options
 * @param {HTMLSelectElement} selectElement - The select element to populate
 * @param {Array} options - Array of option values
 */
function populateFilterOptions(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

/**
 * Add event listeners to filter elements
 */
function addFilterEventListeners() {
    brandFilter.addEventListener('change', updateDashboard);
    priceRangeFilter.addEventListener('change', updateDashboard);
    featureFilter.addEventListener('change', updateDashboard);
}

/**
 * Update the dashboard based on current filter values
 */
function updateDashboard() {
    // Get current filter values
    const selectedBrand = brandFilter.value;
    const selectedPriceRange = priceRangeFilter.value;
    const selectedFeature = featureFilter.value;
    
    // Filter products based on selections
    const filteredProducts = getFilteredProducts(selectedBrand, selectedPriceRange, selectedFeature);
    
    // Update charts with filtered data
    updateCharts(filteredProducts);
    
    // Update product cards
    updateProductCards(filteredProducts);
}

/**
 * Filter products based on selected criteria
 * @param {string} brand - Selected brand filter value
 * @param {string} priceRange - Selected price range filter value
 * @param {string} feature - Selected feature filter value
 * @returns {Array} - Array of filtered products with brand information
 */
function getFilteredProducts(brand, priceRange, feature) {
    let filteredProducts = [];
    
    // Process each brand
    vacuumData.brands.forEach(brandData => {
        // Filter by brand if specified
        if (brand === 'all' || brand === brandData.name) {
            // Process each product in the brand
            brandData.products.forEach(product => {
                // Filter by price range if specified
                let priceMatch = true;
                if (priceRange !== 'all') {
                    const currentPrice = product.price.current;
                    if (priceRange === '0-500' && (currentPrice < 0 || currentPrice > 500)) {
                        priceMatch = false;
                    } else if (priceRange === '500-1000' && (currentPrice < 500 || currentPrice > 1000)) {
                        priceMatch = false;
                    } else if (priceRange === '1000+' && currentPrice < 1000) {
                        priceMatch = false;
                    }
                }
                
                // Filter by feature if specified
                let featureMatch = true;
                if (feature !== 'all' && !product.features.includes(feature)) {
                    featureMatch = false;
                }
                
                // Add product to filtered list if it matches all criteria
                if (priceMatch && featureMatch) {
                    filteredProducts.push({
                        ...product,
                        brand: brandData.name
                    });
                }
            });
        }
    });
    
    return filteredProducts;
}

/**
 * Create all charts for the dashboard
 */
function createCharts() {
    // Get all products with brand information
    const allProducts = getFilteredProducts('all', 'all', 'all');
    
    createPriceChart(allProducts);
    createRatingChart(allProducts);
    createDiscountChart(allProducts);
    createFeatureChart(allProducts);
}

/**
 * Update all charts with filtered data
 * @param {Array} filteredProducts - Array of filtered products
 */
function updateCharts(filteredProducts) {
    updatePriceChart(filteredProducts);
    updateRatingChart(filteredProducts);
    updateDiscountChart(filteredProducts);
    updateFeatureChart(filteredProducts);
}

/**
 * Create the price comparison chart
 * @param {Array} products - Array of products to display
 */
function createPriceChart(products) {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    // Prepare data for the chart
    const labels = products.map(product => product.name.length > 20 ? 
        product.name.substring(0, 20) + '...' : product.name);
    
    const originalPrices = products.map(product => product.price.original);
    const currentPrices = products.map(product => product.price.current);
    const backgroundColors = products.map(product => brandColors[product.brand]);
    
    // Create the chart
    priceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Original Price ($)',
                    data: originalPrices,
                    backgroundColor: backgroundColors.map(color => color.replace('0.7', '0.3')),
                    borderColor: backgroundColors,
                    borderWidth: 1
                },
                {
                    label: 'Current Price ($)',
                    data: currentPrices,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price ($)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            // Get the full product name for tooltip
                            const index = tooltipItems[0].dataIndex;
                            return products[index].name;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update the price chart with filtered data
 * @param {Array} filteredProducts - Array of filtered products
 */
function updatePriceChart(filteredProducts) {
    if (priceChart) {
        // Update chart labels and data
        priceChart.data.labels = filteredProducts.map(product => 
            product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name);
        
        priceChart.data.datasets[0].data = filteredProducts.map(product => product.price.original);
        priceChart.data.datasets[1].data = filteredProducts.map(product => product.price.current);
        
        priceChart.data.datasets[0].backgroundColor = filteredProducts.map(product => 
            brandColors[product.brand].replace('0.7', '0.3'));
        priceChart.data.datasets[0].borderColor = filteredProducts.map(product => 
            brandColors[product.brand]);
        
        priceChart.data.datasets[1].backgroundColor = filteredProducts.map(product => 
            brandColors[product.brand]);
        priceChart.data.datasets[1].borderColor = filteredProducts.map(product => 
            brandColors[product.brand].replace('0.7', '1'));
        
        priceChart.update();
    }
}

/**
 * Create the rating distribution chart
 * @param {Array} products - Array of products to display
 */
function createRatingChart(products) {
    const ctx = document.getElementById('rating-chart').getContext('2d');
    
    // Prepare data for the chart
    const labels = products.map(product => product.name.length > 20 ? 
        product.name.substring(0, 20) + '...' : product.name);
    
    const ratings = products.map(product => product.rating.average);
    const reviewCounts = products.map(product => product.rating.total_reviews);
    const backgroundColors = products.map(product => brandColors[product.brand]);
    
    // Create the chart
    ratingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Average Rating',
                    data: ratings,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Number of Reviews',
                    data: reviewCounts,
                    type: 'line',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Average Rating (0-5)'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Reviews'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            // Get the full product name for tooltip
                            const index = tooltipItems[0].dataIndex;
                            return products[index].name;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update the rating chart with filtered data
 * @param {Array} filteredProducts - Array of filtered products
 */
function updateRatingChart(filteredProducts) {
    if (ratingChart) {
        // Update chart labels and data
        ratingChart.data.labels = filteredProducts.map(product => 
            product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name);
        
        ratingChart.data.datasets[0].data = filteredProducts.map(product => product.rating.average);
        ratingChart.data.datasets[1].data = filteredProducts.map(product => product.rating.total_reviews);
        
        ratingChart.data.datasets[0].backgroundColor = filteredProducts.map(product => 
            brandColors[product.brand]);
        ratingChart.data.datasets[0].borderColor = filteredProducts.map(product => 
            brandColors[product.brand].replace('0.7', '1'));
        
        ratingChart.update();
    }
}

/**
 * Create the discount percentage chart
 * @param {Array} products - Array of products to display
 */
function createDiscountChart(products) {
    const ctx = document.getElementById('discount-chart').getContext('2d');
    
    // Prepare data for the chart
    const labels = products.map(product => product.name.length > 20 ? 
        product.name.substring(0, 20) + '...' : product.name);
    
    // Extract discount percentages (remove % sign and convert to number)
    const discounts = products.map(product => 
        parseFloat(product.price.discount.replace('%', '')));
    
    const backgroundColors = products.map(product => brandColors[product.brand]);
    
    // Create the chart
    discountChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Discount Percentage',
                    data: discounts,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Discount (%)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            // Get the full product name for tooltip
                            const index = tooltipItems[0].dataIndex;
                            return products[index].name;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update the discount chart with filtered data
 * @param {Array} filteredProducts - Array of filtered products
 */
function updateDiscountChart(filteredProducts) {
    if (discountChart) {
        // Update chart labels and data
        discountChart.data.labels = filteredProducts.map(product => 
            product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name);
        
        discountChart.data.datasets[0].data = filteredProducts.map(product => 
            parseFloat(product.price.discount.replace('%', '')));
        
        discountChart.data.datasets[0].backgroundColor = filteredProducts.map(product => 
            brandColors[product.brand]);
        discountChart.data.datasets[0].borderColor = filteredProducts.map(product => 
            brandColors[product.brand].replace('0.7', '1'));
        
        discountChart.update();
    }
}

/**
 * Create the feature analysis chart
 * @param {Array} products - Array of products to display
 */
function createFeatureChart(products) {
    const ctx = document.getElementById('feature-chart').getContext('2d');
    
    // Count feature occurrences across all products
    const featureCounts = {};
    products.forEach(product => {
        product.features.forEach(feature => {
            if (!featureCounts[feature]) {
                featureCounts[feature] = 0;
            }
            featureCounts[feature]++;
        });
    });
    
    // Sort features by count (descending)
    const sortedFeatures = Object.keys(featureCounts).sort((a, b) => 
        featureCounts[b] - featureCounts[a]);
    
    // Take top 10 features for better visualization
    const topFeatures = sortedFeatures.slice(0, 10);
    const topFeatureCounts = topFeatures.map(feature => featureCounts[feature]);
    
    // Create the chart
    featureChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: topFeatures,
            datasets: [
                {
                    data: topFeatureCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(199, 199, 199, 0.7)',
                        'rgba(83, 102, 255, 0.7)',
                        'rgba(40, 159, 64, 0.7)',
                        'rgba(210, 199, 199, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(199, 199, 199, 1)',
                        'rgba(83, 102, 255, 1)',
                        'rgba(40, 159, 64, 1)',
                        'rgba(210, 199, 199, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update the feature chart with filtered data
 * @param {Array} filteredProducts - Array of filtered products
 */
function updateFeatureChart(filteredProducts) {
    if (featureChart) {
        // Count feature occurrences across filtered products
        const featureCounts = {};
        filteredProducts.forEach(product => {
            product.features.forEach(feature => {
                if (!featureCounts[feature]) {
                    featureCounts[feature] = 0;
                }
                featureCounts[feature]++;
            });
        });
        
        // Sort features by count (descending)
        const sortedFeatures = Object.keys(featureCounts).sort((a, b) => 
            featureCounts[b] - featureCounts[a]);
        
        // Take top 10 features for better visualization
        const topFeatures = sortedFeatures.slice(0, 10);
        const topFeatureCounts = topFeatures.map(feature => featureCounts[feature]);
        
        // Update chart data
        featureChart.data.labels = topFeatures;
        featureChart.data.datasets[0].data = topFeatureCounts;
        
        featureChart.update();
    }
}

/**
 * Create product comparison cards
 */
function createProductCards() {
    // Get all products with brand information
    const allProducts = getFilteredProducts('all', 'all', 'all');
    updateProductCards(allProducts);
}

/**
 * Update product cards based on filtered data
 * @param {Array} filteredProducts - Array of filtered products
 */
function updateProductCards(filteredProducts) {
    // Clear existing cards
    cardsContainer.innerHTML = '';
    
    // Create a card for each filtered product
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.borderTop = `4px solid ${brandColors[product.brand]}`;
        
        // Create star rating display
        const stars = '★'.repeat(Math.floor(product.rating.average)) + 
                     '☆'.repeat(5 - Math.floor(product.rating.average));
        
        // Format card content with product details
        card.innerHTML = `
            <h3>${product.name}</h3>
            <div class="brand">${product.brand}</div>
            <div class="price">
                $${product.price.current.toFixed(2)}
                <span class="original-price">$${product.price.original.toFixed(2)}</span>
                <span class="discount">${product.price.discount} OFF</span>
            </div>
            <div class="rating">
                <span class="stars">${stars}</span>
                <span>${product.rating.average} (${product.rating.total_reviews} reviews)</span>
            </div>
            <div class="features">
                ${product.features.map(feature => 
                    `<span class="feature-tag">${feature}</span>`
                ).join('')}
            </div>
            <div class="reviews">
                <h4>Top Review</h4>
                <div class="review">
                    <div class="review-title">${product.latest_reviews[0].title}</div>
                    <div class="review-author">by ${product.latest_reviews[0].author} - ${product.latest_reviews[0].date}</div>
                    <div class="review-rating">Rating: ${'★'.repeat(product.latest_reviews[0].rating)}</div>
                </div>
            </div>
        `;
        
        cardsContainer.appendChild(card);
    });
    
    // Show message if no products match the filters
    if (filteredProducts.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.textContent = 'No products match your selected filters. Please try different criteria.';
        cardsContainer.appendChild(message);
    }
}