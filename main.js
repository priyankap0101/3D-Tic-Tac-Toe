let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let scoreX = 0;
let scoreO = 0;
let timeLeft = 60;
let interval;
let darkMode = false;

const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const timerElement = document.getElementById('timer');
const progressElement = document.getElementById('progress');

function handleClick(event) {
    const index = Array.from(cells).indexOf(event.target);

    // Prevent clicks after the game is over or if cell is already filled
    if (gameBoard[index] !== '' || isGameOver) return;

    // Mark the cell and update the board
    gameBoard[index] = currentPlayer;
    updateCell(index);
    checkWinner();
    switchPlayer();
}

function updateCell(index) {
    const cell = cells[index];
    cell.innerText = currentPlayer;
    cell.classList.add(`player-${currentPlayer.toLowerCase()}`);
    // Disable further clicks on this cell
    cell.classList.add('disabled');
    cell.setAttribute('aria-disabled', 'true');
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            isGameOver = true;
            markWinningCells([a, b, c]);
            updateStatus(`Player ${currentPlayer} wins!`);
            updateScore();
            clearInterval(interval);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        isGameOver = true;
        updateStatus('It\'s a Draw!');
        clearInterval(interval);
    }
}

function markWinningCells(cells) {
    cells.forEach(index => {
        const cell = document.querySelectorAll('.cell')[index];
        cell.classList.add('winning-cell');
    });
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Current Turn: ${currentPlayer}`);
    document.body.classList.toggle('pulse', currentPlayer === 'X'); // Pulse effect on current player
}

function restartGame() {
    if (!confirm('Are you sure you want to restart the game?')) return;

    // Reset game state
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    currentPlayer = Math.random() < 0.5 ? 'X' : 'O'; // Randomly choose who starts
    timeLeft = 60;

    // Clear previous game state from UI
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('player-x', 'player-o', 'winning-cell', 'disabled');
        cell.setAttribute('aria-disabled', 'false');
    });

    updateStatus(`Current Turn: ${currentPlayer}`);
    clearInterval(interval);
    startTimer();
}

function updateStatus(message) {
    statusElement.innerText = message;
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.innerText = scoreX;
    } else {
        scoreO++;
        scoreOElement.innerText = scoreO;
    }
}

function startTimer() {
    interval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Time Left: ${timeLeft}s`;
        progressElement.style.width = `${(timeLeft / 60) * 100}%`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            isGameOver = true;
            updateStatus('Time is up! It\'s a Draw!');
        }
    }, 1000);
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    cells.forEach(cell => {
        cell.classList.toggle('dark-mode-cell', darkMode);
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});
