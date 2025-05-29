# Amazon Product Data Extractor

This project extracts product information and reviews from Amazon using Bright Data's MCP tools. It focuses on vacuum cleaner products from three brands: Dreame, Roborock, and iRobot Roomba.

## Features

- Extracts product information (name, price, rating) from Amazon product pages
- Retrieves the 3 latest reviews for each product
- Organizes data by brand and product
- Saves all data to a structured JSON file

## Files

- `extract_amazon_data.js`: The main script that uses Bright Data MCP to extract product data and reviews
- `amazon_product_extractor.js`: An alternative implementation (for reference)

## How to Use

### Prerequisites

- Node.js installed on your system
- Access to Bright Data MCP services

### Installation

1. Clone or download this repository
2. Install dependencies (if any)

### Running the Script

To extract product data and reviews, run:

```bash
node extract_amazon_data.js
```

The script will:
1. Connect to Bright Data MCP services
2. Extract product information and reviews for each product
3. Save the data to `amazon_products.json` in the project directory

### Output Format

The output JSON file will have the following structure:

```json
{
  "Dreame": [
    {
      "name": "Dreame X50 Ultra Complete",
      "url": "https://www.amazon.it/dp/B0DPB7RN2L",
      "price": "€ 999.99",
      "rating": "4.5 (123 reviews)",
      "reviews": [
        {
          "author": "Reviewer Name",
          "date": "2023-05-01",
          "rating": "5",
          "title": "Great product",
          "content": "Review content here..."
        },
        // 2 more reviews...
      ]
    },
    // More products...
  ],
  // More brands...
}
```

## Notes

- The current implementation includes a simulation of the MCP API calls for demonstration purposes
- In a real-world scenario, you would need to replace the `runMCP` function with actual API calls to Bright Data's MCP service
- The script is designed to handle errors gracefully and will continue processing other products if one fails

## Products Included

### Dreame
- Dreame X50 Ultra Complete
- Dreame L10s Ultra Gen 2
- Dreame L40 Ultra

### Roborock
- Roborock S8 Pro Ultra
- Roborock Q7 Max
- Roborock Q5 Pro+

### iRobot Roomba
- Roomba S9+ (9550)
- Roomba J7+
- Roomba Combo J5