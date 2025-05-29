// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the JSON data from the local file
    fetch('amazon_products.json')
        .then(response => response.json())
        .then(data => {
            // Initialize the dashboard with the data
            initializeDashboard(data);
        })
        .catch(error => {
            console.error('Error loading the data:', error);
            document.querySelector('.container-fluid').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error loading data. Please check the console for details.
                </div>
            `;
        });
});

/**
 * Initialize the dashboard with the provided data
 * @param {Object} data - The JSON data containing product information
 */
function initializeDashboard(data) {
    // Extract all products into a flat array for easier processing
    const allProducts = [];
    const brands = Object.keys(data);
    
    // Process each brand and its products
    brands.forEach(brand => {
        data[brand].forEach(product => {
            // Add brand information to each product
            product.brand = brand;
            
            // Extract numeric price value (remove currency symbol and convert to number)
            product.numericPrice = parseFloat(product.price.replace('€', '').trim());
            
            // Extract numeric rating value
            product.numericRating = parseFloat(product.rating.split(' ')[0]);
            
            // Extract review count
            const reviewMatch = product.rating.match(/\((\d+) reviews\)/);
            product.reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 0;
            
            allProducts.push(product);
        });
    });
    
    // Populate brand filter dropdown
    populateBrandFilter(brands);
    
    // Initialize charts
    createPriceChart(allProducts);
    createRatingChart(allProducts);
    createBrandSummaryChart(data);
    
    // Create product cards
    createProductCards(allProducts);
    
    // Set up event listeners for filters
    setupFilterListeners(allProducts, data);
}

/**
 * Populate the brand filter dropdown with available brands
 * @param {Array} brands - Array of brand names
 */
function populateBrandFilter(brands) {
    const brandFilter = document.getElementById('brandFilter');
    
    // Add each brand as an option
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

/**
 * Create the price comparison chart
 * @param {Array} products - Array of product objects
 */
function createPriceChart(products) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Group products by brand for the chart
    const brandGroups = {};
    products.forEach(product => {
        if (!brandGroups[product.brand]) {
            brandGroups[product.brand] = [];
        }
        brandGroups[product.brand].push(product);
    });
    
    // Prepare data for the chart
    const labels = [];
    const datasets = [];
    const brandColors = {
        'Dreame': 'rgba(52, 152, 219, 0.7)',
        'Roborock': 'rgba(231, 76, 60, 0.7)',
        'iRobot Roomba': 'rgba(46, 204, 113, 0.7)'
    };
    
    // Create a dataset for each brand
    Object.keys(brandGroups).forEach(brand => {
        const productNames = brandGroups[brand].map(p => p.name);
        const productPrices = brandGroups[brand].map(p => p.numericPrice);
        
        // Add all product names to labels if not already included
        productNames.forEach(name => {
            if (!labels.includes(name)) {
                labels.push(name);
            }
        });
        
        // Create dataset for this brand
        datasets.push({
            label: brand,
            data: productPrices,
            backgroundColor: brandColors[brand] || 'rgba(0, 0, 0, 0.5)',
            borderColor: brandColors[brand] || 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1
        });
    });
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price (€)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: € ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the rating comparison chart
 * @param {Array} products - Array of product objects
 */
function createRatingChart(products) {
    const ctx = document.getElementById('ratingChart').getContext('2d');
    
    // Group products by brand for the chart
    const brandGroups = {};
    products.forEach(product => {
        if (!brandGroups[product.brand]) {
            brandGroups[product.brand] = [];
        }
        brandGroups[product.brand].push(product);
    });
    
    // Prepare data for the chart
    const labels = [];
    const datasets = [];
    const brandColors = {
        'Dreame': 'rgba(52, 152, 219, 0.7)',
        'Roborock': 'rgba(231, 76, 60, 0.7)',
        'iRobot Roomba': 'rgba(46, 204, 113, 0.7)'
    };
    
    // Create a dataset for each brand
    Object.keys(brandGroups).forEach(brand => {
        const productNames = brandGroups[brand].map(p => p.name);
        const productRatings = brandGroups[brand].map(p => p.numericRating);
        
        // Add all product names to labels if not already included
        productNames.forEach(name => {
            if (!labels.includes(name)) {
                labels.push(name);
            }
        });
        
        // Create dataset for this brand
        datasets.push({
            label: brand,
            data: productRatings,
            backgroundColor: brandColors[brand] || 'rgba(0, 0, 0, 0.5)',
            borderColor: brandColors[brand] || 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1
        });
    });
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
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
                        text: 'Rating (out of 5)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}/5 (${products.find(p => p.name === context.label).reviewCount} reviews)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the brand summary chart
 * @param {Object} data - The original JSON data organized by brand
 */
function createBrandSummaryChart(data) {
    const ctx = document.getElementById('brandSummaryChart').getContext('2d');
    
    // Calculate brand averages
    const brandStats = {};
    const brands = Object.keys(data);
    
    brands.forEach(brand => {
        const products = data[brand];
        let totalPrice = 0;
        let totalRating = 0;
        let totalReviews = 0;
        
        products.forEach(product => {
            // Extract numeric price
            const price = parseFloat(product.price.replace('€', '').trim());
            totalPrice += price;
            
            // Extract numeric rating
            const rating = parseFloat(product.rating.split(' ')[0]);
            totalRating += rating;
            
            // Extract review count
            const reviewMatch = product.rating.match(/\((\d+) reviews\)/);
            const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 0;
            totalReviews += reviewCount;
        });
        
        brandStats[brand] = {
            avgPrice: totalPrice / products.length,
            avgRating: totalRating / products.length,
            totalReviews: totalReviews,
            productCount: products.length
        };
    });
    
    // Prepare data for the chart
    const brandLabels = brands;
    const avgPrices = brands.map(brand => brandStats[brand].avgPrice);
    const avgRatings = brands.map(brand => brandStats[brand].avgRating);
    const totalReviews = brands.map(brand => brandStats[brand].totalReviews);
    
    // Create the chart
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Average Price (€)', 'Average Rating', 'Total Reviews', 'Product Count'],
            datasets: brands.map(brand => ({
                label: brand,
                data: [
                    brandStats[brand].avgPrice / 200, // Scaled down for better visualization
                    brandStats[brand].avgRating,
                    brandStats[brand].totalReviews / 200, // Scaled down for better visualization
                    brandStats[brand].productCount
                ],
                backgroundColor: brand === 'Dreame' ? 'rgba(52, 152, 219, 0.2)' : 
                                brand === 'Roborock' ? 'rgba(231, 76, 60, 0.2)' : 
                                'rgba(46, 204, 113, 0.2)',
                borderColor: brand === 'Dreame' ? 'rgba(52, 152, 219, 1)' : 
                            brand === 'Roborock' ? 'rgba(231, 76, 60, 1)' : 
                            'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                pointBackgroundColor: brand === 'Dreame' ? 'rgba(52, 152, 219, 1)' : 
                                    brand === 'Roborock' ? 'rgba(231, 76, 60, 1)' : 
                                    'rgba(46, 204, 113, 1)',
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const brand = context.dataset.label;
                            const index = context.dataIndex;
                            
                            if (index === 0) {
                                return `${brand}: € ${brandStats[brand].avgPrice.toFixed(2)}`;
                            } else if (index === 1) {
                                return `${brand}: ${brandStats[brand].avgRating.toFixed(1)}/5`;
                            } else if (index === 2) {
                                return `${brand}: ${brandStats[brand].totalReviews} reviews`;
                            } else {
                                return `${brand}: ${brandStats[brand].productCount} products`;
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create product cards for display
 * @param {Array} products - Array of product objects
 */
function createProductCards(products) {
    const productCardsContainer = document.getElementById('productCards');
    productCardsContainer.innerHTML = ''; // Clear existing cards
    
    // Create a card for each product
    products.forEach(product => {
        // Generate stars based on rating
        const rating = parseFloat(product.rating.split(' ')[0]);
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        // Calculate average review sentiment
        let positiveReviews = 0;
        product.reviews.forEach(review => {
            if (parseInt(review.rating) >= 4) {
                positiveReviews++;
            }
        });
        const positivePercentage = (positiveReviews / product.reviews.length) * 100;
        
        // Create card element using DOM methods instead of innerHTML
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-4 mb-4';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card product-card h-100';
        cardDiv.setAttribute('data-product-id', product.name.replace(/\s+/g, '-').toLowerCase());
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // Create title
        const title = document.createElement('h5');
        title.className = 'product-title';
        title.textContent = product.name;
        
        // Create badge and link container
        const badgeLinkDiv = document.createElement('div');
        badgeLinkDiv.className = 'd-flex justify-content-between align-items-center mb-2';
        
        // Create brand badge
        const badge = document.createElement('span');
        badge.className = `badge bg-${product.brand === 'Dreame' ? 'primary' : product.brand === 'Roborock' ? 'danger' : 'success'} mb-2`;
        badge.textContent = product.brand;
        
        // Create Amazon link
        const amazonLink = document.createElement('a');
        amazonLink.href = product.url;
        amazonLink.target = '_blank';
        amazonLink.className = 'btn btn-sm btn-outline-secondary';
        amazonLink.textContent = 'View on Amazon';
        
        // Add badge and link to their container
        badgeLinkDiv.appendChild(badge);
        badgeLinkDiv.appendChild(amazonLink);
        
        // Create price
        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = product.price;
        
        // Create rating container
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'product-rating';
        
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.innerHTML = starsHTML; // Safe to use innerHTML for just the stars
        
        // Create rating text
        const ratingText = document.createElement('small');
        ratingText.textContent = product.rating;
        
        // Add stars and text to rating container
        ratingDiv.appendChild(starsContainer);
        ratingDiv.appendChild(ratingText);
        
        // Create divider
        const divider = document.createElement('hr');
        
        // Create review summary section
        const reviewSummary = document.createElement('div');
        reviewSummary.className = 'review-summary';
        
        // Create review summary title
        const summaryTitle = document.createElement('p');
        const strongText = document.createElement('strong');
        strongText.textContent = 'Review Summary:';
        summaryTitle.appendChild(strongText);
        
        // Create positive percentage text
        const percentageText = document.createElement('p');
        percentageText.textContent = `${positivePercentage.toFixed(0)}% positive reviews based on ${product.reviews.length} samples`;
        
        // Create recent review date
        const recentReview = document.createElement('p');
        const smallText = document.createElement('small');
        smallText.textContent = `Most recent review: ${product.reviews[0].date}`;
        recentReview.appendChild(smallText);
        
        // Add all review summary elements
        reviewSummary.appendChild(summaryTitle);
        reviewSummary.appendChild(percentageText);
        reviewSummary.appendChild(recentReview);
        
        // Create details button
        const detailsButton = document.createElement('button');
        detailsButton.className = 'btn btn-primary mt-2 view-details-btn';
        detailsButton.textContent = 'View Details';
        detailsButton.setAttribute('data-product', JSON.stringify(product));
        
        // Add click event listener directly to the button
        detailsButton.addEventListener('click', function() {
            const productData = JSON.parse(this.getAttribute('data-product'));
            showProductDetails(productData);
        });
        
        // Assemble the card
        cardBody.appendChild(title);
        cardBody.appendChild(badgeLinkDiv);
        cardBody.appendChild(price);
        cardBody.appendChild(ratingDiv);
        cardBody.appendChild(divider);
        cardBody.appendChild(reviewSummary);
        cardBody.appendChild(detailsButton);
        
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        
        // Add the complete card to the container
        productCardsContainer.appendChild(colDiv);
    });
    
    // Add Font Awesome for stars if not already included
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
    }
}

/**
 * Show detailed information for a product in a modal
 * @param {Object} product - The product object to display details for
 */
function showProductDetails(product) {
    // Check if a modal already exists and remove it
    const existingModal = document.getElementById('productDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal fade';
    modalContainer.id = 'productDetailModal';
    modalContainer.tabIndex = '-1';
    modalContainer.setAttribute('aria-labelledby', 'productDetailModalLabel');
    modalContainer.setAttribute('aria-hidden', 'true');
    
    // Create modal dialog
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-lg';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'productDetailModalLabel';
    modalTitle.textContent = product.name;
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Product info section
    const productInfo = document.createElement('div');
    productInfo.className = 'row mb-4';
    
    // Left column - basic info
    const leftCol = document.createElement('div');
    leftCol.className = 'col-md-6';
    
    const brandBadge = document.createElement('div');
    brandBadge.className = 'mb-3';
    brandBadge.innerHTML = `<span class="badge bg-${product.brand === 'Dreame' ? 'primary' : product.brand === 'Roborock' ? 'danger' : 'success'} mb-2">${product.brand}</span>`;
    
    const priceInfo = document.createElement('p');
    priceInfo.className = 'fs-4';
    priceInfo.innerHTML = `<strong>Price:</strong> ${product.price}`;
    
    const ratingInfo = document.createElement('p');
    ratingInfo.innerHTML = `<strong>Rating:</strong> ${product.rating}`;
    
    const amazonLink = document.createElement('a');
    amazonLink.href = product.url;
    amazonLink.target = '_blank';
    amazonLink.className = 'btn btn-primary';
    amazonLink.textContent = 'View on Amazon';
    
    leftCol.appendChild(brandBadge);
    leftCol.appendChild(priceInfo);
    leftCol.appendChild(ratingInfo);
    leftCol.appendChild(amazonLink);
    
    // Right column - review summary
    const rightCol = document.createElement('div');
    rightCol.className = 'col-md-6';
    
    // Calculate review stats
    let positiveReviews = 0;
    let negativeReviews = 0;
    
    product.reviews.forEach(review => {
        if (parseInt(review.rating) >= 4) {
            positiveReviews++;
        } else {
            negativeReviews++;
        }
    });
    
    const positivePercentage = (positiveReviews / product.reviews.length) * 100;
    
    const reviewTitle = document.createElement('h5');
    reviewTitle.textContent = 'Review Summary';
    
    const reviewStats = document.createElement('div');
    reviewStats.className = 'mb-3';
    reviewStats.innerHTML = `
        <div class="progress mb-2">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${positivePercentage}%" 
                aria-valuenow="${positivePercentage}" aria-valuemin="0" aria-valuemax="100">
                ${positivePercentage.toFixed(0)}% Positive
            </div>
        </div>
        <p><small>${positiveReviews} positive and ${negativeReviews} negative reviews</small></p>
    `;
    
    rightCol.appendChild(reviewTitle);
    rightCol.appendChild(reviewStats);
    
    productInfo.appendChild(leftCol);
    productInfo.appendChild(rightCol);
    
    // Reviews section
    const reviewsSection = document.createElement('div');
    reviewsSection.className = 'mt-4';
    
    const reviewsTitle = document.createElement('h5');
    reviewsTitle.textContent = 'Recent Reviews';
    reviewsSection.appendChild(reviewsTitle);
    
    // Create reviews list
    const reviewsList = document.createElement('div');
    reviewsList.className = 'list-group';
    
    // Add up to 5 most recent reviews
    const recentReviews = product.reviews.slice(0, 5);
    recentReviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'list-group-item';
        
        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'd-flex justify-content-between align-items-center';
        
        const reviewRating = document.createElement('span');
        reviewRating.className = `badge bg-${parseInt(review.rating) >= 4 ? 'success' : 'danger'}`;
        reviewRating.textContent = `${review.rating}/5`;
        
        const reviewDate = document.createElement('small');
        reviewDate.className = 'text-muted';
        reviewDate.textContent = review.date;
        
        reviewHeader.appendChild(reviewRating);
        reviewHeader.appendChild(reviewDate);
        
        const reviewText = document.createElement('p');
        reviewText.className = 'mb-1 mt-2';
        reviewText.textContent = review.text;
        
        reviewItem.appendChild(reviewHeader);
        reviewItem.appendChild(reviewText);
        
        reviewsList.appendChild(reviewItem);
    });
    
    reviewsSection.appendChild(reviewsList);
    
    // Add all sections to modal body
    modalBody.appendChild(productInfo);
    modalBody.appendChild(document.createElement('hr'));
    modalBody.appendChild(reviewsSection);
    
    // Create modal footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const closeModalButton = document.createElement('button');
    closeModalButton.type = 'button';
    closeModalButton.className = 'btn btn-secondary';
    closeModalButton.setAttribute('data-bs-dismiss', 'modal');
    closeModalButton.textContent = 'Close';
    
    modalFooter.appendChild(closeModalButton);
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    
    modalDialog.appendChild(modalContent);
    modalContainer.appendChild(modalDialog);
    
    // Add modal to document
    document.body.appendChild(modalContainer);
    
    // Initialize and show the modal
    const modal = new bootstrap.Modal(modalContainer);
    modal.show();
}

/**
 * Set up event listeners for filters
 * @param {Array} allProducts - Array of all product objects
 * @param {Object} originalData - The original JSON data organized by brand
 */
function setupFilterListeners(allProducts, originalData) {
    const brandFilter = document.getElementById('brandFilter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    // Update price display when slider changes
    priceRange.addEventListener('input', function() {
        priceValue.textContent = `€ ${this.value}`;
        applyFilters();
    });
    
    // Apply filters when brand selection changes
    brandFilter.addEventListener('change', applyFilters);
    
    // Add sort functionality
    const sortSelect = document.createElement('select');
    sortSelect.className = 'form-select mt-3';
    sortSelect.id = 'sortSelect';
    
    // Add sort options
    const sortOptions = [
        { value: 'price-asc', text: 'Price: Low to High' },
        { value: 'price-desc', text: 'Price: High to Low' },
        { value: 'rating-desc', text: 'Rating: High to Low' },
        { value: 'reviews-desc', text: 'Most Reviews' }
    ];
    
    // Create default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sort by...';
    sortSelect.appendChild(defaultOption);
    
    // Add all sort options
    sortOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        sortSelect.appendChild(optionElement);
    });
    
    // Add sort select to filter card
    const filterCard = document.querySelector('.filter-card .card-body');
    const sortContainer = document.createElement('div');
    sortContainer.className = 'mt-3';
    const sortLabel = document.createElement('label');
    sortLabel.className = 'form-label';
    sortLabel.htmlFor = 'sortSelect';
    sortLabel.textContent = 'Sort Products';
    
    sortContainer.appendChild(sortLabel);
    sortContainer.appendChild(sortSelect);
    filterCard.appendChild(sortContainer);
    
    // Add event listener for sort
    sortSelect.addEventListener('change', applyFilters);
    
    /**
     * Apply all active filters and update the display
     */
    function applyFilters() {
        try {
            const selectedBrand = brandFilter.value;
            const maxPrice = parseInt(priceRange.value);
            const sortValue = sortSelect.value;
            
            // Filter products based on selections
            let filteredProducts = allProducts.filter(product => {
                // Apply brand filter if not set to 'all'
                const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
                
                // Apply price filter
                const priceMatch = product.numericPrice <= maxPrice;
                
                return brandMatch && priceMatch;
            });
            
            // Apply sorting if selected
            if (sortValue) {
                filteredProducts = sortProducts(filteredProducts, sortValue);
            }
            
            // Update product count display
            const productCountElement = document.getElementById('productCount');
            if (!productCountElement) {
                const countElement = document.createElement('div');
                countElement.id = 'productCount';
                countElement.className = 'alert alert-info mt-3';
                document.querySelector('.filter-card .card-body').appendChild(countElement);
            }
            
            document.getElementById('productCount').textContent = `Showing ${filteredProducts.length} products`;
            
            // Update product cards with filtered products
            createProductCards(filteredProducts);
            
            // If we're showing all brands, update the charts with filtered data
            if (selectedBrand === 'all') {
                updateCharts(filteredProducts, maxPrice);
            } else {
                // If we're showing a specific brand, filter the data for that brand only
                const brandProducts = allProducts.filter(product => {
                    return product.brand === selectedBrand && product.numericPrice <= maxPrice;
                });
                
                updateCharts(brandProducts, maxPrice);
            }
        } catch (error) {
            console.error('Error applying filters:', error);
            showErrorMessage('There was an error applying filters. Please try again.');
        }
    }
    
    /**
     * Sort products based on the selected sort option
     * @param {Array} products - Array of products to sort
     * @param {String} sortOption - The sort option to apply
     * @returns {Array} - Sorted array of products
     */
    function sortProducts(products, sortOption) {
        const sortedProducts = [...products]; // Create a copy to avoid modifying the original
        
        switch (sortOption) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.numericPrice - b.numericPrice);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.numericPrice - a.numericPrice);
                break;
            case 'rating-desc':
                sortedProducts.sort((a, b) => b.numericRating - a.numericRating);
                break;
            case 'reviews-desc':
                sortedProducts.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            default:
                // No sorting
                break;
        }
        
        return sortedProducts;
    }
    
    /**
     * Update all charts with filtered data
     * @param {Array} filteredProducts - Array of filtered products
     * @param {Number} maxPrice - Maximum price filter value
     */
    function updateCharts(filteredProducts, maxPrice) {
        try {
            // Clear existing charts
            const priceChart = document.getElementById('priceChart');
            const ratingChart = document.getElementById('ratingChart');
            const brandSummaryChart = document.getElementById('brandSummaryChart');
            
            if (!priceChart || !ratingChart || !brandSummaryChart) {
                console.error('One or more chart elements not found');
                return;
            }
            
            // Get chart containers
            const priceChartContainer = priceChart.parentElement;
            const ratingChartContainer = ratingChart.parentElement;
            const brandSummaryChartContainer = brandSummaryChart.parentElement;
            
            // Remove old charts
            priceChart.remove();
            ratingChart.remove();
            brandSummaryChart.remove();
            
            // Create new canvas elements
            priceChartContainer.innerHTML = '<canvas id="priceChart"></canvas>';
            ratingChartContainer.innerHTML = '<canvas id="ratingChart"></canvas>';
            brandSummaryChartContainer.innerHTML = '<canvas id="brandSummaryChart"></canvas>';
            
            // Recreate charts with filtered data
            createPriceChart(filteredProducts);
            createRatingChart(filteredProducts);
            
            // For brand summary, we need to restructure the data
            const filteredData = {};
            Object.keys(originalData).forEach(brand => {
                const brandProducts = originalData[brand].filter(product => {
                    const price = parseFloat(product.price.replace('€', '').trim());
                    return price <= maxPrice;
                });
                
                if (brandProducts.length > 0) {
                    filteredData[brand] = brandProducts;
                }
            });
            
            createBrandSummaryChart(filteredData);
        } catch (error) {
            console.error('Error updating charts:', error);
            showErrorMessage('There was an error updating the charts. Please try again.');
        }
    }
}

/**
 * Display an error message to the user
 * @param {String} message - The error message to display
 */
function showErrorMessage(message) {
    // Check if an error alert already exists
    const existingAlert = document.querySelector('.alert-danger');
    if (existingAlert) {
        existingAlert.textContent = message;
        return;
    }
    
    // Create error alert
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show';
    errorAlert.role = 'alert';
    errorAlert.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    
    errorAlert.appendChild(closeButton);
    
    // Add to the top of the container
    const container = document.querySelector('.container-fluid');
    container.insertBefore(errorAlert, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        errorAlert.classList.remove('show');
        setTimeout(() => errorAlert.remove(), 500);
    }, 5000);
}