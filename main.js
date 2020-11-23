const canvas = document.querySelector('canvas');
const reset = document.getElementById('reset');
const showTip = document.getElementById('showTip');
const tip = document.querySelector('.tip');

const context = canvas.getContext('2d');
const points = [];

const interpolatingPolynomial = x => {
    let px = 0;
    const { length } = points;
    for (let i = 0; i < length; i++) {
        let pi = 1;
        for (let j = 0; j < length; j++) {
            if (i === j) continue;
            const { x: xj } = points[j];
            const { x: xi } = points[i];
            pi *= (x - xj) / (xi - xj);
        }
        const { y: yi } = points[i];
        px += yi * pi;
    }
    return px;
};

const renderPoint = ({ x, y }) => {
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI, true);
    context.fillStyle = 'rgb(52, 70, 237)';
    context.fill();
};

const renderFunction = fn => {
    context.beginPath();
    context.lineWidth = 3;

    for (let x = 0; x < canvas.width; x += 0.5) {
        const y = fn(x);
        context.lineTo(x, y);
    }

    context.setLineDash([5, 5, 7]);
    context.strokeStyle = 'rgba(65, 100, 150, 0.7)';
    context.stroke();
};

const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points.length && renderFunction(interpolatingPolynomial);
    points.forEach(point => renderPoint(point));
};

const hideTip = () => {
    tip.classList.add('tip--hidden');
};

const handleCanvasClick = ({ clientX, clientY }) => {
    const { left, top } = canvas.getBoundingClientRect();

    const point = {
        x: clientX - left,
        y: clientY - top,
    };

    if (!points.some(({ x, y }) => x === point.x && y === point.y)) {
        points.push(point);
        hideTip();
        render();
    }
};

const handleReset = () => {
    points.length = 0;
    render();
};

const handleShowTip = () => {
    tip.classList.remove('tip--hidden');
};

const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
};

canvas.addEventListener('click', handleCanvasClick);

reset.addEventListener('click', handleReset);

showTip.addEventListener('click', handleShowTip);

window.addEventListener('resize', handleResize);

handleResize();