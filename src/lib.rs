mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Pixel {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Fractal {
    pixels: Vec<Pixel>,
}

#[wasm_bindgen]
impl Fractal {
    pub fn mandelbrot(width:u32, height:u32) -> Fractal {
        let pixels = (0..width * height)
            .map(|i| {
                if i % 2 == 0 || i % 7 == 0 {
                    Pixel::Alive
                } else {
                    Pixel::Dead
                }
            })
            .collect();

        Fractal {
            pixels,
        }
    }

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }
}
