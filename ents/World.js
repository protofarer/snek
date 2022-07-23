import Apple from '../immobs/Apple'
import Pebble from '../immobs/Pebble'
export default class World {
  typename = 'world'
  chilId = 0
  constructor(ctx) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.fieldEnts = []
    this.mobs = []
  }

  randomSpawns() {
    const rng = Math.random()
    if (rng < 0.01) {
      this.fieldEnts.push(
        new Apple(
          this.ctx, 
          {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height
          }, 
          this, 
          this.childId++
        )
      )
    } else if (rng < 0.02) {
      this.fieldEnts.push(
        new Pebble(
          this.ctx, 
          {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height
          }, 
          this, 
          this.childId++
        )
      )
    }
  }

  step() {
    this.fieldEnts.forEach(e => e.step())
    // this.randomSpawns()
  }
}
