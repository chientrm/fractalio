import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="flex flex-col h-screen">
    <div class="toolbar bg-gray-800 text-white flex items-center p-4 shadow-md space-x-4">
      <label class="flex items-center space-x-2">
        <span>Fractal Type:</span>
        <select id="fractalType" class="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1">
          <option value="mandelbrot">Mandelbrot</option>
          <option value="julia">Julia</option>
        </select>
      </label>
      <label class="flex items-center space-x-2">
        <span>Max Iterations:</span>
        <input id="maxIterations" type="number" value="100" min="10" max="1000" class="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1" />
      </label>
      <label class="flex items-center space-x-2">
        <span>Zoom:</span>
        <input id="zoom" type="number" value="4" step="0.1" min="1" max="10" class="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1" />
      </label>
      <button id="renderButton" class="ml-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Render
      </button>
    </div>
    <canvas id="fractalCanvas" class="flex-grow bg-black"></canvas>
  </div>
`;

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const fractalTypeInput = document.getElementById('fractalType');
const maxIterationsInput = document.getElementById('maxIterations');
const zoomInput = document.getElementById('zoom');
const renderButton = document.getElementById('renderButton');

function resizeCanvas() {
  const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
  const availableHeight = window.innerHeight - toolbarHeight;
  const availableWidth = window.innerWidth;

  // Maintain aspect ratio (4:3) while ensuring the total height matches the window height
  if (availableWidth / availableHeight > 4 / 3) {
    canvas.height = availableHeight;
    canvas.width = (availableHeight * 4) / 3;
  } else {
    canvas.width = availableWidth;
    canvas.height = (availableWidth * 3) / 4;
  }

  canvas.style.display = 'block'; // Ensure the canvas is displayed as a block element
  canvas.style.margin = '0 auto'; // Center the canvas horizontally
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
  drawFractal(fractalTypeInput.value, parseInt(maxIterationsInput.value, 10), parseFloat(zoomInput.value)); // Re-render fractal on resize
});

// Initial setup
resizeCanvas();
drawFractal('mandelbrot', 100, 4);
