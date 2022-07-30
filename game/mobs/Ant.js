import { baseSwallowEffect, turnErratically } from '../behaviors'
import Mob from './Mob'

export default class Ant extends Mob {
  static species = 'ant'
  species = 'ant'

  swallowables = ['apple', 'mango', 'ant', 'pebble', ]

  r = 4
  exp = 2
  expAbsorbRate = 0.01

  baseMoveSpeed = 2
  baseTurnRate = 5

  primaryColor = 'black'

  get headCoords() { return { 
    x: this.position.x 
      + Math.cos(this.directionAngleRadians) * this.r * 1.1,
    y: this.position.y 
      + Math.sin(this.directionAngleRadians) * this.r * 1.1
  }}

  get mouthCoords() { return {
      x: this.headCoords.x + 0.6 * this.r * Math.cos(this.directionAngleRadians),
      y: this.headCoords.y + 0.6 * this.r * Math.sin(this.directionAngleRadians),
  }}

  constructor(ctx, startPosition=null, parentEnt=null) {
    super(ctx, startPosition, parentEnt)
    this.carriedEnt = null
    this.carriedOffsetRad = null
    this.setHitAreas()
  }

  grab(ent) {
    ent.parentEnt = this
    ent.hitArea = new Path2D()
    this.carriedEnt = ent
    this.carriedOffsetRad = this.directionAngleRadians
      - this.carriedEnt.directionAngleRadians

    // console.log(`this.carriedoffsetrad`, this.carriedOffsetRad)
    // console.log(`carriedent`, this.carriedEnt)
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - 2 * this.hitR,
      this.position.y - 2 * this.hitR,
      4 * this.hitR,
      4 * this.hitR
    )
  }

  drawHitOverlays() {
    super.drawHitOverlays()

    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  move() {
    if (this.isMobile) {
      if (Math.random() < 0.8) {
        this.position.x += this.moveSpeed * Math.cos(this.directionAngleRadians)
        this.position.y += this.moveSpeed * Math.sin(this.directionAngleRadians)
      } else {
        this.isTurnable && turnErratically.call(this)
      }
      this.setHitAreas()
    }
  }

  drawHead(ctx) {
    // Draw Head
    ctx.beginPath()
    ctx.arc(1.1*this.r,0,0.5*this.r,0,2*Math.PI)
  }

  drawBody(ctx) {
    // Draw Thorax
    ctx.rect(this.r*-1, -this.r/4, this.r*2, this.r/2 )
    ctx.fill()

    // Draw Abdomen
    ctx.arc(-1.4*this.r, 0, 0.7*this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.primaryColor
    ctx.shadowColor = 'hsl(0,0%,25%)'
    ctx.shadowBlur = 6
    ctx.fill()
    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 
  }

  drawLegs(ctx) {
    // Draw Legs
    ctx.beginPath()
    ctx.moveTo(this.r, 1.2*this.r)
    ctx.lineTo(-this.r, -1.2*this.r)
    ctx.moveTo(this.r, -1.2*this.r)
    ctx.lineTo(-this.r, 1.2*this.r)
    ctx.moveTo(0, -1.5*this.r)
    ctx.lineTo(0, 1.5*this.r)
    ctx.moveTo(0,0)
    ctx.strokeStyle = 'black'
    ctx.stroke()
  }

  drawComponents(ctx) {
    this.drawLegs(ctx)
    this.drawBody(ctx)
    this.drawHead(ctx)
    // console.log(`render carriedEnt?`,this?.carriedEnt )
    
  }
  render() {
    this.drawInitWrapper(this.directionAngleRadians)
    this.carriedEnt?.render()
  }

  update() {
    this.move()
    // TODO carriedEnt renders at 2 times its own positional coordinates
    if (this.carriedEnt) {
      this.carriedEnt.position = this.mouthCoords
      this.carriedEnt.directionAngleRadians = this.directionAngleRadians + this.carriedOffsetRad
      // console.log(`mouthcoords`, this.mouthCoords)
      // console.log(`carriedent.pos`, this.carriedEnt.position)
      
      // ! hitArea null, may be used for snatch mechanic
      // ! current snek will eat both ant and carriedEnt
    }

  }
}