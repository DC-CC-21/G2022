class CompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: "CompleteScene" });
  }
  preload() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.res = this.sys.game.res;

    this.H = 0.53;
    this.S = 0.8;
    this.ColorOffset = -0.1;
    this.ColorScale = 1.1;

    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
  }

  create() {
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.5);
    graphics.fillRect(0, 0, this.width, this.height);

    WebFont.load({
      google: {
        families: ["Luckiest Guy"],
      },
      active: () => {
        this.FinishText();
      },
    });
  }
  /**
   * Add the title text to the scene.
   * @private
   */
  FinishText() {
    // Add the title text.
    this.titleText = this.add.text(
      this.width / 2,
      this.height * 0.35,
      this.sys.game.finishState ? "You Win" : "You Lose",
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
}
