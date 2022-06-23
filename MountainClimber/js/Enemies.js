class Enemy {
  constructor(x, y, h, src) {
    this.src = src;
    this.path = `assets/${src}.svg`;
    this.img = c.getAspect(this.path);
    this.img.addEventListener("load", () => {
      this.aspect = this.img.height / this.img.width;
      this.w = ~~((1 / this.aspect) * h);
      this.xOffset = this.w/2;
    });
    this.x = x;
    this.y = y;
    this.h = ~~h;
    this.yOffset = 0;
    this.grav = 0;
    this.alive = true;
    this.destroy = false;
  }
  display() {
    c.image(this.path, this.x, this.y, this.w, this.h, false, false);
  }
  move(land, blocks) {
    this.grav += G;
    this.y += this.grav;

    for (let i = 0; i < land.length - 1; i++) {
      if (c.insideLineBounds(land[i], land[i + 1], this)) {
        let line = c.lineSlope(land[i], land[i + 1], this);
        let y = c.collideLine(line, this, this.xOffset, this.yOffset);

        y = c.constrain(
          y,
          land[i].y < land[i + 1].y ? land[i].y : land[i + 1].y,
          land[i].y < land[i + 1].y ? land[i + 1].y : land[i].y
        );
        let dist = c.dist(this.x + this.w / 2, this.y, this.x + this.w / 2, y);
        if (dist < this.h) {
          this.grav = 0;
          this.y = y - this.h;
          this.canJump = true;
          this.landedPos = {
            x: this.x,
            y: this.y,
          };
        } 
        // break;
      }
    }
    this.x += 0.5;

    if(c.rectCollide(p, this)){
        if(p.y+p.h*0.8 < this.y){
            this.alive = false;
        } else if(p.heartDelay <= 0){
            p.lives -=1;
            p.heartDelay = heartDelay
        }
    }
    if(!this.alive){
        this.die()
    }
  }
  die(){
      switch(this.src){
          case 'thundercloud':
            this.squish = this.squish ? this.squish : p.grav;
            this.squish += G;
            this.h -= this.h > 0 ? this.squish>0?this.squish:0 : 0;
            this.y += this.squish;
            if(this.h < 0){this.h = 0.1;}
            if(this.h <= 0.1){
                this.destroy = true;
            }
    }
  }
}
