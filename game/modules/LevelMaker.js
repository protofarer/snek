import Constants from '../Constants'

export default class LevelMaker {
  constructor(game) {
    this.game = game
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game.world)
    this.addEnt = this.game.world.addEnt.bind(this.game.world)
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
    for (let [entWord, n] of Object.entries(ents)) {
      this.spawnEnts(entWord, n)
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
    this.addEnt('apple')
    this.addEnt('apple')
    this.addEnt('apple')
    this.addEnt('apple')
    this.spawnEnts('apple',3)
    this.spawnEnts('ant')
    this.addEnt('centipede').setMobile(true)
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
    // TODO behavior
    this.spawnEnts('apple', 45)
    this.spawnEnts('pebble', 55)
    this.spawnEnts('mango', 5)
    this.spawnEnts('ant', 25)
    this.spawnEnts('centipede', 2)

    // this.spawnEnts(Apple, 50)
    // this.spawnEnts(Pebble, 75)
    // this.spawnEnts(Ant, 70)
    // this.spawnEnts(Mango, 25)
    // this.spawnEnts(Centipede, 5)
  }

  modeSurvival() {
    // increase apple spawn rate
    // when apple count > 5, spawn an ant for each apple
    // when snek gets 8 segs spawn centipede
    // when snek has 5 segs, despawn centipede
    // every 15sec - 1min spawn banana
    // every ~40sec spawn mango
    // once 40 apples eaten or snek length = 20, victory
  }
}