import { baseSwallowEffect } from '../behaviors/digestion'
import { baseAbsorbExp } from '../behaviors/exp'

export default class Mob {
  // Mobs are entities that are generally more dynamic than immobs. They can
  // change their own position via a move function and have some level of
  // autonomy in the form of swallows, bites, grabs, and have sets of behaviors
  // and state-modifying effects.

  static entGroup = 'mob'
  entGroup = 'mob'

  r = 1
  position = { x: 400, y: 400 }
  scale = { x: 1, y: 1 }
  get hitR() { return this.r + 1 }

  headingRadians = 0
  get headingDegrees() { return this.headingRadians * 180 / Math.PI }
  set headingDegrees(val) { this.headingRadians = val * Math.PI / 180 }

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

  // get moveSpeed() { return this.currMoveSpeed }
  // set moveSpeed(val) { this.currMoveSpeed = Math.max(this.minMoveSpeed, val)}

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
    return this.postDigestionData
  }

  swallowBehavior(entAffected) {
    if (this.swallowEffect) {
      this.swallowEffect.call(this, entAffected)
    } else {
      console.log(`no swalloweffect triggered, none defined on ent`, )
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
    this.headingDegrees += -this.currTurnRate
  }

  turnRight() {
    this.headingDegrees += this.currTurnRate
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
    this.drawInitWrapper(this.headingRadians)
  }
}