mod utils;

use rand::prelude::*;
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
    pub fn mandelbrot(width:usize, height:usize) -> Fractal {
        const MAX_ITERATIONS:u32 = 80;

        let mut rng = rand::thread_rng();

        let mut colors:Vec<[u8;4]> = Vec::with_capacity(MAX_ITERATIONS as usize);
        for _n in 0..=MAX_ITERATIONS {
            let r = (rng.gen::<f64>() * 255.0) as u8;
            let g = (rng.gen::<f64>() * 255.0) as u8;
            let b = (rng.gen::<f64>() * 255.0) as u8;
            colors.push([r,g,b,255]);
        }

        colors[MAX_ITERATIONS as usize] = [0,0,0,255];

        let mut pixels: Vec<[u8;4]> = Vec::with_capacity(width*height*4);

        for py in 0..height {
            let y0 = (py as f64 / height as f64) * (1.12*2.0) - 1.12; // -1.12, 1.12

            for px in 0..width {
                let x0 = (px as f64 / width as f64) * 2.47 - 2.0; // -2.00, 0.47
                let mut iteration = 0;
                let mut x = 0.0;
                let mut y = 0.0;

                while x*x + y*y <= 4.0 && iteration < MAX_ITERATIONS {
                    let xtemp = x*x - y*y + x0;
                    y = 2.0*x*y + y0;
                    x = xtemp;
                    iteration += 1;
                }

                pixels.push(colors[iteration as usize]);
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
