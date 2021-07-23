function Cell(i, j, scl) {
  this.i = i;
  this.j = j;
  this.x = i * scl;
  this.y = j * scl;
  this.scl = scl;

  this.isMine = false;
  this.revealed = false;
  this.marked = false;

  this.mineCount = 0;
}

Cell.prototype.show = function () {
  stroke(0);
  strokeWeight(1);

  if (this.revealed || this.marked || this.isMine && this.revealed) noFill();
  else fill(120);

  rect(this.x, this.y, this.scl, this.scl);

  if (this.revealed) {
    if (this.isMine) {
      image(bomb, this.x, this.y + 1.5, this.scl - 2, this.scl - 3);
    } else if (this.mineCount > 0) {
      strokeWeight(2);
      textAlign(CENTER);
      textSize(25);
      text(this.mineCount, this.x + this.scl / 2, this.y + this.scl - 5);
    }
  } else if (this.marked)
    image(flag, this.x, this.y, this.scl, this.scl);

}

Cell.prototype.forNeighbor = function (grid, neighborAction) {
  function isSpotInGrid(a, b) {
    return a >= 0 && a <= cols - 1 && b >= 0 && b <= rows - 1;
  }

  for (let g = -1; g <= 1; g++)
    for (let k = -1; k <= 1; k++) {
      const i = this.i + g, j = this.j + k;
      if (isSpotInGrid(i, j))
        neighborAction(grid[i][j]);
    }
}

Cell.prototype.updateMineCount = function (grid) {
  if (this.isMine) return;

  this.forNeighbor(grid, (neighbor) => {
    if (neighbor.isMine)
      this.mineCount++;
  });
}

Cell.prototype.constrain = function (x, y) {
  return (
    x > this.x &&
    x < this.x + this.scl &&
    y > this.y &&
    y < this.y + this.scl
  );
}

Cell.prototype.reveal = function (grid) {
  this.revealed = true;
  this.marked = false;

  if (this.isMine || this.mineCount !== 0) return;
  this.forNeighbor(grid, (neighbor) => {
    if (!neighbor.revealed)
      neighbor.reveal(grid);
  });
}

Cell.prototype.setMarker = function () {
  this.marked = !this.marked;
}