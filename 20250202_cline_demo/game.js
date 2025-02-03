const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
// Set canvas size accounting for device pixel ratio
const dpr = window.devicePixelRatio || 1;
canvas.style.width = canvas.width + 'px';
canvas.style.height = canvas.height + 'px';
canvas.width *= dpr;
canvas.height *= dpr;
ctx.scale(dpr, dpr);
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Tetromino shapes and colors
const SHAPES = {
    I: [[1,1,1,1]], 
    J: [[1,0,0],[1,1,1]],
    L: [[0,0,1],[1,1,1]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0]],
    T: [[0,1,0],[1,1,1]],
    Z: [[1,1,0],[0,1,1]]
};

const COLORS = {
    I: '#00f0f0', J: '#0000f0', L: '#f0a000',
    O: '#f0f000', S: '#00f000', T: '#a000f0', Z: '#f00000'
};

let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece = null;
let score = 0;
let gameLoop = null;

function createPiece() {
    const types = Object.keys(SHAPES);
    const type = types[Math.floor(Math.random() * types.length)];
    return {
        shape: SHAPES[type],
        color: COLORS[type],
        x: Math.floor(BOARD_WIDTH/2) - Math.floor(SHAPES[type][0].length/2),
        y: 0
    };
}

function drawBoard() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let y = 0; y < BOARD_HEIGHT; y++) {
        for(let x = 0; x < BOARD_WIDTH; x++) {
            if(board[y][x]) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1);
            }
        }
    }
}

function drawPiece() {
    ctx.fillStyle = currentPiece.color;
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value) {
                ctx.fillRect(
                    (currentPiece.x + x) * BLOCK_SIZE,
                    (currentPiece.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE-1, BLOCK_SIZE-1
                );
            }
        });
    });
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    if (!collision(0, 0, rotated)) {
        currentPiece.shape = rotated;
    }
}

function collision(offsetX, offsetY, shape = currentPiece.shape) {
    return shape.some((row, y) => 
        row.some((value, x) => {
            const newX = currentPiece.x + x + offsetX;
            const newY = currentPiece.y + y + offsetY;
            return value && (newX < 0 || newX >= BOARD_WIDTH || 
                            newY >= BOARD_HEIGHT ||
                            (newY >= 0 && board[newY][newX]));
        })
    );
}

function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value) {
                const newY = currentPiece.y + y;
                if (newY >= 0 && newY < BOARD_HEIGHT) {
                    board[newY][currentPiece.x + x] = currentPiece.color;
                }
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    for(let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if(board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++; // Recheck same row index after splice
        }
    }
    
    if(linesCleared > 0) {
        score += linesCleared * 100;
        document.getElementById('score').textContent = `Score: ${score}`;
    }
}

function gameStep() {
    currentPiece.y++;
    if(collision(0, 1)) {
        currentPiece.y--; // Move back to valid position
        mergePiece();
        clearLines();
        currentPiece = createPiece();
        if(collision(0, 0)) {
            clearInterval(gameLoop);
            alert(`Game Over! Score: ${score}`);
            return;
        }
    }
    drawBoard();
    drawPiece();
}

document.addEventListener('keydown', event => {
    switch(event.key) {
        case 'ArrowLeft':
            if(!collision(-1, 0)) currentPiece.x--;
            break;
        case 'ArrowRight':
            if(!collision(1, 0)) currentPiece.x++;
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case 'ArrowDown':
            if(!collision(0, 1)) currentPiece.y++;
            break;
        case ' ':
            while(!collision(0, 1)) currentPiece.y++;
            gameStep();
            break;
    }
    drawBoard();
    drawPiece();
});

function startGame() {
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    currentPiece = createPiece();
    if(gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, 1000);
}

startGame();
