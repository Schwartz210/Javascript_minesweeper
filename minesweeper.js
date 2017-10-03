var SIZE = 25;
var LEVELOFDIFFICULTY = [6, 5, 4, 3];
var QUANTITYOFMINES = (SIZE * SIZE) / LEVELOFDIFFICULTY[0];
var gameInProgress = false;
var allCells = [];
var flaggedCells = [];
var outOfPlay = [];
var mines = [];
var firstCellPlayed = false;
var secondsSinceGameStarted = 0;
var timer;

/**
*onLoad initializer
*/
function execute() {
    gameInProgress = true;
    runGUI(SIZE);
}

/**
*onClick for newGameButton. Resets the game
*/
function newGame(){
    for (var iterator = 0; iterator < allCells.length; iterator++){
        var r1c1 = allCells[iterator];
        document.getElementById(r1c1).src = 'img/grey.png'
    }
    flaggedCells = [];
    outOfPlay = [];
    mines = [];
    gameInProgress = true;
    firstCellPlayed = false;
    secondsSinceGameStarted = 0;
    timerTextView.innerHTML = '00:00';
}

/**
*Executed every seconds. This function is primarily string formatting for the
*timer.
*/
function timeIncrement(){
    if (gameInProgress == false){
        return false;
    }
    if (secondsSinceGameStarted >= 60){
        var minutes = Math.floor(secondsSinceGameStarted / 60);
        var seconds = secondsSinceGameStarted - (minutes * 60);
    } else {
        var minutes = 0;
        var seconds = secondsSinceGameStarted;
    }
    if (minutes < 10){
        var minutesString = '0' + String(minutes);
    } else {
        var minutesString = String(minutes);
    }
    if (seconds < 10){
        var secondsString = '0' + String(seconds);
    } else {
        var secondsString = String(seconds);
    }
    var timerText = minutesString + ':' + secondsString;
    document.getElementById('timerTextView').innerHTML = timerText;
    secondsSinceGameStarted++;
}
/**
* Evaluates if ID is flagged.
* @Returns bool.
*/
function isFlagged(id) {
    var index = flaggedCells.indexOf(id);
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

/**
* Evaluates if ID is outOfPlay.
* @Returns bool.
*/
function isOutOfPlay(id) {
    var index = outOfPlay.indexOf(id);
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

/**
* Evaluates if ID is mine.
* @Returns bool.
*/
function isMine(id){
    var index = mines.indexOf(id);
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

/**
* Left click handler
*/
function leftClick(){
    if (gameInProgress == false) {
        return false;
    } else if (firstCellPlayed == false){
        outOfPlay.push(this.id);
        makeMines();
        firstCellPlayed = true;
        document.getElementById(this.id).src = getImageQuantity(getAdjacentMineQuantity(this.id));
        gameInProgress = true;
        timer = setInterval(timeIncrement, 1000);
    } else if (isFlagged(this.id)) {
        return false;
    } else if (isMine(this.id)){
        detonate(this.id);
    } else if (getAdjacentMineQuantity(this.id) > 0){
        document.getElementById(this.id).src = getImageQuantity(getAdjacentMineQuantity(this.id));
        outOfPlay.push(this.id);
        if (checkVictoryConditions()){
            victory();
        }
    } else if (getAdjacentMineQuantity(this.id) == 0){
        zeroCascade(this.id);
    }
}

/**
* Right click handler
*/
function rightClick(id) {
    if (gameInProgress == false){
        return false;
    } else if (isOutOfPlay(id)){
        return false;
    } else if (isFlagged(id)) {
        flaggedCells.splice(flaggedCells.indexOf(id), 1);
        document.getElementById(id).src = "img/grey.png";
    } else if (isFlagged(id) == false){
        flaggedCells.push(id);
        document.getElementById(id).src = 'img/flag.png';
    }
}

/**
* Evaluates if board state meets victory conditions
* @Returns bool
*/

function checkVictoryConditions(){
    for (var iterator = 0; iterator < mines.length; iterator++){
        var mine = mines[iterator];
        if (isFlagged(mine) == false){
            log(false);
            return false;
        }
    }
    for (var iterator = 0; iterator < flaggedCells.length; iterator++){

        var flag = flaggedCells[iterator];
        if (isMine(flag) == false){
            return false
        }
    }
    return true;
}

/**
* Alerts user of vidtory progress, and stops timer, changes gameInProgress bool
*/

function victory(){
    alert("You are victorious!");
    gameInProgress = false;
    clearInterval(timer);
}

/**
* Creates board, newGameButton, and timer visual
*/
function runGUI(size) {
    var body = document.getElementsByTagName('body')[0];
    var newGameButton = document.createElement('BUTTON');
    var newGameButtonTextNode = document.createTextNode('New Game');
    newGameButton.appendChild(newGameButtonTextNode);
    newGameButton.onclick = newGame;
    body.appendChild(newGameButton);
    var timerTextView = document.createElement('p');
    timerTextView.id = 'timerTextView';
    var timerTextViewTextNode = document.createTextNode('00:00');
    timerTextView.appendChild(timerTextViewTextNode);
    body.appendChild(timerTextView);
    var table = document.createElement('table');
    table.id = 'mainBoard';
    var tableBody = document.createElement('tbody');
    var text = '';
    for (var row = 0; row < size; row++) {
        var tr = document.createElement('tr');
        for (var column = 0; column < size; column++) {
            var td = document.createElement('td');
            var image = document.createElement('img');
            image.src = 'img/grey.png';
            image.id = 'R' + String(row) + 'C' + String(column);
            allCells.push(image.id);
            image.onclick = leftClick;
            image.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                rightClick(this.id);
                return false;
            }, false);
            td.appendChild(image);
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    }
    table.appendChild(tableBody);
    body.appendChild(table);
}

/**
* Generate mines at game beginning
*/
function makeMines(){
    var ids = allCells.slice();
    ids.splice(ids.indexOf(outOfPlay[0]),1);
    for (var iterator = 0; iterator < QUANTITYOFMINES; iterator++){
        var index = Math.floor(Math.random() * ids.length);
        var mine = ids[index];
        mines.push(mine);
        ids.splice(index, 1);
    }
}

/**
* Lose condition and visuals
*/
function detonate(id){
    for (var iterator = 0; iterator < QUANTITYOFMINES; iterator++){
        var r1c1 = mines[iterator];
        if (r1c1 == id){
            document.getElementById(id).src = 'img/minex.png';
        } else if (isFlagged(r1c1)) {
            document.getElementById(r1c1).src = 'img/flag-true.png';
        } else if (isFlagged(r1c1) == false) {
            document.getElementById(r1c1).src = 'img/mine.png';
        }
    }
    for (var iterator = 0; iterator < flaggedCells.length; iterator++){
        var flag = flaggedCells[iterator];
        if (isMine(flag) == false){
            document.getElementById(flag).src = 'img/flag-false.png';
        }
    }
    gameInProgress = false;
    clearInterval(timer);
}

/**
* @Returns integer representing cell below current cell either row or column
*/
function getLowerAdjacent(rowOrColumn){
    var minimum = 0;
    if (rowOrColumn == 0){
        minimum = rowOrColumn;
    } else {
        minimum = rowOrColumn - 1;
    }
    return minimum;
}

/**
* @Returns integer representing cell above current cell either row or column
*/
function getUpperAdjacent(rowOrColumn){
    var maximum = 0;
    if (rowOrColumn == SIZE - 1){
        maximum = rowOrColumn;
    } else {
        maximum = rowOrColumn + 1;
    }
    return maximum;
}

/**
* @Returns integer representing row for inputted r1c1
*/
function getRow(r1c1){
    if (r1c1.length == 4){
        return parseInt(r1c1.charAt(1));
    } else if (r1c1.length == 5 && r1c1.indexOf('C') == 2) {
        return parseInt(r1c1.charAt(1));
    } else if (r1c1.length == 5 && r1c1.indexOf('C') == 3) {
        return parseInt(r1c1.charAt(1) + r1c1.charAt(2));
    } else if (r1c1.length == 6){
        return parseInt(r1c1.charAt(1) + r1c1.charAt(2));
    }
}

/**
* @Returns integer representing column for inputted r1c1
*/
function getColumn(r1c1){
    if (r1c1.length == 4){
        return parseInt(r1c1.charAt(3));
    } else if (r1c1.length == 5 && r1c1.indexOf('C') == 2) {  //R1C10
        return parseInt(r1c1.charAt(3) + r1c1.charAt(4));
    } else if (r1c1.length == 5 && r1c1.indexOf('C') == 3) {  //R10C1
        return parseInt(r1c1.charAt(4));
    } else if (r1c1.length == 6){
        return parseInt(r1c1.charAt(4) + r1c1.charAt(5));
    }
}

/**
* @Returns adjacent cells for inputted r1c1
*/
function getAdjacentCells(id){
    var output = [];
    var row = getRow(id);
    var column = getColumn(id);
    var minimumRow = getLowerAdjacent(row);
    var maximumRow = getUpperAdjacent(row);
    var minimumColumn = getLowerAdjacent(column);
    var maximumColumn = getUpperAdjacent(column);
    for (var r = minimumRow; r <= maximumRow; r++){
        for (var c = minimumColumn; c <= maximumColumn; c++){
            var r1c1 = 'R' + String(r) + 'C' + String(c);
            if (r1c1 != id && isOutOfPlay(r1c1) == false){
                output.push(r1c1);
            }
        }
    }
    return output;
}

/**
* @Returns quantity of mines in adjacent cells.
*/
function getAdjacentMineQuantity(id){
    var quantity = 0;
    var adjacentCells = getAdjacentCells(id);
    for (var iterator = 0; iterator < adjacentCells.length; iterator++){
        var cell = adjacentCells[iterator];
        var index = mines.indexOf(cell);
        if (index > -1) {
            quantity++;
        }
    }
    return quantity;
}

/**
* String formatting for image name
*/
function getImageQuantity(quantity){
    var imageFileName = 'img/' + String(quantity) + '.png';
    return imageFileName;
}

/**
* All adcacent cells with zero mines are played as is the cell adjacent to them
* are played. cascade only stops when it reaches a non-zero cell.
*/
function zeroCascade(id){
    var cellQueue = [];
    var adjacentCells = getAdjacentCells(id);
    document.getElementById(id).src = 'img/0.png'
    for (var iterator = 0; iterator < adjacentCells.length; iterator++){
        var cell = adjacentCells[iterator];
        if (getAdjacentMineQuantity(cell) == 0){
            cellQueue.push(cell);
            document.getElementById(cell).src = 'img/0.png'
        } else {
            document.getElementById(cell).src = getImageQuantity(getAdjacentMineQuantity(cell));
        }
    }
    for (var i = 0; i < cellQueue.length; i++){
        var cell = cellQueue[i];
        var newAdjacentCells = getAdjacentCells(cell);
        for (var j = 0; j < newAdjacentCells.length; j++){
            var newCell = newAdjacentCells[j];
            if (getAdjacentMineQuantity(newCell) == 0){
                cellQueue.push(newCell);
                document.getElementById(newCell).src = 'img/0.png'
            } else {
                document.getElementById(newCell).src = getImageQuantity(getAdjacentMineQuantity(newCell));
            }
            outOfPlay.push(newCell);
        }
    }
}
