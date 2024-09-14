const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas dimensions (fullscreen)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let birdX = canvas.width / 4;
let birdY = canvas.height / 2;
let birdRadius = 20;
let birdVelocity = 0;
let gravity = 0.5;

let pipes = [];
let pipeWidth = 100;
let pipeGap = birdRadius * 8 + Math.random() * birdRadius; // Adjusted gap size for pipes
let pipeSpeed = 3;

let score = 0;
let isGameOver = false;

// Sprites
const birdImage = new Image();
birdImage.src = "sprites/bird.png";

const pipeUpImage = new Image();
pipeUpImage.src = "sprites/pipe-up.png";

const pipeDownImage = new Image();
pipeDownImage.src = "sprites/pipe-down.png";

// Start Screen elements
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");
const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");

// Show Start Screen
function showStartScreen() {
    startScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'none';
}

// Start the game
playButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    init(); // Initialize the game state
    draw(); // Start the game loop
});

// Game Over Screen
function showGameOverScreen() {
    gameOverScreen.style.display = "flex";
    finalScoreText.textContent = score;
}

// Restart the game
restartButton.addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    canvas.style.display = "block";
    init();
    draw();
});

// Initialize game state
function init() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    addPipe();
}

// Add a new pipe
function addPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
    pipeGap = birdRadius * 8 + Math.random() * birdRadius; // Set pipe gap 8x the bird's radius
    pipes.push({
        x: canvas.width,
        y: pipeHeight
    });
}

// Check for collisions
function checkCollision(pipe) {
    if (
        birdX + birdRadius > pipe.x &&
        birdX - birdRadius < pipe.x + pipeWidth &&
        (birdY - birdRadius < pipe.y || birdY + birdRadius > pipe.y + pipeGap)
    ) {
        return true;
    }
    return false;
}

// Update game state
function update() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            addPipe();
            score++;
        }

        if (checkCollision(pipe)) {
            isGameOver = true;
        }
    });

    // Check if bird hits the top or bottom of the screen
    if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
        isGameOver = true;
    }
}

// Draw bird and pipes
function draw() {
    if (isGameOver) {
        showGameOverScreen();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImage, birdX - birdRadius, birdY - birdRadius, birdRadius * 2, birdRadius * 2);

    // Draw pipes
    pipes.forEach((pipe) => {
        // Pipe up
        ctx.drawImage(pipeUpImage, pipe.x, 0, pipeWidth, pipe.y);
        // Pipe down
        ctx.drawImage(pipeDownImage, pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));
    });

    // Draw score
    ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 50);

    update();
    requestAnimationFrame(draw);
}

// Handle bird jump on space or click
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        birdVelocity = -10;
    }
});

canvas.addEventListener("click", () => {
    birdVelocity = -10;
});

// Start the game
showStartScreen();