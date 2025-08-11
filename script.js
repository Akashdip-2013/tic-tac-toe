let theme = document.getElementById("change_theme");
let toggle = 0;

theme.addEventListener("click", () => {
    const root = document.documentElement;

    if (toggle != 0) {
        // Light mode
        root.style.setProperty("--box", "#f0f0f0");
        root.style.setProperty("--btn-border", "rgb(78, 78, 207)");
        root.style.setProperty("--btn-text", "#fff");
        root.style.setProperty("--bg-game_box", "#fff");
        root.style.setProperty("--bg-text", "#333");
        root.style.setProperty("--bg-body", "#ccc");
        root.style.setProperty("--btn-hover", "#000");
        root.style.setProperty("--text-shadow", "rgba(0, 0, 0, 0.1)");
        root.style.setProperty("--theme-btn", "#000");
        root.style.setProperty("--theme-text", "#fff");
        theme.innerText = "🌙 DARK";
    } else {
        // Dark mode
        root.style.setProperty("--box", "gray");
        root.style.setProperty("--btn", "#222");
        root.style.setProperty("--btn-border", "rgb(78, 78, 207)");
        root.style.setProperty("--btn-text", "white");
        root.style.setProperty("--bg-game_box", "#333");
        root.style.setProperty("--bg-text", "white");
        root.style.setProperty("--bg-body", "#000");
        root.style.setProperty("--btn-hover", "#fff");
        root.style.setProperty("--text-shadow", "lightgreen");
        root.style.setProperty("--theme-btn", "#fff");
        root.style.setProperty("--theme-text", "#000");
        theme.innerText = "🌤️ LIGHT";
    }
    toggle = !toggle;
});

// ===== Click sound =====
const clickSound = new Audio("/assets/click.mp3");
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

// =================== GAME LOGIC ======================
const boxes = document.querySelectorAll(".box");
const statusText = document.querySelector(".status");
const startBtn = document.querySelector(".start");
const singleBtn = document.querySelector(".single");

let currentPlayer = "X";
let running = false;
let playerTurn = true; // New flag to lock player moves during AI's turn
let gameMode = "multi"; // "multi" or "single"
let board = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startBtn.addEventListener("click", startGame);
singleBtn.addEventListener("click", switchMode);
boxes.forEach((box, index) => box.addEventListener("click", () => boxClicked(index)));

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    playerTurn = true;
    boxes.forEach(box => {
        box.textContent = "";
        box.classList.remove("win");
    });
    updateStatus();
}

function switchMode() {
    gameMode = gameMode === "multi" ? "single" : "multi";
    singleBtn.textContent = gameMode === "single" ? "Switch to Multiplayer" : "Switch to Single Player";
    startGame();
}

function boxClicked(index) {
    if (!running || board[index] !== "" || (gameMode === "single" && !playerTurn)) return;

    clickSound.currentTime = 0;
    clickSound.play();

    board[index] = currentPlayer;
    boxes[index].textContent = currentPlayer;

    if (checkWinner()) {
        endGame(currentPlayer);
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw! 🤝";
        running = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatus();

        if (gameMode === "single" && currentPlayer === "O" && running) {
            playerTurn = false; // Lock board until AI moves
            setTimeout(aiMove, 400);
        }
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    board[move] = "O";
    boxes[move].textContent = "O";

    if (checkWinner()) {
        endGame("O");
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw! 🤝";
        running = false;
    } else {
        currentPlayer = "X";
        playerTurn = true; // Unlock board for player
        updateStatus();
    }
}

function minimax(newBoard, depth, isMaximizing) {
    if (checkWinnerAI(newBoard, "O")) return 10 - depth;
    if (checkWinnerAI(newBoard, "X")) return depth - 10;
    if (newBoard.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "O";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "X";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            boxes[a].classList.add("win");
            boxes[b].classList.add("win");
            boxes[c].classList.add("win");
            return true;
        }
    }
    return false;
}

function checkWinnerAI(testBoard, player) {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (testBoard[a] === player && testBoard[b] === player && testBoard[c] === player) {
            return true;
        }
    }
    return false;
}

function endGame(winner) {
    if (gameMode === "single") {
        if (winner === "O") {
            statusText.textContent = "You Lose 😢";
        } else {
            statusText.textContent = "You Win 🎉";
        }
    } else {
        statusText.textContent = `${winner} Wins! 🎉`;
    }
    running = false;
}

function updateStatus() {
    statusText.textContent = `${currentPlayer}'s Turn`;
}
