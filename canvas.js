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

function updateGameOptions() {
    function getOption() {
        const value = select('#difficulty').selected();
        if (value === '2') return 'medium';
        if (value === '3') return 'hard';
        return 'small';
    }
    const mineCountInput = select('#mine-count');
    const option = difficultyOptions[getOption()];
    mineCountInput.value(option.mineAmount);
    mineAmount = option.mineAmount;
    cols = option.cols;
    rows = option.rows;
}

function mousePressed(e) {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        if (e.button === 0) {
            if (revealSpot()) {
                loseState();
                return;
            }
        } else placeMarker();

        background(255);
        forAllSpot(grid, (cell) => {
            cell.show();
        });

        updateMineCount();
    }
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

function initializeGrid() {
    print('init');
    background(255);
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
    console.log('LOSE');
    function areAllTilesUntouch() {
        let nbOfRevealedOrMarked = 0;
        forAllSpot(grid, (cell) => {
            if (cell.marked || cell.revealed) nbOfRevealedOrMarked++;
        });

        return nbOfRevealedOrMarked <= 1;
    }
    if (areAllTilesUntouch()) {
        startGrid();
        return;
    }
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
