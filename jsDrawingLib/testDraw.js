const canvas = document.getElementById('svgCanvas')
let c = new Canvas(canvas, window.innerWidth*3, window.innerHeight, true)

let frame = 0;
c.textAlign('middle')

draw = function(){
    c.moveCamera({x:frame/2,y:0})
    frame += 1;
    c.background(75)
    
    c.scale(c.sin(frame), c.cos(frame*2))
    c.fill(255,50)
    c.strokeWeight(10)
    c.stroke(255,0,0,120)
    c.transformOrigin(50,50)
    c.rotate(frame)
    c.rect(100,100,100,100);
    
    let color = c.color(0,0,255,200)
    c.fill(color)
    c.transformOrigin(100,100)
    c.ellipse(100,100,100,100);


    c.transformOrigin(40,40)
    c.triangle(0,0,100,0,50,100);

    c.transformOrigin(100,50)
    c.polygon(0,0,100,0,200,50, 50,50);

    // c.scale(1,1)
    c.textSize(50+5*c.sin(frame*2));
    c.transformOrigin(100,300)
    c.text('TESTING', 100,300)
    c.reset()
    for(let i = 0; i < window.innerHeight; i +=10){
        c.text(i, 100,i)
    }
}




