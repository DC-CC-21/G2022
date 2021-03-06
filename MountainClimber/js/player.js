console.log("Player is Loading...");

class Player {
  constructor(size) {
    this.x = c.map(100, 0, 706, 0, Height);
    this.y = c.map(530, 0, 706, 0, Height);
    this.w = ~~size;
    this.h = ~~(this.w * 1.1);
    this.grav = 0;
    this.speed = c.map(3, 0, 706, 0, Height);
    this.jumpHeight = c.map(11, 0, 706, 0, Height);

    this.xOffset = this.w / 2;
    this.yOffset = 0;
    this.bVec = 0;

    this.landedPos = { x: this.x, y: this.y };
    this.lives = 3;
    this.heartDelay = 0;

    //lightning
    this.lightningCounter = 0;
    this.lightningImg = ~~c.random(0, 3);
    this.lightningDelay = 0;
  }

  display() {
    if (this.lightningCounter > 0) {
      this.lightningCounter -= 1;
    }
    // c.fill(255, 0, 0);
    // c.rect(this.x, this.y, this.w, this.h);
    for (let i = 0; i < this.lives; i++) {
      c.image(
        "assets/heart.png",
        heartOffset + i * heartSize * 1.1,
        heartOffset,
        heartSize,
        heartSize,
        true,
        false
      );
    }
    // if(this.lightningCounter%(~~c.random(5,10)) == 0){
    c.image("assets/googly.jpg", this.x, this.y, this.w, this.h);
    if (this.lightningCounter <= 0) {
    } else {
      if (this.lightningDelay <= 0) {
        this.lightningImg = ~~c.random(0, 4);
        this.lightningDelay = c.random(2, 8);
      } else {
        this.lightningDelay -= 1;
      }

      c.image(
        `assets/lightningGoogly${this.lightningImg}.svg`,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }

  move(land, blocks, coins) {
    this.heartDelay -= this.heartDelay > 0 ? 1 : 0;
    this.prevX = this.x;
    this.prevY = this.y;
    this.grav += G;
    this.y += this.grav;
    this.canJump = false;

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
          this.y = c.lerp(this.y, y - this.h, 0.2);
          this.canJump = true;
          this.landedPos = {
            x: this.x,
            y: this.y,
          };
        }
        // break;
      }
    }
    this.collideBlock(blocks, "y");
    if (this.y > Height + 10) {
      this.grav = 0;
      this.x = this.landedPos.x;
      this.y = this.landedPos.y;
    }

    this.moveX();
    this.collideBlock(blocks, "x");
    this.x = c.constrain(this.x, 0, Width * 30);

    this.jump(1);

    this.collideCoin(coins);
    c.moveCamera(this, WorldWidth);
  }

  collideBlock(blocks, mode) {
    blocks.forEach((block) => {
      if (c.rectCollide(this, block)) {
        if (mode === "y") {
          if (this.prevY > block.y) {
            this.canJump = false;
            this.grav = 0;
            this.grav += 0.1;
            this.y = block.y + block.h + block.offsetY;

            if (block.type[0] == "regular") {
              block.y -= block.jumpHeight;
            }
          } // under block
          else if (this.prevY < block.y) {
            this.y = block.y - this.h;
            this.grav = 0;
            this.canJump = true;
          }
        }

        if (mode == "x") {
          if (this.prevX < block.x) {
            this.x = block.x - this.w;
          }
          if (this.prevX > block.x) {
            this.x = block.x + block.w;
          }
        }
      }
    });
  }

  collideCoin(coins) {
    for (let i = 0; i < coins.length; i++) {
      if (
        c.dist(
          this.x + this.w / 2,
          this.y + this.h / 2,
          coins[i].x,
          coins[i].y
        ) < coins[i].size
      ) {
        coins.pop(i);
      }
    }
  }

  moveX() {
    //key pressed
    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
    }

    //touchscreen
    if (mouseIsPressed) {
      for (let i = 0; i < mouseT.length; i++) {
        if (left.isin(mouseT[i].clientX, mouseT[i].clientY)) {
          this.x -= this.speed;
        } else if (right.isin(mouseT[i].clientX, mouseT[i].clientY)) {
          this.x += this.speed;
        }
      }
    }
  }

  jump(scale) {
    if (keys["ArrowUp"] && this.canJump) {
      // this.grav -= 10;
      this.grav -= this.jumpHeight * scale;
    } else if (mouseIsPressed) {
      for (let i = 0; i < mouseT.length; i++) {
        if (up.isin(mouseT[i].clientX, mouseT[i].clientY) && this.canJump) {
          this.grav -= this.jumpHeight * scale;
        }
      }
    }
  }
}
