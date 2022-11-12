import Apple from '../immobs/Apple'
import Mango from '../immobs/Mango'
import Pebble from '../immobs/Pebble'
import Banana from '../immobs/Banana'
import Scenarios from '../tools/Scenarios'
import Ant from '../mobs/Ant'
import Centipede from '../mobs/Centipede'
import Entity from '../Entity'
import Constants from '../Constants'

export default class LevelMaker {
  constructor(game) {
    this.game = game
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game.world)
  }

  spawn(level, snek) {
    switch (level) {
      case 0:   // debug level
        this.spawnLevelZero(snek)
        break
      case 1:
        this.spawnLevelOne(snek)
        break
      case 's': // survival init
        break
    }
  }

  spawnRandom(ents) {
    for (let [e, n] of Object.entries(ents)) {
      let entClass
      switch (e) {
        case 'apple':
          entClass = Apple
          break
        case 'mango':
          entClass = Mango
          break
        case 'banana':
          entClass = Banana
          break
        case 'ant':
          entClass = Ant
          break
        case 'centipede':
          entClass = Centipede
          break
        case 'pebble':
          entClass = Pebble
          break
        default:
          throw Error(`Invalid spawnRandom class key: ${e}`)
      }
      this.spawnEnts(entClass, n)
    }
  }

  // debug level
  spawnLevelZero(snek) {
    // this.case = new Scenarios(this.game)
    // this.case.base()
    snek.position = { 
      x: Constants.SNEK_START_POS.xRatio * this.game.canvas.width,
      y: Constants.SNEK_START_POS.yRatio * this.game.canvas.height
    }
    this.spawnRandom({
      apple: 10,
      ant: 10,
    })
  }

  // first normal level
  spawnLevelOne(snek) {
    snek.position = { 
      x: Constants.SNEK_START_POS.xRatio * this.game.canvas.width,
      y: Constants.SNEK_START_POS.yRatio * this.game.canvas.height
    }
    this.spawnRandom({
      apple: 10,
      pebble: 5,
      mango: 3,
      banana: 1,
      ant: 2,
      centipede: 1
    })

    // this.spawnEnts(Apple, 15)
    // this.spawnEnts(Pebble, 25)
    // this.spawnEnts(Mango, 3)
    // this.spawnEnts(Ant, 2)
    // this.spawnEnts(Centipede, 1)
  }

  /** Initial spawn method used for playable game/levels.
   * @method
   */
  spawnSurvival() {
    this.spawnEnts(Apple, 45)
    this.spawnEnts(Pebble, 55)
    this.spawnEnts(Mango, 5)
    this.spawnEnts(Ant, 25)
    this.spawnEnts(Centipede, 2)

    // this.spawnEnts(Apple, 50)
    // this.spawnEnts(Pebble, 75)
    // this.spawnEnts(Ant, 70)
    // this.spawnEnts(Mango, 25)
    // this.spawnEnts(Centipede, 5)
  }
}