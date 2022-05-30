console.log("Player is Loading...");

class Player {
  constructor(size) {
    this.x = c.map(50, 0, 706, 0, Height);
    this.y = c.map(450, 0, 706, 0, Height);
    this.w = size;
    this.h = ~~(this.w * 1.1);
    this.grav = 0;
    this.speed = c.map(3, 0, 706, 0, Height);
    this.jumpHeight = c.map(11, 0, 706, 0, Height);

    this.xOffset = this.w / 2;
    this.yOffset = 0;
    this.bVec = 0;

    this.landedPos = { x: this.x, y: this.y };
  }

  display() {
    // c.fill(255, 0, 0);
    // c.rect(this.x, this.y, this.w, this.h);
    c.image("assets/googly.jpg", this.x, this.y, this.w, this.h);
  }

  move(
    land,
    blocks,
    coins /* Dictionary of Junk to collide with ex. blocks, coinds, etc... */
  ) {
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
    this.collideBlock(blocks, "y");
    if (this.y > Height + 10) {
      this.grav = 0;
      this.x = this.landedPos.x;
      this.y = this.landedPos.y;
    }

    this.moveX();
    this.x = c.constrain(this.x, 0, Width * 10);

    this.collideBlock(blocks, "x");
    this.jump();

    this.collideCoin(coins);
    c.moveCamera(this);
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

  jump() {
    if (keys["ArrowUp"] && this.canJump) {
      // this.grav -= 10;
      this.grav -= this.jumpHeight;
    } else if (mouseIsPressed) {
      for (let i = 0; i < mouseT.length; i++) {
        if (up.isin(mouseT[i].clientX, mouseT[i].clientY) && this.canJump) {
          this.grav -= this.jumpHeight;
        }
      }
    }
  }
}
