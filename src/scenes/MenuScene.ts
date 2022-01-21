import Phaser, { DOWN } from 'phaser';

export default class MenuScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;
  private newGameContainer!: Phaser.GameObjects.Container;
  private newGameBox!: Phaser.GameObjects.Image;
  private newGameText!: Phaser.GameObjects.BitmapText;
  private soundContainer!: Phaser.GameObjects.Container;
  private soundBox!: Phaser.GameObjects.Image;
  private soundText!: Phaser.GameObjects.BitmapText;
  private soundMute!: Phaser.GameObjects.Image;
  private levelContainer!: Phaser.GameObjects.Container;
  private levelBox!: Phaser.GameObjects.Image;
  private levelMinus!: Phaser.GameObjects.Image;
  private levelAdd!: Phaser.GameObjects.Image;
  private levelText!: Phaser.GameObjects.BitmapText;
  private levelGame!: Phaser.GameObjects.Text;

  constructor() {
    super('menu-scene');
  }

  init() {
    this.initGlobalDataManager();
  }

  create() {
    const { width, height } = this.scale;
    this.sound.stopAll();
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.add
      .bitmapText(width / 2, height / 2 - 60, 'font', 'SPACE INVADERS', 12)
      .setOrigin(0.5, 0.5);

    this.container = this.add.container(0, 0);
    // new game container
    this.newGameBox = this.add
      .image(0, 0, 'box')
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
    this.newGameText = this.add
      .bitmapText(this.newGameBox.x, this.newGameBox.y, 'font', 'NEW GAME', 8)
      .setOrigin(0.5, 0.5);

    this.newGameContainer = this.add.container(0, 0, [
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
        this.startNewGame();
      });

    // sound container
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
    this.levelBox = this.add
      .image(0, 0, 'box')
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
    this.levelText = this.add
      .bitmapText(this.levelBox.x - 24, this.levelBox.y, 'font', 'LV', 8)
      .setOrigin(0.5, 0.5);
    this.levelMinus = this.add
      .image(this.levelBox.x - 4, this.levelBox.y, 'left')
      .setOrigin(0.5, 0.5)
      .setScale(0.3);
    this.levelAdd = this.add
      .image(this.levelBox.x + 24, this.levelBox.y, 'right')
      .setOrigin(0.5, 0.5)
      .setScale(0.3);
    this.levelGame = this.add
      .text(
        this.levelBox.x + 10,
        this.levelBox.y,
        `${this.registry.values.level}`,
        {
          fontSize: '12px',
        }
      )
      .setOrigin(0.5, 0.5);

    this.levelMinus
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.levelBox.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.levelBox.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.levelBox.setTint(0xffffff);
        this.minusLevel();
      });
    this.levelAdd
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.levelBox.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.levelBox.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.levelBox.setTint(0xffffff);
        this.addLevel();
      });
    this.levelContainer = this.add.container(0, 40, [
      this.levelBox,
      this.levelText,
      this.levelGame,
      this.levelMinus,
      this.levelAdd,
    ]);

    // addon subcontainer to container
    this.container.add(this.newGameContainer);
    this.container.add(this.soundContainer);
    this.container.add(this.levelContainer);

    // display to center
    Phaser.Display.Align.In.Center(this.container, bg);
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

  private minusLevel() {
    this.registry.values.level -= 1;
    if (this.registry.values.level == 0) {
      this.registry.values.level = 1;
    }
    this.levelGame.text = `${this.registry.values.level}`;
  }
  private addLevel() {
    this.registry.values.level += 1;
    if (this.registry.values.level == 4) {
      this.registry.values.level = 3;
    }
    this.levelGame.text = `${this.registry.values.level}`;
  }

  private startNewGame() {
    this.scene.start('game-scene');
    this.scene.start('HUDScene');
    this.scene.bringToTop('HUDScene');
  }

  private initGlobalDataManager(): void {
    this.registry.set('scores', 0);
    this.registry.set('lives', 3);
    this.registry.set('level', 1);
  }
  update() {}
}
