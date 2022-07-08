class Particle {
    constructor(x, y, aclX, aclY, lifeSpan) {
    this.pos = new PVector(x, y);
    this.s = 10;
    this.acl = new PVector(aclX, aclY);
    this.vel = new PVector(0, 0);
    this.lifeSpan = lifeSpan;
  };
  display = function () {
    c.fill(255, 255, 255, c.map(this.lifeSpan, 0, 100, 0, 1));
    c.stroke(0, 0, 0, 0);
    c.ellipse(this.pos.x, this.pos.y, this.s, this.s, true);
  };
  move = function () {
    this.lifeSpan -= 1;
    this.vel.add(this.acl);
    this.pos.add(this.vel);
  };

  run = function () {
    this.move();
    this.display();
  };
  die = function () {
    if(this.lifeSpan < 80){
    if (this.pos.x < 0 || this.pos.x > Width) {
      return true;
    } else if (this.y < 0 || this.pos.y > Height) {
      return true;
    }
   }
    return this.lifeSpan <= 0;
  };

};
class ParticleSystem {
  constructor(x, y, max, aclX, aclY, life, space) {
    this.particles = [];
    this.max = max;
    this.x = x;
    this.y = y;
    this.aclX = aclX;
    this.aclY = aclY;
    this.life = life;
    this.space = space;
    this.frame = 0;
  };
  addMore = function () {
    this.particles.push(
      new Particle(
        this.x,
        this.y,
        c.random(this.aclX.min, this.aclX.max),
        c.random(this.aclY.min, this.aclY.max),
        this.life
      )
    );
  };
  removeParticle = function (i) {
    if (this.particles[i].die()) {
      this.particles.splice(i, 1);
    }
  };
  run = function () {
    this.frame += 1;
    if (this.particles.length < this.max && this.frame % this.space === 0) {
      this.addMore();
    }
    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].run();
      this.removeParticle(i);
    }
  };
}
