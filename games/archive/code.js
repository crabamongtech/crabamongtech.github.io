const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
document.body.appendChild(canvas);
context.globalCompositeOperation = 'lighter';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const textStrip = ['R', 'A', 'I', 'N'];
const stripCount = 256;
const stripX = new Float32Array(stripCount);
const stripY = new Float32Array(stripCount);
const dY = new Float32Array(stripCount);
const stripFontSize = new Float32Array(stripCount);
const fontStrings = new Array(stripCount);
const fontSizeCache = new Map();
const theColors = ['#62BAE0'];
const color = theColors[0]; // single color used, avoid redundant access

// Precompute all strip values
for (let i = 0; i < stripCount; i++) {
    const fontSize = Math.random() * 8 + 6;
    stripX[i] = Math.random() * canvas.width;
    stripY[i] = -Math.random() * canvas.height;
    stripFontSize[i] = fontSize;
    dY[i] = (Math.random() * 3 + 1) * (10 / fontSize);

    // Cache font string
    if (!fontSizeCache.has(fontSize)) {
        fontSizeCache.set(fontSize, `${fontSize}px JetBrains Mono`);
    }
    fontStrings[i] = fontSizeCache.get(fontSize);
}

function drawStrip(x, y, fontSize) {
    context.fillStyle = color;
    for (let k = 0; k < 4; k++) {
        const char = textStrip[Math.floor(Math.random() * textStrip.length)];
        context.fillText(char, x, y - k * fontSize);
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textBaseline = 'top';
    context.textAlign = 'center';

    for (let j = 0; j < stripCount; j++) {
        const fontSize = stripFontSize[j];
        context.font = fontStrings[j];
        drawStrip(stripX[j], stripY[j], fontSize);

        stripY[j] += dY[j];
        if (stripY[j] > canvas.height + 100) {
            const newSize = Math.random() * 8 + 6;
            stripX[j] = Math.random() * canvas.width;
            stripY[j] = -Math.random() * canvas.height;
            stripFontSize[j] = newSize;
            dY[j] = (Math.random() * 3 + 1) * (10 / newSize);

            // Reuse cached font string
            if (!fontSizeCache.has(newSize)) {
                fontSizeCache.set(newSize, `${newSize}px JetBrains Mono`);
            }
            fontStrings[j] = fontSizeCache.get(newSize);
        }
    }

    requestAnimationFrame(draw);
}

draw();

// Disable right-click and copying
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());