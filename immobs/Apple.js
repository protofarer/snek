export default class Apple {
  static species = 'apple'
  species = 'apple'
  static entGroup = 'immob'

  state = {
    position: { x: 0, y: 0 }
  }
  r = 6
  primaryColor = 'red'
  constructor(ctx, startPosition=null, parentEnt=null, id=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.parentEnt = parentEnt
    this.state.position = startPosition || {x:400,y:330}
    this.id = id
    this.hitSideLength = this.r + 1
    
    this.setHitArea()
  }

  // Collision helper
  left() {
    return { x:this.state.position.x - this.hitSideLength, y: this.state.position.y}
  }
  right() {
    return { x:this.state.position.x + this.hitSideLength, y:this.state.position.y}
  }
  top() {
    return { x: this.state.position.x,y: this.state.position.y - this.hitSideLength }
  }
  bottom() {
    return { x: this.state.position.x, y: this.state.position.y + this.hitSideLength }
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitArea() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - this.hitSideLength, 
      this.state.position.y - this.hitSideLength,
      2 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  step() {
    this.draw()
  }

  drawInitWrapper(radians=null) {
    this.ctx.save()
    this.ctx.translate(this.state.position.x, this.state.position.y)

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