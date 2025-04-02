import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- DOM Elements ---
const numCellsInput = document.getElementById('numCells');
const speedInput = document.getElementById('speed');
const speedValueSpan = document.getElementById('speedValue');
const boundarySizeInput = document.getElementById('boundarySize');
const resetButton = document.getElementById('resetButton');

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); // Dark background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;

// --- Simulation Parameters ---
let numCells = parseInt(numCellsInput.value);
let speed = parseFloat(speedInput.value);
let boundarySize = parseFloat(boundarySizeInput.value);
let cells = [];
let boundaryBoxHelper;

// --- Cell Class ---
class Cell {
    constructor(boundary) {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16); // Small sphere for cell
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Green cells
        this.mesh = new THREE.Mesh(geometry, material);
        this.boundary = boundary;

        // Random initial position within boundary
        this.mesh.position.set(
            (Math.random() - 0.5) * boundary * 2,
            (Math.random() - 0.5) * boundary * 2,
            (Math.random() - 0.5) * boundary * 2
        );

        // Random initial velocity direction
        this.velocity = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();

        scene.add(this.mesh);
    }

    update(deltaTime, currentSpeed) {
        // Randomly change direction slightly over time
        this.velocity.x += (Math.random() - 0.5) * 0.1;
        this.velocity.y += (Math.random() - 0.5) * 0.1;
        this.velocity.z += (Math.random() - 0.5) * 0.1;
        this.velocity.normalize();

        // Move the cell
        this.mesh.position.addScaledVector(this.velocity, currentSpeed * deltaTime * 10); // Scale speed

        // Boundary collision check (simple reflection)
        const halfBoundary = this.boundary;
        if (Math.abs(this.mesh.position.x) > halfBoundary) {
            this.mesh.position.x = Math.sign(this.mesh.position.x) * halfBoundary;
            this.velocity.x *= -1;
        }
        if (Math.abs(this.mesh.position.y) > halfBoundary) {
            this.mesh.position.y = Math.sign(this.mesh.position.y) * halfBoundary;
            this.velocity.y *= -1;
        }
        if (Math.abs(this.mesh.position.z) > halfBoundary) {
            this.mesh.position.z = Math.sign(this.mesh.position.z) * halfBoundary;
            this.velocity.z *= -1;
        }
    }

    dispose() {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

// --- Boundary Visualization ---
function updateBoundaryBox() {
    if (boundaryBoxHelper) {
        scene.remove(boundaryBoxHelper);
        boundaryBoxHelper.geometry.dispose();
        boundaryBoxHelper.material.dispose();
    }
    const boxGeometry = new THREE.BoxGeometry(boundarySize * 2, boundarySize * 2, boundarySize * 2);
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    boundaryBoxHelper = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
    scene.add(boundaryBoxHelper);
}

// --- Simulation Initialization/Reset ---
function resetSimulation() {
    // Clear existing cells
    cells.forEach(cell => cell.dispose());
    cells = [];

    // Update parameters from inputs
    numCells = parseInt(numCellsInput.value);
    speed = parseFloat(speedInput.value);
    boundarySize = parseFloat(boundarySizeInput.value);
    speedValueSpan.textContent = speed.toFixed(2);

    // Update boundary visualization
    updateBoundaryBox();

    // Create new cells
    for (let i = 0; i < numCells; i++) {
        cells.push(new Cell(boundarySize));
    }
}

// --- Event Listeners ---
numCellsInput.addEventListener('change', resetSimulation);
speedInput.addEventListener('input', () => {
    speed = parseFloat(speedInput.value);
    speedValueSpan.textContent = speed.toFixed(2);
    // No need to reset the whole simulation, just update speed
});
boundarySizeInput.addEventListener('change', resetSimulation);
resetButton.addEventListener('click', resetSimulation);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    // Update cells
    cells.forEach(cell => cell.update(deltaTime, speed));

    // Update controls
    controls.update();

    // Render scene
    renderer.render(scene, camera);
}

// --- Initial Setup ---
resetSimulation();
animate();
