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

    //Lightning
    this.ltng = 1;
    this.ligntningDelay = 10;
    this.ligntningSize = this.w * 0.8;
    this.ligntningOffset = (this.w - this.ligntningSize) / 2;
  }
  display() {
    // c.rect(this.x, this.y, this.w, this.h);
    this[this.src]();
  }
  thundercloud() {
    c.image(this.path, this.x, this.y, this.w, this.h, false, false);
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
        p.heartDelay = heartDelay;
      }
    }
    if (!this.alive) {
      this.die();
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
