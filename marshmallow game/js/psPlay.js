var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#000",
  parent: "game-container",
  //   pixelArt: true,
  physics: {
    // default: "arcade",
    default: "matter",
    matter: {
      gravity: { y: 0.3 },
      debug: false,
    },
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  // scale: {
  //     scaleMode: Phaser.ScaleManager.RESIZE
  // }
};

var game = new Phaser.Game(config);
const gameState = {
  speed: 3,
  scale: 0.2,
  canJump: false,
  jumpHeight: -6,
  touch: [],
};
function createLayer(map, name, scale) {
  let tileset = map.addTilesetImage(`${name}Map`, name);
  let layer = map.createLayer(name, tileset).setScale(scale);
  return layer;
}
function preload() {
  //images
  this.load.image("extras", "assets/tilemaps/extrasMap.png");
  this.load.image("snow", "assets/tilemaps/snowMap.png");
  this.load.image("tree", "assets/tilemaps/treeMap.png");
  this.load.image("player", "assets/characters/alvielNew.png");
  this.load.image("background", "assets/backgrounds/snowbg.png");

  //tilemaps
  this.load.tilemapTiledJSON("map", "assets/tilemaps/test2.json");

  //animations
  this.load.spritesheet("playerR", "assets/animations/marshmallowRight.png", {
    frameWidth: 232,
    frameHeight: 320,
  });
  this.load.spritesheet("playerL", "assets/animations/marshmallowLeft.png", {
    frameWidth: 232,
    frameHeight: 320,
  });
  this.load.spritesheet(
    "playerIdle",
    "assets/animations/marshmallowForward.png",
    {
      frameWidth: 232,
      frameHeight: 320,
    }
  );
}

function create() {
    this.add.image(0,0, 'background').setOrigin(0,0).setScale(1.5).setPosition(0, -300)

  const map = this.make.tilemap({ key: "map" });

  //arrange in z order
  const treeLayer = createLayer(map, "tree", gameState.scale);
  const extrasLayer = createLayer(map, "extras", gameState.scale);
  const snowLayer = createLayer(map, "snow", gameState.scale);

  // map.setCollisionByExclusion([-1, 0]);
  map.setCollisionByProperty({ collide: true });

  this.matter.world.convertTilemapLayer(snowLayer);
  this.matter.world.convertTilemapLayer(extrasLayer);

  this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
  gameState.player = this.matter.add
    .sprite(100, 600, "playerIdle")
    .setScale(0.2)
    .setFixedRotation();
  //arcade
  //   map.setCollisionByProperty({ collide: true });
  //   this.physics.add.collider(gameState.player, layer1);

  //animations
  this.anims.create({
    key: "playerRunR",
    frames: this.anims.generateFrameNumbers("playerR", { start: 0, end: 15 }),
    frameRate: 25,
    repeat: -1,
  });
  this.anims.create({
    key: "playerRunL",
    frames: this.anims.generateFrameNumbers("playerL", { start: 0, end: 15 }),
    frameRate: 25,
    repeat: -1,
  });
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("playerIdle", {
      start: 0,
      end: 62,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //camera
  this.cameras.main.setBounds(0, 0, game.width, game.height);

  this.cameras.main.startFollow(gameState.player);
  gameState.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameState.cursors.right.isDown || gameState.touch["right"]) {
    gameState.player.setVelocityX(gameState.speed);
    gameState.player.anims.play("playerRunR", true);
  } else if (gameState.cursors.left.isDown || gameState.touch["left"]) {
    gameState.player.setVelocityX(-gameState.speed);
    gameState.player.anims.play("playerRunL", true);
  } else {
    gameState.player.setVelocityX(0);
    gameState.player.anims.play("idle", true);
  }

  if (gameState.cursors.up.isDown || gameState.touch["up"]) {
    if (gameState.canJump) {
      gameState.player.setVelocityY(gameState.jumpHeight);
      gameState.canJump = false;
    }
  }

  this.matter.world.on("collisionactive", function (event) {
    gameState.canJump = true;
  });
}

document.addEventListener("touchstart", (e) => {
  gameState.touch[e.target.id] = true;
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
        gameState.touch[button.id] = false;
      }
    }
  });
  gameState.touch[e.target.id] = false;
});
