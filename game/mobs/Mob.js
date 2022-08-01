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

  digestion = {
    timeLeft: 3000,
    baseTime: 3000
  }

  baseExp = 10
  currExp = this.baseExp
  get expAbsorbRate() { 
    const rate = (17 / this.digestion.baseTime) * this.baseExp/2 
    return rate
  }

  swallowEffect = baseSwallowEffect
  postDigestionData = null

  basePrimaryColor = 'lawngreen'
  currPrimaryColor = this.basePrimaryColor
  baseSecondaryColor = 'tomato'
  currSecondaryColor = this.baseSecondaryColor
  bodyColor = 'hsl(35, 50%, 55%)'

  // * Override in instance constructor: 1) field specify baseMS 2) this.moveSpeed = this.baseMS
  // * otherwise will be set to below
  isMobile = true
  baseMoveSpeed = 1
  currMoveSpeed = this.baseMoveSpeed
  minMoveSpeed = 0.3

  get moveSpeed() { return this.currMoveSpeed }
  set moveSpeed(val) { this.currMoveSpeed = Math.max(this.minMoveSpeed, val)}

  // * Override in instance constructor: 1) field specify baseTR 2) this.turnRate = this.baseTR
  // * otherwise will be set to below
  isTurnable = true
  turnDirection = 0
  baseTurnRate = this.moveSpeed + 5
  currTurnRate = this.baseTurnRate
  minTurnRate = 0

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.position = startPosition || this.position
    this.parentEnt = parentEnt
    this.setHitAreas()
  }

  getPostDigestionData() {
    if (!this.wasExcreted) {
      return this.postDigestionData
    }
    return null
  }

  swallowBehavior(entAffected) {
    if (!this.wasExcreted && this.swallowEffect) {
      this.swallowEffect.call(this, entAffected)
    } else {
      console.log(`no swalloweffect triggered, either wasExcreted or missing`, )
    }
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
    this.directionAngleDegrees += -this.currTurnRate
  }

  turnRight() {
    this.directionAngleDegrees += this.currTurnRate
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
    ctx.strokeStyle = this.currPrimaryColor
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