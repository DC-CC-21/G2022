import * as ct from "../../../3D world/js/constant.js";
import { blocks, key, playerSize, blockSize} from "../play.js";
import { cube, plane } from "../../../3D world/js/constant.js";

export class Player {
  constructor(x, y, scene) {
    this.w = playerSize[0];
    this.h = playerSize[1];
    this.p = cube(
      scene,
      { x: x * this.w, y: y * this.h, z: 0 },
      [this.w, this.h, this.w],
      0xff0000,
      true,
      true
    );
    this.p.geometry.translate(this.w / 2, this.h / 2, 0);
    this.grav = 0;
    this.canJump = false;
    this.jumpHeight = 0.15;
    this.speed = blockSize[0]*0.05;
    console.log(this.p.position);
  }
  move() {
    this.prevX = this.p.position.x;
    this.prevY = this.p.position.y;
    this.grav -= 0.005;
    this.p.position.y += this.grav;
    this.canJump = false;
    for (let i = 0; i < blocks.length; i++) {
      let b = blocks[i].b;
      if (
        this.collide(
          { x: this.p.position.x, y: this.p.position.y, w: this.w, h: this.h },
          { x: b.position.x, y: b.position.y, w: blocks[i].w, h: blocks[i].h }
        )
      ) {
        if (this.prevY > b.position.y) {
          this.grav = 0;
          this.canJump = true;
          this.p.position.y = b.position.y + blocks[i].h;
        } else {
          this.grav = 0;
          this.p.position.y = b.position.y - 1;
          this.grav -= 0.01;
        }
      }
    }
    if (key["ArrowLeft"]) {
      this.p.position.x -= this.speed;
    }
    if (key["ArrowRight"]) {
      this.p.position.x += this.speed;
    }

    for (let i = 0; i < blocks.length; i++) {
      let b = blocks[i].b;
      if (
        this.collide(
          { x: this.p.position.x, y: this.p.position.y, w: this.w, h: this.h },
          { x: b.position.x, y: b.position.y, w: blocks[i].w, h: blocks[i].h }
        )
      ) {
        if (this.prevX < b.position.x) {
          this.p.position.x = b.position.x - this.w;
        }
        if (this.prevX > b.position.x) {
          this.p.position.x = b.position.x + blocks[i].w;
        }
      }
    }

    if (this.canJump && key["ArrowUp"]) {
      this.grav += this.jumpHeight;
    }
    // this.p.setPosition()
  }
  collide(a, b) {
    return (
      a.x - b.x < b.w && b.x - a.x < a.w && a.y - b.y < b.h && b.y - a.y < a.h
    );
  }
}
