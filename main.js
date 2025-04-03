// Game State Variables
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let isGameOver = false;
let playerXName = 'Player X';
let playerOName = 'Player O';
let scoreX = 0;
let scoreO = 0;

// Select Elements
const board = document.querySelector('.board');
const statusElement = document.getElementById('status');
const gameButton = document.getElementById('gameButton');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreboardXLabel = document.querySelector('.scoreboard .score-x-label');
const scoreboardOLabel = document.querySelector('.scoreboard .score-o-label');

// Sounds
const winSound = new Audio('win.mp3'); 
const clickSound = new Audio('click.mp3'); 

// Event Listeners
playerXInput.addEventListener('input', updatePlayerNames);
playerOInput.addEventListener('input', updatePlayerNames);
gameButton.addEventListener('click', startOrRestartGame);

// Dynamic Board Creation
function createBoard() {
    board.innerHTML = ''; 
    gameBoard = Array(9).fill('');
    isGameOver = false;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
}

// Update player names dynamically
function updatePlayerNames() {
    playerXName = playerXInput.value.trim() || 'Player X';
    playerOName = playerOInput.value.trim() || 'Player O';

    // Update Status
    updateStatus(`Current Turn: ${currentPlayer === 'X' ? playerXName : playerOName}`);

    // Update Scoreboard Labels
    document.querySelector('.score-x-label').innerText = `${playerXName}:`;
    document.querySelector('.score-o-label').innerText = `${playerOName}:`;

    // Also update scores if already displayed
    updateScoreboard();
}

// Update the scoreboard dynamically
function updateScoreboard() {
    document.getElementById('scoreX').innerText = scoreX;
    document.getElementById('scoreO').innerText = scoreO;
}


// Handle cell clicks
function handleClick(event) {
    if (isGameOver) return;

    const index = event.target.dataset.index;
    if (gameBoard[index] !== '') return; // Prevent clicking the same cell twice

    clickSound.play();

    gameBoard[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    event.target.classList.add(`player-${currentPlayer.toLowerCase()}`, 'bounce');

    checkWinner();
    if (!isGameOver) switchPlayer();
}

// Check for a winner or draw
function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            isGameOver = true;
            highlightWinningCells(condition);
            winSound.play();
            updateStatus(`${currentPlayer === 'X' ? playerXName : playerOName} Wins! 🎉`);
            updateScore(); // Update Scoreboard
            gameButton.innerText = 'Restart Game';
            return;
        }
    }

    if (!gameBoard.includes('')) {
        isGameOver = true;
        updateStatus("It's a Draw! 🤝");
        gameButton.innerText = 'Restart Game';
    }
}

// Update Scoreboard
function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.innerText = scoreX;
    } else {
        scoreO++;
        scoreOElement.innerText = scoreO;
    }
}

// Highlight winning cells
function highlightWinningCells(cellsIndexes) {
    cellsIndexes.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
    });
}

// Switch player turn
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Current Turn: ${currentPlayer === 'X' ? playerXName : playerOName}`);
}

// Update status message dynamically
function updateStatus(message) {
    statusElement.innerText = message;
}

// Start or Restart Game
function startOrRestartGame() {
    isGameOver = false;
    currentPlayer = 'X';
    gameButton.innerText = 'Restart Game';
    createBoard();
    updatePlayerNames(); // Keep names updated
}

// Initialize game on page load
createBoard();
updatePlayerNames(); // Ensure names appear on the scoreboard at start
