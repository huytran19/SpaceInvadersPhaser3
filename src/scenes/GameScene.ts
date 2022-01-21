import Enemy from '../objects/enemy';
import Player from '../objects/player';
import Bullet from '../objects/bullet';

export default class GameScene extends Phaser.Scene {
  private enemies!: Phaser.GameObjects.Group;
  private player!: Player;
  private pauseKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: 'game-scene',
    });
  }

  init(): void {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.enemies = this.add.group({ runChildUpdate: true });
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.pauseKey.isDown = false;
    this.sound.play('sound', { loop: true });
  }

  create(): void {
    // create game objects
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height - 40,
      texture: 'player',
    });
    this.player.setTint(0x00ffff);

    // if you want to make it random:
    // let enemyTypes = ["octopus", "crab", "squid"];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 10; x++) {
        let type;
        if (y === 0) {
          type = 'squid';
        } else if (y === 1) {
          if (this.registry.values.level === 3) {
            type = 'squid';
          } else {
            type = 'crab';
          }
        } else if (y === 2) {
          type = 'crab';
        } else if (y === 3) {
          if (this.registry.values.level === 1) {
            type = 'octopus';
          } else {
            type = 'crab';
          }
        } else type = 'octopus';
        // if you want to make it random:
        // let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.enemies.add(
          new Enemy({
            scene: this,
            x: 20 + x * 15,
            y: 50 + y * 15,
            texture: type,
          })
        );
      }
    }
  }

  update(): void {
    if (this.player.active) {
      if (this.pauseKey.isDown) {
        this.scene.pause();
        this.scene.run('pause-scene');
      }
      this.player.update();

      this.enemies.children.each((child) => {
        const enemy = child as Enemy;
        enemy.update();
        if (enemy.getBullets().getLength() > 0) {
          this.physics.overlap(
            enemy.getBullets(),
            this.player,
            this.bulletHitPlayer,
            undefined,
            this
          );
        }
      }, this);

      this.checkCollisions();
    }

    if (this.registry.get('lives') == 0 || this.enemies.getLength() === 0) {
      this.scene.start('gameover-scene');
      this.scene.stop('HUDScene');
    }
  }

  private checkCollisions(): void {
    this.physics.overlap(
      this.player.getBullets(),
      this.enemies,
      this.bulletHitEnemy,
      undefined,
      this
    );
  }

  private bulletHitEnemy(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ): void {
    const bullet = obj1 as Bullet;
    const enemy = obj2 as Enemy;
    bullet.destroy();
    enemy.gotHurt();
  }

  private bulletHitPlayer(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ): void {
    const bullet = obj1 as Bullet;
    const player = obj2 as Player;
    bullet.destroy();
    player.gotHurt();
  }
}
