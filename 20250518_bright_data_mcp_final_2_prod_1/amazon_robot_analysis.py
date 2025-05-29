import os
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import re
from dotenv import load_dotenv

# Load environment variables if needed
load_dotenv()

# Set plot style and font size for better readability
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams.update({'font.size': 12})

# Function to extract price from string
def extract_price(price_str):
    """Extract numeric price from string format.
    
    Args:
        price_str (str): Price string (e.g., '€199,99')
        
    Returns:
        float: Extracted price value
    """
    if not price_str or not isinstance(price_str, str):
        return None
    # Extract digits and replace comma with dot for decimal
    price_match = re.search(r'[\d.,]+', price_str.replace(',', '.'))
    if price_match:
        # Remove any non-numeric characters except decimal point
        price = re.sub(r'[^\d.]', '', price_match.group())
        return float(price)
    return None

# Function to search for robot vacuum cleaners on Amazon Italy
def search_robot_vacuums():
    """Search for robot vacuum cleaners on Amazon Italy using Bright Data MCP.
    
    Returns:
        list: List of search results
    """
    print("Searching for robot vacuum cleaners on Amazon Italy...")
    
    # Use Bright Data MCP to search for robot vacuum cleaners
    # This is a placeholder for the actual MCP call
    search_query = "robot aspirapolvere"
    
    # In a real implementation, we would use the MCP server to get the data
    # For demonstration, we'll simulate the data structure
    
    # Placeholder for search results
    results = []
    
    return results

# Function to scrape product details
def scrape_product_details(product_urls):
    """Scrape detailed information for each product.
    
    Args:
        product_urls (list): List of product URLs to scrape
        
    Returns:
        list: List of product details
    """
    print(f"Scraping details for {len(product_urls)} products...")
    
    products = []
    
    # In a real implementation, we would use the MCP server to get the data
    # For demonstration, we'll simulate the data structure
    
    return products

# Function to process and clean the data
def process_data(products):
    """Process and clean the scraped product data.
    
    Args:
        products (list): List of product details
        
    Returns:
        pandas.DataFrame: Processed data in a DataFrame
    """
    print("Processing data...")
    
    # Convert to DataFrame
    df = pd.DataFrame(products)
    
    # Clean and transform data
    if 'price' in df.columns:
        df['price_value'] = df['price'].apply(extract_price)
    
    # Extract ratings
    if 'rating' in df.columns:
        df['rating_value'] = df['rating'].apply(lambda x: float(x.split(' ')[0].replace(',', '.')) if isinstance(x, str) else None)
    
    # Extract number of reviews
    if 'reviews' in df.columns:
        df['reviews_count'] = df['reviews'].apply(lambda x: int(re.sub(r'[^\d]', '', x)) if isinstance(x, str) else None)
    
    # Add brand category
    if 'title' in df.columns:
        # Extract common brands
        common_brands = ['iRobot', 'Roomba', 'Ecovacs', 'Roborock', 'Xiaomi', 'Dreame', 'Lefant', 'Proscenic', 'Cecotec']
        
        def extract_brand(title):
            if not isinstance(title, str):
                return 'Other'
            for brand in common_brands:
                if brand.lower() in title.lower():
                    return brand
            return 'Other'
        
        df['brand'] = df['title'].apply(extract_brand)
    
    return df

# Function to create visualizations
def create_visualizations(df, output_dir='plots'):
    """Create visualizations from the processed data.
    
    Args:
        df (pandas.DataFrame): Processed data
        output_dir (str): Directory to save plots
    """
    print("Creating visualizations...")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Set the figure size for all plots
    plt.figure(figsize=(12, 8))
    
    # 1. Price Distribution
    if 'price_value' in df.columns:
        plt.figure(figsize=(12, 8))
        sns.histplot(df['price_value'].dropna(), bins=20, kde=True)
        plt.title('Distribuzione dei Prezzi dei Robot Aspirapolvere', fontsize=16)
        plt.xlabel('Prezzo (€)', fontsize=14)
        plt.ylabel('Numero di Prodotti', fontsize=14)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/price_distribution.png")
        plt.close()
    
    # 2. Price by Brand
    if 'price_value' in df.columns and 'brand' in df.columns:
        plt.figure(figsize=(12, 8))
        brand_order = df.groupby('brand')['price_value'].median().sort_values(ascending=False).index
        sns.boxplot(x='brand', y='price_value', data=df, order=brand_order)
        plt.title('Prezzi per Marca', fontsize=16)
        plt.xlabel('Marca', fontsize=14)
        plt.ylabel('Prezzo (€)', fontsize=14)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/price_by_brand.png")
        plt.close()
    
    # 3. Ratings Distribution
    if 'rating_value' in df.columns:
        plt.figure(figsize=(12, 8))
        sns.histplot(df['rating_value'].dropna(), bins=10, kde=True)
        plt.title('Distribuzione delle Valutazioni', fontsize=16)
        plt.xlabel('Valutazione (stelle)', fontsize=14)
        plt.ylabel('Numero di Prodotti', fontsize=14)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/ratings_distribution.png")
        plt.close()
    
    # 4. Average Rating by Brand
    if 'rating_value' in df.columns and 'brand' in df.columns:
        plt.figure(figsize=(12, 8))
        brand_avg_rating = df.groupby('brand')['rating_value'].mean().sort_values(ascending=False)
        sns.barplot(x=brand_avg_rating.index, y=brand_avg_rating.values)
        plt.title('Valutazione Media per Marca', fontsize=16)
        plt.xlabel('Marca', fontsize=14)
        plt.ylabel('Valutazione Media (stelle)', fontsize=14)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/avg_rating_by_brand.png")
        plt.close()
    
    # 5. Number of Reviews by Brand
    if 'reviews_count' in df.columns and 'brand' in df.columns:
        plt.figure(figsize=(12, 8))
        brand_reviews = df.groupby('brand')['reviews_count'].sum().sort_values(ascending=False)
        sns.barplot(x=brand_reviews.index, y=brand_reviews.values)
        plt.title('Numero di Recensioni per Marca', fontsize=16)
        plt.xlabel('Marca', fontsize=14)
        plt.ylabel('Numero di Recensioni', fontsize=14)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/reviews_by_brand.png")
        plt.close()
    
    # 6. Price vs. Rating Scatter Plot
    if 'price_value' in df.columns and 'rating_value' in df.columns:
        plt.figure(figsize=(12, 8))
        sns.scatterplot(x='price_value', y='rating_value', data=df, hue='brand', size='reviews_count', 
                        sizes=(50, 200), alpha=0.7)
        plt.title('Prezzo vs. Valutazione', fontsize=16)
        plt.xlabel('Prezzo (€)', fontsize=14)
        plt.ylabel('Valutazione (stelle)', fontsize=14)
        plt.legend(title='Marca', bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.tight_layout()
        plt.savefig(f"{output_dir}/price_vs_rating.png")
        plt.close()
    
    print(f"Visualizations saved to {output_dir}/")

# Main function to run the analysis
def main():
    """Main function to run the analysis."""
    print("Starting Amazon Italy Robot Vacuum Cleaner Analysis")
    
    # Step 1: Search for robot vacuum cleaners
    search_results = search_robot_vacuums()
    
    # Step 2: Extract product URLs
    product_urls = [result.get('url') for result in search_results if result.get('url')]
    
    # Step 3: Scrape product details
    products = scrape_product_details(product_urls)
    
    # Step 4: Process data
    df = process_data(products)
    
    # Step 5: Create visualizations
    create_visualizations(df)
    
    print("Analysis complete!")

# Run the main function if the script is executed directly
if __name__ == "__main__":
    main()