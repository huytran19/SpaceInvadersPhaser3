export default class HUDScene extends Phaser.Scene {
  private bitmapTexts!: Phaser.GameObjects.BitmapText[];
  private topContainer!: Phaser.GameObjects.Container;
  private bottomContainer!: Phaser.GameObjects.Container;
  private pauseContainer!: Phaser.GameObjects.Container;
  private pauseBox!: Phaser.GameObjects.Image;
  private leftLine!: Phaser.GameObjects.Image;
  private rightLine!: Phaser.GameObjects.Image;
  private levelText!: Phaser.GameObjects.BitmapText;
  private scoresText!: Phaser.GameObjects.BitmapText;
  private livesText!: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: 'HUDScene',
    });
  }

  init(): void {
    this.bitmapTexts = [];
  }

  create(): void {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setVisible(false);

    // Top container
    this.topContainer = this.add.container(0, 0);

    this.pauseBox = this.add
      .image(0, 0, 'square')
      .setScale(0.35)
      .setOrigin(0.5, 0.5);
    this.leftLine = this.add
      .image(-2, 0, 'line')
      .setScale(0.05)
      .setOrigin(0.5, 0.5);
    this.rightLine = this.add
      .image(2, 0, 'line')
      .setScale(0.05)
      .setOrigin(0.5, 0.5);

    this.pauseContainer = this.add.container(-103, 0, [
      this.pauseBox,
      this.leftLine,
      this.rightLine,
    ]);
    this.pauseBox
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.pauseBox.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.pauseBox.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.pauseBox.setTint(0xffffff);
        this.scene.setVisible(false, 'game-scene');
        this.scene.pause('game-scene');
        this.scene.run('pause-scene');
        this.scene.stop();
      });
    this.levelText = this.add
      .bitmapText(0, 0, 'font', `Level ${this.registry.values.level}`, 8)
      .setOrigin(0.5, 0.5);
    this.topContainer.add(this.pauseContainer);
    this.topContainer.add(this.levelText);

    Phaser.Display.Align.In.TopCenter(
      this.topContainer,
      bg,
      0,
      (-this.pauseBox.height / 2) * 0.35
    );

    // Bottom container
    this.bottomContainer = this.add.container(0, 0);
    this.scoresText = this.add
      .bitmapText(-56, 0, 'font', `Scores ${this.registry.values.scores}`, 8)
      .setOrigin(0.5, 0.5);
    this.livesText = this.add
      .bitmapText(56, 0, 'font', `Lives ${this.registry.values.lives}`, 8)
      .setOrigin(0.5, 0.5);

    this.bottomContainer.add(this.scoresText);
    this.bottomContainer.add(this.livesText);
    Phaser.Display.Align.In.BottomCenter(
      this.bottomContainer,
      bg,
      0,
      (-this.pauseBox.height / 2) * 0.35
    );
    // create events
    const level = this.scene.get('game-scene');
    level.events.on('scoresChanged', this.updateScores, this);
    level.events.on('livesChanged', this.updateLives, this);
  }

  private updateScores() {
    this.scoresText.setText(`Scores ${this.registry.get('scores')}`);
  }

  private updateLives() {
    this.livesText.setText(`Lives ${this.registry.get('lives')}`);
  }

  update() {}
}
