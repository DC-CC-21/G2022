var width;
var height;
var puzzleW;
var puzzleH;
var drawOnce = 0;
var puzzleImg;
function setup(){
    width = window.innerWidth;
    height = window.innerHeight;
    var canvasSize = width > height ? height : width
    puzzleW = canvasSize
    puzzleH = canvasSize*0.8

    var cnv = createCanvas(width,height)
    cnv.parent('canvas')
}


function draw(){
    if(!drawOnce && img){
        drawOnce = 1;
        loadImage(img,(img)=>{
            puzzleImg = img;
        })
    }
    background(75)

    fill(255)
    rect(0,0,puzzleW,puzzleH)
    if(puzzleImg){
        image(puzzleImg,0,0,puzzleW,puzzleH)
    }
}