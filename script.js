const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status p');
const resetButton = document.querySelector('.reset-btn');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const checkWinner = () => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      statusText.textContent = `Player ${currentPlayer} wins!`;
      return;
    }
  }

  if (!board.includes('')) {
    gameActive = false;
    statusText.textContent = 'It\'s a tie!';
  }
};

const handleCellClick = (event) => {
  const index = event.target.dataset.index;

  if (board[index] || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  checkWinner();

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if (gameActive) {
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
};

const resetGame = () => {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  cells.forEach(cell => cell.textContent = '');
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
