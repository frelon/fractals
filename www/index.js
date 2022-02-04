import { Fractal,Viewpoint } from "fractal-viewer";
import { memory } from "fractal-viewer/fractal_viewer_bg";

const canvas = document.getElementById("fractal-canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let vp = [-2.0, 1.12, 0.47, -1.12];

let fractal = Fractal.mandelbrot(width,height,vp[0],vp[1],vp[2],vp[3]);
let pixels = new Uint8ClampedArray(memory.buffer, fractal.data(), width * height * 4);

window.onresize = function() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    fractal = Fractal.mandelbrot(width,height,vp[0],vp[1],vp[2],vp[3]);
    pixels = new Uint8ClampedArray(memory.buffer, fractal.data(), width * height * 4);

    requestAnimationFrame(render);
}

canvas.onclick = function(e) {
    vp[0] += 0.0001*e.x;
    vp[1] -= 0.0001*e.y;
    vp[2] -= 0.0001*e.x;
    vp[3] += 0.0001*e.y;

    fractal = Fractal.mandelbrot(width,height,vp[0],vp[1],vp[2],vp[3]);
    pixels = new Uint8ClampedArray(memory.buffer, fractal.data(), width * height * 4);

    requestAnimationFrame(render);
}

const render = () => {
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(pixels, width, height);
    ctx.putImageData(imageData, 0, 0);
};

requestAnimationFrame(render);

