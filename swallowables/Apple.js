export default class Apple {
  typename = 'apple'
  position = { x: 0, y: 0 }
  r = 6
  isSwallowed = false
  primaryColor = 'red'
  constructor(ctx, startPosition=null, parentEnt=null, id=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.parentEnt = parentEnt
    this.position = startPosition || {x:400,y:330}
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
  step() {
    if (!this.isSwallowed) {
      this.draw()
    }
  }


  drawInitWrapper(radians=null) {
    this.ctx.save()
    this.ctx.translate(this.position.x, this.position.y)

    radians && this.ctx.rotate(radians)

    this.drawComponents()

    this.ctx.restore()
  }

  drawBody(color=null) {
    this.ctx.save()
    this.ctx.rotate(Math.PI / 4)
    this.ctx.scale(0.8, 1)
    this.ctx.beginPath()
    this.ctx.arc(this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    this.ctx.arc(-this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = color || this.primaryColor || 'red'
    this.ctx.fill()
    this.ctx.restore()
  }

  drawLeaf(color=null) {
    this.ctx.save()
    this.ctx.rotate(-Math.PI/4)
    this.ctx.translate(this.r*0.8, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r / 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = color || 'lawngreen'
    this.ctx.fill()
    this.ctx.restore()
  }

  drawHighlight(color=null) {
    this.ctx.rotate(-2 * Math.PI / 3)
    this.ctx.translate(this.r*0.8, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r / 3, 0, 2 * Math.PI)
    this.ctx.fillStyle = color || 'white'
    this.ctx.fill()
  }

  drawComponents() {
    this.drawBody()
    this.drawLeaf()
    this.drawHighlight()
  }

  draw(radians=null) {
    this.drawInitWrapper(radians)
  }
}