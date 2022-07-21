export default class Apple {
  name = 'apple'
  position = { x: 0, y: 0 }
  r = 4
  isEaten = false
  constructor(canvas, position, id=null) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.position = position
    this.id = id
    this.hitSideLength = this.r
    this.setHitArea()
  }

  getPerimeterCoords() {
    const l = this.hitSideLength
    return {
      top: { x: this.position.x,y: this.position.y - l},
      bot: { x: this.position.x, y: this.position.y + l},
      left: { x:this.position.x - l, y: this.position.y},
      right: { x:this.position.x + l, y:this.position.y}
    }
  }

  getEaten() {
    this.isEaten = true
    this.perish()
  }

  perish() {
    this.perimeter = null
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.perimeter)
  }

  setHitArea(newPosition = null) {
    let hitPosition = newPosition ? newPosition : this.position
    console.log(`hitposition`, hitPosition)
    
    this.perimeter = new Path2D()
    this.perimeter.moveTo(
      hitPosition.x - this.hitSideLength, 
      hitPosition.y - this.hitSideLength
    )
    this.perimeter.lineTo(
      hitPosition.x + this.hitSideLength, 
      hitPosition.y - this.hitSideLength
    )
    this.perimeter.lineTo(
      hitPosition.x + this.hitSideLength, 
      hitPosition.y + this.hitSideLength
    )
    this.perimeter.lineTo(
      hitPosition.x - this.hitSideLength, 
      hitPosition.y + this.hitSideLength
    )
    this.perimeter.closePath()
  }

  draw() {
    if (!this.isEaten) {
      this.ctx.save()
      this.ctx.translate(this.position.x, this.position.y)
      
      this.ctx.moveTo(0,0)
      this.ctx.beginPath()
  
      this.ctx.save()
      this.ctx.rotate(Math.PI / 3)
      this.ctx.arc(this.r/6, 0, this.r, 0, 2 * Math.PI)
      this.ctx.arc(-this.r/6, 0, this.r, 0, 2 * Math.PI)
      this.ctx.fillStyle = 'red'
      this.ctx.fill()
      this.ctx.restore()
  
      this.ctx.save()
      this.ctx.rotate(-Math.PI/4)
      this.ctx.translate(this.r, 0)
      this.ctx.beginPath()
      this.ctx.arc(0, 0, this.r / 2, 0, 2 * Math.PI)
      this.ctx.fillStyle = 'lawngreen'
      this.ctx.fill()
      this.ctx.restore()
  
      this.ctx.rotate(-2 * Math.PI / 3)
      this.ctx.translate(this.r, 0)
      this.ctx.beginPath()
      this.ctx.arc(0, 0, this.r / 3, 0, 2 * Math.PI)
      this.ctx.fillStyle = 'white'
      this.ctx.fill()
  
      this.ctx.restore()
    }
  }
}