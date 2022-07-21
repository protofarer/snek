import Apple from './Apple'
export default class World {
  name = 'world'
  chilId = 0
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.objects = {
      apples: [],
    }
    this.createFieldOfApples()
    this.objects.apples.push(new Apple(this.canvas, {x:400,y:300}, this.childId++))
  }

  createFieldOfApples() {
    const n = 10
    for(let i = 0; i < n; i++) {
      this.objects.apples.push(new Apple(
        this.canvas,
        { 
          x: Math.random()*this.canvas.width, 
          y: Math.random()*this.canvas.height 
        },
        this.childId++
      ))
    }
  }

  drawObjects() {
    this.objects.apples.forEach(a => a.draw())
  }

  draw() {
    this.drawObjects()
  }

  step() {
    this.draw()
  }
}
