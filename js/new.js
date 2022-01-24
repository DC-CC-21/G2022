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
        this.rotation = (Math.random()*360);
    }
    display(){
        stroke(0)
        fill(this.x,this.y,this.w,50)
        rect(this.x,this.y,this.w,this.h)
        push()
        translate(this.x+this.w/2,this.y+this.h/2)
        rotate(this.rotation/(180/Math.PI))
        if(this.image) image(this.image,-this.w/2,-this.h/2)

        if(dist(this.x,this.y,this.origX,this.origY) < 0.1 && this.rotation > 0){
        }
        else{
            this.assemble()
            fill(255)
            
            rect(-this.w/2,-this.h/2,this.w,this.h)
            
        }
        pop()
        if(this.rotation >= 360){this.rotation = 0;}
        if(this.rotation > 0){this.rotation +=(360-this.rotation)/10;}
    }
    assemble(){
        this.x += (this.origX - this.x)/10
        this.y += (this.origY - this.y)/10
        
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
                    text(`${pieces.length} done of ${difficulty*difficulty}`)
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
        // image(puzzleImg,0,0,puzzleW,puzzleH)
    }
    if(pieces.length > 0){
        for(var i = 0; i < pieces.length; i ++){
            pieces[i].display()
        }
    }
}