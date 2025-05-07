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
const theColors = ['#62BAE0'];

for (let i = 0; i < stripCount; i++) {
    const fontSize = Math.random() * 8 + 6;
    stripX[i] = Math.random() * canvas.width;
    stripY[i] = -Math.random() * canvas.height;
    stripFontSize[i] = fontSize;
    dY[i] = (Math.random() * 3 + 1) * (10 / fontSize);
    fontStrings[i] = `${fontSize}px JetBrains Mono`;
}

function drawStrip(x, y, fontSize) {
    for (let k = 0; k < 4; k++) {
        context.fillStyle = theColors[Math.min(k, theColors.length - 1)];
        context.fillText(textStrip[Math.floor(Math.random() * textStrip.length)], x, y);
        y -= fontSize;
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textBaseline = 'top';
    context.textAlign = 'center';

    for (let j = 0; j < stripCount; j++) {
        context.font = fontStrings[j];

        if (stripY[j] > canvas.height + 100) {
            const fontSize = Math.random() * 8 + 6;
            stripX[j] = Math.random() * canvas.width;
            stripY[j] = -Math.random() * canvas.height;
            stripFontSize[j] = fontSize;
            dY[j] = (Math.random() * 3 + 1) * (10 / fontSize);
            fontStrings[j] = `${fontSize}px JetBrains Mono`;
        }

        drawStrip(stripX[j], stripY[j], stripFontSize[j]);
        stripY[j] += dY[j];
    }

    requestAnimationFrame(draw);
}

draw();

// Disable right-click and copying
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());