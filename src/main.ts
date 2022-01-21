import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import PauseScene from './scenes/PauseScene';
import HUDScene from './scenes/HudScene';
import GameoverScene from './scenes/GameoverScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 224,
  height: 240,
  zoom: 3,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [BootScene, MenuScene, GameScene, PauseScene, HUDScene, GameoverScene],
  backgroundColor: '#f5cc69',
};

export default new Phaser.Game(config);
