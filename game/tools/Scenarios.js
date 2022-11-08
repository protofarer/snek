import Ant from '../mobs/Ant'
import Centipede from '../mobs/Centipede'
import Apple from '../immobs/Apple'
import Mango from '../immobs/Mango'
import Pebble from '../immobs/Pebble'
import Banana from '../immobs/Banana'
import Poop from '../immobs/Poop'

export default class Scenarios {
  constructor(game) {
    this.game = game
    this.snek = this.game.world.snek
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game.world)
    this.addEnt = this.game.world.addEnt.bind(this.game.world)

    this.snek.position = { 
      x: this.game.canvas.width * 0.1, 
      y: this.game.canvas.height * 0.5 
    }
    this.snek.headingDegrees = 0
  }

  base() {
    this.harmSegByCent(2)
  }

  harmHeadByCent() {
    const cent = this.addEnt(Centipede).setMobile(true)
    cent.position = { x: this.game.canvas.width*.2, y: this.game.canvas.height*.7}
    cent.headingDegrees = -90
    cent.setTurnable(false)
  }

  harmSegByCent(n) {
    const cent = this.addEnt(Centipede).setMobile(true)
    cent.position = { 
      x: this.game.canvas.width*.26 - ((n-1)*.05*this.game.canvas.width), 
      y: this.game.canvas.height*.9
    }
    cent.headingDegrees = -90
    cent.setTurnable(false)
  }

  eatAllImmobs() {
    this.addEnt(Apple)
    this.addEnt(Mango)
    this.addEnt(Banana)
    this.addEnt(Pebble)
    this.addEnt(Poop)
  }

  antCarry() {
    const b = this.addEnt(Ant).setMobile(true).setTurnable(false)
    b.headingRadians = 0
    b.position = {x: 170, y:400}
    b.setHitAreas()
  
    const a = this.addEnt(Apple)
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
    this.addEnt(Apple)
    this.addEnt(Mango)
    this.addEnt(Banana)
  }

  snekEatWalkingAnt() {
    const b = this.addEnt(Ant).setMobile(true).setTurnable(false)
    b.position = {x: 230, y:400}
    b.headingDegrees = 180
    b.setHitAreas()
  }

  centBiteSnek() {
    const f = this.addEnt(Centipede).setMobile(true).setTurnable(false)
    f.headingRadians = - Math.PI/2
    f.position = {x:150,y:550}
  }

  forcePass() {
    this.addEnt(Pebble)
    this.addEnt(Apple)
  }

  detachedSegmentsDigestion() {
    this.addEnt(Mango)
    this.addEnt(Mango)

    const f = this.addEnt(Centipede).setMobile(true).setTurnable(false)
    f.headingRadians = - Math.PI/2
    f.position = {x:250,y:650}
  }
}