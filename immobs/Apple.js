import Immob from "./Immob"

export default class Apple extends Immob {
  static entGroup = 'immob'
  static species = 'apple'
  entGroup = 'immob'
  species = 'apple'

  r = 6
  position = { x: 400, y: 400 }
  exp = 10
  secondaryColor = `hsl(95 60% 50%)`
  get primaryColor() { return `hsl(${0 + 40*(this.digestion.maxTimeLeft-this.digestion.timeLeft)/this.digestion.maxTimeLeft},${20 + 50*this.digestion.timeLeft/this.digestion.maxTimeLeft}%, ${20 + 30*this.digestion.timeLeft/this.digestion.maxTimeLeft}%)` }
  digestion = {
    timeLeft: 7000,
    baseTime: 7000
  }

  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }
  directionAngleRadian = 0
  get hitR() { return this.r + 1 }

  constructor(ctx, startPosition=null, parentEnt=null) {
    super(ctx, startPosition, parentEnt)
    this.ctx = ctx
    this.parentEnt = parentEnt
    this.position = startPosition || this.position
    this.setHitAreas()
  }

  digestionEffect (entAffected) {
    entAffected.moveSpeed += 1
    return () => { entAffected.moveSpeed -= 1 }
  }

  absorbExp(entAffected) {
    if (this.exp > 0) {
      entAffected.exp += 1
      this.exp -= 1
    }
  }
  
  swallowEffect(entAffected) {
    entAffected.exp += Math.ceil(this.exp / 2)
    this.exp = Math.ceil(this.exp / 2)
  }

  drawInitWrapper(radians=null) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.state.position.x, this.state.position.y)
    radians && ctx.rotate(radians)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawBody(ctx) {
    ctx.save()
    ctx.rotate(Math.PI / 4)
    ctx.scale(0.8, 1)
    ctx.beginPath()
    ctx.arc(this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    ctx.arc(-this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.primaryColor
    ctx.fill()

    this.drawShadow()

    ctx.restore()
  }

  drawShadow(ctx) {
    ctx.shadowOffsetY = this.r * 0.4
    ctx.shadowColor = 'hsl(0,0%,20%)'
    ctx.shadowBlur = this.r * 0.2
    ctx.fill()
  }

  drawLeaf(ctx) {
    ctx.save()
    ctx.rotate(-Math.PI/6)
    ctx.translate(this.r*0.8, 0.2 * this.r)
    ctx.beginPath()
    ctx.arc(0, 0, 0.4 * this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.leafColor
    ctx.fill()
    ctx.restore()
  }

  drawHighlight(ctx) {
    ctx.rotate(-.55 * Math.PI)
    ctx.translate(this.r*0.8, 0)
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 0.28, 0, 2 * Math.PI)
    ctx.fillStyle = 'hsla(0,0%,100%, 0.6)'
    ctx.fill()
  }

  drawStem(ctx) {
    ctx.save()
    ctx.rotate(-1)
    ctx.beginPath()
    ctx.moveTo(0.55*this.r,0)
    ctx.lineTo(1.1*this.r,0)
    ctx.lineWidth = 1.5
    ctx.strokeStyle = 'hsl(40, 60%, 20%)'
    ctx.stroke()
    ctx.restore()
  }

  drawComponents() {
    this.drawBody()
    this.drawLeaf()
    this.drawStem()
    this.drawHighlight()
  }

  update() {
  }
}