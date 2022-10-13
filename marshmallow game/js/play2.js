var map;
var groundLayer, coinLayer;

function preload() {
  this.load.image(
    "bug1",
    "https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png"
  );
  this.load.image(
    "bug2",
    "https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png"
  );
  this.load.image(
    "bug3",
    "https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png"
  );
  this.load.image(
    "platform",
    // "./assets/mario blocks.svg"
    "https://content.codecademy.com/courses/learn-phaser/physics/platform.png"
  );
  this.load.image("avatar1", "./assets/googly.jpg");

  this.load.spritesheet("marshR", "./assets/marshmallowRight.png", {
    frameWidth: 232,
    frameHeight: 320,
  });
  this.load.spritesheet("marshL", "./assets/marshmallowLeft.png", {
    frameWidth: 232,
    frameHeight: 320,
  });
  this.load.spritesheet("marshF", "./assets/marshmallowForward.png", {
    frameWidth: 232,
    frameHeight: 320,
  });
  this.load.tilemapTiledJSON(
    "map",
    "./levels/tilemap.json"
  );
  this.load.image("tiles2", "./assets/tiles4.png");
}

const gameState = {
  width: window.innerWidth,
  height: window.innerHeight,
  canJump:true,
};


function create() {
  //create tilemap
  map = this.make.tilemap({ key: 'map', frameWidth:83, frameHeight:83});
  var tileset = map.addTilesetImage('tiles4', 'tiles2');
  var groundLayer = map.createDynamicLayer('Tile Layer 1', tileset, 0, 0).setScale(1);
  console.log(groundLayer) 
  groundLayer.setCollisionByProperty({ active: true });
  map.setCollisionByExclusion([ -1, 0 ]);
  this.matter.world.convertTilemapLayer(groundLayer);

  //for arcade
  // gameState.player = this.physics.add.sprite(225, -200, "marshL").setScale(0.3);

  //for matter
  gameState.playerController = {
    matterSprite: this.matter.add.sprite(0, 0, 'marshF', 1).setScale(.5),
    blocked: {
        left: false, 
        right: false,
        bottom: false
    },
    numTouching: {
        left: 0,
        right: 0,
        bottom: 0
    },
    sensors: {
        bottom: null,
        left: null,
        right: null
    },
    time: {
        leftDown: 0,
        rightDown: 0
    },
    lastJumpedAt: 0,
    speed: {
        run: 5,
        jump: 12
    }
};
  
// var M = Phaser.Physics.Matter.Matter;
// var w = gameState.playerController.matterSprite.width;
// var h = gameState.playerController.matterSprite.height;

// // Move the sensor to player center
// var sx = w / 2;
// var sy = h / 2;
// var playerBody = M.Bodies.rectangle(sx, sy, w * 0.75, h, { chamfer: { radius: 10 } });
// gameState.playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 5, { isSensor: true });
// gameState.playerController.sensors.left = M.Bodies.rectangle(sx - w * 0.45, sy, 5, h * 0.25, { isSensor: true });
// gameState.playerController.sensors.right = M.Bodies.rectangle(sx + w * 0.45, sy, 5, h * 0.25, { isSensor: true });
// var compoundBody = M.Body.create({
//     parts: [
//         playerBody, gameState.playerController.sensors.bottom, gameState.playerController.sensors.left,
//         gameState.playerController.sensors.right
//     ],
//     restitution: 0.05 // Prevent body from sticking against a wall
// });

gameState.playerController.matterSprite
//     // .setExistingBody(compoundBody)
//     .setFixedRotation() // Sets max inertia to prevent rotation
    .setPosition(50,0);

  
  
  
  //animations and camera
  this.anims.create({
    key: "runR",
    frames: this.anims.generateFrameNumbers("marshR", { start: 0, end: 15 }),
    frameRate: 25,
    repeat: -1,
  });
  this.anims.create({
    key: "runL",
    frames: this.anims.generateFrameNumbers("marshL", { start: 0, end: 15 }),
    frameRate: 25,
    repeat: -1,
  });
  this.anims.create({
    key: "runF",
    frames: this.anims.generateFrameNumbers("marshF", { start: 0, end: 62 }),
    frameRate: 10,
    repeat: -1,
  });

  // this.cameras.main.setBounds(0, 0, gameState.width * 2, gameState.height);
  this.cameras.main.startFollow(gameState.playerController.matterSprite);


  gameState.cursors = this.input.keyboard.createCursorKeys();
  gameState.touch = [];
  console.log(gameState.playerController.speed)
}
// function create() {
//   //for arcade
//   // gameState.player = this.physics.add.sprite(225, -200, "marshL").setScale(0.3);

//   //for matter
//   gameState.player = this.matter.add.sprite(225, -200, "marshL").setScale(0.3);

