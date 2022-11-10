import Apple from './immobs/Apple'
import Mango from './immobs/Mango'
import Pebble from './immobs/Pebble'
import Scenarios from './tools/Scenarios'

import Centipede from './mobs/Centipede'
import Ant from './mobs/Ant'

export default class LevelMaker {
  constructor(game) {
    this.game = game
  }

  spawn(level, snek) {
    switch (level) {
      case 0:   // debug level
        this.spawnLevelZero()
        break
      case 1:
        this.spawnLevelOne(snek)
        break
      case 's': // survival init
        break
    }
  }

  spawnLevelZero() {
    this.case = new Scenarios(this.game)
    this.case.base()

    // this.game.world.spawnEnts(Apple, 45)
    // this.game.world.spawnEnts(Pebble, 55)
    // this.game.world.spawnEnts(Mango, 5)
    // this.game.world.spawnEnts(Ant, 25)
    // this.game.world.spawnEnts(Centipede, 2)
  }

  spawnLevelOne(snek) {
    snek.position = { 
      x: this.game.canvas.width * 0.5, 
      y: this.game.canvas.height * 0.8 
    }
    snek.headingDegrees = -90

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