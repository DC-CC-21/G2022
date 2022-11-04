const canvas = document.getElementById("canvas");
const c = new Canvas();
const worldWidth = 4000;
c.createCanvas(worldWidth, window.innerHeight, canvas);
function cs(txt, rp) {
  if (rp) {
    document.getElementById("console").innerHTML = txt;
  } else {
    document.getElementById("console").append(txt + "\n");
  }
}
cs(window.innerWidth + "," + window.innerHeight, 1);

let frame = 0; //current framecount
let keys = []; //holds keys that are pressed

//
let Pheight = ~~cMath.map(80, 0, 1366, 0, window.innerWidth);
// let Pheight = cMath.map(80,0,917, 0, window.innerHeight);

let Pwidth = ~~(Pheight * 0.8);

let cameraX = 0;
let p;

let tileKeys = {
  //                 /
  //Left slopes  => /
  gentleLeftSlopeLeft: [11, 43],
  gentleLeftSlopeRight: [3, 35],
  steepLeftSlopeTop: [5, 21],
  steepLeftSlopeBottom: [13, 29],

  //              \
  //Right slopes   \ <=
  gentleRightSlopeLeft: [4, 36],
  gentleRightSlopeRight: [12, 44],
  steepRightSlopeTop: [6, 22],
  steepRightSlopeBottom: [14, 30],

  //                  ___
  // Half blocks Top
  HalfBlockTop: [7, 18],

  //
  // Half blocks bottom  __
  halfBlockBottom: [8, 15, 26],

  //slopes left and right / \
  slopeLeft: [10, 33],
  slopeRight: [2, 41],
};
c.background(255, 0, 0);
let background = c.image(
  // "./assets/backgrounds/caveBG.png",
  // "./assets/backgrounds/volcano.png",
  "./assets/backgrounds/ruins2.png",
  0,
  0,
  Pwidth * 35,
  window.innerHeight
);
//PLAYER
class Player {
  constructor(x, y) {
    c.fill(0, 0, 0, 0);
    this.height = Pheight;
    this.width = Pwidth; //cMath.map(50, 0, 917, 0, window.innerHeight)
    this.shape = c.rect(x, y, this.width, this.height);

    c.stroke(0, 255, 0);
    this.debug = c.text("debug", x + 25, y, x + 25, 100);
    this.grav = 0;
    this.y = y;
    this.x = x;
    this.prevAngle = 0;
    this.canJump = false;
    this.speed = 2;
    this.slopeRange = 60;
    this.isSlope = false;
    //animation
    this.animations = {
      forward: [
        c.image(
          "./assets/animations/marshmallowForward.png",
          0,
          0,
          this.width * 63,
          this.height,
          false
        ),
        this.width * 63,
        63,
      ],
      right: [
        c.image(
          "./assets/animations/marshmallowRight.png",
          0,
          0,
          this.width * 17,
          this.height,
          false
        ),
        this.width * 17,
        17,
      ],
      left: [
        c.image(
          "./assets/animations/marshmallowLeft.png",
          0,
          0,
          this.width * 17,
          this.height,
          false
        ),
        this.width * 17,
        17,
      ],
    };

    this.imgAnim = c.animation(
      this.animFrame,
      "player",
      this.width,
      this.height
    );
    this.currentFrame = 0;
    this.currentAnim = "";
    this.runAnim("forward");
    this.frame = 0;
    this.ps = c.ellipse(x, y, 20, 20);
  }
  animate() {
    this.frame += 1;
    if (this.frame % 3 == 0)
      this.currentFrame +=
        this.animations[this.currentAnim][1] /
        this.animations[this.currentAnim][2]; //14616 / 63;
    if (this.currentFrame >= this.animations[this.currentAnim][1]) {
      this.currentFrame = 0;
    }
  }

  runAnim(name) {
    if (this.currentAnim == name) {
      return;
    }

    this.currentAnim = name;
    this.frameOffset = 0;

    for (let i in this.animations) {
      this.animations[i][0].setAttribute("class", "hidden");
      this.animations[i][0].setAttribute("mask", `url(#player)`);
    }
    this.animations[name][0].classList.remove("hidden");
    this.currentFrame = 0;
  }
  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.canJump = false;
    this.isSlope = false;
    this.grav += 0.1;
    this.y += this.grav;

    //top collisions       |
    //                    \|/
    for (let i = 0; i < g.tiles.length; i++) {
      let tile = g.tiles[i][1];
      if (cMath.AABB(this, tile)) {
        cs(tile.type, 1);
        if (tile.type == "L") {
          let pos =
            (tile.height / tile.width) *
              (tile.x + tile.width - this.x - this.width / 2) +
            tile.y;
          if (
            this.x + this.width / 2 > tile.x &&
            this.x + this.width / 2 <= tile.x + tile.width &&
            this.y + this.height >= pos
          ) {
            // pos = cMath.constrain(pos, tile.y, tile.y + tile.height);
            this.y = pos - this.height;
            this.grav = 0;
            this.isSlope = true;
            break;
          }
        } else if (tile.type == "R") {
          let pos = -(tile.height / tile.width) * (tile.x - this.x) + tile.y;
          if (
            // this.x + this.width / 2 > tile.x &&
            // this.x + this.width / 2 <= tile.x + tile.width &&
            this.y + this.height >=
            pos
          ) {
            // pos = cMath.constrain(pos, tile.y, tile.y + tile.height);
            this.y = pos - this.height;
            this.grav = 0;
            this.isSlope = true;
            break;
          }
        } else if (this.prevY < tile.y) {
          this.grav = 0;
          this.canJump = true;
          this.y = tile.y - this.height;
        } else {
          this.grav = 0;
          this.grav += 0.5;
          this.y = tile.y + tile.height;
        }

        // }
      }
    }

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
      this.shape.setPositionX(this.x);

