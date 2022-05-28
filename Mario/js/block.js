


console.log("Blocks are Loading");

class Block {
  constructor(x, y, size, type, offset) {
    this.x = c.map(x, 0, 706, 0, Height);
    this.y = c.map(y, 0, 706, 0, Height);
    this.w = size.w;
    this.h = size.h;
    this.jumpHeight = 5;
    this.grav = 0;
    this.origY = this.y;
    this.type = type;
    this.theta = 0;
    this.origY = this.y;

    this.offsetX = offset.x;
    this.offsetY = offset.y;

    this.vel = { x: 0, y: 0 };

    //path block
    if (this.type[0] == "path") {
      /*this.type[0]
        pathway:[[100,300],[800,300]],
        startIndex:0,
        amount:0.05,
        error:10
      */
      this.set_path(this.type[1])
    }
     
  }

  set_path(pathBlockInfo){
    this.pathway = pathBlockInfo.pathway;

    this.idx = pathBlockInfo.startIndex + 1;//current position inn this.pathway
    this.error = pathBlockInfo.error;// distance error threshold
    this.vector = {
      p1: {
        x: this.pathway[this.idx - 1][0],
        y: this.pathway[this.idx - 1][1],
      },
      p2: {
        x: this.pathway[this.idx][0],
        y: this.pathway[this.idx][1],
      },
    };//points p1 and p2
    this.x = this.vector.p1.x-this.w/2; //this.pathway[0][0];
    this.y = this.vector.p1.y-this.h/2; //this.pathway[0][1];
    this.direction = 1;
    this.amount = c.map(pathBlockInfo.amount,0,706,0,Height)
  }

  path() {
    // c.ellipse(this.vector.p1.x, this.vector.p1.y, 10, 10);
    // c.ellipse(this.vector.p2.x, this.vector.p2.y, 10, 10);

    this.x = c.lerp(this.x, this.vector.p2.x-this.w/2, this.amount); //solution but to fast(this.x * 0.9 + this.vector.p2.x * 0.1);
    this.y = c.lerp(this.y, this.vector.p2.y-this.h/2, this.amount); //solution but to fast(this.y * 0.9 + this.vector.p2.y * 0.1);

    if (
      c.dist(this.x+this.w/2, this.y+this.h/2, this.vector.p2.x, this.vector.p2.y) < this.error
    ) {
      this.idx += this.direction;
      if (this.idx > this.pathway.length - 1) {
        this.idx -= 1;
        this.direction *= -1;
      } else if (this.idx < 0) {
        this.idx += 1;
        this.direction *= -1;
      }
      this.vector = {
        p1: {
          x: this.x,
          y: this.y,
        },
        p2: {
          x: this.pathway[this.idx][0],
          y: this.pathway[this.idx][1],
        },
      };
    }
  }

  display() {
    this[this.type[0]]();
    switch (this.type[0]) {
      case "regular":
        c.fill("#885500");
        c.stroke(0, 0, 0);
        break;
      case "moving":
        c.fill("#22dd00");
        break;
      case "path":
        c.fill(75, 75, 75);
        break;
    }
    if(this.pathway){
      for(let i = 1; i < this.pathway.length; i ++){
        c.line(this.pathway[i-1][0], this.pathway[i-1][1], this.pathway[i][0], this.pathway[i][1])
      }
    }
    c.rect(this.x, this.y, this.w * 0.95, this.h, 2);
  }

  moving() {
    if (this.type[1] == "v") {
      this.theta += 0.01;
      this.y = 50 * Math.sin(this.theta) + this.origY;
    }
  }

  regular() {
    this.recenter();
  }

  recenter() {
    if (this.y < this.origY) {
      this.grav += 0.1;
      this.y += this.grav;
    } else if (
      c.dist(this.x, this.y, this.x, this.origY) < c.map(1, 0, 706, 0, Height)
    ) {
      this.y = this.origY;
      this.grav = 0;
    } else if (c.dist(this.x, this.y, this.x, this.origY) != 0) {
      this.y -= this.y - this.origY;
    }
  }
}

//old arc = 85mm;
//old rad = 99mm;
