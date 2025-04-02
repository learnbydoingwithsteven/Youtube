import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import os
import time

# --- Configuration ---
OUTPUT_DIR = "output"
TIMESTAMP = time.strftime("%Y%m%d_%H%M%S")
LESSON_OUTPUT_DIR = os.path.join(OUTPUT_DIR, f"lesson_1_{TIMESTAMP}")

# --- Data Generation ---
# Generate some synthetic data for linear regression
np.random.seed(0) # for reproducibility
X = 2 * np.random.rand(100, 1) # Feature (single)
y = 4 + 3 * X + np.random.randn(100, 1) # Target variable with some noise

# --- Data Splitting ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- Model Training ---
model = LinearRegression()
model.fit(X_train, y_train)

# --- Model Prediction ---
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

# --- Evaluation ---
mse_train = mean_squared_error(y_train, y_pred_train)
r2_train = r2_score(y_train, y_pred_train)
mse_test = mean_squared_error(y_test, y_pred_test)
r2_test = r2_score(y_test, y_pred_test)

print("--- Linear Regression Results ---")
print(f"Intercept (theta_0): {model.intercept_[0]:.4f}")
print(f"Coefficient (theta_1): {model.coef_[0][0]:.4f}")
print(f"Train MSE: {mse_train:.4f}, Train R2: {r2_train:.4f}")
print(f"Test MSE: {mse_test:.4f}, Test R2: {r2_test:.4f}")

# --- Visualization ---
plt.figure(figsize=(10, 6))
plt.scatter(X_train, y_train, color='blue', label='Training data')
plt.scatter(X_test, y_test, color='green', label='Testing data')
plt.plot(X_test, y_pred_test, color='red', linewidth=2, label='Linear Regression Fit')
plt.title('Linear Regression Example')
plt.xlabel('Feature (X)')
plt.ylabel('Target (y)')
plt.legend()
plt.grid(True)

# --- Save Output ---
# Create the output directory if it doesn't exist
os.makedirs(LESSON_OUTPUT_DIR, exist_ok=True)

# Save the plot
plot_filename = os.path.join(LESSON_OUTPUT_DIR, "linear_regression_plot.png")
plt.savefig(plot_filename)
print(f"\nPlot saved to: {plot_filename}")

# Save results to a text file
results_filename = os.path.join(LESSON_OUTPUT_DIR, "results.txt")
with open(results_filename, 'w') as f:
    f.write("--- Linear Regression Results ---\n")
    f.write(f"Timestamp: {TIMESTAMP}\n")
    f.write(f"Intercept (theta_0): {model.intercept_[0]:.4f}\n")
    f.write(f"Coefficient (theta_1): {model.coef_[0][0]:.4f}\n")
    f.write(f"Train MSE: {mse_train:.4f}\n")
    f.write(f"Train R2: {r2_train:.4f}\n")
    f.write(f"Test MSE: {mse_test:.4f}\n")
    f.write(f"Test R2: {r2_test:.4f}\n")
print(f"Results saved to: {results_filename}")

# Keep the plot window open until manually closed (optional)
# plt.show()
