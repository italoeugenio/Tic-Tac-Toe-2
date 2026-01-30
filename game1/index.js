const board = document.getElementById("board")
const nodeListCells = document.querySelectorAll(".cell")
const gameStatus = document.querySelector(".status")
const restartButton = document.getElementById("restart")

let currentPlayer = "X"
let running = true

const images = {
    X: "/assets/images/red-bull.png",
    O: "/assets/images/mclaren.png"
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
board.addEventListener("click", cellClicked)
restartButton.addEventListener("click", restartGame)
function cellClicked(event){
    const cell = event.target;
    if(cell.querySelector("img") || !running) return

    const img = document.createElement("img")
    img.src = images[currentPlayer]
    img.alt = teams[currentPlayer]
    img.classList.add("team-icon");
    cell.appendChild(img);

    if(checkVictory()){
        const combinationWinner = checkCombinationWinner()
        highlightCell(combinationWinner)
        gameStatus.textContent = `${teams[currentPlayer]} is the winner`
        sounds[currentPlayer].play()
        running = false
    } else if (checkDraw()){
        gameStatus.textContent = 'Draw!';
        running = false;
    } else {
        changePlayer()
    }
}



function checkVictory(){
    for(let combination of winConditions){
        let everyEqual = true
        for(let idx of combination){
            const img = nodeListCells[idx].querySelector("img"); 
            if(!img || img.alt !== teams[currentPlayer]){
                everyEqual = false
                break
            }
        }
        if(everyEqual){
            return true
        }
    }
    return false
}


function checkCombinationWinner(){
    for(let combination of winConditions){
        let everyEquals = true
        for(let idx of combination){
            const img = nodeListCells[idx].querySelector("img");
            if(!img || img.alt !== teams[currentPlayer]){
                everyEquals = false
                break
            }
        }

        if(everyEquals){
            return combination
        }
    }

    return null;
}

function highlightCell(combinationWinner){
    for(let idx of combinationWinner){
        nodeListCells[idx].classList.add("winner")
    }
}

function checkDraw(){
    for(let cell of nodeListCells){
        if(!cell.querySelector("img")){  
            return false;
        }
    }
    return true;
}


function restartGame(){
     for(content of nodeListCells){
        content.innerHTML = ""; 
        content.classList.remove("winner");
    }
    gameStatus.style.color = "red";
    gameStatus.style.textShadow = "1px 1px 3px white";
    gameStatus.textContent = "Red Bull's turn"
    currentPlayer = "X"
    running = true
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
