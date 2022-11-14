import Constants from '../Constants'

export default class Scenarios {
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
    // this.addEnt('apple')
    this.addEnt('apple')
    this.addEnt('apple')
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
      x: this.game.canvas.width*.1, 
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