var SIZE = 25;
var QUANTITYOFMINES = (SIZE * SIZE) / 12;
var gameInProgress = false;
var allCells = [];
var flaggedCells = [];
var outOfPlay = [];
var mines = [];

function execute() {
    gameInProgress = true;
    createTable(SIZE);
    makeMines();
}

function isFlagged(id) {
    var index = flaggedCells.indexOf(id);
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

function isOutOfPlay(id) {
    var index = outOfPlay.indexOf(id);
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

function isMine(id){
    var index = mines.indexOf(id);
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

function leftClick(){
    if (gameInProgress == false) {
        return false;
    } else if (isFlagged(this.id)) {
        return false;
    } else if (isMine(this.id)){
        detonate();
    } else {
        document.getElementById(this.id).src = 'img/red.png';
        outOfPlay.push(this.id);
    }
}

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

function createTable(size) {
    var body = document.getElementsByTagName('body')[0];
    var table = document.createElement('table');
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

function makeMines(){
    var ids = allCells.slice();
    for (var iterator = 0; iterator < QUANTITYOFMINES; iterator++){
        var index = Math.floor(Math.random() * ids.length);
        var mine = ids[index];
        mines.push(mine);
        ids.splice(index, 1);
    }
}

function detonate(){
    for (var iterator = 0; iterator < QUANTITYOFMINES; iterator++){
        var id = mines[iterator];
        document.getElementById(id).src = 'img/mine.png';
        gameInProgress = false;
    }
}
