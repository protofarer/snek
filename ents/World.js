import Apple from '../swallowables/Apple'
import Pebble from '../swallowables/Pebble'
export default class World {
  name = 'world'
  chilId = 0
  constructor(ctx) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.fieldEnts = []
    this.createFieldOf('apple', 40)
    this.createFieldOf('pebble', 40)
  }

  createFieldOf(name, n) {
    for(let i = 0; i < n; i++) {
      switch(name) {
        case 'apple':
          this.fieldEnts.push(new Apple(
            this.canvas,
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
            this.canvas,
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
          this.canvas, 
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
          this.canvas, 
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
