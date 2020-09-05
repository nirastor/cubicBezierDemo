/*
Желательно переписать drawLines -- дублирование
Возможно drawBezer стоит переписать через рекурсию
*/

const elGraphArea = document.querySelector('.graph');
const elPolyLine = elGraphArea.querySelector('.graph-line');
const elLine1 = elGraphArea.querySelector('.line-point-1');
const elLine2 = elGraphArea.querySelector('.line-point-2');

const elementsInput = Array.from(document.querySelectorAll('.legend__input'));

const errorMessage = document.querySelector('.legend__error-message--Wrong ');
let errorState = false;

const points = {
    p1x: 0,
    p1y: 0.7,
    p2x: 0.5,
    p2y: 1.2,
}

function registerEvents() {
    elementsInput.forEach(input => {
        input.addEventListener('input', () => {
            getValues(input);
            drawLines();
            drawBezer();
        });
    });
}

function bezierStep(start, fin, step) {
    return start + (fin - start) / 400 * step;
}

function drawBezer() {
    const bezier = [];
    for (let i = 0; i < 400; i++) {
        const p_b11_x = bezierStep(0, points.p1x, i);
        const p_b11_y = bezierStep(0, points.p1y, i);
        const p_b12_x = bezierStep(points.p1x, points.p2x, i);
        const p_b12_y = bezierStep(points.p1y, points.p2y, i);
        const p_b13_x = bezierStep(points.p2x, 1, i);
        const p_b13_y = bezierStep(points.p2y, 1, i);

        const p_b21_x = bezierStep(p_b11_x, p_b12_x, i);
        const p_b21_y = bezierStep(p_b11_y, p_b12_y, i);
        const p_b22_x = bezierStep(p_b12_x, p_b13_x, i);
        const p_b22_y = bezierStep(p_b12_y, p_b13_y, i);

        bezier.push([
            scaleX( bezierStep(p_b21_x, p_b22_x, i) ),
            scaleY( bezierStep(p_b21_y, p_b22_y, i) ),
        ])
    }
    bezier.push( [scaleX(1), scaleY(1)] );
    drawPoliline(elPolyLine, bezier);
}


function drawLines() {
    const map1 = [];
    map1.push([3, 500]);
    map1.push([scaleX(points.p1x), scaleY(points.p1y)]);
    drawPoliline(elLine1, map1);

    const map2 = [];
    map2.push([403, 100]);
    map2.push([scaleX(points.p2x), scaleY(points.p2y)]);
    drawPoliline(elLine2, map2);
}

function getValues(input) {
    points[input.id] = Number(input.value);
    checkValues();
}

function checkValues() {
    if (points.p1x < 0 || points.p1x > 1 || points.p2x < 0 || points.p2x > 1) {  
        setErrorState();  
    } else {
        removeErrorState();
    }  
}

function setErrorState() {
    errorState = true;
    errorMessage.classList.add('error_active');
}

function removeErrorState() {
    errorState = false;
    errorMessage.classList.remove('error_active');
}

function scaleX(x) {
    return 400 * x + 3;
}

function scaleY(y) {
    return 500 - 400 * y;
} 

function drawPoliline(elem, arr) {
    elem.points.clear();

    arr.forEach(item => {
        const point = elGraphArea.createSVGPoint();
        point.x = item[0];
        point.y = item[1];
        elem.points.appendItem(point);
    });
   
}

registerEvents();
drawLines();
drawBezer();