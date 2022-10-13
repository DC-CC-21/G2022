const canvas = document.getElementById("canvas");
const c = new Canvas();
const worldWidth = 5000;
c.createCanvas(worldWidth, window.innerHeight, canvas);
console.log(window.innerHeight);
// c.rotate(40)
let rect = c.rect(100, 100, 50, 50);
let ellipse = c.ellipse(200, 125, 50, 25);
let line = c.line(125 - 25 / 2, 125, 200, 125);

let frame = 0;
let ground = [];
let keys = [];
let points = [];

c.background(255, 0, 0);

let y = 0,
  scale = 0.7;
class Point {
  constructor(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.s = 10;
    this.shape = c.ellipse(pos.x, pos.y, 10, 10);
    this.clicked = false;
  }
  click(i) {
    this.clicked = i;
  }
  drag(e) {
    if (this.clicked) {
      this.x = e.clientX - Number(canvas.style.left.replace("px", ""));
      this.y = e.clientY;
      this.shape.setPosition(this.x, this.y);
      this.changeWorld(this.clicked);
    }
  }
  changeWorld() {
    document
      .querySelectorAll(".line")
      [this.clicked - 1].setAttribute("x2", this.x + "px");
    document
      .querySelectorAll(".line")
      [this.clicked - 1].setAttribute("y2", this.y + "px");
    document
      .querySelectorAll(".line")
      [this.clicked].setAttribute("x1", this.x + "px");
    document
      .querySelectorAll(".line")
      [this.clicked].setAttribute("y1", this.y + "px");
    ground[this.clicked] = { x: this.x, y: this.y };
    this.recalculateNormals();
  }
  recalculateNormals() {
    for (let i = 1; i >= 0; i--) {
      let vec = cMath.findNormal(
        ground[this.clicked - i],
        ground[this.clicked + (1 - i)],
        50
      );

      document
        .querySelectorAll(".normal")
        [this.clicked - i].setAttribute("x1", vec[0].x + "px");
      document
        .querySelectorAll(".normal")
        [this.clicked - i].setPositionY(vec[0].y, "y1");

      document
        .querySelectorAll(".normal")
        [this.clicked - i].setAttribute("x2", vec[1].x + "px");
      document
        .querySelectorAll(".normal")
        [this.clicked - i].setAttribute("y2", vec[1].y + "px");
    }
  }
}

//draw random points
for (let i = 0; i < worldWidth; i += worldWidth / 50) {
  let mr = c.rect(i, Height / 2, 2000 / 60, 2000 / 56);

  //   let y = cMath.sin(i) * (1000-i) * 0.2;

  if (i) {
    y = cMath.lerp(cMath.random(-100, 100), y, scale);
  } else {
    y = cMath.lerp(cMath.random(-100, 100), 0, scale);
  }
  mr.setTranslation(0, y);

  let t = c.text(
    i,
    mr.getTPosition().x + 1000 / 60,
    mr.getTPosition().y + 1000 / 56 + 8
  );
  t.setRotation(i, t.getTPosition().x, t.getTPosition().y - 8);

  ground.push({ x: mr.getTPosition().x, y: mr.getTPosition().y });
  points.push(new Point({ x: mr.getTPosition().x, y: mr.getTPosition().y }));
}
// ground= [
//   {x: 0, y: 646, gap:false},
// {x: 40, y: 646, gap:false},
// {x: 80, y: 669, gap:false},
// {x: 120, y: 669, gap:false},
// {x: 160, y: 669, gap:false},
// {x: 200, y: 670, gap:false},
// {x: 240, y: 669, gap:false},
// {x: 280, y: 663, gap:false},
// {x: 320, y: 640, gap:false},
// {x: 360, y: 599, gap:false},
// {x: 400, y: 541, gap:false},
// {x: 440, y: 490, gap:true},
// {x: 480, y: 471, gap:true},
// {x: 520, y: 460, gap:false},
// {x: 560, y: 454, gap:false},
// {x: 600, y: 453, gap:false},
// {x: 640, y: 448, gap:false},
// {x: 680, y: 465, gap:false},
// {x: 720, y: 523, gap:false},
// {x: 760, y: 596, gap:false},
// {x: 800, y: 642, gap:false},
// {x: 840, y: 670, gap:false},
// {x: 880, y: 680, gap:false},
// {x: 920, y: 681, gap:false},
// {x: 960, y: 663, gap:false},
// {x: 1000, y: 631, gap:false},
// {x: 1040, y: 606, gap:false},
// {x: 1080, y: 599, gap:false},
// {x: 1120, y: 587, gap:false},
// {x: 1160, y: 588, gap:false},
// {x: 1200, y: 605, gap:false},
// {x: 1240, y: 669, gap:false},
// {x: 1280, y: 716, gap:false},
// {x: 1320, y: 733, gap:false},
// {x: 1360, y: 733, gap:false},
// {x: 1400, y: 733, gap:false},
// {x: 1440, y: 727, gap:false},
// {x: 1480, y: 733, gap:false},
// {x: 1520, y: 727, gap:false},
// {x: 1560, y: 727, gap:false},
// {x: 1600, y: 715, gap:false},
// {x: 1640, y: 675, gap:false},
// {x: 1680, y: 588, gap:false},
// {x: 1720, y: 581, gap:false},
// {x: 1760, y: 581, gap:false},
// {x: 1800, y: 558, gap:false},
// {x: 1840, y: 535, gap:false},
// {x: 1880, y: 534, gap:false},
// {x: 1920, y: 535, gap:false},
// {x: 1960, y: 547, gap:false},
// ]
for (let i = 1; i < ground.length; i++) {
  if (!ground[i].gap) {
    c.stroke(255, 255, 0);
    let l = c.line(ground[i - 1].x, ground[i - 1].y, ground[i].x, ground[i].y);
    l.classList.toggle("line");
    l.setTranslation(0, 0);

    var vec = cMath.findNormal(ground[i - 1], ground[i], 50);
    c.stroke(0, 0, 255);
    l = c.line(vec[0].x, vec[0].y, vec[1].x, vec[1].y);
    l.classList.toggle("normal");
  }
}

