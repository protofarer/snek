import { baseAbsorbExp, baseSwallowEffect } from '../behaviors'

export default class Mob {
  static entGroup = 'mob'
  entGroup = 'mob'

  r = 1
  position = { x: 0, y: 0 }
  scale = { x: 1, y: 1 }
  get hitR() { return this.r }

  directionAngleRadians = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }

  baseExp = 10
  currExp = this.baseExp
  expAbsorbRate = 1

  digestion = {
    timeLeft: 3000,
    baseTime: 3000
  }

  primaryColor
  secondaryColor
  bodyColor = 'hsl(35, 50%, 55%)'

  // * Override in instance constructor: 1) field specify baseMS 2) this.moveSpeed = this.baseMS
  // * otherwise will be set to below
  isMobile = true
  minMoveSpeed = 0.3
  baseMoveSpeed = 1
  currMoveSpeed = this.baseMoveSpeed
  get moveSpeed() { return this.currMoveSpeed }
  set moveSpeed(val) { this.currMoveSpeed = Math.max(this.minMoveSpeed, val)}

  // * Override in instance constructor: 1) field specify baseTR 2) this.turnRate = this.baseTR
  // * otherwise will be set to below
  isTurnable = true
  turnDirection = 0
  baseTurnRate = 5
  currTurnRate = this.baseTurnRate
  get turnRate() { return this.currMoveSpeed + this.currTurnRate }
  set turnRate(val) { this.currTurnRate = Math.max(0, val) }

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
      2 * this.hitR,
      2 * this.hitR
    )
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  drawDebugOverlays() {
    this.drawHitOverlays()
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