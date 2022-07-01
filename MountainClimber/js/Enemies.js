class Enemy {
  constructor(x, y, h, src) {
    this.src = src;
    this.path = `assets/${src}.svg`;
    this.img = c.getAspect(this.path);
    this.img.addEventListener("load", () => {
      this.aspect = this.img.height / this.img.width;
      this.w = ~~((1 / this.aspect) * h);
      this.xOffset = this.w / 2;
    });
    this.x = x;
    this.y = y;
    this.w = ~~h;
    this.h = ~~h;
    this.yOffset = 0;
    this.grav = 0;
    this.alive = true;
    this.destroy = false;

    this[this.src+'Setup']()
  }
  display() {
    // c.rect(this.x, this.y, this.w, this.h);
    this[this.src]();
  }
  //   thundercloud() {
  //     c.image(this.path, this.x, this.y, this.w, this.h, false, false);
  //   }

  //thundercloud
  thundercloud2Setup() {
    //Lightning
    this.ltng = 1;
    this.ligntningDelay = 10;
    this.ligntningSize = this.w * 0.8;
    this.ligntningOffset = (this.w - this.ligntningSize) / 2;
    this.speed = c.map(1,0,706,0,Height)
  }
  thundercloud2() {
    this.ligntningDelay -= 1;
    if (!this.ligntningDelay) {
      let ligntning = [1, 2, 3, 4];
      this.ligntningDelay = ~~c.random(3, 8);
      let prevLigntning = this.ltng;
      this.ltng = ligntning[~~c.random(0, ligntning.length)];
      if (~~this.ltng == ~~prevLigntning) {
        ligntning.pop(ligntning);
        this.ltng = ligntning[~~c.random(0, ligntning.length)];
      }
    }
    c.image(
      `assets/Lightning${~~this.ltng}.svg`,
      this.x + this.ligntningOffset,
      this.y,
      this.ligntningSize,
      this.h
    );
    c.image(
      this.path,
      this.x + this.ligntningOffset,
      this.y,
      this.ligntningSize,
      this.h * 0.8,
      false,
      false
    );
  }
  thundercloud2Movement(land) {
    this.gravity()
    this.collideWithGround(land);
    this.x += this.speed;
    this.collideWithPlayer()
  }

  //fireball
  fireballSetup(){
    this.canJump = false;
    this.rotation = 0;
    this.direction = Math.random() > 0.5 ? -1 : 1;
    this.speed = this.direction * 2;
    console.log(this.speed)
    this.jumpHeight = c.map(8,0,706,0,Height)
    this.groundY = this.y;
    this.groundX = this.x;
  }
  fireball() {
    // this.rotation = Math.atan2(this.y-this.groundY, this.x-this.groundX)
    // this.rotation = c.map(this.rotation*(180/Math.PI),-40,40,-180,0)
    this.prevRot = this.rotation;
    this.rotation = 360*c.sin(this.grav*2)
    this.rotation = c.lerp(this.prevRot, this.rotation, 0.2)
    this.rotation = c.constrain(this.rotation, -90, 90)
    c.rotate((this.rotation-90)*this.speed/2,this.w/2, this.h/2)
    c.image(this.path, this.x, this.y, this.w, this.h, false, false);
    c.reset()
  }
  fireballMovement(land) {
    this.jump = false;
    this.gravity()
    this.collideWithGround(land)
    if(this.jump){
        this.grav -= this.jumpHeight
    }
    this.x += this.speed;
    
  }

  //constant
  collideWithGround(land) {
    for (let i = 0; i < land.length - 1; i++) {
      let collision = c.insideLineBounds(land[i], land[i + 1], this)
        if (collision) {
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
          this.jump = true;
          this.landedPos = {
            x: this.x,
            y: this.y,
          };
        }
        // break;
        return true;
      }
    }
  }
  gravity(gravScale=1){
    this.grav += G*gravScale;
    this.y += this.grav;

    if (this.y > Height) {
      this.destroy = true;
    }

  }


  collideWithPlayer() {
    switch(this.src){
        case 'thundercloud2':
    if (c.rectCollide(p, this)) {
      if (p.y + p.h * 0.8 < this.y && p.grav > 0) {
        this.alive = false;
        p.canJump = true;
        p.jump(1.5);
        if (p.grav > 0) {
          p.grav -= p.jumpHeight;
        }
      } else if (p.heartDelay <= 0) {
        p.lives -= 1;
        p.lightningCounter = 100;
        p.heartDelay = heartDelay;
      }
    } else {
        p.lightningCounter = 0;
    }

    if (!this.alive) {
      this.die();
    }
    }
  }
  die() {
    switch (this.src) {
      case "thundercloud":
        this.squish = this.squish ? this.squish : p.grav > 0 ? p.grav : 0;
        this.squish += G;
        this.h -= this.h > 0 ? (this.squish > 0 ? this.squish : 0) : 0;
        this.y += this.squish;
        if (this.h < 0) {
          this.h = 0.1;
        }
        if (this.h <= 0.1) {
          this.destroy = true;
        }
        break;
      case "thundercloud2":
        this.squish = this.squish ? this.squish : p.grav > 0 ? p.grav : 0;
        this.squish += G;
        this.h -= this.h > 0 ? (this.squish > 0 ? this.squish : 0) : 0;
        this.y += this.squish;
        if (this.h < 0) {
          this.h = 0.1;
        }
        if (this.h <= 0.1) {
          this.destroy = true;
        }
    }
  }
}