class Player {
  constructor(x, y) {
    c.fill(255, 40, 150);
    this.shape = c.rect(x, y, 50, 50);

    c.stroke(0, 255, 0);
    this.debug = c.text("debug", x + 25, y, x + 25, 100);
    this.grav = 0;
    this.y = 0;
    this.x = x;
    this.prevAngle = 0;
    this.canJump = false;
    this.speed = 2;
    this.slopeRange = 60;
    //animation
    this.animFrame = c.rect(0, 0, 616.25 / 17, 50);
    this.animations = {
      forward: [
        c.image("./assets/marshmallowForward.png", 0, 0, 2283.75, 50, true),
        2283.75,
        63,
      ],
      right: [
        c.image("./assets/marshmallowRight.png", 0, 0, 616.25, 50, true),
        616.25,
        17,
      ],
      left: [
        c.image("./assets/marshmallowLeft.png", 0, 0, 616.25, 50, true),
        616.25,
        17,
      ],
    };

    this.imgAnim = c.animation(this.animFrame, "player");
    this.currentFrame = 0;
    this.currentAnim = "";
    this.runAnim("forward");

    this.animations[this.currentAnim][0].setPosition(100, 100);
    this.animFrame.setPosition(100, 100);

    this.frame = 0;
  }
  animate() {
    this.frame += 1;
    if (this.frame % 3 == 0)
      this.currentFrame +=
        this.animations[this.currentAnim][1] /
        this.animations[this.currentAnim][2]; //14616 / 63;
    if (this.currentFrame >= this.animations[this.currentAnim][1]) {
      console.log(
        this.currentAnim,
        this.currentFrame,
        this.animations[this.currentAnim]
      );
      this.currentFrame = 0;
    }
    this.animations[this.currentAnim][0].setPosition(
      this.x + this.frameOffset - this.currentFrame,
      this.y
    );
    this.animFrame.setPosition(this.x + this.frameOffset, this.y);
  }

  runAnim(name) {
    if (this.currentAnim == name) {
      return;
    }

    this.currentAnim = name;
    this.frameOffset =
      50 / 2 -
      this.animations[this.currentAnim][1] /
        this.animations[this.currentAnim][2] /
        2;

    for (let i in this.animations) {
      this.animations[i][0].setAttribute("class", "hidden");
      this.animations[i][0].setAttribute("clip-path", `url(#player)`);
    }
    this.animations[name][0].classList.remove("hidden");
    this.currentFrame = 0;
  }
  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.canJump = false;
    this.grav += 0.1;
    this.y += this.grav;

    for (let i = 1; i < ground.length; i++) {
      let vec1 = ground[i - 1].x < ground[i].x ? ground[i - 1] : ground[i];
      let vec2 = ground[i - 1].x > ground[i].x ? ground[i - 1] : ground[i];
      if (
        cMath.AABBL(
          { x: this.x + 25, y: this.y, w: 50, h: 50 },
          { vec1: vec1, vec2 }
        )
      ) {
        if (ground[i].gap) {
          continue;
        }
        let h = ground[i].y - ground[i - 1].y;
        let w = ground[i].x - ground[i - 1].x;
        let pos = (h / w) * (this.x + 25 - ground[i - 1].x) + ground[i - 1].y;

        if (pos - this.y > 0 && pos - this.y < 50) {
          let a =
            Math.atan2(
              ground[i].y - ground[i - 1].y,
              ground[i].x - ground[i - 1].x
            ) *
            (180 / Math.PI);
          if (a > -this.slopeRange && a < this.slopeRange) {
            this.y = pos - 50; //slope * (ground[i - 1].x - this.x) + ground[i - 1].y-50;
            this.grav = 0;
            this.canJump = true;

            //sets angle for box
            let angle =
              Math.atan2(
                ground[i].y - ground[i - 1].y,
                ground[i].x - ground[i - 1].x
              ) *
              (180 / Math.PI);
            this.prevAngle = cMath.lerp(this.prevAngle, angle, 0.2);
            if (this.prevAngle != angle) {
              this.prevAngle = cMath.constrain(this.prevAngle, -30, 30);
            }
          } else {
            this.y = pos;
            // this.grav = 0;
            this.grav += 5;
            break;
          }
        }
      } else {
        this.prevAngle = cMath.lerp(this.prevAngle, 0, 0.001);
      }
    }

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
      this.shape.setPositionX(this.x);

