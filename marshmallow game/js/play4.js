const canvas = document.getElementById("canvas");
const c = new Canvas();
const worldWidth = 4000;
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
let background = c.image("./assets/caveBG.png", 0, 0, 4000, window.innerHeight);

document.getElementById("left").innerHTML =
  window.innerWidth + "," + window.innerHeight;

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
ground = [
  { x: 0, y: 663 },
  { x: 20, y: 663 },
  { x: 40, y: 663 },
  { x: 60, y: 663 },
  { x: 80, y: 662 },
  { x: 100, y: 663 },
  { x: 120, y: 662 },
  { x: 140, y: 663 },
  { x: 160, y: 662 },
  { x: 180, y: 662 },
  { x: 200, y: 662 },
  { x: 220, y: 662 },
  { x: 240, y: 662 },
  { x: 260, y: 663 },
  { x: 280, y: 662 },
  { x: 300, y: 663 },
  { x: 320, y: 662 },
  { x: 340, y: 662 },
  { x: 360, y: 662 },
  { x: 380, y: 663 },
  { x: 400, y: 663 },
  { x: 420, y: 662 },
  { x: 440, y: 663 },
  { x: 460, y: 662 },
  { x: 480, y: 662 },
  { x: 500, y: 662 },
  { x: 520, y: 662 },
  { x: 540, y: 662 },
  { x: 560, y: 663 },
  { x: 580, y: 663 },
  { x: 600, y: 662 },
  { x: 620, y: 662 },
  { x: 640, y: 661 },
  { x: 660, y: 657 },
  { x: 680, y: 650 },
  { x: 700, y: 640 },
  { x: 720, y: 628 },
  { x: 740, y: 613 },
  { x: 760, y: 606 },
  { x: 780, y: 604 },
  { x: 800, y: 604 },
  { x: 820, y: 604 },
  { x: 840, y: 604 },
  { x: 860, y: 604 },
  { x: 880, y: 604 },
  { x: 900, y: 604 },
  { x: 920, y: 604 },
  { x: 940, y: 610 },
  { x: 960, y: 621 },
  { x: 980, y: 635 },
  { x: 1000, y: 646 },
  { x: 1020, y: 654 },
  { x: 1040, y: 659 },
  { x: 1060, y: 662 },
  { x: 1080, y: 662 },
  { x: 1100, y: 663 },
  { x: 1120, y: 662 },
  { x: 1140, y: 662 },
  { x: 1160, y: 662 },
  { x: 1180, y: 663 },
  { x: 1200, y: 662 },
  { x: 1220, y: 662 },
  { x: 1240, y: 660 },
  { x: 1260, y: 650 },
  { x: 1280, y: 635 },
  { x: 1300, y: 616 },
  { x: 1320, y: 597 },
  { x: 1340, y: 579 },
  { x: 1360, y: 563 },
  { x: 1380, y: 554 },
  { x: 1400, y: 552 },
  { x: 1420, y: 557 },
  { x: 1440, y: 565 },
  { x: 1460, y: 574 },
  { x: 1480, y: 582 },
  { x: 1500, y: 587 },
  { x: 1520, y: 587 },
  { x: 1540, y: 587 },
  { x: 1560, y: 587 },
  { x: 1580, y: 586 },
  { x: 1600, y: 587 },
  { x: 1620, y: 586 },
  { x: 1640, y: 586 },
  { x: 1660, y: 586 },
  { x: 1680, y: 587 },
  { x: 1700, y: 587 },
  { x: 1720, y: 587 },
  { x: 1740, y: 586 },
  { x: 1760, y: 586 },
  { x: 1780, y: 587 },
  { x: 1800, y: 587 },
  { x: 1820, y: 587 },
  { x: 1840, y: 586 },
  { x: 1860, y: 587 },
  { x: 1880, y: 586 },
  { x: 1900, y: 561 },
  { x: 1900, y: 571 },
  { x: 1900, y: 575 },
  { x: 1900, y: 581 },
  { x: 1900, y: 587 },
  { x: 1920, y: 561 },
  { x: 1940, y: 562 },
  { x: 1960, y: 534 },
  { x: 1980, y: 534 },
  { x: 2000, y: 510 },
  { x: 2000, y: 512 },
  { x: 2000, y: 514 },
  { x: 2000, y: 520 },
  { x: 2000, y: 524 },
  { x: 2000, y: 530 },
  { x: 2000, y: 534 },
  { x: 2020, y: 509 },
  { x: 2040, y: 509 },
  { x: 2060, y: 742 },
  { x: 2080, y: 743 },
  { x: 2100, y: 743 },
  { x: 2120, y: 743 },
  { x: 2140, y: 743 },
  { x: 2160, y: 743 },
  { x: 2180, y: 744 },
  { x: 2200, y: 744 },
  { x: 2220, y: 509 },
  { x: 2240, y: 509 },
  { x: 2260, y: 534 },
  { x: 2280, y: 534 },
  { x: 2300, y: 559 },
  { x: 2320, y: 584 },
  { x: 2340, y: 584 },
  { x: 2360, y: 609 },
  { x: 2380, y: 609 },
  { x: 2400, y: 634 },
  { x: 2420, y: 634 },
  { x: 2440, y: 659 },
  { x: 2460, y: 684 },
  { x: 2480, y: 684 },
  { x: 2500, y: 684 },
  { x: 2520, y: 684 },
  { x: 2540, y: 684 },
  { x: 2560, y: 684 },
  { x: 2580, y: 684 },
  { x: 2600, y: 684 },
  { x: 2620, y: 684 },
  { x: 2640, y: 684 },
  { x: 2660, y: 644 },
  { x: 2680, y: 644 },
  { x: 2700, y: 644 },
  { x: 2720, y: 644 },
  { x: 2740, y: 664 },
  { x: 2760, y: 665 },
  { x: 2780, y: 664 },
  { x: 2800, y: 664 },
  { x: 2820, y: 684 },
  { x: 2840, y: 684 },
  { x: 2860, y: 684 },
  { x: 2880, y: 684 },
  { x: 2880, y: 739 },
  { x: 2900, y: 684 },
  { x: 2900, y: 739 },
  { x: 2920, y: 739 },
  { x: 2940, y: 734 },
  { x: 2960, y: 721 },
  { x: 2980, y: 710 },
  { x: 3000, y: 706 },
  { x: 3020, y: 703 },
  { x: 3040, y: 693 },
  { x: 3060, y: 686 },
  { x: 3080, y: 684 },
  { x: 3100, y: 684 },
  { x: 3120, y: 681 },
  { x: 3140, y: 675 },
  { x: 3160, y: 671 },
  { x: 3180, y: 669 },
  { x: 3200, y: 669 },
  { x: 3220, y: 672 },
  { x: 3240, y: 676 },
  { x: 3260, y: 678 },
  { x: 3280, y: 679 },
  { x: 3300, y: 678 },
  { x: 3320, y: 677 },
  { x: 3340, y: 674 },
  { x: 3360, y: 672 },
  { x: 3380, y: 670 },
  { x: 3400, y: 666 },
  { x: 3420, y: 660 },
  { x: 3440, y: 654 },
  { x: 3460, y: 648 },
  { x: 3480, y: 645 },
  { x: 3500, y: 644 },
  { x: 3520, y: 644 },
  { x: 3540, y: 645 },
  { x: 3560, y: 646 },
  { x: 3580, y: 647 },
  { x: 3600, y: 649 },
  { x: 3620, y: 653 },
  { x: 3640, y: 660 },
  { x: 3660, y: 668 },
  { x: 3680, y: 675 },
  { x: 3700, y: 682 },
  { x: 3720, y: 687 },
  { x: 3740, y: 691 },
  { x: 3760, y: 693 },
  { x: 3780, y: 696 },
  { x: 3800, y: 699 },
  { x: 3820, y: 700 },
  { x: 3840, y: 700 },
  { x: 3860, y: 699 },
  { x: 3880, y: 696 },
  { x: 3900, y: 694 },
  { x: 3920, y: 693 },
  { x: 3940, y: 693 },
  { x: 3960, y: 693 },
  { x: 3980, y: 691 },
  { x: 4000, y: 691 },
];
for (let i = 1; i < ground.length; i++) {
  ground[i].y = cMath.map(ground[i].y, 0, 917, 0, window.innerHeight);
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
    this.size = 80; //cMath.map(50, 0, 917, 0, window.innerHeight)
    this.shape = c.rect(x, y, this.size, this.size);

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
    // this.animFrame = c.rect(0, 0, 616.25 / 17, this.size);
        this.animFrame = c.rect(0, 0, this.size*10, this.size);
    this.animations = {
      forward: [
        c.image(
          "./assets/marshmallowForward.png",
          0,
          0,
          (2283.75 * 63) / this.size*2,
          this.size,
          false
        ),
        2283.75,
        63,
      ],
      right: [
        c.image(
          "./assets/marshmallowRight.png",
          0,
          0,
          (616.25 * 50) / this.size,
          this.size,
          true
        ),
        616.25,
        17,
      ],
      left: [
        c.image(
          "./assets/marshmallowLeft.png",
          0,
          0,
          (616.25 * 50) / this.size,
          this.size,
          true
        ),
        616.25,
        17,
      ],
    };

    this.imgAnim = c.animation(this.animFrame, "player");
    this.currentFrame = 0;
    this.currentAnim = "";
    this.runAnim("forward");

    this.animations[this.currentAnim][0].setPosition(0, 0);
    this.animFrame.setPosition(0, 0);

    this.frame = 0;
  }
  animate() {
    this.frame += 1;
    if (this.frame % 3 == 0)
      // this.currentFrame +=
      //   this.animations[this.currentAnim][1] /
      //   this.animations[this.currentAnim][2]; //14616 / 63;
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
      this.size / 2 -
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
          // { x: this.x + 25, y: this.y, w: 50, h: 50 },
          { x: this.x + this.size / 2, y: this.y, w: this.size, h: this.size },
          { vec1: vec1, vec2 }
        )
      ) {
        if (ground[i].gap) {
          continue;
        }
        let h = ground[i].y - ground[i - 1].y;
        let w = ground[i].x - ground[i - 1].x;
        let pos =
          (h / w) * (this.x + this.size / 2 - ground[i - 1].x) +
          ground[i - 1].y;

        if (pos - this.y > 0 && pos - this.y < this.size) {
          let a =
            Math.atan2(
              ground[i].y - ground[i - 1].y,
              ground[i].x - ground[i - 1].x
            ) *
            (180 / Math.PI);
          if (a > -this.slopeRange && a < this.slopeRange) {
            // this.y = pos - 50; //slope * (ground[i - 1].x - this.x) + ground[i - 1].y-50;
            this.y = pos - this.size;
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
    this.x = cMath.constrain(this.x, 25, 4000 - 75);

    this.y = cMath.constrain(this.y, 0, Height - 50);
    this.debug.setAttribute("x", this.x + 25);
    this.debug.setAttribute("y", this.y - 10);

    this.shape.setPosition(this.x, this.y);

    this.shape.setRotation(this.prevAngle, this.x + (this.size/2), this.y + this.size);
    this.animate();
    this.animations[this.currentAnim][0].setRotation(
      this.prevAngle,
      this.x + (this.size/2),
      this.y + this.size
    );
    // this.animFrame.setRotation(this.prevAngle,this.x + this.frameOffset, 0);
  }
}

let p = new Player(100, 0);
let bgground = c.image("./assets/ground.png", 0, 0, 4000, 754);

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
