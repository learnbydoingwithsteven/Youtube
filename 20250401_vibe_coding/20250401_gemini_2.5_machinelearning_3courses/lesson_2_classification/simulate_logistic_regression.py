import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_curve, auc
from sklearn.datasets import make_classification
import os
import time

# --- Configuration ---
OUTPUT_DIR = "output"
TIMESTAMP = time.strftime("%Y%m%d_%H%M%S")
LESSON_OUTPUT_DIR = os.path.join(OUTPUT_DIR, f"lesson_2_{TIMESTAMP}")
N_SAMPLES = 200
N_FEATURES = 2 # Using 2 features for easy visualization
RANDOM_STATE = 42

# --- Data Generation ---
# Generate synthetic data for binary classification
X, y = make_classification(n_samples=N_SAMPLES, n_features=N_FEATURES, n_informative=2,
                           n_redundant=0, n_clusters_per_class=1, flip_y=0.1,
                           random_state=RANDOM_STATE)

# --- Data Splitting ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=RANDOM_STATE)

# --- Model Training ---
model = LogisticRegression()
model.fit(X_train, y_train)

# --- Model Prediction ---
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)
y_pred_proba_test = model.predict_proba(X_test)[:, 1] # Probabilities for ROC curve

# --- Evaluation ---
accuracy_train = accuracy_score(y_train, y_pred_train)
accuracy_test = accuracy_score(y_test, y_pred_test)
conf_matrix = confusion_matrix(y_test, y_pred_test)
class_report = classification_report(y_test, y_pred_test)
fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba_test)
roc_auc = auc(fpr, tpr)

print("--- Logistic Regression Results ---")
print(f"Train Accuracy: {accuracy_train:.4f}")
print(f"Test Accuracy: {accuracy_test:.4f}")
print("\nConfusion Matrix (Test Set):\n", conf_matrix)
print("\nClassification Report (Test Set):\n", class_report)
print(f"\nROC AUC: {roc_auc:.4f}")

# --- Visualization ---

# 1. Scatter plot with Decision Boundary
plt.figure(figsize=(10, 6))
# Plot data points
plt.scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap='viridis', edgecolors='k', label='Test Data')

# Create a meshgrid to plot decision boundary
ax = plt.gca()
xlim = ax.get_xlim()
ylim = ax.get_ylim()
xx, yy = np.meshgrid(np.linspace(xlim[0], xlim[1], 50),
                     np.linspace(ylim[0], ylim[1], 50))
Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

# Plot decision boundary and margins
plt.contourf(xx, yy, Z, cmap='viridis', alpha=0.3)
plt.contour(xx, yy, Z, colors='k', levels=[0.5], linestyles=['-']) # Boundary at P=0.5

plt.title('Logistic Regression Decision Boundary')
plt.xlabel(f'Feature 1')
plt.ylabel(f'Feature 2')
plt.legend()
plt.grid(True)

# Save plot 1
os.makedirs(LESSON_OUTPUT_DIR, exist_ok=True)
plot1_filename = os.path.join(LESSON_OUTPUT_DIR, "logistic_regression_boundary.png")
plt.savefig(plot1_filename)
print(f"\nDecision boundary plot saved to: {plot1_filename}")
plt.close() # Close the figure to prepare for the next plot

# 2. Confusion Matrix Heatmap
plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues",
            xticklabels=model.classes_, yticklabels=model.classes_)
plt.title('Confusion Matrix (Test Set)')
plt.xlabel('Predicted Label')
plt.ylabel('True Label')

# Save plot 2
plot2_filename = os.path.join(LESSON_OUTPUT_DIR, "confusion_matrix.png")
plt.savefig(plot2_filename)
print(f"Confusion matrix plot saved to: {plot2_filename}")
plt.close()

# 3. ROC Curve
plt.figure(figsize=(7, 7))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend(loc="lower right")
plt.grid(True)

# Save plot 3
plot3_filename = os.path.join(LESSON_OUTPUT_DIR, "roc_curve.png")
plt.savefig(plot3_filename)
print(f"ROC curve plot saved to: {plot3_filename}")
plt.close()

# --- Save Results ---
results_filename = os.path.join(LESSON_OUTPUT_DIR, "results.txt")
with open(results_filename, 'w') as f:
    f.write("--- Logistic Regression Results ---\n")
    f.write(f"Timestamp: {TIMESTAMP}\n")
    f.write(f"Parameters: n_samples={N_SAMPLES}, n_features={N_FEATURES}, random_state={RANDOM_STATE}\n\n")
    f.write(f"Train Accuracy: {accuracy_train:.4f}\n")
    f.write(f"Test Accuracy: {accuracy_test:.4f}\n\n")
    f.write("Confusion Matrix (Test Set):\n")
    f.write(np.array2string(conf_matrix))
    f.write("\n\nClassification Report (Test Set):\n")
    f.write(class_report)
    f.write(f"\nROC AUC: {roc_auc:.4f}\n")
print(f"Results saved to: {results_filename}")

# Optional: plt.show() to display plots interactively if needed
