// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

const speed = 200;
const res = 5

const spriteSize = {
  width: 80*res,
  height: 50*res,
};
const spriteBox = {
  width: spriteSize.width,
  scaleY: 0.3,
};

const config = {
  res: res,
  type: Phaser.AUTO,
  // width: WIDTH,
  // height: HEIGHT,
  width: 390*res, 
  height: 844*res,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  parent: "phaser-container",
  backgroundColor: "#2d2d2d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speed },
      // debug: true,
    },
  },
  scene:[HomeScene,PlayScene, CompleteScene], /*{
    preload: preload,
    create: create,
    update: update,
    
  },*/
  pixelArt: true,
  antialias: false,
  // resolution: ,

};

class Game extends Phaser.Game{

  constructor(config){
    super(config);
    this.width = config.width;
    this.height = config.height;
    this.res = config.res

  }
}

// let game = new Phaser.Game(config);
let game = new Game(config);
