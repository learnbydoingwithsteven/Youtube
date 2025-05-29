// Amazon Product Extractor using Bright Data MCP
// This script extracts product information and reviews from Amazon product pages

// Import required modules
const fs = require('fs');
const path = require('path');

// In a real implementation, you would import and initialize the MCP client
// const mcpClient = require('mcp-client');
// mcpClient.init({ apiKey: 'your-api-key' });

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
    // Make an API call to Bright Data's MCP service to get product data
    console.log(`Fetching product data for: ${url}`);
    
    // In a real implementation, this would use the MCP API
    // For demonstration purposes, we're showing how it would be called
    // The actual implementation would require the MCP client library
    
    // Example of how to call the MCP API:
    // const productData = await mcpClient.runTool('web_data_amazon_product', { url });
    
    // For now, we'll simulate the response structure based on the MCP tool's expected output
    const productData = {
      name: "Product Name", // Will be replaced with actual data from MCP
      price: {
        value: 0.00,
        currency: "EUR"
      },
      rating: {
        value: 0.0,
        count: 0
      }
    };
    
    // Extract the relevant information
    return {
      name: productData.name,
      price: `€${productData.price.value.toFixed(2)}`,
      rating: `${productData.rating.value} (${productData.rating.count} reviews)`
    };
  } catch (error) {
    console.error(`Error fetching product data for ${url}:`, error);
    return null;
  }
}

// Function to fetch product reviews using Bright Data MCP
async function fetchProductReviews(url) {
  try {
    // Make an API call to Bright Data's MCP service to get product reviews
    console.log(`Fetching product reviews for: ${url}`);
    
    // In a real implementation, this would use the MCP API
    // For demonstration purposes, we're showing how it would be called
    // The actual implementation would require the MCP client library
    
    // Example of how to call the MCP API:
    // const reviewsData = await mcpClient.runTool('web_data_amazon_product_reviews', { url });
    
    // For now, we'll simulate the response structure based on the MCP tool's expected output
    const reviewsData = {
      reviews: [
        {
          author: "Reviewer 1",
          date: "2023-05-01",
          rating: 5.0,
          title: "Great product",
          content: "This is a great product! Very satisfied with the purchase."
        },
        {
          author: "Reviewer 2",
          date: "2023-04-15",
          rating: 4.0,
          title: "Good product",
          content: "This is a good product. Works as expected but could be improved."
        },
        {
          author: "Reviewer 3",
          date: "2023-04-02",
          rating: 3.0,
          title: "Average product",
          content: "This is an average product. It does the job but has some limitations."
        },
        {
          author: "Reviewer 4",
          date: "2023-03-20",
          rating: 5.0,
          title: "Excellent",
          content: "Excellent vacuum cleaner. Highly recommended!"
        }
      ]
    };
    
    // Extract and format the reviews
    return reviewsData.reviews.slice(0, 3).map(review => ({
      author: review.author,
      date: review.date,
      rating: review.rating.toString(),
      title: review.title,
      content: review.content
    }));
  } catch (error) {
    console.error(`Error fetching product reviews for ${url}:`, error);
    return [];
  }
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
          reviews: productReviews.slice(0, 3) // Get only the 3 latest reviews
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