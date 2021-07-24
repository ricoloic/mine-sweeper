function Minesweeper(scl) {
  this.scl = scl;
  this.finished = false;
}

Minesweeper.prototype.createTiles = function ({ cols, rows }) {
  // create grid with no mines
  this.tiles = make2DGrid(cols, rows, (i, j) => new Cell(i, j, this.scl));
  return this;
}

Minesweeper.prototype.showTiles = function () {
  background(255);
  forAllSpot(this.tiles, (cell) => cell.show());
  return this;
}

Minesweeper.prototype.updateTiles = function () {
  forAllSpot(this.tiles, (cell) => cell.updateMineCount(this.tiles));
}

Minesweeper.prototype.addMines = function (mineAmount) {
  const availableSpots = [];
  forAllSpot(this.tiles, (cell) => availableSpots.push(cell));

  for (let i = mineAmount; i > 0; i--) {
    const index = floor(random(availableSpots.length));
    const choice = availableSpots[index];
    this.tiles[choice.i][choice.j].isMine = true;
    availableSpots.splice(index, 1);
  }
}

Minesweeper.prototype.revealTile = function (x, y) {
  let gameLost = false;
  let neighborMines, gotCell = false;
  forAllSpot(this.tiles, (cell) => {
    if (cell.constrain(x, y)) {
      cell.reveal(this.tiles);
      neighborMines = cell.mineCount;
      if (cell.isMine) gameLost = true;
      gotCell = true;
    }
  });
  this.showTiles();
  if (gameLost && this.isTouch)
    this.loseGame();
  else if ((gameLost || neighborMines > 0) && !this.isTouch)
    this.startGame({ mineAmount: this.mineAmount, cols: this.cols, rows: this.rows }).revealTile(x, y);
  else if (gotCell) this.isTouch = true;
}

Minesweeper.prototype.markTile = function (x, y) {
  forAllSpot(this.tiles, (cell) => {
    if (!cell.revealed && cell.constrain(x, y))
      cell.setMarker();
  });
  this.showTiles();
  this.updateMineCount();
}

Minesweeper.prototype.updateMineCount = function () {
  let correctFlagCount = 0;
  let flagCount = 0;
  forAllSpot(this.tiles, (cell) => {
    if (cell.marked) flagCount++;
    if (cell.isMine && cell.marked) correctFlagCount++;
  });

  this.setMineLeft(this.mineAmount - flagCount);
  if (flagCount === correctFlagCount && correctFlagCount === this.mineAmount)
    this.winGame();
}

Minesweeper.prototype.displayText = function (content) {
  background(255, 255, 255, 170);
  fill(0);
  strokeWeight(1);
  textAlign(CENTER);
  textSize(30);
  text(content, width / 2, height / 2);
}

Minesweeper.prototype.loseGame = function () {
  this.finished = true;
  this.displayText('You Lost!!');
}

Minesweeper.prototype.winGame = function () {
  this.finished = true;
  this.displayText('You Won!!');
}

Minesweeper.prototype.startGame = function (gameOptions, scl) {
  if (scl) scl = this.scl || 30;
  const { mineAmount, cols, rows } = gameOptions;
  this.cols = cols, this.rows = rows, this.mineAmount = mineAmount;
  this.createTiles(gameOptions);
  this.addMines(mineAmount);
  this.updateTiles();
  this.showTiles();
  this.finished = false;
  this.isTouch = false;
  return this;
}