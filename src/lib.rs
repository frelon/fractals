mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Fractal {
    data: Vec<u8>,
}

#[wasm_bindgen]
impl Fractal {
    fn linear_interpolate(color1:[u8;4], color2:[u8;4], iterations:f64) -> [u8;4] {
        [
        (((color2[0] as f64 - color1[0] as f64) * iterations) * color1[0] as f64).floor() as u8,
        (((color2[1] as f64 - color1[1] as f64) * iterations) * color1[1] as f64).floor() as u8,
        (((color2[2] as f64 - color1[2] as f64) * iterations) * color1[2] as f64).floor() as u8,
        255]
    }

    fn get_palette(iterations:usize) -> Vec<[u8;4]> {
        let mut colors:Vec<[u8;4]> = Vec::with_capacity(iterations);
        for n in 0..=iterations as u8 {
            let b = (n as f64/iterations as f64) * 255.0;
            colors.push([0,0,b.floor() as u8,255]);
        }

        colors.push([0,0,0,255]);

        colors
    }

    pub fn mandelbrot(max_iterations:f64,width:usize, height:usize, left:f64, top:f64, right:f64, bottom:f64) -> Fractal {
        utils::set_panic_hook();

        let palette = Fractal::get_palette(max_iterations as usize);

        let mut pixels: Vec<[u8;4]> = Vec::with_capacity(width*height*4);

        for py in 0..height {
            let y0 = (py as f64 / height as f64) * (top*2.0) + bottom;

            for px in 0..width {
                let x0 = (px as f64 / width as f64) * (left.abs() + right) + left;
                let mut iteration = 0.0;
                let mut x = 0.0;
                let mut y = 0.0;

                while x*x + y*y <= (1 << 16) as f64 && iteration < max_iterations {
                    let xtemp = x*x - y*y + x0;
                    y = 2.0*x*y + y0;
                    x = xtemp;
                    iteration += 1.0;
                }

                if iteration < max_iterations {
                    let log_zn = (x*x + y*y).log10() / 2.0;
                    let nu = (log_zn / 2.0_f64.log10()).log10() / 2.0_f64.log10();
                    iteration = iteration + 1.0 - nu
                }

                let color1 = palette[iteration.floor() as usize];
                let color2 = palette[(iteration.floor() + 1.0) as usize];
                let color = Fractal::linear_interpolate(color1, color2, iteration % 1.0);

                pixels.push(color);
            }
        }

        let data = pixels.concat();

        Fractal {
            data,
        }
    }

    pub fn data(&self) -> *const u8 {
        self.data.as_ptr()
    }
}
