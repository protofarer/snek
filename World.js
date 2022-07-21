export default class World {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.objects = {
      apples: [],
    }
    this.createFieldOfApples()
  }

  createFieldOfApples() {
    const n = 5
    for(let i = 0; i < n; i++) {
      this.objects.apples.push(new Apple(
        this.canvas,
        { 
          x: Math.random()*this.canvas.width, 
          y: Math.random()*this.canvas.height 
        }
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

class Apple {
  position = { x: 0, y: 0 }
  r = 4
  constructor(canvas, position) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.position = position
  }

  setHitArea(newPosition = null) {
    let hitPosition = newPosition ? newPosition : this.position
    this.perimeter = new Path2D()
    this.perimeter.moveTo(
      hitPosition.x - this.r * 0.8, 
      hitPosition.y - this.r * 0.8
    )
    this.perimeter.lineTo(
      hitPosition.x + this.r * 0.8, 
      hitPosition.y - this.r * 0.8
    )
    this.perimeter.lineTo(
      hitPosition.x + this.r * 0.8, 
      hitPosition.y + this.r * 0.8
    )
    this.perimeter.lineTo(
      hitPosition.x - this.r * 0.8, 
      hitPosition.y + this.r * 0.8
    )
    this.perimeter.closePath()
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.position.x, this.position.y)
    
    this.ctx.moveTo(0,0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'red'
    this.ctx.fill()

    this.ctx.save()
    this.ctx.rotate(-Math.PI/4)
    this.ctx.translate(this.r, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r / 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'lightgreen'
    this.ctx.fill()
    this.ctx.restore()

    this.ctx.rotate(-3 * Math.PI / 4)
    this.ctx.translate(this.r / 2, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r / 3, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'white'
    this.ctx.fill()

    this.ctx.restore()
  }
}