//   this.anims.create({
//     key: "runR",
//     frames: this.anims.generateFrameNumbers("marshR", { start: 0, end: 15 }),
//     frameRate: 25,
//     repeat: -1,
//   });
//   this.anims.create({
//     key: "runL",
//     frames: this.anims.generateFrameNumbers("marshL", { start: 0, end: 15 }),
//     frameRate: 25,
//     repeat: -1,
//   });
//   this.anims.create({
//     key: "runF",
//     frames: this.anims.generateFrameNumbers("marshF", { start: 0, end: 62 }),
//     frameRate: 10,
//     repeat: -1,
//   });
//   this.cameras.main.setBounds(0, 0, gameState.width * 2, gameState.height);
//   this.cameras.main.startFollow(gameState.player);
//   gameState.player.body.bounce.set(0.18);

//   // Add your code below:
//   const platforms = this.physics.add.staticGroup();
//   platforms.create(225, 610, "platform");
//   platforms.create(725, 710, "platform");

//   this.physics.add.collider(gameState.player, platforms, () => {
//     gameState.canJump = true;
//   });
//   this.physics.add.collider(groundLayer, gameState.player, () => {
//     gameState.canJump = true;
//   });
//   gameState.cursors = this.input.keyboard.createCursorKeys();
//   gameState.touch = [];
// }

function update() {
  if (gameState.cursors.left.isDown || gameState.touch["Left"]) {
    gameState.playerController.matterSprite.setVelocityX(-gameState.playerController.speed.run);
    gameState.playerController.matterSprite.anims.play("runL", true);
    // gameState.player.anims.play("runR", false);
  } else if (gameState.cursors.right.isDown || gameState.touch["Right"]) {
    gameState.playerController.matterSprite.anims.play("runR", true);
    gameState.playerController.matterSprite.setVelocityX(gameState.playerController.speed.run);
  } else {
    gameState.playerController.matterSprite.anims.play("runF", true);
    gameState.playerController.matterSprite.setVelocityX(0);
  }
  if (gameState.cursors.up.isDown || gameState.touch["Jump"]) {
    if (gameState.canJump) {
      gameState.playerController.matterSprite.setVelocityY(-10);
      gameState.canJump = false;
    }
  } else {
    // gameState.player.setVelocityY(-20)
  }
  this.matter.world.on('collisionactive', function (event){
    gameState.canJump = true;
  })
  // document.querySelector('p').innerHTML = JSON.stringify({touch:gameState.touch}).replace(/\{|\}|,/g,'<br>')
}

// const config = {
//   type: Phaser.AUTO,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   backgroundColor: "b9eaff",
//   physics: {
//     default: "arcade",
//     arcade: {
//       gravity: { y: 300 },
//       enableBody: true,
//       debug: true,
//     },
//   },
//   parent: "canvas",
//   // resolution:3,
//   scene: {
//     preload,
//     create,
//     update,
//   },
// };
var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  parent: 'phaser-example',
  pixelArt: false,
  physics: {
      default: 'matter',
      matter: {
          gravity: { y: 2 },
          enableSleep: false,
          debug: true
      }
  },
  scene: {
      key: 'main',
      preload: preload,
      create: create,
      update: update
  }
};

const game = new Phaser.Game(config);

document.addEventListener("touchstart", (e) => {
  // document.querySelector('p').innerHTML = JSON.stringify({x:e.touches[0].clientX, y:e.touches[0].clientY, target:e.target.innerHTML}).replace(/\{|\}|,/g,'<br>')
  document.querySelector("p").innerHTML = JSON.stringify(
    document.querySelectorAll("*:active")
  );
  gameState.touch[e.target.innerHTML] = true;
});
document.addEventListener("touchend", (e) => {
  // document.querySelector('p').innerHTML = JSON.stringify({x:e.touches[0].clientX, y:e.touches[0].clientY, target:e.target.innerHTML}).replace(/\{|\}|,/g,'<br>')
  // document.querySelector('p').innerHTML = e.target.innerHTML
  Array.from(document.getElementById("buttons").children).forEach((button) => {
    console.log(button, "hi");
    var divRect = button.getBoundingClientRect();
    document.querySelector("p").innerHTML = button.innerHTML;
    for (let i = 0; i < e.touches.length; i++) {
      if (
        e.touches[i].clientX >= divRect.left &&
        e.touches[i].clientX <= divRect.right &&
        e.touches[i].clientY >= divRect.top &&
        e.touches[i].clientY <= divRect.bottom
      ) {
        // Mouse is inside element.
      } else {
        gameState.touch[button.innerHTML] = false;
      }
    }
  });
  gameState.touch[e.target.innerHTML] = false;
});
