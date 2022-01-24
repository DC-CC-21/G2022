var width;
var height;
var puzzleW;
var puzzleH;
var drawOnce = 0;
var puzzleImg;
var pieceW;
var pieceH;
var pieces = [];

function setup(){
    width = window.innerWidth;
    height = window.innerHeight;
    var canvasSize = width > height ? height : width
    puzzleW = canvasSize
    puzzleH = canvasSize*0.8

    var cnv = createCanvas(width,height)
    cnv.parent('canvas')
}

class Piece{
    constructor(self){
        for(let i = 0; i < Object.keys(self).length; i ++){
            this[Object.keys(self)[i]] = self[Object.keys(self)[i]]
        }

        // this.c = createGraphics(puzzleW,puzzleH)
        background(0,0)
        image(this.msk,0,0,puzzleW,puzzleH)
        this.image = get(this.x,this.y,this.w,this.h)

        this.origX = this.x;
        this.origY = this.y;

        this.x = Math.random()*width
        this.y = Math.random()*height
    }
    display(){
        stroke(0)
        fill(this.x,this.y,this.w,50)
        rect(this.x,this.y,this.w,this.h)
        if(this.image) image(this.image,this.x,this.y)

        if(dist(this.x,this.y,this.origX,this.origY) > 0.1){
            this.assemble()
            fill(255)
            rect(this.x,this.y,this.w,this.h)
        }
    }
    assemble(){
        this.x += (this.origX - this.x)/20
        this.y += (this.origY - this.y)/20
    }
}

function createPuzzle(difficulty,IMAGE){
    pieceW = (puzzleW/difficulty);
    pieceH = (puzzleH/difficulty);
    console.log(pieceW)
    console.log(pieceH)
    if(!drawOnce){
        drawOnce = 1;
        loadImage(IMAGE,(img)=>{
            puzzleImg = img;
            for(var i = 0; i < puzzleW; i += pieceW){
                for(var j = 0; j < puzzleH; j += pieceH){
                    pieces.push(new Piece({
                        x:i,
                        y:j,
                        w:pieceW,
                        h:pieceH,
                        msk:puzzleImg
                    }))
                }
            }
        })
        
    }
}

function draw(){

    background(75)

    fill(255)
    rect(0,0,puzzleW,puzzleH)
    if(puzzleImg){
        image(puzzleImg,0,0,puzzleW,puzzleH)
    }
    if(pieces.length > 0){
        for(var i = 0; i < pieces.length; i ++){
            pieces[i].display()
        }
    }
}