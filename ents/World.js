import Apple from '../swallowables/Apple'
import Pebble from '../swallowables/Pebble'
export default class World {
  typename = 'world'
  chilId = 0
  constructor(ctx) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.fieldEnts = []
    this.mobs = []
    // this.createFieldOfImmob('apple', 90)
    // this.createFieldOfImmob('pebble', 90)
  }

  createFieldOfImmob(typename, n) {
    for(let i = 0; i < n; i++) {
      switch(typename) {
        case 'apple':
          this.fieldEnts.push(new Apple(
            this.ctx,
            { 
              x: Math.random()*this.canvas.width, 
              y: Math.random()*this.canvas.height 
            },
            this,
            this.childId++
          ))
          break
        case 'pebble':
          this.fieldEnts.push(new Pebble(
            this.ctx,
            { 
              x: Math.random()*this.canvas.width, 
              y: Math.random()*this.canvas.height 
            },
            this,
            this.childId++
          ))
          break
        default:
          console.log('createFieldOf defaulted')
      }
    }
  }

  step() {
    this.fieldEnts.forEach(e => e.step())
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
}
