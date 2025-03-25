import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="flex flex-col h-screen">
    <div class="toolbar bg-gray-800 text-white flex items-center p-4 shadow-md space-x-4">
      <button id="mandelbrotButton" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Mandelbrot
      </button>
      <button id="juliaButton" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
        Julia
      </button>
    </div>
    <canvas id="fractalCanvas" class="flex-grow bg-black"></canvas>
    <div id="popup" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md space-y-4">
        <h2 id="popupTitle" class="text-lg font-bold"></h2>
        <label class="block">
          <span>Max Iterations:</span>
          <input id="popupMaxIterations" type="number" value="100" min="10" max="1000" class="block w-full mt-1 border border-gray-300 rounded px-2 py-1" />
        </label>
        <label class="block">
          <span>Zoom:</span>
          <input id="popupZoom" type="number" value="4" step="0.1" min="1" max="10" class="block w-full mt-1 border border-gray-300 rounded px-2 py-1" />
        </label>
        <div class="flex justify-end space-x-2">
          <button id="cancelButton" class="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button id="renderPopupButton" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Render
          </button>
        </div>
      </div>
    </div>
  </div>
`;

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popupTitle');
const popupMaxIterations = document.getElementById('popupMaxIterations');
const popupZoom = document.getElementById('popupZoom');
const renderPopupButton = document.getElementById('renderPopupButton');
const cancelButton = document.getElementById('cancelButton');
let currentFractalType = 'mandelbrot';

function resizeCanvas() {
  const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
  const availableHeight = window.innerHeight - toolbarHeight;
  const availableWidth = window.innerWidth;

  if (availableWidth / availableHeight > 4 / 3) {
    canvas.height = availableHeight;
    canvas.width = (availableHeight * 4) / 3;
  } else {
    canvas.width = availableWidth;
    canvas.height = (availableWidth * 3) / 4;
  }

  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
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

function showPopup(type) {
  currentFractalType = type;
  popupTitle.textContent = `Render ${type.charAt(0).toUpperCase() + type.slice(1)} Fractal`;
  popup.classList.remove('hidden');
}

function hidePopup() {
  popup.classList.add('hidden');
}

document.getElementById('mandelbrotButton').addEventListener('click', () => {
  showPopup('mandelbrot');
});

document.getElementById('juliaButton').addEventListener('click', () => {
  showPopup('julia');
});

renderPopupButton.addEventListener('click', () => {
  const maxIterations = parseInt(popupMaxIterations.value, 10);
  const zoom = parseFloat(popupZoom.value);
  hidePopup();
  drawFractal(currentFractalType, maxIterations, zoom);
});

cancelButton.addEventListener('click', hidePopup);

window.addEventListener('resize', () => {
  resizeCanvas();
  drawFractal(currentFractalType, parseInt(popupMaxIterations.value, 10), parseFloat(popupZoom.value));
});

resizeCanvas();
drawFractal('mandelbrot', 100, 4);
