import wordList from '/words.js';

const maxAttempts = 6;
let currentAttempt = 0;
let gameOver = false;

// Select random word from imported list
const targetWord = wordList[Math.floor(Math.random() * wordList.length)];

// Initialize game board
const gameBoard = document.getElementById('game-board');
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-button');
const messageElement = document.getElementById('message');

// Create board cells
for (let i = 0; i < maxAttempts; i++) {
    for (let j = 0; j < 5; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameBoard.appendChild(cell);
    }
}

function updateBoard(guess, rowIndex) {
    const cells = gameBoard.children;
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: Mark correct letters
    guessLetters.forEach((letter, index) => {
        const cell = cells[rowIndex * 5 + index];
        cell.textContent = letter;
        
        if (letter === targetLetters[index]) {
            cell.className = 'cell correct';
            targetLetters[index] = null;
        }
    });
    
    // Second pass: Mark present and absent letters
    guessLetters.forEach((letter, index) => {
        const cell = cells[rowIndex * 5 + index];
        if (cell.className === 'cell correct') return;
        
        const letterPosition = targetLetters.indexOf(letter);
        if (letterPosition !== -1) {
            cell.className = 'cell present';
            targetLetters[letterPosition] = null;
        } else {
            cell.className = 'cell absent';
        }
    });
}

function checkWin(guess) {
    if (guess === targetWord) {
        messageElement.textContent = "Congratulations! You guessed the word!";
        endGame();
        return true;
    }
    return false;
}

function endGame() {
    gameOver = true;
    guessInput.disabled = true;
    submitButton.disabled = true;
}

submitButton.addEventListener('click', () => {
    const guess = guessInput.value.toLowerCase();
    
    if (guess.length !== 5) {
        messageElement.textContent = "Please enter a 5-letter word";
        return;
    }

    updateBoard(guess, currentAttempt);
    
    if (!checkWin(guess)) {
        currentAttempt++;
        if (currentAttempt >= maxAttempts) {
            messageElement.textContent = `Game over, the word was "${targetWord}"`;
            endGame();
        }
    }
    
    guessInput.value = '';
    guessInput.focus();
});

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitButton.click();
    }
});