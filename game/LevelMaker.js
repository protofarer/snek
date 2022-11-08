import Apple from './immobs/Apple'
import Mango from './immobs/Mango'
import Pebble from './immobs/Pebble'

import Centipede from './mobs/Centipede'
import Ant from './mobs/Ant'

export default class LevelMaker {
  constructor(game) {
    this.game = game
  }

  spawn(level) {
    switch (level) {
      case 1:
        this.spawnLevelOne()
        break
      case 's':
        console.log(`survival mode init spawn`, )
        break
    }
  }

  spawnLevelOne() {
      this.game.snek.position = { x: 200, y: 400 }

      this.game.world.spawnEnts(Apple, 45)
      this.game.world.spawnEnts(Pebble, 55)
      this.game.world.spawnEnts(Mango, 5)
      this.game.world.spawnEnts(Ant, 25)
      this.game.world.spawnEnts(Centipede, 2)

      // this.spawnEnts(Apple, 50)
      // this.spawnEnts(Pebble, 75)
      // this.spawnEnts(Ant, 70)
      // this.spawnEnts(Mango, 25)
      // this.spawnEnts(Centipede, 5)
  }
}