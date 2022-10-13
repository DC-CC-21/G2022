var DemoState = (function (Phaser) {
  var DemoState = function () {
    // Feature configuration values that we'll use to control our game state
    this.features = {
      // Arcade slopes
      slopes: true,
      minimumOffsetY: true,
      pullUp: 0,
      pullDown: 0,
      pullLeft: 0,
      pullRight: 0,
      snapUp: 0,
      snapDown: 0,
      snapLeft: 0,
      snapRight: 0,

      // Camera controls
      cameraZoom: 1.0,
      cameraMicroZoom: 0.0,
      cameraRotation: 0.0,
      cameraMicroRotation: 0.0,
      cameraLerp: 0.1,
      cameraFollow: true,
      cameraRoundPixels: false,

      // Collision controls
      particleSelfCollide: 0,

      // Debug controls
      debugLayers: false,
      debugPlayerBody: false,
      debugPlayerBodyInfo: false,
      debugCameraInfo: false,
      debugInputInfo: false,

      // Player controls
      acceleration: 2000,
      dragX: 1200,
      dragY: 0,
      bounceX: 0,
      bounceY: 0,
      frictionX: 0,
      frictionY: 0,
      jump: 500,
      wallJump: 350,
      shape: "aabb",
      size: 96,
      anchorX: 0.5,
      anchorY: 0.5,

      // Tilemaps
      tilemapOffsetX1: 0,
      tilemapOffsetY1: 0,
      tilemapOffsetX2: 0,
      tilemapOffsetY2: 0,

      // World
      gravity: 1000,
      enableGravity: true,

      // Fun
      slowMotion: 1,
      debug: 0,
    };
  };
  DemoState.prototype = {
    preload: function () {
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
      // Load our assets (a demo map and two tilesets)
      this.load.tilemap(
        "demo-tilemap",
        "https://hexus.github.io/phaser-arcade-slopes/assets/maps/demo.json",
        "../levels/tilemap.json",
        null,
        Phaser.Tilemap.TILED_JSON
      );
      this.load.image(
        "pink-collision-spritesheet",
        "http://hexus.github.io/phaser-arcade-slopes/assets/tilesets/ninja-tiles32-pink.png",
        32,
        32
      );
      this.load.image(
        "arcade-slopes-spritesheet",
        "http://hexus.github.io/phaser-arcade-slopes/assets/tilesets/arcade-slopes-32-pink.png",
        32,
        32
      );
    },

    create: function () {
      // I always have this on :)
			this.time.advancedTiming = true;
			
			// Start up Arcade Physics
			this.physics.startSystem(Phaser.Physics.ARCADE);
			
			// Give it a bit of a boost ;)
			this.game.arcadeSlopesPlugin = this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
			
			// Set the stage background colour
			this.stage.backgroundColor = '#8d549b';
			
			// Create the tilemap object from the map JSON data
			this.map = this.add.tilemap('demo-tilemap');
			
			// Attach the tileset images to the tilesets defined in the tilemap
			// this.map.addTilesetImage('collision', 'pink-collision-spritesheet');
			this.map.addTilesetImage('arcade-slopes-32', 'arcade-slopes-spritesheet');
			
			// Create TilemapLayer objects from the collision layers of the map
			this.ground = this.map.createLayer('collision');
			// this.ground2 = this.map.createLayer('collision2');
			this.ground.resizeWorld();
			
			// Enable collision between the appropriate tile indices for each
			// layer in the map
			this.map.setCollisionBetween(2, 34, true, 'collision');
			this.map.setCollisionBetween(49, 73, true, 'collision2');
			
			// Map Arcade Slopes tile types to the correct tilesets, preparing
			// slope data for each tile in the layers
			this.game.slopes.convertTilemapLayer(this.ground, 'ninja');
			// this.game.slopes.convertTilemapLayer(this.ground2, 'arcadeslopes', 49);
			
			// Create a player sprite
			this.player = this.add.sprite(595, 384);
			
			// Create a graphics object for the player
			this.playerGraphics = new Phaser.Graphics(this);
			
			// Generate a texture for the player and give it a physics body
			this.updatePlayer(this.player);
			
			// Set the gravity
			this.physics.arcade.gravity.y = 1000;
			
			// Add a touch of tile padding for the collision detection
			this.player.body.tilePadding.x = 1;
			this.player.body.tilePadding.y = 1;
			
			// Set the initial properties of the player's physics body
			this.player.body.drag.x = this.features.dragX;
			this.player.body.bounce.x = this.features.bounceX;
			this.player.body.bounce.y = this.features.bounceY;
			this.player.body.slopes.friction.x = this.features.featuresX;
			this.player.body.slopes.friction.y = this.features.featuresY;
			this.player.body.maxVelocity.x = 500;
			this.player.body.maxVelocity.y = 1000;
			this.player.body.collideWorldBounds = true;
			
      //   //create anims
      //   this.anims.create({
      //     key: "runR",
      //     frames: this.anims.generateFrameNumbers("marshR", {
      //       start: 0,
      //       end: 15,
      //     }),
      //     frameRate: 25,
      //     repeat: -1,
      //   });
      //   this.anims.create({
      //     key: "runL",
      //     frames: this.anims.generateFrameNumbers("marshL", {
      //       start: 0,
      //       end: 15,
      //     }),
      //     frameRate: 25,
      //     repeat: -1,
      //   });
      //   this.anims.create({
      //     key: "runF",
      //     frames: this.anims.generateFrameNumbers("marshF", {
      //       start: 0,
      //       end: 62,
      //     }),
      //     frameRate: 10,
      //     repeat: -1,
      //   });
      //   player.anims.play('runF', true)
      this.camera.follow(this.player);

      // Smooth out the camera movement with linear interpolation (lerp)
      this.camera.lerp.setTo(this.features.cameraLerp);
      this.controls = this.input.keyboard.createCursorKeys();
      console.log("create");
    },
    updatePlayer(player) {
    	var features = this.features;
			var graphics = this.playerGraphics;
			var size = features.size;
			var halfSize = Math.floor(features.size * 0.5);
			
			// Update the player's anchor
			player.anchor.set(features.anchorX, features.anchorY);
			
			// Determine whether we need to update the player
			if (player.body && player.body.height === features.size && player.body.isCircle == features.shape) {
				// If the player has a body, and the body's height hasn't
				// changed, we don't need to update it
				return;
			}
			
			// Enable physics for the player (give it a physics body)
			this.physics.arcade.enable(player);
			
			// Start the graphics instructions
			graphics.clear();
			graphics._currentBounds = null; // Get Phaser to behave
			graphics.beginFill(Phaser.Color.hexToRGB('#e3cce9'), 1);
			
			// Set an AABB physics body
			if (features.shape === 'aabb') {
				player.body.setSize(halfSize, size);
				graphics.drawRect(0, 0, halfSize, size);
			}
			
			// Set a circular physics body
			if (features.shape == 'circle') {
				player.body.setCircle(halfSize);
				graphics.drawCircle(0, 0, features.size);
			}
			
			// Create a Pixi texture from the graphics and give it to the player
			player.setTexture(graphics.generateTexture(), true);
			
			// We don't have to update the player sprite size, but it's good to
			if (features.shape === 'aabb') {
				player.width = halfSize;
				player.height = size;
			}
			
			if (features.shape === 'circle') {
				player.width = size;
				player.height = size;
			}
			
			// Enable Arcade Slopes physics
			if (this.game.slopes) {
				player.body.slopes = null; // TODO: Fix Phaser.Util.Mixin or use something else
				this.game.slopes.enable(player);
			}
    },
    update: function () {
	// Update the player
    this.updatePlayer(this.player);
			
    // Define some shortcuts to some useful objects
    var body = this.player.body;
    var camera = this.camera;
    var gravity = this.physics.arcade.gravity;
    var blocked = body.blocked;
    var touching = body.touching;
    var controls = this.controls;
    var features = this.features;
    
    // Update slow motion values; these two are great fun together
    // ( ͡° ͜ʖ ͡°)
    if (this.time.slowMotion !== features.slowMotion) {
        this.time.slowMotion = features.slowMotion;
        this.time.desiredFps = 60 + (features.slowMotion > 1 ? features.slowMotion * 20 : 0);
    }
    
    // Update camera zoom and rotation
    camera.scale.set(
        features.cameraZoom + features.cameraMicroZoom
    );
    camera.rotation = Phaser.Math.degToRad(
        features.cameraRotation + features.cameraMicroRotation
    );
    // this.game.input.scale.set(
    // 	1.0 / (features.cameraZoom + features.cameraMicroZoom)
    // );
    
    // Update camera linear interpolation and pixel rounding
    camera.lerp.set(features.cameraLerp);
    camera.roundPx = features.cameraRoundPixels;
    
    // Toggle camera follow
    if (features.cameraFollow && !camera.target) {
        camera.follow(this.player);
        camera.lerp.set(0.2);
    }
    
    if (!features.cameraFollow && camera.target) {
        camera.unfollow();
    }
    

    
    // Update gravity
    if (features.enableGravity) {
        gravity.y = features.gravity;
    } else {
        gravity.y = 0;
    }
    
    // Update player body properties
    body.drag.x = features.dragX;
    body.drag.y = features.dragY;
    body.bounce.x = features.bounceX;
    body.bounce.y = features.bounceY;
    
    // Update player body Arcade Slopes properties
    body.slopes.friction.x = features.frictionX;
    body.slopes.friction.y = features.frictionY;
    body.slopes.preferY    = features.minimumOffsetY;
    body.slopes.pullUp     = features.pullUp;
    body.slopes.pullDown   = features.pullDown;
    body.slopes.pullLeft   = features.pullLeft;
    body.slopes.pullRight  = features.pullRight;
    body.slopes.snapUp     = features.snapUp;
    body.slopes.snapDown   = features.snapDown;
    body.slopes.snapLeft   = features.snapLeft;
    body.slopes.snapRight  = features.snapRight;
    
    // Offset the tilemap layers
    this.ground.tileOffset.x = features.tilemapOffsetX1;
    this.ground.tileOffset.y = features.tilemapOffsetY1;
    // this.ground2.tileOffset.x = features.tilemapOffsetX2;
    // this.ground2.tileOffset.y = features.tilemapOffsetY2;
    
    // Debug output for the tilemap
    this.ground.debug = features.debugLayers;
    this.ground.debugSettings.forceFullRedraw = this.ground.debug;
    // this.ground2.debug = this.ground.debug;
    this.ground.debugSettings.forceFullRedraw = this.ground.debug;
    
    
    // Toggle the Arcade Slopes plugin itself
    if (features.slopes && !this.game.slopes) {
        this.game.arcadeSlopesPlugin = this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
    }
    
    if (!features.slopes && this.game.slopes) {
        this.game.plugins.remove(this.game.arcadeSlopesPlugin);
        this.game.arcadeSlopes = null;
    }
    
    // Camera shake for the fun of it
    if (this.input.keyboard.isDown(Phaser.KeyCode.H)) {
        camera.shake(0.005, 50); // :sunglasses:
    }
    
    // Collide the player against the collision layer
    this.physics.arcade.collide(this.player, this.ground);
    this.physics.arcade.collide(this.player, this.ground2);
    
    // Reset the player acceleration
    body.acceleration.x = 0;
    body.acceleration.y = 0;
    
 // Accelerate left
 if (controls.left.isDown) {
    body.acceleration.x = -features.acceleration;
}

// Accelerate right
if (controls.right.isDown) {
    body.acceleration.x = features.acceleration;
}

// Accelerate or jump up
if (controls.up.isDown) {
    if (features.jump) {
        if (gravity.y > 0 && (blocked.down || touching.down)) {
            body.velocity.y = -features.jump;
        }
    }
    
    if (!features.jump || gravity.y <= 0){
        body.acceleration.y = -Math.abs(gravity.y) - features.acceleration;
    }
}

// Accelerate down or jump down
if (controls.down.isDown) {
    if (features.jump) {
        if (gravity.y < 0 && (blocked.up || touching.up)) {
            body.velocity.y = features.jump;
        }
    }
    
    if (!features.jump || gravity.y >= 0){
        body.acceleration.y = Math.abs(gravity.y) + features.acceleration;
    }
}

    },
  };
  return DemoState;
})(Phaser);

var state = new DemoState();
window.state = state;
var game = new Phaser.Game(
  window.innerWidth,
  window.innerHeight,
  Phaser.CANVAS,
  "phaser",
  state
);

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
