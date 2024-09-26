class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
    this.foodNames = [
      "bunTop",
      "burger",
      "burger2",
      "cheese",
      "lettuce",
      "onionRings",
      "pickles",
      "tomato",
    ];
    this.landedFoods = [];
    this.order = [];
    this.food;
  }
  preload() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    this.load.image("bunBottom", "assets/bunBottom.png");
    this.load.image("bunTop", "assets/bunTop.png");
    this.foodNames.forEach((name) => {
      this.load.image(name, `assets/${name}.png`);
    });

    let length = Math.floor(Math.random() * 15) + 1;
    this.order.push("bunTop");
    for (let i = 0; i < length; i++) {
      this.order.push(randomChoice(this.foodNames.slice(1)));
    }
    this.order.push("bunBottom");
  }

  createOrder() {
    this.order.reverse().forEach((name, index) => {
      let offsetY = spriteSize.height * spriteBox.scaleY;
      let f = this.add.image(
        spriteSize.width * 0.6,
        spriteSize.height * 0.4 +
          offsetY * this.order.length -
          index * offsetY,
        name
      );
      f.displayWidth = spriteSize.width;
      f.displayHeight = spriteSize.height;
    });
  }

  create() {
    document.addEventListener("keydown", (e) => {
      console.log(this.landedFoods.map((x) => x.name));
      switch (e.key) {
        case "ArrowLeft":
          this.base.setAccelerationX(-speed * 5);
          break;
        case "ArrowRight":
          this.base.setAccelerationX(speed * 5);
          break;
        default:
          break;
      }
    });
    document.addEventListener("keyup", (e) => {
      this.base.setAccelerationX(0);
      this.base.setVelocityX(0);
    });

    this.createOrder(); //.bind(this)();

    this.base = this.physics.add.sprite(
      400,
      this.height - spriteSize.height,
      "bunBottom"
    );
    this.base.setImmovable(true);
    this.base.body.setAllowGravity(false);
    this.base.setCollideWorldBounds(true);
    this.base.body.drag.setTo(500, 500);
    configureSize(this.base);

    this.food = this.physics.add.group({
      bounceX: 1,
      bounceY: 0,
      quantity: 5,
    });
    function foodGen() {
      const x = Phaser.Math.Between(
        spriteSize.width,
        this.width - spriteSize.width
      );
      let name = randomChoice(this.foodNames);
      let f = this.food.create(
        x,
        -spriteSize.height * 1.5,
        name
      );
      console.log(f.displayWidth);

      configureSize(f);

      f.name = name;
    }
    Phaser.Actions.RandomRectangle(
      this.food.getChildren(),
      this.physics.world.bounds
    );

    this.foodLoop = this.time.addEvent({
      delay: 1500,
      callback: foodGen,
      callbackScope: this,
      loop: true,
    });

    // colliders
    /**
     * Handle collision between food objects.
     * If the overlap on the y-axis is greater than or equal to the height of the food object,
     * then the food has landed and should be frozen in place.
     * If the food object is a bun top, then the game is over.
     * @param {Phaser.Physics.Arcade.Sprite} f - The first food object.
     * @param {Phaser.Physics.Arcade.Sprite} f2 - The second food object.
     */
    this.physics.add.collider(this.food, undefined, (f, f2) => {
      let overlapY = Phaser.Math.Distance.Between(
        f.y,
        0,
        f2.y,
        0
      );

      if (overlapY >= f.displayHeight * spriteBox.scaleY) {
        // If the food has landed and is not a bun top, then freeze it in place.
        if (!f.landed && f.name !== "bunTop") {
          f.landed = true;
          freezeObject(f);
          landedFoods.push(f);
        } else if (!f2.landed && f2.name !== "bunTop") {
          f2.landed = true;
          freezeObject(f2);
          this.landedFoods.push(f2);
        } else if (f.name === "bunTop" || f2.name === "bunTop") {
          // If the food is a bun top, then the game is over.
          this.foodLoop.destroy();
          f.x = this.base.x;
          f2.x = this.base.x;

          if (
            compareArr(
              this.order,
              this.landedFoods.map((f) => f.name)
            )
          ) {
            console.log("Complete");
            this.sys.game.finishState = true;
          } else {
            console.log("Failed");
          }

          this.scene.start("CompleteScene");
          this.physics.pause();
        }
      } else {
        // If the food has not landed, then give it a velocity in the x-direction
        // that is twice the velocity of the base object.
        let BVX = this.base.body.velocity.x;
        f2.setVelocityX(BVX * 2);
      }
    });
    /**
     * Handle collision between the base and food objects.
     * If the food object lands on the base, then freeze it in place and add it to the list of landed foods.
     * @param {Phaser.Physics.Arcade.Sprite} b - The base object.
     * @param {Phaser.Physics.Arcade.Sprite} f - The food object.
     */
    this.physics.add.collider(this.base, this.food, (b, f) => {
      if (f.body.blocked.down && !b.touched) {
        // Freeze the food in place.
        freezeObject(f);

        // Add the food to the list of landed foods.
        this.landedFoods.push(f);

        // Set the food object to have landed.
        f.landed = true;

        // Set the base object to have been touched.
        b.touched = true;
      }
    });
  }

  update() {
    this.landedFoods.forEach((f, i) => {
      if (f) {
        f.setVelocityX(0);
        f.x = lerp(
          f.x,
          this.base.x,
          ((this.landedFoods.length - i) / 20) ** 1.01
        );
      }
    });

    /**
     * Remove any food objects that are off the bottom of the screen.
     * This is done to prevent the food objects from accumulating and
     * using up too much memory.
     */
    this.food.children.iterate((f) => {
      if (!f) {
      } else if (f.y > this.height + f.displayHeight) {
        // Destroy the food object if it is off the bottom of the screen.
        f.destroy();
      }
    });
  }
}