      this.runAnim("left");
    } else if (keys["ArrowRight"]) {
      this.x += this.speed;
      this.shape.setPositionX(this.x);
      this.runAnim("right");
    } else {
      this.runAnim("forward");
    }

    for (let i = 0; i < g.tiles.length; i++) {
      let tile = g.tiles[i][1];
      if (cMath.AABB(this, tile)) {
        if (this.isSlope) {
          break;
        }
        if (tile.type == "sq") {
          this.x =
            this.prevX < tile.x ? tile.x - this.width : tile.x + tile.width;
        }
      }
    }

    if (keys["ArrowUp"] && this.canJump) {
      this.grav -= 5;
    }
    this.x = cMath.constrain(
      this.x,
      this.width * 0.5,
      4000 - this.width * 1.25
    );

    this.y = cMath.constrain(this.y, 0, Height - this.height);
    this.debug.setAttribute("x", this.x + this.width / 2);
    this.debug.setAttribute("y", this.y - 10);

    this.shape.setPosition(this.x, this.y);
    this.imgAnim.children[0].setPosition(this.x, this.y);
    this.animations[this.currentAnim][0].setPosition(
      this.x + this.frameOffset - this.currentFrame,
      this.y
    );

    this.shape.setRotation(
      this.prevAngle,
      this.x + this.width / 2,
      this.y + this.height
    );

    this.animations[this.currentAnim][0].setRotation(
      this.prevAngle,
      this.x + this.width / 2,
      this.y + this.height - this.grav * 10
    );
    this.animate();
  }
}
class Game {
  constructor() {
    this.tiles = [];
    this.dim = { cols: 9, rows: 6 };
    this.ground = "grass";
    this.layer = {};
    this.create();
  }
  create() {
    fetch("./assets/tilemaps/test2.json")
      .then((response) => response.json())
      .then((jsObject) => {
        // get layers
        jsObject.layers.forEach((layer, index) => {
          this.layer[layer.name] = {
            data: layer.data,
            width: layer.width,
            height: layer.height,
            tilemap: jsObject.tilesets[index].name,
            index: index,
          };
          for (let i = 0; i < jsObject.tilesets.length; i++) {
            if (jsObject.tilesets[i].name.includes(layer.name)) {
              this.layer[layer.name].index = i;
            }
          }
        });
        // let layer1 = jsObject.layers[0];
        let s = Pheight / 2;
        let pPos = { x: 0, y: 0 };
        let totalTiles = 9 * 6; // cols * rows

        Object.keys(this.layer).forEach((layer, index) => {
          this.ground = layer;
          let layer1 = this.layer[this.ground];
          var min = this.dim.rows * this.dim.cols * layer1.index;
          var max = this.dim.rows * this.dim.cols * (layer1.index + 1);

          for (let i = 0; i < layer1.width; i++) {
            for (let j = 0; j < layer1.height; j++) {
              let id = layer1.data[layer1.width * j + i];
              id =
                id !== 0
                  ? ~~cMath.map(id, min, max, 0, this.dim.rows * this.dim.cols)
                  : 0;
              if (id == 39) {
                pPos = {
                  x: i * s,
                  y: (j - (layer1.height - window.innerHeight / s)) * s,
                };
              } else if (id) {
                this.createTile(
                  i,
                  j - (layer1.height - window.innerHeight / s),
                  id,
                  s
                );
              }
            }
          }
        });
        p = new Player(pPos.x, pPos.y - Pheight);
        c.callibrateCamera(
          window.innerWidth / 2,
          Height / 2,
          0,
          Width,
          0,
          window.innerHeight
        );
        draw();
      });
  }
  createTile(x, y, id, s) {
    let tile = c.image(
      `./assets/tilemaps/${this.ground}/tile${id}.png`,
      x * s,
      y * s,
      s,
      s
    );

    //Left Slopes /
    if (tileKeys.gentleLeftSlopeLeft.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s + s / 2,
          width: s,
          height: s / 2,
          id: id,
          type: "L",
        },
      ]);
    } else if (tileKeys.gentleRightSlopeRight.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s + s / 2,
          width: s,
          height: s / 2,
          id: id,
          type: "R",
        },
      ]);
    } else if (tileKeys.gentleLeftSlopeRight.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s,
          width: s,
          height: s / 2,
          id: id,
          type: "L",
        },
      ]);
    } else if (tileKeys.gentleRightSlopeLeft.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s,
          width: s,
          height: s / 2,
          id: id,
          type: "R",
        },
      ]);
    } else if (tileKeys.slopeLeft.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s,
          width: s,
          height: s,
          id: id,
          type: "L",
        },
      ]);
    } else if (tileKeys.slopeRight.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s,
          width: s,
          height: s,
          id: id,
          type: "R",
        },
      ]);
    } else if (tileKeys.steepLeftSlopeBottom.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s,
          width: s / 2,
          height: s,
          id: id,
          type: "L",
        },
      ]);
    } else if (tileKeys.steepRightSlopeBottom.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s + s / 2,
          y: y * s,
          width: s / 2,
          height: s,
          id: id,
          type: "R",
        },
      ]);
    } else if (tileKeys.steepLeftSlopeTop.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s + s / 2,
          y: y * s,
          width: s / 2,
          height: s,
          id: id,
          type: "L",
        },
      ]);
    } else if (tileKeys.steepRightSlopeTop.includes(id)) {
      //gentleSlopeRight
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s,
          width: s / 2,
          height: s,
          id: id,
          type: "R",
        },
      ]);
    }

    // half blocks
    else if (tileKeys.HalfBlockTop.includes(id)) {
      this.tiles.push([
        tile,
        { x: x * s, y: y * s, width: s, height: s / 2, id: id, type: "sq" },
      ]);
    } else if (tileKeys.halfBlockBottom.includes(id)) {
      this.tiles.push([
        tile,
        {
          x: x * s,
          y: y * s + s / 2,
          width: s,
          height: s / 2,
          id: id,
          type: "sq",
        },
      ]);
    } else {
      //normalSquare
      this.tiles.push([
        tile,
        { x: x * s, y: y * s, width: s, height: s, id: id, type: "sq" },
      ]);
    }

    // c.stroke(0);
    // c.fill(255, 255, 255);
    // c.text(id, x * s + s / 2, y * s + s / 1.5);
  }
  //   createTile(x, y, id, s) {
  //     var ty = ~~(id / 8);
  //     var tx = ~~(id % 8);
  //     let tileSize = cMath.map(256, 0, 706, 0, window.innerHeight) / 8;
  //     let tilemap = c.image(
  //       "./assets/tilemaps/tilemap.png",
  //       -tx * tileSize,
  //       -ty * tileSize,
  //       cMath.map(256, 0, 706, 0, window.innerHeight),
  //       cMath.map(256, 0, 706, 0, window.innerHeight) * 0.75,
  //       true
  //     );
  //     let tile = c.animation(tilemap, `tilemap${x * y}`, tileSize, tileSize);
  //     tilemap.setAttribute("mask", `url(#tilemap${x * y})`);
  // y-=3
  //     tile.children[0].setPosition(x * tileSize, y * tileSize);
  //     tilemap.setPosition(-tx * tileSize + x * tileSize, -ty * tileSize + y * tileSize);

  //     return [tile, tilemap];
  //   }
}
let g = new Game();

