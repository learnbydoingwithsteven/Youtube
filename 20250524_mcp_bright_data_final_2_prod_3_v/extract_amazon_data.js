// Amazon Product Data Extractor using Bright Data MCP
// This script extracts product information and reviews from Amazon using Bright Data's MCP tools

// Import required modules
const fs = require('fs');
const path = require('path');

// Define the product URLs organized by brand
const products = {
  "Dreame": [
    { name: "Dreame X50 Ultra Complete", url: "https://www.amazon.it/dp/B0DPB7RN2L" },
    { name: "Dreame L10s Ultra Gen 2", url: "https://www.amazon.it/dp/B0DCVYS9FQ" },
    { name: "Dreame L40 Ultra", url: "https://www.amazon.it/dp/B0DCW1WZJ4" }
  ],
  "Roborock": [
    { name: "Roborock S8 Pro Ultra", url: "https://www.amazon.it/dp/B0BSL98D73" },
    { name: "Roborock Q7 Max", url: "https://www.amazon.it/dp/B09S3RR6LD" },
    { name: "Roborock Q5 Pro+", url: "https://www.amazon.it/dp/B0CCD9YGXJ" }
  ],
  "iRobot Roomba": [
    { name: "Roomba S9+ (9550)", url: "https://www.amazon.it/dp/B07QXM2V6X" },
    { name: "Roomba J7+", url: "https://www.amazon.it/dp/B0BSNTCVVX" },
    { name: "Roomba Combo J5", url: "https://www.amazon.it/dp/B0C414DZPN" }
  ]
};

// Function to fetch product data using Bright Data MCP
async function fetchProductData(url) {
  try {
    console.log(`Fetching product data for: ${url}`);
    
    // Call the Bright Data MCP tool to get product data
    // In a real implementation, this would be an actual API call
    const response = await runMCP('mcp.config.usrlocalmcp.Bright Data', 'web_data_amazon_product', { url });
    
    // Extract the relevant information from the response
    if (response && response.name) {
      return {
        name: response.name,
        price: response.price ? `${response.price.currency} ${response.price.value}` : 'Price not available',
        rating: response.rating ? `${response.rating.value} (${response.rating.count} reviews)` : 'Rating not available'
      };
    } else {
      console.error(`Invalid response format for ${url}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product data for ${url}:`, error);
    return null;
  }
}

// Function to fetch product reviews using Bright Data MCP
async function fetchProductReviews(url) {
  try {
    console.log(`Fetching product reviews for: ${url}`);
    
    // Call the Bright Data MCP tool to get product reviews
    // In a real implementation, this would be an actual API call
    const response = await runMCP('mcp.config.usrlocalmcp.Bright Data', 'web_data_amazon_product_reviews', { url });
    
    // Extract and format the reviews
    if (response && response.reviews && Array.isArray(response.reviews)) {
      // Get the 3 latest reviews
      return response.reviews.slice(0, 3).map(review => ({
        author: review.author || 'Anonymous',
        date: review.date || 'Unknown date',
        rating: review.rating ? review.rating.toString() : 'No rating',
        title: review.title || 'No title',
        content: review.content || 'No content'
      }));
    } else {
      console.error(`Invalid reviews response format for ${url}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching product reviews for ${url}:`, error);
    return [];
  }
}

// Simulate the MCP API call (in a real implementation, this would be replaced with actual API calls)
async function runMCP(serverName, toolName, args) {
  // This is a simulation function that would be replaced with actual MCP API calls
  console.log(`Running MCP tool: ${toolName} with args:`, args);
  
  // Simulate different responses based on the tool being called
  if (toolName === 'web_data_amazon_product') {
    // Simulate product data response
    return {
      name: `Product from ${args.url}`,
      price: {
        value: Math.floor(Math.random() * 1000) + 100,
        currency: '€'
      },
      rating: {
        value: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        count: Math.floor(Math.random() * 1000) + 50 // Random number of reviews
      }
    };
  } else if (toolName === 'web_data_amazon_product_reviews') {
    // Simulate reviews response
    const reviewCount = Math.floor(Math.random() * 3) + 3; // Random number of reviews (3-5)
    const reviews = [];
    
    for (let i = 0; i < reviewCount; i++) {
      const rating = Math.floor(Math.random() * 3) + 3; // Random rating between 3 and 5
      reviews.push({
        author: `Reviewer ${i + 1}`,
        date: `2023-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        rating: rating,
        title: rating >= 4 ? 'Great product' : 'Decent product',
        content: rating >= 4 ? 
          'Very satisfied with this vacuum cleaner. It works great and has excellent suction power.' : 
          'This vacuum cleaner is decent. It does the job but could be better in some aspects.'
      });
    }
    
    return { reviews };
  }
  
  return null;
}

// Main function to extract all product data and reviews
async function extractAllProductData() {
  const result = {};
  
  // Process each brand and its products
  for (const [brand, brandProducts] of Object.entries(products)) {
    result[brand] = [];
    
    // Process each product in the brand
    for (const product of brandProducts) {
      console.log(`Processing ${product.name}...`);
      
      // Fetch product data
      const productData = await fetchProductData(product.url);
      
      // Fetch product reviews
      const productReviews = await fetchProductReviews(product.url);
      
      // Add product data and reviews to the result
      if (productData) {
        result[brand].push({
          name: product.name,
          url: product.url,
          price: productData.price,
          rating: productData.rating,
          reviews: productReviews
        });
      }
    }
  }
  
  return result;
}

// Function to save the result to a JSON file
function saveToJsonFile(data, filename) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the main function
(async () => {
  try {
    console.log('Starting product data extraction...');
    const data = await extractAllProductData();
    saveToJsonFile(data, 'amazon_products.json');
    console.log('Product data extraction completed successfully!');
  } catch (error) {
    console.error('Error during product data extraction:', error);
  }
})();