// src/index.js

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');

    startButton.addEventListener('click', () => {
        startFireworks(ctx);
    });
});

function startFireworks(ctx) {
    // Import the fireworks logic
    import('./fireworks.js').then(module => {
        module.animateFireworks(ctx);
    });
}