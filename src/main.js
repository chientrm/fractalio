import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Fractal Math Studio</h1>
    <div class="controls">
      <label>
        Max Iterations:
        <input id="maxIterations" type="number" value="100" min="10" max="1000" />
      </label>
      <label>
        Zoom:
        <input id="zoom" type="number" value="4" step="0.1" min="1" max="10" />
      </label>
      <button id="renderButton">Render</button>
    </div>
    <div class="canvas-container">
      <canvas id="fractalCanvas" width="800" height="600"></canvas>
    </div>
    <p class="description">
      Use this tool to explore and study fractal mathematics. Adjust the parameters above and click "Render" to see the changes.
    </p>
  </div>
`

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const maxIterationsInput = document.getElementById('maxIterations');
const zoomInput = document.getElementById('zoom');
const renderButton = document.getElementById('renderButton');

function drawFractal(maxIterations, zoom) {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cx = (x - width / 2) * zoom / width;
      const cy = (y - height / 2) * zoom / height;
      let zx = 0, zy = 0, iteration = 0;
      const maxIteration = maxIterations;

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

renderButton.addEventListener('click', () => {
  const maxIterations = parseInt(maxIterationsInput.value, 10);
  const zoom = parseFloat(zoomInput.value);
  drawFractal(maxIterations, zoom);
});

// Initial render
drawFractal(100, 4);
