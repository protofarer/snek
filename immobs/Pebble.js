export default class Pebble {
  static entGroup = 'immob'
  static species ='pebble'
  entGroup = 'immob'
  species = 'pebble'

  state = {
    r: 6,
    position: {x: 400, y: 400},
    primaryColor: 'hsl(220, 10%, 48%)',
    directionAngle: 0,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    get weight() { return this.state.r },
    exp: 0,
  }

  constructor(ctx, position=null, parentEnt=null, r=null) {
    this.ctx = ctx
    this.state.position = position || this.state.position
    this.parentEnt = parentEnt
    this.state.r = r || 1 + Math.random() * 2.5     // TODO skewed gaussian random dist
    this.state.directionAngle = Math.random() * 359
    this.canvas = this.ctx.canvas
    this.hitSideLength = this.state.r + 4
    this.setHitAreas()
  }

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

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitAreas() {
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

  drawBody() {
    this.ctx.save()
    this.ctx.rotate(Math.PI / 3)
    this.ctx.beginPath()
    this.ctx.arc(this.state.r/6, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.arc(-this.state.r/6, 0, 0.8*this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.primaryColor
    this.ctx.fill()

    this.drawShadow()

    this.ctx.restore()
  }

  render() {
      this.ctx.save()
      this.ctx.translate(this.state.position.x, this.state.position.y)
      this.ctx.rotate(this.state.directionRad)
      this.ctx.scale(2,2)

      this.drawBody()
  
      this.ctx.restore()
  }

  update() {
  }
}