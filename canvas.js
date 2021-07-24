const scl = 30;
let canvasContainer, mineCountInput;
let bomb, explosion, flag;
let gameOption = {};
let game = new Minesweeper(scl);

function preload() {
    bomb = loadImage('./bomb.png');
    explosion = loadImage('./explosion.png');
    flag = loadImage('./flag.png');
}

function mousePressed(e) {
    if (!game.finished) {
        const mouseInCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
        if (mouseInCanvas)
            if (e.button === 0)
                game.revealTile(mouseX, mouseY);
            else
                game.markTile(mouseX, mouseY);
    }
}

function setup() {
    mineCountInput = select('#mine-count');
    canvasContainer = select('#canvas-container');
    game.setMineLeft = (val) => mineCountInput.value(val);
    updateGameOptions();
}

function updateGameOptions() {
    gameOption = difficultyOptions[getDifficulty()];
    mineCountInput.value(gameOption.mineAmount);
}

function newGame() {
    updateGameOptions();
    canvasContainer.style('display', 'grid');
    mineCountInput.value(gameOption.mineAmount);
    const w = gameOption.cols * scl, h = gameOption.rows * scl;
    setupCanvas(w, h);
    game.startGame(gameOption);
}

function countMine() {
    let c = 0;
    forAllSpot(game.tiles, (cell) => {
        if (cell.isMine) c++;
    });
    console.log(c);
}

function getDifficulty() {
    return select('#difficulty').selected();
}