//END PLAYER

//CAMERA

//END CAMERA

function draw() {
  frame += 1;
  requestAnimationFrame(draw);
  if (frame % 1 == 0) {
    cameraX = cMath.lerp(cameraX, p.x + 25, 0.1);
    c.moveCamera(cameraX, 0);
    p.move();
  }
}
// draw();

let mousePos = c.ellipse(0, 0, 10, 10); //mouse position debugger

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key == " ") {
    console.log(JSON.stringify(ground));
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.addEventListener("mousemove", (e) => {
  mousePos.setPosition(
    e.clientX - Number(canvas.style.left.replace("px", "")),
    e.clientY
  );
});

document.addEventListener("mousedown", (e) => {});

document.addEventListener("mouseup", (e) => {});

document.addEventListener("touchstart", (e) => {
  if (e.target.innerHTML == "Left") {
    keys["ArrowLeft"] = true;
  }
  if (e.target.innerHTML == "Right") {
    keys["ArrowRight"] = true;
  }
  if (e.target.innerHTML == "Jump") {
    keys["ArrowUp"] = true;
  }
});
document.addEventListener("touchend", (e) => {
  Array.from(document.getElementById("buttons").children).forEach((button) => {
    var divRect = button.getBoundingClientRect();
    for (let i = 0; i < e.touches.length; i++) {
      if (
        e.touches[i].clientX >= divRect.left &&
        e.touches[i].clientX <= divRect.right &&
        e.touches[i].clientY >= divRect.top &&
        e.touches[i].clientY <= divRect.bottom
      ) {
        // Mouse is inside element.
      } else {
        if (e.target.innerHTML == "Left") {
          keys["ArrowLeft"] = false;
        }
        if (e.target.innerHTML == "Right") {
          keys["ArrowRight"] = false;
        }
        if (e.target.innerHTML == "Jump") {
          keys["ArrowUp"] = false;
        }
      }
    }
  });
  if (e.target.innerHTML == "Left") {
    keys["ArrowLeft"] = false;
  }
  if (e.target.innerHTML == "Right") {
    keys["ArrowRight"] = false;
  }
  if (e.target.innerHTML == "Jump") {
    keys["ArrowUp"] = false;
  }
});
