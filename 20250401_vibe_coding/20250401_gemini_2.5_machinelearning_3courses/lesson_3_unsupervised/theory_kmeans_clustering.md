# Lesson 3: Advanced Machine Learning - Unsupervised Learning with K-Means Clustering

## Theory

### What is Unsupervised Learning?
- Learning patterns from unlabeled data.
- Contrast with Supervised and Reinforcement Learning.
- Common tasks: Clustering, Dimensionality Reduction, Association Rule Learning.

### Clustering
- Goal: Group similar data points together.
- Applications: Customer segmentation, anomaly detection, image compression.

### K-Means Clustering Algorithm
- Concept: Partitioning data into K distinct, non-overlapping clusters.
- Algorithm Steps:
    1. Initialization: Randomly select K centroids.
    2. Assignment Step: Assign each data point to the nearest centroid.
    3. Update Step: Recalculate the centroids as the mean of the points assigned to them.
    4. Iteration: Repeat assignment and update steps until convergence (centroids stabilize).
- Choosing K (Elbow Method, Silhouette Score).
- Limitations (Sensitivity to initialization, assumes spherical clusters).

## Evaluation Metrics
- Inertia (Within-cluster sum of squares).
- Silhouette Score.

## Use Cases
Detailed examples of K-Means applications.

## Further Reading
Links to resources and more advanced clustering techniques.