      this.runAnim("left");
    } else if (keys["ArrowRight"]) {
      this.x += this.speed;
      this.shape.setPositionX(this.x);
      //   this.animFrame.setPositionX(this.x);

      //   this.animations[this.currentAnim][0].setPositionX(this.x)

      this.runAnim("right");
    } else {
      this.runAnim("forward");
    }

    // for (let i = 1; i < ground.length; i++) {
      
    //       let a =
    //         Math.atan2(
    //           ground[i].y - ground[i - 1].y,
    //           ground[i].x - ground[i - 1].x
    //         ) *
    //         (180 / Math.PI);
    //       if (a < -this.slopeRange) {
    //         // this.x = this.prevX-25;
    //       }
    //       else if (a > this.slopeRange) {
    //         this.x = this.prevX+25;
    //       }
    //     }
    //   }
    // }


    if (keys["ArrowUp"] && this.canJump) {
      this.grav -= 5;
    }
    this.x = cMath.constrain(this.x, 25, Width - 50 * 1.5);

    this.y = cMath.constrain(this.y, 0, Height - 50);
    this.debug.setAttribute("x", this.x + 25);
    this.debug.setAttribute("y", this.y - 10);

    this.shape.setPosition(this.x, this.y);

    this.shape.setRotation(this.prevAngle, this.x + 25, this.y + 50);
    this.animate();
    this.animations[this.currentAnim][0].setRotation(
      this.prevAngle,
      this.x + 25,
      this.y + 50
    );
    // this.animFrame.setRotation(this.prevAngle,this.x + this.frameOffset, 0);
  }
}

let p = new Player(100, 0);

c.callibrateCamera(
  window.innerWidth / 2,
  Height / 2,
  0,
  Width,
  0,
  window.innerHeight
);
let cameraX = 0;

// let animFrame = c.rect(0, 0, 616.25 / 17, 320);
// let animations = {
//   forward: [
//     c.image("./assets/marshmallowForward.png", 0, 0, 14616, 320, true),
//     14616,
//   ],
//   right: [
//     c.image("./assets/marshmallowRight.png", 0, 0, 616.25, 50, true),
//     616.25,
//   ],
//   left: [c.image("./assets/marshmallowLeft.png", 0, 0, 3944, 320, true), 3944],
// };
// animations.right[0].setAttribute("clip-path", `url(#forward)`);

// animations.left[0].remove();
// animations.forward[0].remove();

// let imgAnim = c.animation(animFrame, "forward", 90, 100, 1);
// let currentFrame = 0;
// let currentAnim = "right";

function draw() {
  frame += 1;
  requestAnimationFrame(draw);
  if (frame % 1 == 0) {
    cameraX = cMath.lerp(cameraX, p.x + 25, 0.1);
    c.moveCamera(cameraX, 0);

    rect.setRotation(frame, 200, 125);
    ellipse.setRotation(-frame, 200, 125);
    line.setRotation(frame, 200, 125);

    p.move();
  }
}
draw();
// document.getElementById('console').innerHTML = cMath.add()
let mousePos = c.ellipse(0, 0, 10, 10);

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.addEventListener("mousemove", (e) => {
  mousePos.setPosition(
    e.clientX - Number(canvas.style.left.replace("px", "")),
    e.clientY
  );
  for (let i = 1; i < ground.length; i++) {
    if (
      e.clientX - Number(canvas.style.left.replace("px", "")) >=
        ground[i - 1].x &&
      e.clientX - Number(canvas.style.left.replace("px", "")) <= ground[i].x &&
      e.clientY >= ground[i - 1].y &&
      e.clientY <= ground[i].y
    ) {
      let h = ground[i].y - ground[i - 1].y;
      let w = ground[i].x - ground[i - 1].x;
      var dst = (h / w) * (e.clientX - ground[i - 1].x) + ground[i - 1].y;

      mousePos.setPosition(
        e.clientX - Number(canvas.style.left.replace("px", "")),
        dst
      );
    }
  }
  for (let i = 0; i < points.length; i++) {
    if (points[i].clicked) {
      points[i].drag(e);
    }
  }
});

document.addEventListener("mousedown", (e) => {
  for (let i = 0; i < points.length; i++) {
    if (
      cMath.dist(
        e.clientX - Number(canvas.style.left.replace("px", "")),
        e.clientY,
        points[i].x,
        points[i].y
      ) < points[i].s
    ) {
      points[i].shape.setAttribute("fill", "gold");
      points[i].click(i);
      return;
    }
  }
});

document.addEventListener("mouseup", (e) => {
  for (let i = 0; i < points.length; i++) {
    points[i].clicked = false;
  }
});
