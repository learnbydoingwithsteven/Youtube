document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const frequencyInput = document.getElementById('frequency');
    const amplitudeInput = document.getElementById('amplitude');
    const numTermsInput = document.getElementById('num_terms');
    const param1Input = document.getElementById('param1');
    const param1ValueSpan = document.getElementById('param1_value');
    const param2Input = document.getElementById('param2');
    const param2ValueSpan = document.getElementById('param2_value');
    const runButton = document.getElementById('run_button');
    const plotCanvas = document.getElementById('plotCanvas');
    const ctx = plotCanvas.getContext('2d');
    const accuracyMetricSpan = document.getElementById('accuracy_metric');
    const lossMetricSpan = document.getElementById('loss_metric');

    // --- Event Listeners ---

    // Update displayed values for range sliders
    param1Input.addEventListener('input', () => {
        param1ValueSpan.textContent = param1Input.value;
    });

    param2Input.addEventListener('input', () => {
        param2ValueSpan.textContent = param2Input.value;
    });

    // Run simulation when the button is clicked
    runButton.addEventListener('click', runSimulationAndTest);

    // --- Core Functions ---

    function runSimulationAndTest() {
        // 1. Get current parameter values
        const simParams = {
            frequency: parseFloat(frequencyInput.value),
            amplitude: parseFloat(amplitudeInput.value),
            numTerms: parseInt(numTermsInput.value, 10)
        };
        const hyperParams = {
            param1: parseFloat(param1Input.value), // e.g., learning rate
            param2: parseFloat(param2Input.value)  // e.g., regularization
        };

        console.log("Running with Sim Params:", simParams);
        console.log("Running with Hyper Params:", hyperParams);

        // 2. Generate Fourier simulation data (Placeholder)
        const simulationData = generateFourierData(simParams);

        // 3. Run model test/tuning with hyperparameters (Placeholder)
        const metrics = runModelTest(simulationData, hyperParams);

        // 4. Plot the simulation data
        plotData(simulationData);

        // 5. Update the metrics display
        updateMetrics(metrics);
    }

    function generateFourierData(params) {
        // Placeholder: Generate simple sine wave based on params
        // In a real scenario, this would compute the Fourier series
        console.log("Generating Fourier data with params:", params);
        const dataPoints = [];
        const steps = 200; // Number of points to plot
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * 2 * Math.PI; // Simulate one cycle
            let y = 0;
            // Basic Fourier series approximation (example: square wave)
            for (let n = 1; n <= params.numTerms; n++) {
                 const termIndex = 2 * n - 1; // Odd terms for square wave
                 y += (4 / Math.PI) * (1 / termIndex) * Math.sin(termIndex * params.frequency * x);
            }
            y *= params.amplitude;
            dataPoints.push({ x: i * (plotCanvas.width / steps), y: y }); // Scale x for canvas width
        }
        console.log("Generated data points:", dataPoints.length);
        return dataPoints;
    }

    function runModelTest(data, hyperParams) {
        // Placeholder: Simulate model testing
        // In a real scenario, this would involve training/evaluating a model
        // using the simulation data and hyperparameters.
        console.log("Running model test with hyperparams:", hyperParams);

        // Simulate some metrics based on hyperparameters (simple example)
        const simulatedAccuracy = 0.8 + (hyperParams.param1 * 1.5) - (hyperParams.param2 * 0.1); // Example calculation
        const simulatedLoss = 0.5 - (hyperParams.param1 * 2) + (hyperParams.param2 * 0.2);     // Example calculation

        return {
            accuracy: Math.max(0, Math.min(1, simulatedAccuracy)).toFixed(3), // Clamp between 0 and 1
            loss: Math.max(0.01, simulatedLoss).toFixed(3) // Ensure loss is positive
        };
    }

    function plotData(dataPoints) {
        const canvasWidth = plotCanvas.width;
        const canvasHeight = plotCanvas.height;
        const padding = 20; // Padding around the plot

        // Clear previous plot
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Find data range for scaling
        let minY = dataPoints[0].y;
        let maxY = dataPoints[0].y;
        dataPoints.forEach(p => {
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });

        // Add some buffer to min/max Y
        const yRange = maxY - minY;
        minY -= yRange * 0.1;
        maxY += yRange * 0.1;
        const effectiveHeight = canvasHeight - 2 * padding;
        const effectiveWidth = canvasWidth - 2 * padding; // Use padding for x-axis too

        // Function to scale data points to canvas coordinates
        const scaleX = (xValue) => padding + (xValue / dataPoints[dataPoints.length - 1].x) * effectiveWidth;
        const scaleY = (yValue) => canvasHeight - padding - ((yValue - minY) / (maxY - minY)) * effectiveHeight;

        // Draw axes (simple lines)
        ctx.beginPath();
        ctx.strokeStyle = '#aaa';
        // Y-axis
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvasHeight - padding);
        // X-axis
        ctx.moveTo(padding, canvasHeight - padding);
        ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
        ctx.stroke();


        // Plot the data
        ctx.beginPath();
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;

        const firstPoint = dataPoints[0];
        ctx.moveTo(scaleX(firstPoint.x), scaleY(firstPoint.y));

        dataPoints.forEach(point => {
            ctx.lineTo(scaleX(point.x), scaleY(point.y));
        });

        ctx.stroke();
        console.log("Plotting complete.");
    }

    function updateMetrics(metrics) {
        accuracyMetricSpan.textContent = metrics.accuracy;
        lossMetricSpan.textContent = metrics.loss;
        console.log("Metrics updated:", metrics);
    }

    // Initial run to show something on load
    runSimulationAndTest();
});
