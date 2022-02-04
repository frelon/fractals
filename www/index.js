import {Fractal,Pixel} from "fractal-viewer";
import { memory } from "fractal-viewer/fractal_viewer_bg";

const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const canvas = document.getElementById("fractal-canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.onresize = function() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    requestAnimationFrame(render);
}

const render = () => {
    const fractal = Fractal.mandelbrot(width,height);
    const ctx = canvas.getContext('2d');
    const pixels = new Uint8ClampedArray(memory.buffer, fractal.data(), width * height * 4);

    const imageData = new ImageData(pixels, width, height);
    ctx.putImageData(imageData, 0, 0);
};

requestAnimationFrame(render);

