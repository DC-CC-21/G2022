const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const polygons = [];
const polygonsColors = [ 'red', 'blue', 'green', 'pink', 'purple', 'cyan' ];

polygons.push(createPolygon([
    { x: 50, y: 50 },
    { x: 60, y: 40 },
    { x: 70, y: 40 },
    { x: 80, y: 50 },
    { x: 80, y: 60 },
    { x: 70, y: 70 },
    { x: 60, y: 70 },
    { x: 50, y: 60 },
]));

polygons.push(createPolygon([
    { x: 75 + 100, y: 50 + 25 },
    { x: 100 + 100, y: 150 + 25 },
    { x: 50 + 100, y: 150 + 25 },
]));

polygons.push(createPolygon([
    {x: 10, y: -10},
    {x: 10, y: 0},
    {x: 10, y: 10},
    {x: 0, y: 10},
    {x: -10, y: 10},
    {x: -10, y: 0},
    {x: -10, y: -10},
    {x: 0, y: -10}
]))


function testCollision() {
    for (let i = 1; i < polygons.length; i++) {
        if (polygons[0].testWith(polygons[i])) {
            console.log("Tested with index: ", i);
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        polygons[0].offset(10, 0);
        testCollision();
        render();
    } else if (e.key === 'ArrowLeft') {
        polygons[0].offset(-10, 0);
        testCollision();
        render();
    } else if (e.key === 'ArrowDown') {
        polygons[0].offset(0, 10);
        testCollision();
        render();
    } else if (e.key === 'ArrowUp') {
        polygons[0].offset(0, -10);
        testCollision();
        render();
    }
});

function render() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let colorIndex = 0;
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].render(context, polygonsColors[colorIndex]);

        colorIndex++;
        if (colorIndex === polygonsColors.length) {
            colorIndex = 0;
        }
    }
}

render();