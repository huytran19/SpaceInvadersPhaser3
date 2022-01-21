import { AnimationHelper } from '~/helpers/animation-helper';

export default class BootScene extends Phaser.Scene {
  private animationHelperInstance!: AnimationHelper;
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super('boot-scene');
  }

  preload(): void {
    // set the background and create loading bar
    this.cameras.main.setBackgroundColor(0x98d687);
    this.createLoadingbar();
    // pass value to change the loading bar fill
    this.load.on(
      'progress',
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xfff6d3, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );
    // delete bar graphics, when loading complete
    this.load.on(
      'complete',
      () => {
        this.animationHelperInstance = new AnimationHelper(
          this,
          this.cache.json.get('animationJSON')
        );
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );
    // load out package
    this.load.image('bullet', 'sprites/bullet.png');
    this.load.image('player', 'sprites/player.png');
    this.load.spritesheet('crab', 'sprites/crab.png', {
      frameWidth: 11,
      frameHeight: 8,
    });
    this.load.spritesheet('octopus', 'sprites/octopus.png', {
      frameWidth: 12,
      frameHeight: 8,
    });
    this.load.spritesheet('squid', 'sprites/squid.png', {
      frameWidth: 8,
      frameHeight: 8,
    });

    this.load.bitmapFont('font', 'font/font.png', 'font/font.fnt');

    this.load.json('animationJSON', 'animations/animations.json');

    // load ui pack
    this.load.image('box', 'ui-pack/box.png');
    this.load.image('check', 'ui-pack/check.png');
    this.load.image('cross', 'ui-pack/cross.png');
    this.load.image('left', 'ui-pack/left.png');
    this.load.image('right', 'ui-pack/right.png');
    this.load.image('square', 'ui-pack/square_box.png');
    this.load.image('line', 'ui-pack/line.png');

    this.load.audio('sound', 'sound/soundtrack.mp3');
    this.load.image('bg', 'bg.jpg');
  }

  init() {
    this.initGlobalDataManager();
  }

  update(): void {
    this.scene.start('menu-scene');
  }

  private createLoadingbar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }

  private initGlobalDataManager(): void {
    this.registry.set('mute', false);
    this.registry.set('highscore', 0);
  }
}
