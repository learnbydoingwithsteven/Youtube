# China GDP Visualization (2020-2024)

This project visualizes China's GDP data for the last 5 years (2020-2024) using Python, pandas, and matplotlib.

## Data Source

The GDP data was collected from [Macrotrends](https://www.macrotrends.net/global-metrics/countries/chn/china/gdp-gross-domestic-product), which provides historical economic data for countries worldwide.

## Features

- Displays China's GDP values for the last 5 years (2020-2024)
- Shows year-over-year growth rates
- Includes a trend line to visualize the overall direction
- Provides basic statistical analysis of the data

## Requirements

The script requires the following Python packages:
- pandas
- matplotlib
- numpy

You can install these dependencies using the provided requirements.txt file:

```
pip install -r requirements.txt
```

## Usage

To run the visualization script:

```
python china_gdp_visualization.py
```

This will:
1. Display a table of China's GDP data for the last 5 years
2. Generate and show a bar chart visualization
3. Save the visualization as 'china_gdp_last_5_years.png'
4. Print a brief analysis of the data

## Output

The script generates:
- A console output with the raw data and statistical analysis
- A PNG image file ('china_gdp_last_5_years.png') with the visualization

## Analysis

The visualization shows China's GDP trend over the last 5 years, highlighting:
- The significant GDP increase between 2020 and 2021 (21.33% growth)
- The slight increase in 2022 (0.34% growth)
- The minor decline in 2023 (0.49% decrease)
- The recovery in 2024 (5.48% growth)
- The overall growth from 2020 to 2024