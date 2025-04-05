document.addEventListener('DOMContentLoaded', () => {
  let currentPlayer = 'X';
  let gameBoard = Array(9).fill('');
  let isGameOver = false;
  let playerXName = 'Player X';
  let playerOName = 'Player O';
  let scoreX = parseInt(localStorage.getItem('scoreX')) || 0;
  let scoreO = parseInt(localStorage.getItem('scoreO')) || 0;
  let isSinglePlayer = true;
  let aiDifficulty = 'hard'; // 'easy' or 'hard'

  // Select Elements
  const board = document.querySelector('.board');
  const statusElement = document.getElementById('status');
  const gameButton = document.getElementById('gameButton');
  const playerXInput = document.getElementById('playerX');
  const playerOInput = document.getElementById('playerO');
  const scoreXElement = document.getElementById('scoreX');
  const scoreOElement = document.getElementById('scoreO');
  const aiToggle = document.getElementById('aiToggle');
  const toggleBtn = document.querySelector('.dark-mode-toggle');
  const resetBtn = document.getElementById('resetBtn');
  const difficultySelect = document.getElementById('difficultySelect');

  const winSound = new Audio('win.mp3');
  const clickSound = new Audio('click.mp3');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const icon = toggleBtn.querySelector('i');
      icon.classList.toggle('fa-sun');
      icon.classList.toggle('fa-moon');
    });
  }

  playerXInput.addEventListener('input', updatePlayerNames);
  playerOInput.addEventListener('input', updatePlayerNames);
  gameButton.addEventListener('click', startOrRestartGame);
  aiToggle.addEventListener('change', () => {
    isSinglePlayer = aiToggle.checked;
    updatePlayerNames();
    startOrRestartGame();
  });

  difficultySelect.addEventListener('change', () => {
    aiDifficulty = difficultySelect.value;
  });

  resetBtn?.addEventListener('click', () => {
    scoreX = scoreO = 0;
    localStorage.setItem('scoreX', '0');
    localStorage.setItem('scoreO', '0');
    updateScoreboard();
    startOrRestartGame();
  });

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

  function updatePlayerNames() {
    playerXName = playerXInput.value.trim() || 'Player X';
    playerOName = isSinglePlayer ? 'AI' : (playerOInput.value.trim() || 'Player O');
    updateStatus(`Turn: ${currentPlayer === 'X' ? playerXName : playerOName}`);
    document.querySelector('.score-x-label').innerText = `${playerXName}:`;
    document.querySelector('.score-o-label').innerText = `${playerOName}:`;
    updateScoreboard();
  }

  function updateScoreboard() {
    scoreXElement.innerText = scoreX;
    scoreOElement.innerText = scoreO;
  }

  function handleClick(e) {
    if (isGameOver) return;
    const index = e.target.dataset.index;
    if (gameBoard[index] !== '') return;

    makeMove(index);

    if (!isGameOver) {
      switchPlayer();
      if (isSinglePlayer && currentPlayer === 'O') {
        setTimeout(aiMove, 300);
      }
    }
  }

  function makeMove(index) {
    gameBoard[index] = currentPlayer;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase(), 'bounce');
    clickSound.play();
    checkWinner();
  }

  function aiMove() {
    if (aiDifficulty === 'easy') {
      const empty = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
      if (empty.length) {
        makeMove(empty[Math.floor(Math.random() * empty.length)]);
        switchPlayer();
      }
    } else {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
          gameBoard[i] = 'O';
          const score = minimax(gameBoard, 0, false);
          gameBoard[i] = '';
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      makeMove(move);
      if (!isGameOver) switchPlayer();
    }
  }

  function minimax(board, depth, isMax) {
    const result = evaluateBoard();
    if (result !== null) return result;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = '';
        }
      }
      return best;
    }
  }

  function evaluateBoard() {
    const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (const [a,b,c] of wins) {
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        return gameBoard[a] === 'O' ? 10 : -10;
      }
    }
    if (!gameBoard.includes('')) return 0;
    return null;
  }

  function checkWinner() {
    const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (const [a,b,c] of wins) {
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        isGameOver = true;
        highlightWinningCells([a,b,c]);
        winSound.play();
        updateStatus(`${currentPlayer === 'X' ? playerXName : playerOName} Wins! 🎉`);
        updateScore();
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

  function updateScore() {
    if (currentPlayer === 'X') {
      scoreX++;
      localStorage.setItem('scoreX', scoreX);
    } else {
      scoreO++;
      localStorage.setItem('scoreO', scoreO);
    }
    updateScoreboard();
  }

  function highlightWinningCells(cells) {
    cells.forEach(i => {
      document.querySelector(`.cell[data-index='${i}']`).classList.add('winning-cell');
    });
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Turn: ${currentPlayer === 'X' ? playerXName : playerOName}`);
  }

  function updateStatus(msg) {
    statusElement.innerText = msg;
  }

  function startOrRestartGame() {
    isGameOver = false;
    currentPlayer = 'X';
    gameButton.innerText = 'Restart Game';
    createBoard();
    updatePlayerNames();
  }

  // Init
  createBoard();
  updatePlayerNames();
});
