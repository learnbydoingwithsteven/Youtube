#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Run script for Amazon Italy Robot Vacuum Cleaner Analysis

This script provides a command-line interface to run the analysis
with different options and displays the results.
"""

import os
import sys
import argparse
from amazon_scraper import main as run_scraper
from amazon_robot_analysis import process_data, create_visualizations
import pandas as pd

def setup_directories():
    """Create necessary directories for data and plots.
    
    Returns:
        tuple: Paths to data and plots directories
    """
    # Create directories if they don't exist
    data_dir = "data"
    plots_dir = "plots"
    
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(plots_dir, exist_ok=True)
    
    return data_dir, plots_dir

def parse_arguments():
    """Parse command line arguments.
    
    Returns:
        argparse.Namespace: Parsed arguments
    """
    parser = argparse.ArgumentParser(description="Amazon Italy Robot Vacuum Cleaner Analysis")
    
    parser.add_argument(
        "--refresh", 
        action="store_true", 
        help="Force refresh data even if it already exists"
    )
    
    parser.add_argument(
        "--data-only", 
        action="store_true", 
        help="Only collect data without creating visualizations"
    )
    
    parser.add_argument(
        "--viz-only", 
        action="store_true", 
        help="Only create visualizations using existing data"
    )
    
    return parser.parse_args()

def print_header():
    """Print a header for the analysis."""
    print("\n" + "=" * 50)
    print("   Amazon Italy Robot Vacuum Cleaner Analysis")
    print("=" * 50 + "\n")

def print_summary(df):
    """Print a summary of the analysis results.
    
    Args:
        df (pandas.DataFrame): Processed data
    """
    print("\n" + "-" * 50)
    print("ANALYSIS SUMMARY")
    print("-" * 50)
    
    print(f"\nTotal products analyzed: {len(df)}")
    
    if 'brand' in df.columns:
        print(f"\nBrands distribution:")
        brand_counts = df['brand'].value_counts()
        for brand, count in brand_counts.items():
            print(f"  - {brand}: {count} products")
    
    if 'price_value' in df.columns:
        print(f"\nPrice statistics:")
        print(f"  - Average price: €{df['price_value'].mean():.2f}")
        print(f"  - Minimum price: €{df['price_value'].min():.2f}")
        print(f"  - Maximum price: €{df['price_value'].max():.2f}")
    
    if 'rating_value' in df.columns:
        print(f"\nRating statistics:")
        print(f"  - Average rating: {df['rating_value'].mean():.1f} stars")
        
        # Find highest rated brand
        if 'brand' in df.columns:
            brand_ratings = df.groupby('brand')['rating_value'].mean().sort_values(ascending=False)
            if not brand_ratings.empty:
                top_brand = brand_ratings.index[0]
                top_rating = brand_ratings.iloc[0]
                print(f"  - Highest rated brand: {top_brand} ({top_rating:.1f} stars)")
    
    print("\nVisualizations have been saved to the 'plots' directory.")
    print("You can view the following plots:")
    print("  - Price distribution")
    print("  - Price by brand")
    print("  - Ratings distribution")
    print("  - Average rating by brand")
    print("  - Number of reviews by brand")
    print("  - Price vs. Rating scatter plot")
    print("-" * 50 + "\n")

def main():
    """Main function to run the analysis with command line options."""
    # Parse command line arguments
    args = parse_arguments()
    
    # Print header
    print_header()
    
    # Setup directories
    data_dir, plots_dir = setup_directories()
    data_file = os.path.join(data_dir, "robot_vacuum_data.csv")
    
    # Determine if we need to collect data
    need_data_collection = args.refresh or not os.path.exists(data_file) or not args.viz_only
    
    # Collect data if needed
    if need_data_collection and not args.viz_only:
        print("Collecting data from Amazon Italy...")
        df = run_scraper()
        df.to_csv(data_file, index=False, encoding='utf-8')
        print(f"Data saved to {data_file}")
    elif os.path.exists(data_file):
        print(f"Loading existing data from {data_file}")
        df = pd.read_csv(data_file)
    else:
        print(f"Error: No data file found at {data_file} and --viz-only specified")
        print("Please run without --viz-only first to collect data")
        sys.exit(1)
    
    # Process data
    processed_df = process_data(df.to_dict('records'))
    
    # Create visualizations if not data-only
    if not args.data_only:
        print("Creating visualizations...")
        create_visualizations(processed_df, output_dir=plots_dir)
        print(f"Visualizations saved to {plots_dir}/")
    
    # Print summary
    print_summary(processed_df)
    
    print("Analysis complete!")

if __name__ == "__main__":
    main()