const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird, pipes, frame, score, gameOver, birdImage, pipeUpImage, pipeDownImage, waitingForRestart;

// Initialize game state
function init() {
    resizeCanvas(); // Set the initial canvas size
    bird = { x: 50, y: 150, width: 30, height: 30, gravity: 0.6, lift: 12, velocity: 0 };
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    waitingForRestart = false;

    // Load bird image
    birdImage = new Image();
    birdImage.src = 'sprites/bird.png'; // Path to the bird image

    // Load pipe images
    pipeUpImage = new Image();
    pipeUpImage.src = 'sprites/pipe-up.png'; // Path to the top pipe image

    pipeDownImage = new Image();
    pipeDownImage.src = 'sprites/pipe-down.png'; // Path to the bottom pipe image
}

// Handle bird flap or restart the game
function flapOrRestart() {
    if (!gameOver) {
        bird.velocity = -bird.lift;
    } else if (waitingForRestart) {
        init(); // Restart game on key press or click after game over
    }
}

// Resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Event listeners for flap or restarting and window resizing
document.addEventListener('keydown', flapOrRestart);
document.addEventListener('click', flapOrRestart);
document.addEventListener('touchstart', flapOrRestart);
window.addEventListener('resize', resizeCanvas); // Resize the canvas when the window is resized

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bird image
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Draw and update pipes
    if (frame % 80 === 0) { // Adjust frequency if needed
        let pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 30; // More varied height
        let pipeGap = bird.height * 5 + Math.floor(Math.random() * 40) - 20; // Gap is around five times the bird's height with a bit of randomness (130 to 170 pixels)
        let pipeWidth = 50; // Pipe width (adjust to match your images)
        pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: pipeHeight, type: 'up' }); // Top pipe
        pipes.push({ x: canvas.width, y: pipeHeight + pipeGap, width: pipeWidth, height: canvas.height - pipeHeight - pipeGap, type: 'down' }); // Bottom pipe
    }
    pipes.forEach((pipe, index) => {
        pipe.x -= 3; // Pipe speed

        // Draw pipe images
        if (pipe.type === 'up') {
            ctx.drawImage(pipeUpImage, pipe.x, pipe.y + pipe.height - pipeUpImage.height, pipe.width, pipeUpImage.height);
        } else {
            ctx.drawImage(pipeDownImage, pipe.x, pipe.y, pipe.width, pipeDownImage.height);
        }

        // Check for collisions with bird
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameOver = true;
            waitingForRestart = true;
        }

        // Remove off-screen pipes and update score
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            if (index % 2 === 0) score++;
        }
    });

    // Check if bird hits the ground or the top of the canvas
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
        waitingForRestart = true;
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Handle game over
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '15px Arial';
        ctx.fillText('Press any key or click to restart', canvas.width / 2 - 100, canvas.height / 2 + 30);
        return;
    }

    frame++;
    requestAnimationFrame(draw);
}

// Start the game
init();
draw();
