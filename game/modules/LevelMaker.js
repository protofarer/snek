import Constants from '../Constants'
import Scenarios from '../tools/Scenarios'

export default class LevelMaker {
  constructor(game) {
    this.game = game
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game.world)
    this.addEnt = this.game.world.addEnt.bind(this.game.world)
  }

  generateLevel(level, snek) {
    snek.position = { 
      x: Constants.SNEK_START_POS.xRatio * this.game.canvas.width,
      y: Constants.SNEK_START_POS.yRatio * this.game.canvas.height
    }
    
    switch (level) {
      case 1:
        return this.spawnLevelOne()
      case 's':
        return this.spawnSurvival(this.game.t)
      case 'd':   // debug level
        this.initSpawnSurvival()
        return this.spawnLevelZero(snek)
      case 't':
        return this.spawnTest()
      default:
        console.error('Not a valid initial spawn levelmaker code')
    }
  }

  spawnTest() {
    this.addEnt('apple')
  }

  spawnRandom(ents) {
    for (let [entWord, n] of Object.entries(ents)) {
      this.spawnEnts(entWord, n)
    }
  }

  // debug level
  spawnLevelZero() {
    this.case = new Scenarios(this.game)
    this.case.base()
    // this.addEnt('apple')
    // this.addEnt('apple')
    // this.addEnt('apple')
    // this.addEnt('centipede').setMobile(true)
  }

  // first normal level
  spawnLevelOne() {
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

  /** Initial spawn for survival mode
   * @method
   */
  initSpawnSurvival() {
    this.spawnEnts('apple', 1)
  }

  /** Ongoing spawn behavior for survival mode
   * @method
   */
  spawnSurvival(tPlayStart) {
    this.initSpawnSurvival()
    let isAppleSpawning = false
    let isMangoSpawning = false
    let isBananaSpawning = false
    let hasCentipedeSpawned = false
    let hasSecondCentipedeSpawned = false
    let isAntSpawning = false
    let isAntSwarmSpawning = false
    return (t) => {
      if (!isAppleSpawning) {
        isAppleSpawning = true
        setTimeout(() => { 
          this.game.world.spawnEnts('apple')
          isAppleSpawning = false
        }, Constants.spawnIntervals.apple.recurring)
      }
      if (!isMangoSpawning) {
        isMangoSpawning = true
        setTimeout(() => { 
          this.game.world.spawnEnts('mango')
          isMangoSpawning = false
        }, Constants.spawnIntervals.mango.recurring)
      }
      if (!isBananaSpawning) {
        isBananaSpawning = true
        setTimeout(() => { 
          this.game.world.spawnEnts('banana')
          isBananaSpawning = false
        }, Constants.spawnIntervals.banana.recurring)
      }
      if (this.game.world.countSweets() > 4 && !isAntSpawning) {
        this.game.world.spawnEnts('ant')
        isAntSpawning = true
        setTimeout(() => {
          isAntSpawning = false
        }, Constants.spawnIntervals.ant.recurring)
      }

      if ((this.game.world.countSweets() > 15 
        || (t - tPlayStart) === Constants.spawnIntervals.antSwarm.initial) 
        && !isAntSwarmSpawning
      ) {
        isAntSwarmSpawning = true
        this.game.world.spawnEnts('ant', 5)
        for (let i = 1; i < 6; ++i) {
          setTimeout(() => this.game.world.spawnEnts('ant', 3), i*1000)
        }
        // setTimeout(() => {
          // isAntSwarmSpawning = false
        // }, Constants.spawnIntervals.antSwarm.recurring)
      }

      if (!hasCentipedeSpawned && t - tPlayStart >= 60000) {
        this.game.world.spawnEnts('centipede')
        hasCentipedeSpawned = true
      }

      if (!hasSecondCentipedeSpawned && this.game.world.snek.segments.length >= Constants.spawnConditionals.secondCentipede.segcount) {
        this.game.world.spawnEnts('centipede')
        hasSecondCentipedeSpawned = true
      }
    }
    // increase apple spawn rate
    // when apple count > 5, spawn an ant for each apple
    // when snek gets 8 segs spawn centipedes
    // when snek has 5 segs, despawn centipede
    // every 15sec - 1min spawn banana
    // every ~40sec spawn mango
    // once 40 apples eaten or snek length = 20, victory
  }
}