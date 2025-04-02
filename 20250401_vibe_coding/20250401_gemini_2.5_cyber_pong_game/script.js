const ball = document.getElementById('ball');
const playerPaddle = document.getElementById('player-paddle');
const computerPaddle = document.getElementById('computer-paddle');
const playerScoreElem = document.getElementById('player-score');
const computerScoreElem = document.getElementById('computer-score');
const gameBoard = document.querySelector('.game-board');

const boardRect = gameBoard.getBoundingClientRect();

let playerScore = 0;
let computerScore = 0;

const initialBallSpeed = 5;
let ballSpeedX = initialBallSpeed;
let ballSpeedY = initialBallSpeed;
let computerPaddleSpeed = 4; // Adjust for difficulty

// Ball position
let ballX = boardRect.width / 2;
let ballY = boardRect.height / 2;

// --- Game Loop ---
let lastTime;
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime;
        moveBall(delta);
        moveComputerPaddle(delta);
        checkCollisions();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}

// --- Ball Movement ---
function moveBall(delta) {
    ballX += ballSpeedX * (delta / 16); // Normalize speed based on typical frame time
    ballY += ballSpeedY * (delta / 16);

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

// --- Player Paddle Movement ---
gameBoard.addEventListener('mousemove', e => {
    // Calculate paddle top relative to the game board
    const playerPaddleRect = playerPaddle.getBoundingClientRect();
    let newTop = e.clientY - boardRect.top - playerPaddleRect.height / 2;

    // Clamp paddle position within bounds
    newTop = Math.max(0, Math.min(newTop, boardRect.height - playerPaddleRect.height));
    playerPaddle.style.top = `${newTop}px`;
});

// --- Computer Paddle Movement (Simple AI) ---
function moveComputerPaddle(delta) {
    const computerPaddleRect = computerPaddle.getBoundingClientRect();
    const computerPaddleCenter = computerPaddleRect.top + computerPaddleRect.height / 2;
    const ballRect = ball.getBoundingClientRect();
    const ballCenter = ballRect.top + ballRect.height / 2;

    let targetY = computerPaddleRect.top - boardRect.top; // Current top relative to board

    if (computerPaddleCenter < ballCenter - 10) { // Move down if ball is lower
        targetY += computerPaddleSpeed * (delta / 16);
    } else if (computerPaddleCenter > ballCenter + 10) { // Move up if ball is higher
        targetY -= computerPaddleSpeed * (delta / 16);
    }

    // Clamp paddle position within bounds
    targetY = Math.max(0, Math.min(targetY, boardRect.height - computerPaddleRect.height));
    computerPaddle.style.top = `${targetY}px`;
}


// --- Collision Detection ---
function checkCollisions() {
    const ballRect = ball.getBoundingClientRect();
    const playerPaddleRect = playerPaddle.getBoundingClientRect();
    const computerPaddleRect = computerPaddle.getBoundingClientRect();

    // Collision with top/bottom walls
    if (ballRect.bottom >= boardRect.bottom || ballRect.top <= boardRect.top) {
        ballSpeedY *= -1;
         // Prevent sticking to wall
        if (ballRect.bottom >= boardRect.bottom) ballY = boardRect.height - ballRect.height;
        if (ballRect.top <= boardRect.top) ballY = 0;
    }

    // Collision with paddles
    if (isCollision(ballRect, playerPaddleRect) || isCollision(ballRect, computerPaddleRect)) {
        ballSpeedX *= -1;
        // Optional: Increase speed slightly on paddle hit
        // ballSpeedX *= 1.05;
        // ballSpeedY *= 1.05;

        // Move ball slightly away from paddle to prevent sticking
        if (isCollision(ballRect, playerPaddleRect)) {
            ballX = playerPaddleRect.right - boardRect.left;
        } else {
            ballX = computerPaddleRect.left - boardRect.left - ballRect.width;
        }

    }

    // Collision with left/right walls (scoring)
    if (ballRect.right >= boardRect.right) {
        // Player scores
        playerScore++;
        playerScoreElem.textContent = playerScore;
        resetBall();
    } else if (ballRect.left <= boardRect.left) {
        // Computer scores
        computerScore++;
        computerScoreElem.textContent = computerScore;
        resetBall();
    }
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// --- Reset Ball ---
function resetBall() {
    ballX = boardRect.width / 2;
    ballY = boardRect.height / 2;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Randomize initial direction after score
    ballSpeedX = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = initialBallSpeed * (Math.random() * 2 - 1); // Random angle between -1 and 1
    // Ensure it's not too vertical
    if (Math.abs(ballSpeedY) < 0.2) {
        ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 0.3;
    }
}

// --- Start Game ---
resetBall(); // Initial setup
window.requestAnimationFrame(update);
