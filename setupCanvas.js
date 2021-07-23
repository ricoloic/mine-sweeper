function setupCanvas(w = window.innerWidth, h = window.innerHeight, render = undefined) {
  canvas = createCanvas(w, h, render);
  const mainNodeDOM = canvas.parent();
  canvas.parent("canvas-container");
  mainNodeDOM.remove();
  return canvas;
}