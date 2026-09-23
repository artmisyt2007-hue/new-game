const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const healthText = document.getElementById("health");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

let score = 0;
let health = 100;
let gameRunning = true;

const keys = {};

const player = {
    x: 0,
    y: 0,
    size: 25,
    speed: 5
};

let bullets = [];
let enemies = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (player.x === 0) {
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
    }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


// --------------------
// Keyboard
// --------------------

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        shoot();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


// --------------------
// Mouse Shooting
// --------------------

canvas.addEventListener("mousedown", () => {
    shoot();
});


// --------------------
// Player
// --------------------

function updatePlayer() {

    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    player.x = Math.max(
        player.size,
        Math.min(canvas.width - player.size, player.x)
    );

    player.y = Math.max(
        player.size + 50,
        Math.min(canvas.height - player.size, player.y)
    );
}


// --------------------
// Shooting
// --------------------

function shoot() {

    if (!gameRunning) return;

    bullets.push({
        x: player.x,
        y: player.y - 20,
        speed: 9,
        radius: 5
    });
}


// --------------------
// Create Enemy
// --------------------

function createEnemy() {

    if (!gameRunning) return;

    enemies.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -30,
        size: 20,
        speed: 1.5 + Math.random() * 2
    });
}

setInterval(createEnemy, 900);


// --------------------
// Update Bullets
// --------------------

function updateBullets() {

    bullets.forEach((bullet, index) => {

        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}


// --------------------
// Update Enemies
// --------------------

function updateEnemies() {

    enemies.forEach((enemy, enemyIndex) => {

        enemy.y += enemy.speed;

        // Enemy reaches player
        if (enemy.y > canvas.height) {

            enemies.splice(enemyIndex, 1);

            health -= 10;
            healthText.textContent = health;

            if (health <= 0) {
                endGame();
            }
        }
    });
}


// --------------------
// Collision Detection
// --------------------

function checkCollisions() {

    bullets.forEach((bullet, bulletIndex) => {

        enemies.forEach((enemy, enemyIndex) => {

            const distance = Math.hypot(
                bullet.x - enemy.x,
                bullet.y - enemy.y
            );

            if (distance < enemy.size + bullet.radius) {

                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);

                score += 10;
                scoreText.textContent = score;
            }
        });
    });
}


// --------------------
// Drawing Player
// --------------------

function drawPlayer() {

    ctx.save();

    ctx.translate(player.x, player.y);

    // Body
    ctx.fillStyle = "#3498db";
    ctx.fillRect(-15, -15, 30, 30);

    // Gun
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-4, -28, 8, 15);

    ctx.restore();
}


// --------------------
// Drawing Bullets
// --------------------

function drawBullets() {

    bullets.forEach((bullet) => {

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffd700";
        ctx.fill();
    });
}


// --------------------
// Drawing Enemies
// --------------------

function drawEnemies() {

    enemies.forEach((enemy) => {

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#e74c3c";
        ctx.fill();

        ctx.fillStyle = "#111";

        ctx.beginPath();
        ctx.arc(
            enemy.x - 7,
            enemy.y - 4,
            3,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
            enemy.x + 7,
            enemy.y - 4,
            3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}


// --------------------
// Game Over
// --------------------

function endGame() {

    gameRunning = false;

    finalScore.textContent = score;
    gameOverScreen.style.display = "block";
}


// --------------------
// Restart
// --------------------

function restartGame() {

    score = 0;
    health = 100;

    scoreText.textContent = score;
    healthText.textContent = health;

    bullets = [];
    enemies = [];

    player.x = canvas.width / 2;
    player.y = canvas.height - 100;

    gameRunning = true;

    gameOverScreen.style.display = "none";

    gameLoop();
}


// --------------------
// Main Game Loop
// --------------------

function gameLoop() {

    if (!gameRunning) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    updatePlayer();
    updateBullets();
    updateEnemies();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(gameLoop);
}

gameLoop();
