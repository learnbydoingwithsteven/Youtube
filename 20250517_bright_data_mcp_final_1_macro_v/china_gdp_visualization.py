# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Define the GDP data for China for the last 5 years (2020-2024)
# Data source: Macrotrends (https://www.macrotrends.net/global-metrics/countries/chn/china/gdp-gross-domestic-product)
years = [2020, 2021, 2022, 2023, 2024]
gdp_values = [
    14.688,  # 2020 GDP in trillion USD
    17.820,  # 2021 GDP in trillion USD
    17.882,  # 2022 GDP in trillion USD
    17.795,  # 2023 GDP in trillion USD
    18.770   # 2024 GDP in trillion USD (source: China's official statistics)
]

# Create a pandas DataFrame for better data handling
data = pd.DataFrame({
    'Year': years,
    'GDP (Trillion USD)': gdp_values
})

# Print the data table
print("China's GDP Data (Last 5 Years):")
print(data)

# Create a figure with a specific size
plt.figure(figsize=(12, 6))

# Create a bar chart
bars = plt.bar(data['Year'], data['GDP (Trillion USD)'], color='#1f77b4', width=0.6)

# Add data labels on top of each bar
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.1,
             f'{height:.3f}', ha='center', va='bottom', fontsize=10)

# Calculate year-over-year growth rates
growth_rates = []
for i in range(1, len(gdp_values)):
    growth_rate = ((gdp_values[i] - gdp_values[i-1]) / gdp_values[i-1]) * 100
    growth_rates.append(growth_rate)

# Add growth rate annotations
for i, growth_rate in enumerate(growth_rates):
    x1, x2 = years[i], years[i+1]
    y1, y2 = gdp_values[i], gdp_values[i+1]
    plt.annotate(f'{growth_rate:.2f}%', 
                 xy=((x1 + x2)/2, (y1 + y2)/2), 
                 xytext=(0, 10),
                 textcoords='offset points',
                 ha='center', va='bottom',
                 color='green' if growth_rate > 0 else 'red',
                 fontsize=9)

# Add a trend line
z = np.polyfit(years, gdp_values, 1)
p = np.poly1d(z)
plt.plot(years, p(years), "r--", alpha=0.7, label=f'Trend Line (y={z[0]:.2f}x{z[1]:+.2f})')

# Customize the plot
plt.title('China GDP (2020-2024)', fontsize=16)
plt.xlabel('Year', fontsize=12)
plt.ylabel('GDP (Trillion USD)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.xticks(years)
plt.ylim(bottom=0)  # Start y-axis from 0
plt.legend()

# Add a source note
plt.figtext(0.5, 0.01, 'Data Source: Macrotrends (https://www.macrotrends.net)', 
            ha='center', fontsize=8, style='italic')

# Save the figure
plt.tight_layout(pad=2.0)
plt.savefig('china_gdp_last_5_years.png', dpi=300, bbox_inches='tight')

# Show the plot
plt.show()

# Print additional analysis
print("\nAnalysis:")
print(f"Average GDP (2020-2024): {np.mean(gdp_values):.3f} trillion USD")
print(f"GDP Growth (2020-2024): {((gdp_values[-1] - gdp_values[0]) / gdp_values[0] * 100):.2f}%")
print(f"Highest GDP: {max(gdp_values):.3f} trillion USD in {years[gdp_values.index(max(gdp_values))]}")
print(f"Lowest GDP: {min(gdp_values):.3f} trillion USD in {years[gdp_values.index(min(gdp_values))]}")