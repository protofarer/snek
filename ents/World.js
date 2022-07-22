import Apple from './Apple'
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
    this.objects.apples.push(new Apple(this.canvas, {x:400,y:300}, this, this.childId++))
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

  draw() {
    this.objects.apples.forEach(a => a.draw())
  }

  step() {
    this.draw()
  }
}
