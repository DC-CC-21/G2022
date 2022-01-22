// Document vars
var root = document.querySelector(':root');
var imgBtns = document.querySelectorAll('.puzzleImg')
var startBtn = document.getElementById('start')
var scene3 = document.getElementById('scene3')

// Puzzle vars
var difficulty = 1
var img;

var selectedImage = document.getElementById('selectedImage');
imgBtns.forEach((element) => {
    element.addEventListener('click', (current) => {
        root.style.setProperty('--scene1--', 'none');
        root.style.setProperty('--scene2--', 'flex');
        img = current.target.src;
        selectedImage.src = img
    })
})
startBtn.addEventListener('click', () => {
    root.style.setProperty('--scene1--', 'none');
    root.style.setProperty('--scene2--', 'none');
    root.style.setProperty('--scene3--', 'flex')

    var pieceCount = document.getElementsByName('numberOfPieces')
    for (var i = 0; i < pieceCount.length; i++) {
        console.log('value: ' + pieceCount[i].value)
        if (pieceCount[i].checked) {
            difficulty = ~~Math.sqrt(Number(pieceCount[i].value))
        }
    }

    createPuzzle(difficulty, img)
})
