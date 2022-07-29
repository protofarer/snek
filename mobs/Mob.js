import { baseAbsorbExp, baseSwallowEffect } from '../behaviors'

export default class Mob {
  static entGroup = 'mob'
  entGroup = 'mob'

  r = 1
  position = { x: 0, y: 0 }
  scale = { x: 1, y: 1 }
  hitR = this.r

  directionAngleRadians = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }

  exp = 10
  expAbsorbRate = 1

  digestion = {
    timeLeft: 3000,
    baseTime: 3000
  }

  primaryColor
  secondaryColor
  bodyColor = 'hsl(35, 50%, 55%)'

  moveSpeed = 1
  isMobile = true

  isTurnable = true
  turnDirection = 0
  turnRate = this.moveSpeed + 5

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.position = startPosition || this.position
    this.parentEnt = parentEnt
    this.setHitAreas()
  }

  swallowEffect(entAffected) {
    baseSwallowEffect.call(this, entAffected)
  }

  absorbExp(entAffected) {
    baseAbsorbExp.call(this, entAffected)
  }

  setTurnable(setTurnable) {
    this.isTurnable = setTurnable
    return this
  }

  setMobile(setMobile) {
    this.isMobile = setMobile
    return this
  }
  
  turnLeft() {
    this.directionAngleDegrees += -this.turnRate
  }

  turnRight() {
    this.directionAngleDegrees += this.turnRate
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - this.hitR, 
      this.position.y - this.hitR,
      2 * this.hitR * this.scale,
      2 * this.hitR * this.scale
    )
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.rect(0,0,10,10)
    ctx.strokeStyle = this.primaryColor
    ctx.lineWidth = 2
    ctx.stroke()
  }

  drawInitWrapper(radians=null) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    if (this.scale.x !== 1 || this.scale.y !== 1) {
      ctx.scale(this.scale.x, this.scale.y)
    }
    radians && ctx.rotate(radians)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }

  render() {
    this.drawInitWrapper(this.directionAngleRadians)
  }
}