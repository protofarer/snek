import Ant from '../mobs/Ant'
import Centipede from '../mobs/Centipede'
import Snek from '../mobs/Snek'
import Apple from '../immobs/Apple'
import Mango from '../immobs/Mango'
import Pebble from '../immobs/Pebble'
import Banana from '../immobs/Banana'

export default class Scenarios {
  constructor(game) {
    this.game = game
    this.snek = this.game.world.snek
    this.spawnEnts = this.game.world.spawnEnts.bind(this.game)
    this.addEnt = this.game.world.addEnt.bind(this.game)

    this.snek.position = { 
      x: this.game.canvas.width * 0.1, 
      y: this.game.canvas.height * 0.5 
    }
    this.snek.headingDegrees = 0
  }

  base() {
    this.addEnt(Apple)
  }

  antCarry() {
    // const b = this.addEnt(Ant).setMobile(true).setTurnable(false)
    // b.headingRadians = 0
    // b.position = {x: 170, y:400}
    // b.setHitAreas()
  
    // const a = this.addEnt(Apple)
    // a.position = {x: 200, y:400}
    // a.setHitAreas()
    // return {a, b}
  }

  snekEatAntCarry() {
    const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
    this.game.snek = snek
    let {b} = this.antCarry()
    b.setMobile(false)
    b.position = {x: 190, y:400}
  }
  
  snekEatWalkingAntCarry() {
    const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
    this.game.snek = snek
    let {b} = this.antCarry()
    b.setMobile(true)
    b.position = {x: 240, y:400}
    b.headingDegrees = 180
  }

  snekEatAllFruit() {
    const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
    this.game.snek = snek
    this.addEnt(Apple)
    this.addEnt(Mango)
    this.addEnt(Banana)
  }

  snekEatWalkingAnt() {
    const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
    this.game.snek = snek

    const b = this.addEnt(Ant).setMobile(true).setTurnable(false)
    b.position = {x: 230, y:400}
    b.headingDegrees = 180
    b.setHitAreas()
  }

  centBiteSnek() {
    const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
    this.game.snek = snek
    const f = this.addEnt(Centipede).setMobile(true).setTurnable(false)
    f.headingRadians = - Math.PI/2
    f.position = {x:150,y:550}
  }

  forcePass() {
    const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
    this.game.snek = snek
    this.addEnt(Pebble)
    this.addEnt(Apple)
  }

  detachedSegmentsDigestion() {
    const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
    this.game.snek = snek
    this.addEnt(Mango)
    this.addEnt(Mango)

    const f = this.addEnt(Centipede).setMobile(true).setTurnable(false)
    f.headingRadians = - Math.PI/2
    f.position = {x:250,y:650}
  }
}