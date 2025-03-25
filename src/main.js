import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Fractal Math Study Tool</h1>
    <div class="canvas-container">
      <canvas id="fractalCanvas" width="800" height="600"></canvas>
    </div>
    <p class="description">
      Use this tool to explore and study fractal mathematics. The canvas above will render fractals based on mathematical formulas.
    </p>
  </div>
`

// Add fractal rendering logic
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

function drawFractal() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cx = (x - width / 2) * 4 / width;
      const cy = (y - height / 2) * 4 / height;
      let zx = 0, zy = 0, iteration = 0;
      const maxIteration = 100;

      while (zx * zx + zy * zy < 4 && iteration < maxIteration) {
        const xtemp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = xtemp;
        iteration++;
      }

      const color = iteration === maxIteration ? 0 : (iteration / maxIteration) * 255;
      const index = (x + y * width) * 4;
      imageData.data[index] = color; // Red
      imageData.data[index + 1] = color; // Green
      imageData.data[index + 2] = color; // Blue
      imageData.data[index + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

drawFractal();
