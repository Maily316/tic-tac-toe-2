const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const message = document.getElementById('message');
const savedGamesContainer = document.getElementById('savedGames');

let currentPlayer = 'X'; // Inicia con el jugador X
let boardState = ['', '', '', '', '', '', '', '', '']; // Estado del tablero
let gameId = 0;

// Inicializa el tablero
function initBoard() {
    board.innerHTML = ''; // Limpiar el tablero
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
    boardState = ['', '', '', '', '', '', '', '', '']; // Reinicia el estado del tablero
    currentPlayer = 'X';
}

// Maneja el clic en cada celda
function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] !== '') return; // Si la celda ya está ocupada, no hace nada

    // Actualizar el estado del tablero
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase()); // Añade la clase x o o

    if (checkWin()) {
        setTimeout(() => {
            showMessage(`${currentPlayer} ha ganado!`);
            saveGame(`${currentPlayer} ha ganado!`); //Guarda el juego cuando hay un ganador
        }, 100);
        return;
    }

    if(boardState.every(cell => cell !== '')) {
        setTimeout(() => {
            showMessage(`¡Empate! }`);
            saveGame(`¡Empate!`); //Guarda el juego cuando hay un empate
        }, 100);
        return;
    }
    // Cambia de jugador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Verifica si hay un ganador
function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return true;
        }
    }
    return boardState.every(cell => cell !== ''); // Empate
}

// Muestra el mensaje de victoria
function showMessage(text) {
    message.textContent = text;
    modal.style.display = 'block';
}

// Cierra el modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    initBoard(); // Reinicia el juego
});

// Reinicia el juego al hacer clic en el botón
restartButton.addEventListener('click', () => {
    modal.style.display = 'none';
    initBoard();
});

function saveGame(result){
    const games = JSON.parse(localStorage.getItem('games')) || [];
    const game = {
        id: gameId++,
        boardState: [...boardState],
        result: result,
        date: new Date().toLocaleString()
    };
    games.push(game);
    localStorage.setItem('games', JSON.stringify(games));
    loadSavedGames(); // Carga los juegos guardados
}

function loadSavedGames() {
    savedGamesContainer.innerHTML = '';
    const games = JSON.parse(localStorage.getItem('games')) || [];
    games.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.textContent = `Partida ${game.id} - ${game.result} - ${game.date}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteGame(game.id));
        gameElement.appendChild(deleteButton);
        savedGamesContainer.appendChild(gameElement);
    });
}

function deleteGame(id) {
    let games = JSON.parse(localStorage.getItem('games')) || [];
    games = games.filter(game => game.id !== id);
    localStorage.setItem('games', JSON.stringify(games));
    loadSavedGames(); // Carga los juegos guardados
}

loadSavedGames(); // Carga los juegos guardados
// Inicializa el tablero al cargar la página
initBoard();