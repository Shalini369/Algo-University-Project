// Elements
const net = document.getElementById('net');
net.style.top = "250px";
net.style.left = "100px";
const scoreDisplay = document.getElementById('score');
const message = document.getElementById('message');

const netHitbox = document.createElement('div');
netHitbox.classList.add('hitbox');
netHitbox.style.top = "20px";    // adjust as needed
netHitbox.style.left = "10px";
netHitbox.style.width = "100px";
netHitbox.style.height = "100px";   // adjust to cover the net hoop

net.appendChild(netHitbox);

// Game state
let netTop = 250;
let netLeft = 50;
let gravity = 2;
let isGameOver = false;
let score = 0;
let spawnInterval = null;

function background(){
    
}
// Initialize game
function initializeGame() {
    netTop = 250;
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    net.style.top = netTop + "px";
    message.style.display = "none";

    // Remove old butterflies
    document.querySelectorAll(".bfly").forEach(f => f.remove());

    document.removeEventListener("keydown", jump);
    document.addEventListener("keydown", jump);

    // Spawn butterflies every 2s
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnBfly, 3500);
}

// Jump
function jump() {
    if (!isGameOver) {
        netTop -= 50;
        if (netTop < 0) netTop = 0;
        net.style.top = netTop + "px";
    }
}

// Gravity
function applyGravity() {
    if (!isGameOver) {
        netTop += gravity;
        net.style.top = netTop + "px";

        if (netTop >= window.innerHeight - net.offsetHeight) {
            gameOver();
        }
    }
}

// Spawn butterfly at random height
function spawnBfly() {
    const bfly = document.createElement("div");
    bfly.classList.add("bfly");

     const bflyHitbox = document.createElement("div");
    bflyHitbox.classList.add("hitbox");
    bflyHitbox.style.top = "30px";      // adjust as needed
    bflyHitbox.style.left = "10px";
    bflyHitbox.style.width = "70px";
    bflyHitbox.style.height = "50px";
    bfly.appendChild(bflyHitbox);
    const min = 100;
    const max = window.innerHeight/2
    const randomTop = Math.floor(Math.random() * (max-min)+min);
    bfly.style.top = randomTop + "px";
    bfly.style.left = window.innerWidth +"px"; // start from right edge
    document.body.appendChild(bfly);
}

// Move butterflies
function moveBflies() {
    const bflies = document.querySelectorAll(".bfly");

    bflies.forEach(bfly => {
        let flyLeft = parseInt(bfly.style.left);

        if (flyLeft > -60) {
            bfly.style.left = (flyLeft - 3) + "px"; // move left
        } else {
            bfly.remove(); // remove off-screen
            gameOver(); // missed butterfly = game over
        }
    });
}

// Collision detection
function detectCollision() {
    const netHitbox = document.querySelector("#net .hitbox");
    const butterflies = document.querySelectorAll(".bfly");

    const netRect = netHitbox.getBoundingClientRect();

    butterflies.forEach(bfly => {
    const bflyHitbox = bfly.querySelector(".hitbox");
    const bflyRect = bflyHitbox.getBoundingClientRect();

        if (
            netRect.left < bflyRect.right &&
            netRect.right > bflyRect.left &&
            netRect.top < bflyRect.bottom &&
            netRect.bottom > bflyRect.top
        ) {
            // Touch success
            score++;
            scoreDisplay.textContent = "Score: " + score;
            bfly.remove();
        }
    });
}

// Game over
function gameOver() {
    if (isGameOver) return;
    isGameOver = true;

    clearInterval(spawnInterval);
    document.querySelectorAll(".bfly").forEach(f => f.remove());

    message.textContent = "Game Over! Final Score: " + score + " (Press any key to restart)";
    message.style.display = "block";

    document.removeEventListener("keydown", jump);

    document.addEventListener("keydown", () => {
        initializeGame();
        gameLoop();
    }, { once: true });
}

// Game loop
function gameLoop() {
    if (!isGameOver) {
        applyGravity();
        moveBflies();
        detectCollision();
        requestAnimationFrame(gameLoop);
    }
}

// Start game
document.addEventListener("DOMContentLoaded", function () {
    message.textContent = "Press any key to start";
    message.style.display = "block";

    document.addEventListener("keydown", () => {
        initializeGame();
        gameLoop();
    }, { once: true });
});
