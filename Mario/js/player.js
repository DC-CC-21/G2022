console.log("Player is Loading...");

class Player {
  constructor(size) {
    this.x = c.map(50 , 0, 706, 0, Height);
    this.y = c.map(450, 0, 706, 0, Height);
    this.w = size;
    this.h = ~~(this.w * 1.1);
    this.grav = 0;
    this.speed = c.map(3, 0, 706, 0, Height);
    this.jumpHeight = c.map(6, 0, 706, 0, Height);

    this.xOffset = this.w / 2;
    this.yOffset = 0;
  }

  display() {
    // c.fill(255, 0, 0);
    // c.rect(this.x, this.y, this.w, this.h);
    c.image("assets/googly.jpg", this.x, this.y, this.w, this.h)
  }

  move(
    land,
    blocks /* Dictionary of Junk to collide with ex. blocks, coinds, etc... */
  ) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.grav += c.map(0.1, 0, 706, 0, Height);
    this.y += this.grav;
    this.canJump = false;

    for (let i = 0; i < land.length - 1; i++) {
      if (c.insideLineBounds(land[i], land[i + 1], this)) {
        let line = c.lineSlope(land[i], land[i + 1], this);
        let y = c.collideLine(line, this, this.xOffset, this.yOffset);
        let dist = c.dist(this.x + this.w / 2, this.y, this.x+this.w/2, y) 
        if (dist < this.h) {
          this.grav = 0;
          this.y = y - this.h;
          this.canJump = true;
        }
        // break;
      }
    }

    this.collideBlock(blocks, "y");

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
    }
    if(mouseIsPressed){
      if(left.isin(mouseX, mouseY)){
        this.x -= this.speed;
      }
      else if(right.isin(mouseX, mouseY)){
        this.x += this.speed;
      } else {
        for(let i = 0; i < mouseT.length; i ++){
          if(left.isin(mouseT[i].clientX, mouseT[i].clientY)){
            this.x -= this.speed;
          }
          else if(right.isin(mouseT[i].clientX, mouseT[i].clientY)){
            this.x += this.speed;
          }
        }
      }

    }

    this.collideBlock(blocks, "x");

    if (keys["ArrowUp"] && this.canJump) {
      // this.grav -= 10;
      this.grav -= this.jumpHeight;
    } else if(mouseIsPressed){
      if(up.isin(mouseX, mouseY) && this.canJump){
        this.grav -= this.jumpHeight;
      }
    }

  }

  collideBlock(blocks, mode) {
    blocks.forEach((block) => {
      if (c.rectCollide(this, block)) {
        if (mode === "y") {
          if (this.prevY > block.y) {
            this.canJump = false;
            this.grav = 0;
            this.grav += 0.1;
            this.y = block.y + block.h;
            block.y -= block.jumpHeight;
          } else if (this.prevY < block.y) {
            this.y = block.y - this.h;
            this.grav = 0;
            this.canJump = true;
          }
        }

        if (mode == "x") {
          if (this.prevX < block.x) {
            this.x = block.x - this.w;
          }
          console.log(this.prevX, block.x);
          if (this.prevX > block.x) {
            this.x = block.x + block.w;
          }
        }
      }
    });
  }
}
