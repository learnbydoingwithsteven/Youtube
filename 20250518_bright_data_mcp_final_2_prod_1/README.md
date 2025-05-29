# Amazon Italy Robot Vacuum Cleaner Analysis

This project analyzes house cleaning robot products available on the Italian Amazon marketplace. It collects data about robot vacuum cleaners, processes it, and generates visualizations to compare different products and brands.

## Features

- Scrapes robot vacuum cleaner product data from Amazon Italy using Bright Data MCP
- Extracts key information such as prices, ratings, reviews, and features
- Processes and cleans the data for analysis
- Creates visualizations including:
  - Price distribution
  - Price comparison by brand
  - Ratings distribution
  - Average rating by brand
  - Number of reviews by brand
  - Price vs. Rating correlation
- Provides summary statistics of the analyzed products

## Project Structure

```
├── amazon_robot_analysis.py  # Data processing and visualization functions
├── amazon_scraper.py         # Amazon scraping functionality using Bright Data MCP
├── main.py                   # Main script to run the complete analysis pipeline
├── requirements.txt          # Python dependencies
├── data/                     # Directory for storing scraped data
└── plots/                    # Directory for storing generated visualizations
```

## Installation

1. Clone this repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the main script to perform the complete analysis:

```bash
python main.py
```

This will:
1. Scrape robot vacuum cleaner data from Amazon Italy (or use existing data if available)
2. Process and clean the data
3. Generate visualizations in the `plots` directory
4. Display summary statistics in the console

## Visualizations

The analysis generates the following visualizations:

1. **Price Distribution** - Shows how prices are distributed across all products
2. **Price by Brand** - Compares price ranges across different brands
3. **Ratings Distribution** - Shows the distribution of customer ratings
4. **Average Rating by Brand** - Compares average ratings across brands
5. **Number of Reviews by Brand** - Shows which brands have the most reviews
6. **Price vs. Rating** - Scatter plot showing the relationship between price and rating

## Notes

- The project uses Bright Data MCP to fetch real data from Amazon Italy
- The scraper fetches product information for robot vacuum cleaners from the Italian market
- Error handling is implemented to fall back to sample data if API requests fail
- The analysis is focused on the Italian market but can be adapted for other regions

## Requirements

- Python 3.7+
- Required packages are listed in `requirements.txt`