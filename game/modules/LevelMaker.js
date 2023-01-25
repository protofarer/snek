import Constants from '../Constants'

export default class LevelMaker {
  constructor(game) {
    this.game = game
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game.world)
    this.addEnt = this.game.world.addEnt.bind(this.game.world)
  }

  generateLevel(level, snek, playStartT) {
    snek.position = { 
      x: Constants.SNEK_START_POS.xRatio * this.game.canvas.width,
      y: Constants.SNEK_START_POS.yRatio * this.game.canvas.height
    }
    console.log(`level`, level)
    
    
    switch (level) {
      case 1:
        return this.spawnLevelOne()
      case 's':
        return this.spawnSurvival(playStartT)
      case 'd':   // debug level
        this.initSpawnSurvival()
        return this.spawnLevelZero(snek)
      case 't':
        return this.spawnTest(playStartT)
      default:
        console.error('Not a valid initial spawn levelmaker code')
    }
  }

  spawnOnInterval(entSpeciesWord, spawnStartT, world) {
    let lastSpawnT = spawnStartT

    const spawnCondition = this.game.world.getEntClass(entSpeciesWord)
      .spawnCondition?.(this.game.world)

    return (t) => {
      if (t - lastSpawnT >= Constants.spawnIntervals[entSpeciesWord].recurring) {
        if (spawnCondition) {
          if (spawnCondition()) {
            world.spawnEnts(entSpeciesWord)
            lastSpawnT = t
          }
        } else {
          world.spawnEnts(entSpeciesWord)
          lastSpawnT = t
        }
      }
    }
  }

  spawnsOnInterval(listOfEnts, playStartT) {
    const intervalSpawners = listOfEnts.map(entWord => this.spawnOnInterval(
        entWord, 
        playStartT, 
        this.game.world
    ))

    return (t) => {
      for (let i = 0; i < intervalSpawners.length; ++i) {
        intervalSpawners[i](t)
      }
    }
  }

  spawnTest(playStartT) {
    this.initSpawnSurvival()
    const intervalSpawner = this.spawnsOnInterval([
      'apple', 'mango', 'banana', 'ant'
    ], playStartT)

    // const eventSpawner = this.spawnE

    // entWord and a condition to check before spawning
    let hasCentipedeSpawned = false
    let hasSecondCentipedeSpawned = false
    let isAntSwarmSpawning = false

    return (t) => {
      intervalSpawner(t)

      if ((this.game.world.countSweets() > 15 
        || (t - playStartT) === Constants.spawnIntervals.antSwarm.initial) 
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

      if (!hasCentipedeSpawned && t - playStartT >= 60000) {
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


class Scenarios {
  constructor(game) {
    this.game = game
    this.snek = this.game.world.snek
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game.world)
    this.addEnt = this.game.world.addEnt.bind(this.game.world)
  }

  base() {
    this.snek.position = { 
      x: Constants.SNEK_START_POS.xRatio * this.game.canvas.width,
      y: Constants.SNEK_START_POS.yRatio * this.game.canvas.height
    }
    this.addEnt('apple')
    this.addEnt('apple')
    this.addEnt('apple')
    this.harmSegByCent()
    // this.quickDeathByCent()
  }

  slowerDeathByCent() {
    for (let i = 0; i < 19; ++i) {
      const cent = this.addEnt('centipede').setMobile(true).setTurnable(false)
      cent.position = { 
        x: this.game.canvas.width*.05 * (i+1), 
        y: this.game.canvas.height*.9 + (this.game.canvas.height*0.013*(i)) 
      }
      cent.headingDegrees = -90
    }
  }

  quickDeathByCent() {
    for (let i = 0; i < 10; ++i) {
      const cent = this.addEnt('centipede').setMobile(true).setTurnable(false)
      cent.isIntermittentPausing = false
      cent.position = { 
        x: this.game.canvas.width*.2 - (i*15), 
        y: this.game.canvas.height*.85 - (this.game.canvas.height*0.05*i) 
      }
      cent.headingDegrees = 0
    }
  }

  harmHeadByCent() {
    const cent = this.addEnt('centipede').setMobile(true)
    cent.position = { x: this.game.canvas.width*.2, y: this.game.canvas.height*.7}
    cent.headingDegrees = -90
    cent.setTurnable(false)
  }

  harmSegByCent(n=1) {
    const cent = this.addEnt('centipede').setMobile(true).setTurnable(false)
    cent.isIntermittentPausing = false
    cent.position = { 
      x: this.game.canvas.width*.3, 
      y: this.game.canvas.height*.8 - ((n-1)*.05*this.game.canvas.height)
    }
    cent.headingDegrees = 0
  }

  eatAllImmobs() {
    this.addEnt('apple')
    this.addEnt('mango')
    this.addEnt('banana')
    this.addEnt('pebble')
    this.addEnt('poop')
  }

  antCarry() {
    const b = this.addEnt('ant').setMobile(true).setTurnable(false)
    b.headingRadians = 0
    b.position = {x: 170, y:400}
    b.setHitAreas()
  
    const a = this.addEnt('apple')
    a.position = {x: 200, y:400}
    a.setHitAreas()
    return {a, b}
  }

  snekEatAntCarry() {
    let {b} = this.antCarry()
    b.setMobile(false)
    b.position = {x: 190, y:400}
  }
  
  snekEatWalkingAntCarry() {
    let {b} = this.antCarry()
    b.setMobile(true)
    b.position = {x: 240, y:400}
    b.headingDegrees = 180
  }

  snekEatAllFruit() {
    this.addEnt('apple')
    this.addEnt('mango')
    this.addEnt('banana')
  }

  snekEatWalkingAnt() {
    const b = this.addEnt('ant').setMobile(true).setTurnable(false)
    b.position = {x: 230, y:400}
    b.headingDegrees = 180
    b.setHitAreas()
  }

  centBiteSnek() {
    const f = this.addEnt('centipede').setMobile(true).setTurnable(false)
    f.headingRadians = - Math.PI/2
    f.position = {x:150,y:550}
  }

  forcePass() {
    this.addEnt('pebble')
    this.addEnt('apple')
  }

  detachedSegmentsDigestion() {
    this.addEnt('mango')
    this.addEnt('mango')

    const f = this.addEnt('centipede').setMobile(true).setTurnable(false)
    f.headingRadians = - Math.PI/2
    f.position = {x:250,y:650}
  }
}