class Button {
    constructor(self) {
      for (let i = 0; i < Object.keys(self).length; i++) {
        this[Object.keys(self)[i]] = self[Object.keys(self)[i]];
      }
     
    }
    display() {
      strokeWeight(this.strokeWeight || 1);
      stroke(this.stroke || 0);
      
      fill(color(this.fill) || 255);
      if (this.help) {
        if (this.isin()) {
          fill(0, 255, 0, 100);
        }
      }
      switch (this.shape) {
        case "rect":
          rect(this.x, this.y, this.w, this.h);
          break;
        case "ellipse":
          ellipse(this.x, this.y, this.radius, this.radius);
      }
      if(this.text){
        fill(this.tFill || 255);
        stroke(this.tStroke || this.tFill)
        textSize(this.tSize);
        text(this.text,this.x + this.tx, this.y + this.ty);
      }
      
    }
    isin() {
      if (this.shape === "rect") {
        return (
          mouseX > this.x &&
          mouseX < this.x + this.w &&
          mouseY > this.y &&
          mouseY < this.y + this.h
        );
      } else {
        return dist(this.x, this.y, mouseX, mouseY) < this.radius / 2;
      }
    }
    click() {
      if (this.isin()) {
        this.cmd();
      }
    }
  }