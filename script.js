const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const toggleDark = document.getElementById('toggle-dark');
const modeToggle = document.getElementById('mode-toggle');

let boardState = Array(9).fill('');
let currentPlayer = 'X';
let isGameActive = true;
let aiEnabled = true;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (boardState[index] !== '' || !isGameActive) return;

  updateCell(index, currentPlayer);
  animateClick(e.target);

  if (checkWinner(boardState, currentPlayer)) {
    showMessage(`${currentPlayer} wins!`);
    isGameActive = false;
    celebrateWin();
    return;
  }

  if (isDraw()) {
    showMessage("It's a draw!");
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  showMessage(`${currentPlayer}'s turn`);

  if (aiEnabled && currentPlayer === 'O') {
    const bestMove = getBestMove();
    updateCell(bestMove, currentPlayer);
    animateClick(cells[bestMove]);

    if (checkWinner(boardState, currentPlayer)) {
      showMessage(`${currentPlayer} wins!`);
      isGameActive = false;
      celebrateWin();
      return;
    }

    if (isDraw()) {
      showMessage("It's a draw!");
      isGameActive = false;
      return;
    }

    currentPlayer = 'X';
    showMessage("X's turn");
  }
}

function updateCell(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;
}

function animateClick(cell) {
  gsap.fromTo(cell, {scale: 0, rotation: 0}, {scale: 1.2, rotation: 360, duration: 0.5, ease: "elastic.out(1, 0.5)"});
  gsap.to(cell, {scale: 1, duration: 0.2, delay: 0.5});
}

function showMessage(msg) {
  statusText.textContent = msg;
  gsap.fromTo(statusText, {opacity: 0, y: -20}, {opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)"});
}

function celebrateWin() {
  gsap.fromTo(board, {scale: 1}, {scale: 1.05, duration: 0.3, yoyo: true, repeat: 1});
}

function isDraw() {
  return boardState.every(cell => cell !== '');
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === '') {
      boardState[i] = 'O';
      let score = minimax(boardState, 0, false);
      boardState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMax) {
  if (checkWinner(board, 'O')) return 10 - depth;
  if (checkWinner(board, 'X')) return depth - 10;
  if (board.every(c => c !== '')) return 0;

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

function checkWinner(board, player) {
  return winningCombinations.some(combo => combo.every(i => board[i] === player));
}

function resetGame() {
  boardState = Array(9).fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    gsap.fromTo(cell, {scale: 0}, {scale: 1, duration: 0.4, ease: "back.out(1.7)"});
  });
  currentPlayer = 'X';
  isGameActive = true;
  showMessage("X's turn");
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  gsap.fromTo('body', {opacity: 0.7}, {opacity: 1, duration: 0.5});
}

function toggleMode() {
  aiEnabled = !aiEnabled;
  modeToggle.textContent = aiEnabled ? "Play without AI" : " Play with AI";
  resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
toggleDark.addEventListener('click', toggleDarkMode);
modeToggle.addEventListener('click', toggleMode);

// Bubble Generator
const bubbleContainer = document.querySelector('.bubbles');
for (let i = 0; i < 30; i++) {
  const bubble = document.createElement('span');
  const size = Math.random() * 80 + 20 + 'px';
  bubble.style.width = size;
  bubble.style.height = size;
  bubble.style.top = Math.random() * 100 + '%';
  bubble.style.left = Math.random() * 100 + '%';
  bubble.style.background = `linear-gradient(45deg, hsl(${Math.random()*360}, 70%, 60%), hsl(${Math.random()*360}, 70%, 70%))`;
  bubbleContainer.appendChild(bubble);

  gsap.to(bubble, {
    y: Math.random() * 100 - 50,
    x: Math.random() * 100 - 50,
    scale: Math.random() * 0.5 + 0.8,
    duration: Math.random() * 10 + 5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });
}
