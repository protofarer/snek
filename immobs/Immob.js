export default class Immob {
  static entGroup = 'immob'
  static species = 'immob'
  entGroup = 'immob'
  species = 'immob'

  r = 1
  position = { x: 400, y: 400 }
  primaryColor = ''
  exp = 10
  expAbsorbRate = 1
  digestion = {
    timeLeft: 1000,
    baseTime: 1000,
  }
  directionAngleRadian = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }
  get hitSideLength() { return this.r + 1 }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.parentEnt = parentEnt
    // assert
    this.position = startPosition || this.position
    
    this.setHitAreas()
  }

  swallowEffect(entAffected) {
    entAffected.exp += Math.floor(this.exp / 2)
    this.exp -= Math.floor(this.exp / 2)
  }

  absorbExp(entAffected) {
    if (this.exp > 0) {
      entAffected.exp += this.expAbsorbRate
      this.exp -= this.expAbsorbRate
    }
  }

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

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - this.hitSideLength, 
      this.position.y - this.hitSideLength,
      2 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  drawInitWrapper(radians=null) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)

    radians && ctx.rotate(radians)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.rect(0,0,10,10)
    ctx.strokeStyle = 'lawngreen'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  drawShadow() {
  }

  update() {
  }

  render() {
    this.drawInitWrapper(this.directionRad)
  }
}