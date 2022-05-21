console.log('Blocks are Loading')

class Block {
    constructor(x, y, size) {
      this.x = c.map(x, 0, 706, 0, Height);
      this.y = c.map(y, 0, 706, 0, Height);
      this.h = size;
      this.w = size;
      this.jumpHeight = 5;
      this.grav = 0;
      this.origY = this.y;
    }
  
    display() {
      this.recenter();
      c.fill("#885500");
      c.stroke(0,0,0)

      c.rect(this.x, this.y, this.w * 0.95, this.h, 2);
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
  