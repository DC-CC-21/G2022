class Coin {
  constructor(x, y, size) {
    this.x = c.map(x, 0, 706, 0, Height);
    this.y = c.map(y, 0, 706, 0, Height);
    this.size = size / 2;
  }
  display() {
    c.fill(255,255,0)
    c.ellipse(this.x, this.y, this.size, this.size);
  }
  collect() {
    collectedCoins += 1;
  }
}
