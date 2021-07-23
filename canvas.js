let grid;
const scl = 30;
let cols = 9, rows = 9;
let mineAmount;
let currentMineAmount;

let bomb, explosion, flag;

function preload() {
    bomb = loadImage('./bomb.png');
    explosion = loadImage('./explosion.png');
    flag = loadImage('./flag.png');
}

function updateGameOptions() {
    const mineCountInput = select('#mine-count');
    switch (parseInt(select('#difficulty').selected(), 10)) {
        case 1:
            mineCountInput.value(10);
            mineAmount = 10;
            cols = 9;
            rows = 9;
            break;
        case 2:
            mineCountInput.value(40);
            mineAmount = 40;
            cols = 16;
            rows = 16;
            break;
        case 3:
            mineCountInput.value(99);
            mineAmount = 99;
            cols = 30;
            rows = 16;
            break;
    }
}

function mousePressed(e) {
    if (e.button === 0)
        if (revealSpot()) {
            loseState();
            return;
        }
        else placeMarker();

    background(255);
    forAllSpot(grid, (cell) => {
        cell.show();
    });

    updateMineCount();
}

function setup() {
    updateGameOptions();
    const init = true;
    startNewGame(init);
}

function placeMarker() {
    forAllSpot(grid, (cell) => {
        if (!cell.revealed && cell.constrain(mouseX, mouseY))
            cell.setMarker();
    });
}

function revealSpot() {
    let gameLost = false;
    forAllSpot(grid, (cell) => {
        if (cell.constrain(mouseX, mouseY)) {
            cell.reveal(grid);
            if (cell.isMine) gameLost = true;
        }
    });
    return gameLost;
}

function startNewGame(init) {
    if (!init)
        select('#canvas-container')
            .style('display', 'grid');

    select('#mine-count').value(mineAmount);
    currentMineAmount = mineAmount;
    const w = cols * scl, h = rows * scl;
    setupCanvas(w, h);

    startGrid();
}

function initializeGrid() {
    forAllSpot(grid, (cell) => {
        cell.updateMineCount(grid);
        cell.show();
    });
}

function startGrid() {
    grid = make2DGrid(cols, rows, (i, j) => new Cell(i, j, scl));

    setMines();
    initializeGrid();
}

function setMines() {
    const options = [];
    forAllSpot(grid, (cell) => options.push(cell));

    for (let i = mineAmount; i > 0; i--) {
        const index = floor(random(options.length));
        const choice = options[index];
        grid[choice.i][choice.j].isMine = true;
        options.splice(index, 1);
    }
}

function updateMineCount() {
    const mineCountDom = select('#mine-count');
    let correctFlagCount = 0;
    let flagCount = 0;
    forAllSpot(grid, (cell) => {
        if (cell.marked) flagCount++;
        if (cell.isMine && cell.marked) correctFlagCount++;
    });
    mineCountDom.value(currentMineAmount - flagCount);
    if (flagCount === correctFlagCount && correctFlagCount === currentMineAmount)
        winState();
}

function winState() {
    background(255);
    fill(0);
    strokeWeight(1);
    textAlign(CENTER);
    textSize(30);
    text('You Win!!', width / 2, height / 2);
}

function loseState() {
    background(255);
    fill(0);
    strokeWeight(1);
    textAlign(CENTER);
    textSize(30);
    text('You Lose!!', width / 2, height / 2);
}

function countMine() {
    let c = 0;
    forAllSpot(grid, (cell) => {
        if (cell.isMine) c++;
    });
    console.log(c);
}
