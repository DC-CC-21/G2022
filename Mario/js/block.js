console.log('Blocks are Loading')

class Block {
    constructor(x, y, size, type, offset) {
      this.x = c.map(x, 0, 706, 0, Height);
      this.y = c.map(y, 0, 706, 0, Height);
      this.w = size.w;
      this.h = size.h;
      this.jumpHeight = 5;
      this.grav = 0;
      this.origY = this.y;
      this.type = type
      this.theta = 0;
      this.origY = this.y;

      this.offsetX = offset.x
      this.offsetY = offset.y
    }
  
    display() {
      this[this.type[0]]()
      switch(this.type[0]){
        case 'regular':
          c.fill("#885500");
          c.stroke(0,0,0)
          break;
        case 'moving':
          c.fill('#22dd00')
        }
      c.rect(this.x, this.y, this.w * 0.95, this.h, 2);
    }
    moving(){
      if(this.type[1] == 'v'){
        this.theta += 0.01
        this.y = 50 * Math.sin(this.theta) + this.origY;
      }
    }
    regular(){
      this.recenter()
    }
    recenter() {
      if (this.y < this.origY) {
        this.grav += 0.1;
        this.y += this.grav;
      } else if(c.dist(this.x, this.y, this.x, this.origY) < c.map(1,0,706, 0, Height)){
        this.y = this.origY
        this.grav = 0;
      } 
      else if (c.dist(this.x, this.y, this.x, this.origY) != 0) {
        this.y -= this.y - this.origY;
        
      }
    }
}
  