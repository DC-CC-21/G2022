console.log('Blocks are Loading')

class Block {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.w = 20;
      this.h = 20;
      this.jumpHeight = 5;
      this.grav = 0;
      this.origY = this.y;
    }
  
    display() {
      this.recenter();
      c.fill("#885500");
      c.rect(this.x, this.y, this.w * 0.95, this.h);
    }
  
    recenter() {
      if (this.y < this.origY) {
        this.grav += 0.1;
        this.y += this.grav;
      } else if (c.dist(this.x, this.y, this.x, this.origY) != 0) {
        this.y -= this.y - this.origY;
      }
    }
  }
  