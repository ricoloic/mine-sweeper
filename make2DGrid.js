function make2DGrid(cols, rows, feedAction) {
  let grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++)
      grid[i][j] = feedAction(i, j);
  }
  return grid;
}

function forAllSpot(grid, action) {
  for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[i].length; j++)
      action(grid[i][j]);
}