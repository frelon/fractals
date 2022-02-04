import { Fractal,Viewpoint } from "fractal-viewer";
import { memory } from "fractal-viewer/fractal_viewer_bg";

const canvas = document.getElementById("fractal-canvas");
let width = window.innerWidth;
let height = window.innerHeight;
let zoom_history = [[-2.0, 1.12, 0.47, -1.12]];
let zoom_level = 0;
let zoom_pos = [-1000,-1000];
let zoom_enabled = false;
let fractal = null;
let pixels = null;
let max_iterations = 60.0;

const setZoomPos = function(e) {
    zoom_pos[0] = e.x;
    zoom_pos[1] = e.y;
}

const updateFractal = function() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let vp = zoom_history[zoom_level];
    fractal = Fractal.mandelbrot(max_iterations, width,height,vp[0],vp[1],vp[2],vp[3]);
    pixels = new Uint8ClampedArray(memory.buffer, fractal.data(), width * height * 4);
}

const interpolate = function(aspect, min, max) {
    return min + (aspect * (max-min))
}

const toFractalVP = function(x,y) {
    let w = width/5;
    let h = height/5;
    let left = x-(w/2)
    let top = y-(h/2);
    let right = left + w;
    let bottom = top + h;

    let vp = zoom_history[zoom_level]; 

    return [
        interpolate(left/width, vp[0], vp[2]),
        interpolate(top/height, vp[1], vp[3]),
        interpolate(right/width, vp[0], vp[2]),
        interpolate(bottom/height, vp[1], vp[3]),
    ];
}

const zoom = function(e) {
    if(!zoom_enabled) {
        return
    }

    let vp = toFractalVP(e.x, e.y);

    zoom_history.push(vp);
    zoom_level += 1;

    updateFractal();
}

const toggleZoom = function() {
    zoom_enabled = !zoom_enabled;

    if(zoom_enabled) {
        canvas.cursor = 'zoom-in';
    } else {
        canvas.cursor = 'auto';
    }
}

const handleKeyUp = function(e) {
    if(e.key == 'z') {
        toggleZoom();
    }
}

canvas.onclick = zoom;
canvas.onmousemove = setZoomPos;
window.onresize = updateFractal;
document.onkeyup = handleKeyUp;

const renderLoop = () => {
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(pixels, width, height);
    ctx.putImageData(imageData, 0, 0);

    if(zoom_enabled) {
        ctx.strokeStyle = 'white';
        let w = width/5;
        let h = height/5;
        ctx.strokeRect(zoom_pos[0]-(w/2), zoom_pos[1]-(h/2), w, h);
    }

    requestAnimationFrame(renderLoop);
};

updateFractal();
requestAnimationFrame(renderLoop);

