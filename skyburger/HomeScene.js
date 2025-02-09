class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: "HomeScene" });
  }
  preload() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.res = this.sys.game.res;

    this.shades = 20;

    this.H = 0.53;
    this.S = 0.8;
    this.ColorOffset = -0.1;
    this.ColorScale = 1.1;

    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

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
    this.foodNames.forEach((name) => {
      this.load.image(name, `assets/${name}.png`);
    });
  }

  create() {
    let rectHeight = this.height / this.shades;
    for (let i = 0; i <= this.height; i += rectHeight * 1) {
      let color = Phaser.Display.Color.HSLToColor(
        this.H,
        this.S,
        1 -
          ((i * this.ColorScale) / this.height) * 0.5 +
          this.ColorOffset
      ).color32;
      let rectangle = this.add.rectangle(
        this.width / 2,
        i + rectHeight / 2,
        this.width,
        rectHeight,
        0xffffff
      );
      rectangle.setFillStyle(color);
    }

    WebFont.load({
      google: {
        families: ["Luckiest Guy"],
      },
      active: () => {
        console.log("font loaded");
        this.addTitleText();
        this.addPlayButton();
      },
    });

    this.addFallingFood();
  }

  /**
   * Add the title text to the scene.
   * @private
   */
  addTitleText() {
    // Add the title text.
    this.titleText = this.add.text(
      this.width / 2,
      this.height * 0.2,
      "SkyBurger",
      {
        fontFamily: "Luckiest Guy",
        fontSize: 60 * this.res,
        color: "#ff0000",
      }
    );

    // Set the text shadow, padding, and origin.
    this.titleText.setShadow(5, 15, "#000000", 5, false, true);
    this.titleText.setPadding(64 * this.res, 16 * this.res);
    this.titleText.setOrigin(0.5, 0.5);

    // Create a gradient to fill the text with.
    const gradient = this.titleText.context.createLinearGradient(
      0,
      25,
      0,
      this.titleText.height * 0.8
    );

    // Set the gradient colors.
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(1, "#ffffff");

    // Set the gradient as the fill for the text.
    this.titleText.setFill(gradient);
    this.titleText.depth = 1;
  }

  /**
   * Add the play button to the scene.
   * @private
   */
  addPlayButton() {
    const buttonColor = 0x0000ff; // blue
    const playButton = this.add.text(
      this.width / 2,
      this.height * 0.4,
      "Play",
      {
        fontFamily: "Luckiest Guy",
        fontSize: 32 * this.res,
        color: "#ffffff", // white text color
        align: "center",
        fixedWidth: 160 * this.res,
      }
    );
    playButton.setPadding(3 * this.res);
    playButton.setOrigin(0.5);

    // Create a new Graphics object to draw the button
    const graphics = this.add.graphics();
    graphics.lineStyle(5 * this.res, buttonColor); // blue fill color
    graphics.strokeRoundedRect(
      0,
      0,
      playButton.width + 20 * this.res,
      playButton.height + 20 * this.res,
      10 * this.res // rounded corner radius
    );

    // Set the graphics object as a child of the playButton
    this.add.container(
      playButton.x - playButton.width / 2 - 10 * this.res,
      playButton.y - playButton.height / 2 - 10 * this.res,
      [graphics]
    );

    // Set the depth of the graphics object to a lower value than the playButton
    playButton.depth = 2;
    graphics.depth = 2;

    // Set the interactive properties of the playButton
    playButton.setInteractive({
      useHandCursor: true,
    });

    /**
     * Add hover effect when the button is hovered
     */
    playButton.on("pointerover", () => {
      playButton.setScale(1.1);
    });

    /**
     * Add out effect when the button is not hovered
     */
    playButton.on("pointerout", () => {
      playButton.setScale(1);
    });

    /**
     * Start the PlayScene when the button is clicked
     */
    playButton.on("pointerdown", () => {
      this.scene.start("PlayScene");
    });
    this.scene.start("PlayScene");
  }

  /**
   * Adds falling food objects to the scene. The food objects are created
   * randomly at the top of the screen and fall down to the bottom of the
   * screen. The food objects are also given a random name from the foodNames
   * array.
   *
   * @function addFallingFood
   * @memberof HomeScene
   * @instance
   */
  addFallingFood() {
    // Create a group of food objects with a quantity of 5
    this.food = this.physics.add.group({
      bounceX: 1,
      bounceY: 0,
      quantity: 10,
    });

    // Function to generate a food object at a random position at the top
    // of the screen
    function foodGen() {
      // Get a random x position within the bounds of the screen
      const x = Phaser.Math.Between(
        spriteSize.width,
        this.width - spriteSize.width
      );

      // Get a random name from the foodNames array
      let name = randomChoice(this.foodNames);

      // Create a food object with the random position and name
      let f = this.food.create(
        x,
        -spriteSize.height * 1.5,
        name
      );

      // Set the depth of the food object to 0 so that it is drawn under
      // the other objects in the scene
      f.depth = 0;

      // Configure the size of the food object
      configureSize(f);

      // Set the name of the food object
      f.name = name;
    }

    // Randomly position the food objects within the bounds of the screen
    Phaser.Actions.RandomRectangle(
      this.food.getChildren(),
      this.physics.world.bounds
    );

    // Create a timer that calls the foodGen function every 1500ms
    const foodLoop = this.time.addEvent({
      delay: 1500,
      callback: foodGen,
      callbackScope: this,
      loop: true,
    });

    // this.scene.start("PlayScene")
    // this.sys.game.finishState = true
    // this.scene.start("CompleteScene")
  }

  update() {
    if (this.titleText) {
      this.titleText.rotation =
        Math.sin(Date.now() * 0.002) * 0.1;
    }

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
