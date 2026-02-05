const board = document.getElementById("board")
const nodeListCells = document.querySelectorAll(".cell")
const gameStatus = document.querySelector(".status")
const restartButton = document.getElementById("restart")
const gridGame = document.querySelectorAll(".grid-game")


let currentBoard = null
let currentPlayer = "X"
let running = true
const boardWinners = Array(9).fill(null)


const images = {
    X: "/assets/images/red-bull.png",
    O: "/assets/images/mclaren.png",
    D: "/assets/images/draw-2.png"
}

const sounds = {
    X: new Audio("/assets/audios/redbull-winner.MP3"),
    O: new Audio("/assets/audios/mclaren-winner.MP3")
}

const teams = {
    X : "Red Bull",
    O : "McLaren"
}

const winConditions =[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

gridGame.forEach((grid) =>{
    grid.addEventListener("click", cellClicked)
})


function cellClicked(event){
    const cell = event.target.closest(".cell")
    if(!cell) return
    
    const boardIndex = cell.parentElement.getAttribute("gameBoardIndex")
    const whereCanPlayIndex = cell.getAttribute("classIndex")

    if(checkWhereCanPlay(currentBoard, boardIndex)) return
    if(cell.querySelector("img") || !running) return 

    const img = document.createElement("img")
    img.src = images[currentPlayer]
    img.alt = teams[currentPlayer]
    img.classList.add("team-icon")
    cell.appendChild(img)

    checkVictoryInBoard()

    const combinationWinner = checkBigGameVictory()
    
    if(combinationWinner){
        highlightCellVictory(combinationWinner)
        gameStatus.textContent = `${teams[currentPlayer]} is the winner!`
        sounds[currentPlayer].play()
        running = false
        gridGame.forEach(g => g.classList.remove("wherePlay"))
        return
    }

    if(checkDraw()){
        gameStatus.textContent = "Draw! No winners."
        gameStatus.style.color = "white"
        gameStatus.style.textShadow = "none"
        running = false
        gridGame.forEach(g => g.classList.remove("wherePlay"))
        return
    }

    currentBoard = whereCanPlayIndex

    if(boardWinners[currentBoard] !== null){
        currentBoard = null
    }

    highlightWhereToPlay(gridGame, currentBoard)
    changePlayer()
}


function changePlayer(){
     currentPlayer = (currentPlayer == "X") ? "O" : "X";
     if(currentPlayer === "X") {
        gameStatus.style.color = "red";
        gameStatus.style.textShadow = "1px 1px 3px white";
    } else {
        gameStatus.style.color = "rgb(255, 166, 0)";
        gameStatus.style.textShadow = "1px 1px 3px rgb(255, 255, 255)";
    }
    gameStatus.textContent = `${teams[currentPlayer]}'s turn`; 
}

function checkWhereCanPlay(currentBoard, boardIndex){
    if(currentBoard !== null && currentBoard != boardIndex){
        return true
    } else {
        return false 
    }
}

function highlightWhereToPlay(gridGame, index){
    gridGame.forEach(grid => grid.classList.remove("wherePlay"));

    for(let grid of gridGame){
        const gridIndex = grid.getAttribute("gameBoardIndex")

        if(boardWinners[gridIndex] !== null) {
            continue; 
        }

        if(index === null || gridIndex == index){
            void grid.offsetWidth;
            grid.classList.add("wherePlay") 
        }
    }
}

function checkVictoryInBoard() {
    for (let i = 0; i < gridGame.length; i++) {
        if (boardWinners[i] !== null) {
            continue;
        }

        const board = gridGame[i];
        const cells = board.querySelectorAll(".cell");
        let boardWon = false;

        for (let combination of winConditions) {
            const [a, b, c] = combination;
            const imgA = cells[a].querySelector("img");
            const imgB = cells[b].querySelector("img");
            const imgC = cells[c].querySelector("img");

            if (imgA && imgB && imgC && imgA.alt === teams[currentPlayer] && imgB.alt === teams[currentPlayer] && imgC.alt === teams[currentPlayer]) {
                completeBoard(i, currentPlayer);
                boardWon = true;
                break;
            }
        }

        if (boardWon) continue;

        const isDraw = Array.from(cells).every(cell => cell.querySelector("img"));
        
        if (isDraw) {
            completeBoard(i, "D");
        }
    }
}

function completeBoard(boardIndex, winnerSymbol) {
    boardWinners[boardIndex] = winnerSymbol;

    const board = gridGame[boardIndex];
    board.classList.add("board-completed");
    board.innerHTML = ""; 

    const img = document.createElement("img");
    img.src = images[winnerSymbol];
    img.alt = winnerSymbol === "D" ? "Draw" : teams[winnerSymbol];
    img.classList.add("big-team-icon");

    board.appendChild(img);
}

function checkBigGameVictory(){
    for(let combination of winConditions){
        const [a, b, c] = combination
        
        const winnerA = boardWinners[a]
        const winnerB = boardWinners[b]
        const winnerC = boardWinners[c]


        const matchA = winnerA === currentPlayer || winnerA === "D"
        const matchB = winnerB === currentPlayer || winnerB === "D"
        const matchC = winnerC === currentPlayer || winnerC === "D"

        if(matchA && matchB && matchC && winnerA !== null && winnerB !== null && winnerC !== null){
            return combination 
        }
    }
    return null 
}

function highlightCellVictory(combinationWinner){
    for(idx of combinationWinner){
        gridGame[idx].classList.add("winner-background")
    }
}

restartButton.addEventListener("click", restartGame)

function restartGame(){
    sounds[currentPlayer].pause()
    currentBoard = null
    currentPlayer = "X"
    running = true
    boardWinners.fill(null)
    gameStatus.textContent = `${teams[currentPlayer]}'s turn`
    
    gameStatus.style.color = "red"
    gameStatus.style.textShadow = "1px 1px 3px white"

    gridGame.forEach((grid, index) => {
        grid.classList.remove("wherePlay", "board-completed", "winner-background")
        
        grid.innerHTML = ""

        for(let i = 0; i < 9; i++){
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.setAttribute("classIndex", i)
            cell.setAttribute("data-celula", "")

            grid.appendChild(cell) 
        }
    })
}


function checkDraw(){
    return !boardWinners.includes(null)
}