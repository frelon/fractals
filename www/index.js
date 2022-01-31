import {Fractal,Pixel} from "fractal-viewer";
import { memory } from "fractal-viewer/fractal_viewer_bg";

const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const canvas = document.getElementById("fractal-canvas");
let width = canvas.clientWidth;
let height = canvas.clientHeight;

window.onresize = function() {
  console.log("resized");
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  requestAnimationFrame(render);
}

const render = () => {
  console.log("rendering fractal");
  const getIndex = (row, column) => {
    return row * width + column;
  };

  const fractal = Fractal.mandelbrot(width,height);
  const ctx = canvas.getContext('2d');
  const pixels = new Uint8Array(memory.buffer, fractal.pixels(), width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = pixels[idx] === Pixel.Dead
        ? DEAD_COLOR
        : ALIVE_COLOR;

      ctx.fillRect(
        col,
        row,
        1,
        1
      );
    }
  }

  ctx.stroke();

};

requestAnimationFrame(render);

