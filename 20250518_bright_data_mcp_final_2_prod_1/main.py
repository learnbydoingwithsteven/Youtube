import os
import pandas as pd
from amazon_scraper import main as run_scraper
from amazon_robot_analysis import process_data, create_visualizations

def main():
    """Main function to run the complete analysis pipeline.
    
    This function orchestrates the entire process of scraping Amazon Italy
    for robot vacuum cleaner data, processing it, and creating visualizations.
    """
    print("\n=== Amazon Italy Robot Vacuum Cleaner Analysis ===\n")
    
    # Step 1: Create directories for output
    os.makedirs("data", exist_ok=True)
    os.makedirs("plots", exist_ok=True)
    
    # Step 2: Check if we already have data
    data_file = "data/robot_vacuum_data.csv"
    
    if os.path.exists(data_file):
        print(f"Loading existing data from {data_file}")
        df = pd.read_csv(data_file)
    else:
        print("No existing data found. Running scraper to collect data...")
        # Run the scraper to collect data
        df = run_scraper()
        # Save to the data directory
        df.to_csv(data_file, index=False, encoding='utf-8')
        print(f"Data saved to {data_file}")
    
    # Step 3: Process the data
    processed_df = process_data(df.to_dict('records'))
    
    # Step 4: Create visualizations
    create_visualizations(processed_df, output_dir='plots')
    
    print("\n=== Analysis Complete ===\n")
    print(f"Data summary:\n")
    print(f"Total products analyzed: {len(processed_df)}")
    
    if 'brand' in processed_df.columns:
        print(f"\nBrands distribution:")
        brand_counts = processed_df['brand'].value_counts()
        for brand, count in brand_counts.items():
            print(f"  - {brand}: {count} products")
    
    if 'price_value' in processed_df.columns:
        print(f"\nPrice statistics:")
        print(f"  - Average price: €{processed_df['price_value'].mean():.2f}")
        print(f"  - Minimum price: €{processed_df['price_value'].min():.2f}")
        print(f"  - Maximum price: €{processed_df['price_value'].max():.2f}")
    
    if 'rating_value' in processed_df.columns:
        print(f"\nRating statistics:")
        print(f"  - Average rating: {processed_df['rating_value'].mean():.1f} stars")
    
    print("\nVisualizations have been saved to the 'plots' directory.")
    print("You can view the following plots:")
    print("  - Price distribution")
    print("  - Price by brand")
    print("  - Ratings distribution")
    print("  - Average rating by brand")
    print("  - Number of reviews by brand")
    print("  - Price vs. Rating scatter plot")

if __name__ == "__main__":
    main()