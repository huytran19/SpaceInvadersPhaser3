import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;
  private newGameContainer!: Phaser.GameObjects.Container;
  private newGameBox!: Phaser.GameObjects.Image;
  private newGameText!: Phaser.GameObjects.BitmapText;
  private soundContainer!: Phaser.GameObjects.Container;
  private soundBox!: Phaser.GameObjects.Image;
  private soundText!: Phaser.GameObjects.BitmapText;
  private soundMute!: Phaser.GameObjects.Image;
  private resumeContainer!: Phaser.GameObjects.Container;
  private resumeBox!: Phaser.GameObjects.Image;
  private resumeText!: Phaser.GameObjects.BitmapText;

  constructor() {
    super('pause-scene');
  }

  // init() {}

  create() {
    const { width, height } = this.scale;
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.container = this.add.container(0, 0);
    //   // new game container
    this.newGameBox = this.add
      .image(0, 0, 'box')
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
    this.newGameText = this.add
      .bitmapText(this.newGameBox.x, this.newGameBox.y, 'font', 'QUIT', 8)
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
        this.quit();
      });

    //   // sound container
    this.soundBox = this.add
      .image(0, 0, 'box')
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
    this.soundText = this.add
      .bitmapText(this.soundBox.x - 12, this.soundBox.y, 'font', 'SOUND', 8)
      .setOrigin(0.5, 0.5);
    this.soundMute = this.add
      .image(this.soundBox.x + 24, this.soundBox.y, 'check')
      .setOrigin(0.5, 0.5)
      .setScale(0.35);
    if (this.registry.values.mute) {
      this.soundMute.setTexture('cross');
    }
    this.soundContainer = this.add.container(0, 20, [
      this.soundBox,
      this.soundText,
      this.soundMute,
    ]);
    this.soundBox
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.soundBox.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.soundBox.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.soundBox.setTint(0xffffff);
        this.toggleSound();
      });

    // level container
    this.resumeBox = this.add
      .image(0, 0, 'box')
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
    this.resumeText = this.add
      .bitmapText(this.newGameBox.x, this.newGameBox.y, 'font', 'RESUME', 8)
      .setOrigin(0.5, 0.5);

    this.resumeContainer = this.add.container(0, 0, [
      this.resumeBox,
      this.resumeText,
    ]);
    this.resumeBox
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.resumeBox.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.resumeBox.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.resumeBox.setTint(0xffffff);
        this.unpauseGame();
      });

    //   // addon subcontainer to container
    this.container.add(this.newGameContainer);
    this.container.add(this.soundContainer);
    this.container.add(this.resumeContainer);

    //   // display to center
    Phaser.Display.Align.In.Center(
      this.container,
      this.add.zone(width * 0.5, height * 0.5, width, height)
    );
  }

  private toggleSound() {
    if (!this.registry.values.mute) {
      this.registry.values.mute = !this.registry.values.mute;
      this.soundMute.setTexture('cross');
    } else {
      this.registry.values.mute = !this.registry.values.mute;
      this.soundMute.setTexture('check');
    }
    this.sound.mute = this.registry.values.mute;
  }

  private quit() {
    this.scene.stop('game-scene');
    this.scene.stop('pause-scene');
    this.scene.start('menu-scene');
  }

  private unpauseGame() {
    this.scene.run('HUDScene');
    this.scene.setVisible(true, 'game-scene');
    this.scene.resume('game-scene');
    this.scene.sleep('pause-scene');
  }
  update() {}
}
