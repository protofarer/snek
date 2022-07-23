export default class Pebble {
  species = 'pebble'
  static species ='pebble'
  static entGroup = 'immob'
  entGroup = 'immob'

  r = 6
  state = {
    position: {x: 0, y: 0},
    primaryColor: 'hsl(220, 30%, 30%)'
  }

  constructor(ctx, position=null, parentEnt=null, id=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.parentEnt = parentEnt
    this.state.position = position || {x: 400, y:300}
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

  drawShadow() {
    this.ctx.shadowColor='hsl(0,0%,10%)'
    this.ctx.shadowBlur = 2
    this.ctx.shadowOffsetY = 3
    this.ctx.fill()
  }
  draw() {
      this.ctx.save()
      this.ctx.translate(this.state.position.x, this.state.position.y)
      
      this.ctx.beginPath()
  
      this.ctx.save()
      this.ctx.rotate(Math.PI / 3)
      this.ctx.arc(this.r/6, 0, this.r, 0, 2 * Math.PI)
      this.ctx.arc(-this.r/6, 0, this.r, 0, 2 * Math.PI)
      this.ctx.fillStyle = this.state.primaryColor
      this.ctx.fill()

      this.drawShadow()

      this.ctx.restore()
  
      this.ctx.restore()
  }

  step() {
    if (!this.isSwallowed) {
      this.draw()
    }
  }
}