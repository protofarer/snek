import Apple from '../swallowables/Apple'
import Pebble from '../swallowables/Pebble'
export default class World {
  name = 'world'
  chilId = 0
  constructor(ctx) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.objects = {
      apples: [],
    }
    this.createFieldOfApples()
  }

  createFieldOfApples() {
    const n = 60
    for(let i = 0; i < n; i++) {
      this.objects.apples.push(new Apple(
        this.canvas,
        { 
          x: Math.random()*this.canvas.width, 
          y: Math.random()*this.canvas.height 
        },
        this,
        this.childId++
      ))
    }
  }

  step() {
    this.objects.apples.forEach(a => a.step())
    if (Math.random() < 0.01) {
      this.objects.apples.push(
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
    }
  }
}
