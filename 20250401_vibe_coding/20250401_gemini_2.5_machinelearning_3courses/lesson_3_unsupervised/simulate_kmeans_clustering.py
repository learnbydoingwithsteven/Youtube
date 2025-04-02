import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score
import os
import time

# --- Configuration ---
OUTPUT_DIR = "output"
TIMESTAMP = time.strftime("%Y%m%d_%H%M%S")
LESSON_OUTPUT_DIR = os.path.join(OUTPUT_DIR, f"lesson_3_{TIMESTAMP}")
N_SAMPLES = 300
N_FEATURES = 2 # For visualization
N_CLUSTERS = 4 # The actual number of clusters we generate
RANDOM_STATE = 42
K_TO_TRY = N_CLUSTERS # The K value we will use for the final clustering
MAX_K_ELBOW = 10 # Max K to check for the elbow method

# --- Data Generation ---
# Generate synthetic data with distinct clusters
X, y_true = make_blobs(n_samples=N_SAMPLES, centers=N_CLUSTERS,
                       n_features=N_FEATURES, cluster_std=0.8,
                       random_state=RANDOM_STATE)

# --- Elbow Method for finding optimal K ---
inertia_values = []
k_range = range(1, MAX_K_ELBOW + 1)

print(f"--- Calculating Elbow Method (K=1 to {MAX_K_ELBOW}) ---")
for k in k_range:
    kmeans_elbow = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=10)
    kmeans_elbow.fit(X)
    inertia_values.append(kmeans_elbow.inertia_)
    print(f" K={k}, Inertia={kmeans_elbow.inertia_:.2f}")

# --- Model Training (with chosen K) ---
print(f"\n--- Training K-Means with K={K_TO_TRY} ---")
kmeans = KMeans(n_clusters=K_TO_TRY, random_state=RANDOM_STATE, n_init=10)
kmeans.fit(X)
y_kmeans = kmeans.predict(X)
centroids = kmeans.cluster_centers_

# --- Evaluation ---
final_inertia = kmeans.inertia_
silhouette_avg = silhouette_score(X, y_kmeans)

print(f"\nFinal Inertia (K={K_TO_TRY}): {final_inertia:.4f}")
print(f"Silhouette Score (K={K_TO_TRY}): {silhouette_avg:.4f}")
# Note: We have y_true here because we generated the data,
# but in a real unsupervised scenario, you wouldn't have it for evaluation.
# We could calculate Adjusted Rand Index (ARI) if needed for comparison:
# from sklearn.metrics import adjusted_rand_score
# ari = adjusted_rand_score(y_true, y_kmeans)
# print(f"Adjusted Rand Index (ARI): {ari:.4f}")


# --- Visualization ---

# 1. Elbow Method Plot
plt.figure(figsize=(8, 5))
plt.plot(k_range, inertia_values, marker='o')
plt.title('Elbow Method for Optimal K')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('Inertia (Within-cluster sum of squares)')
plt.xticks(k_range)
plt.grid(True)

# Save plot 1
os.makedirs(LESSON_OUTPUT_DIR, exist_ok=True)
plot1_filename = os.path.join(LESSON_OUTPUT_DIR, "elbow_method.png")
plt.savefig(plot1_filename)
print(f"\nElbow method plot saved to: {plot1_filename}")
plt.close()

# 2. K-Means Clustering Results Plot
plt.figure(figsize=(10, 7))
# Plot data points colored by cluster
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis', alpha=0.7, label='Data Points')
# Plot centroids
plt.scatter(centroids[:, 0], centroids[:, 1], c='red', s=200, alpha=0.9, marker='X', label='Centroids')

plt.title(f'K-Means Clustering (K={K_TO_TRY})')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.grid(True)

# Save plot 2
plot2_filename = os.path.join(LESSON_OUTPUT_DIR, "kmeans_clusters.png")
plt.savefig(plot2_filename)
print(f"K-Means clusters plot saved to: {plot2_filename}")
plt.close()

# --- Save Results ---
results_filename = os.path.join(LESSON_OUTPUT_DIR, "results.txt")
with open(results_filename, 'w') as f:
    f.write("--- K-Means Clustering Results ---\n")
    f.write(f"Timestamp: {TIMESTAMP}\n")
    f.write(f"Parameters: n_samples={N_SAMPLES}, n_features={N_FEATURES}, generated_centers={N_CLUSTERS}, K_used={K_TO_TRY}, random_state={RANDOM_STATE}\n\n")
    f.write(f"Final Inertia (K={K_TO_TRY}): {final_inertia:.4f}\n")
    f.write(f"Silhouette Score (K={K_TO_TRY}): {silhouette_avg:.4f}\n\n")
    # f.write(f"Adjusted Rand Index (ARI): {ari:.4f}\n\n") # Uncomment if ARI calculated
    f.write("Final Centroid Locations:\n")
    f.write(np.array2string(centroids, precision=4, separator=', '))
    f.write("\n\nElbow Method Inertia Values:\n")
    for k, inertia in zip(k_range, inertia_values):
        f.write(f" K={k}: {inertia:.2f}\n")

print(f"Results saved to: {results_filename}")

# Optional: plt.show()
