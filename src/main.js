import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="toolbar">
    <label>
      Fractal Type:
      <select id="fractalType">
        <option value="mandelbrot">Mandelbrot</option>
        <option value="julia">Julia</option>
      </select>
    </label>
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
  <canvas id="fractalCanvas"></canvas>
`

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const fractalTypeInput = document.getElementById('fractalType');
const maxIterationsInput = document.getElementById('maxIterations');
const zoomInput = document.getElementById('zoom');
const renderButton = document.getElementById('renderButton');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector('.toolbar').offsetHeight;
}

function drawMandelbrot(maxIterations, zoom) {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cx = (x - width / 2) * zoom / width;
      const cy = (y - height / 2) * zoom / height;
      let zx = 0, zy = 0, iteration = 0;

      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = xtemp;
        iteration++;
      }

      const color = iteration === maxIterations ? 0 : (iteration / maxIterations) * 255;
      const index = (x + y * width) * 4;
      imageData.data[index] = color; // Red
      imageData.data[index + 1] = color; // Green
      imageData.data[index + 2] = color; // Blue
      imageData.data[index + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function drawJulia(maxIterations, zoom) {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const cRe = -0.7;
  const cIm = 0.27015;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let zx = (x - width / 2) * zoom / width;
      let zy = (y - height / 2) * zoom / height;
      let iteration = 0;

      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + cRe;
        zy = 2 * zx * zy + cIm;
        zx = xtemp;
        iteration++;
      }

      const color = iteration === maxIterations ? 0 : (iteration / maxIterations) * 255;
      const index = (x + y * width) * 4;
      imageData.data[index] = color; // Red
      imageData.data[index + 1] = color; // Green
      imageData.data[index + 2] = color; // Blue
      imageData.data[index + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function drawFractal(type, maxIterations, zoom) {
  if (type === 'mandelbrot') {
    drawMandelbrot(maxIterations, zoom);
  } else if (type === 'julia') {
    drawJulia(maxIterations, zoom);
  }
}

renderButton.addEventListener('click', () => {
  const fractalType = fractalTypeInput.value;
  const maxIterations = parseInt(maxIterationsInput.value, 10);
  const zoom = parseFloat(zoomInput.value);
  drawFractal(fractalType, maxIterations, zoom);
});

window.addEventListener('resize', () => {
  resizeCanvas();
  drawFractal(fractalTypeInput.value, 100, 4); // Re-render fractal on resize
});

// Initial setup
resizeCanvas();
drawFractal('mandelbrot', 100, 4);
