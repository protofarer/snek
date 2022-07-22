export default class Pebble {
  class = 'pebble'
  position = { x: 0, y: 0 }
  r = 4
  isSwallowed = false
  constructor(canvas, position, parentEnt=null, id=null) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.parentEnt = parentEnt
    this.position = position
    this.id = id
    this.hitSideLength = this.r + 1
    this.setHitArea()
  }

  // Collision helper
  left() {
    return { x:this.position.x - this.hitSideLength, y: this.position.y}
  }
  right() {
    return { x:this.position.x + this.hitSideLength, y:this.position.y}
  }
  top() {
    return { x: this.position.x,y: this.position.y - this.hitSideLength }
  }
  bottom() {
    return { x: this.position.x, y: this.position.y + this.hitSideLength }
  }

  getSwallowed() {
    this.isSwallowed = true
    this.nullifyHit()
  }

  nullifyHit() {
    this.perimeter = null
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.perimeter)
  }

  setHitArea(newPosition = null) {
    let hitPosition = newPosition ? newPosition : this.position
    
    this.perimeter = new Path2D()
    this.perimeter.rect(
      hitPosition.x - this.hitSideLength, 
      hitPosition.y - this.hitSideLength,
      2 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  draw() {
      this.ctx.save()
      this.ctx.translate(this.position.x, this.position.y)
      
      this.ctx.beginPath()
  
      this.ctx.save()
      this.ctx.rotate(Math.PI / 3)
      this.ctx.arc(this.r/6, 0, this.r, 0, 2 * Math.PI)
      this.ctx.arc(-this.r/6, 0, this.r, 0, 2 * Math.PI)
      this.ctx.fillStyle = 'brown'
      this.ctx.fill()
      this.ctx.restore()
  
      this.ctx.restore()
  }

  step() {
    if (!this.isSwallowed) {
      this.draw()
    }
  }
}