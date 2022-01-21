import Phaser, { DOWN } from 'phaser';

export default class GameoverScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;
  private newGameContainer!: Phaser.GameObjects.Container;
  private newGameBox!: Phaser.GameObjects.Image;
  private newGameText!: Phaser.GameObjects.BitmapText;
  private scoreText!: Phaser.GameObjects.BitmapText;
  private highScoreText!: Phaser.GameObjects.BitmapText;

  constructor() {
    super('gameover-scene');
  }

  create() {
    const { width, height } = this.scale;
    this.sound.stopAll();
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.add
      .bitmapText(width / 2, height / 2 - 60, 'font', 'GAME OVER', 12)
      .setOrigin(0.5, 0.5);

    this.container = this.add.container(0, 0);

    this.scoreText = this.add
      .bitmapText(0, -20, 'font', `Score: ${this.registry.values.scores}`, 8)
      .setOrigin(0.5, 0.5);

    if (this.registry.values.scores > this.registry.values.highscore) {
      this.registry.values.highscore = this.registry.values.scores;
    }

    this.highScoreText = this.add
      .bitmapText(
        0,
        0,
        'font',
        `Highscore: ${this.registry.values.highscore}`,
        8
      )
      .setOrigin(0.5, 0.5);

    // new game container
    this.newGameBox = this.add
      .image(0, 0, 'box')
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
    this.newGameText = this.add
      .bitmapText(this.newGameBox.x, this.newGameBox.y, 'font', 'MENU', 8)
      .setOrigin(0.5, 0.5);

    this.newGameContainer = this.add.container(0, 40, [
      this.newGameBox,
      this.newGameText,
    ]);
    this.newGameBox
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.newGameBox.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.newGameBox.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.newGameBox.setTint(0xffffff);
        this.startMenu();
      });

    // addon subcontainer to container
    this.container.add(this.scoreText);
    this.container.add(this.highScoreText);
    this.container.add(this.newGameContainer);

    // display to center
    Phaser.Display.Align.In.Center(this.container, bg);
  }

  private startMenu() {
    this.scene.start('menu-scene');
  }

  update() {}
}
