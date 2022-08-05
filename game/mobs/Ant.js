import { turnErratically } from '../behaviors/movements'
import Mob from './Mob'
import { getGameObject } from '../utils/helpers'

export default class Ant extends Mob {
  static species = 'ant'
  species = 'ant'

  swallowables = ['apple', 'mango', 'ant', 'pebble', ]
  get hitR() { return this.r }

  get headCoords() { return { 
    x: this.position.x 
      + Math.cos(this.headingRadians) * this.r * 1.1,
    y: this.position.y 
      + Math.sin(this.headingRadians) * this.r * 1.1
  }}

  get mouthCoords() { return {
      x: this.headCoords.x + 0.6 * this.r * Math.cos(this.headingRadians),
      y: this.headCoords.y + 0.6 * this.r * Math.sin(this.headingRadians),
  }}

  constructor(ctx, startPosition=null, parent=null) {
    super(ctx, startPosition, parent)

    this.r = 4
    this.primaryColor = 'black'

    this.baseExp = 10
    this.currExp = this.baseExp

    this.baseMoveSpeed = 2
    this.currMoveSpeed = this.baseMoveSpeed

    this.baseTurnRate = this.baseMoveSpeed + 5
    this.currTurnRate = this.baseTurnRate

    this.carriedEnt = null
    this.carriedOffsetRad = null
    this.setHitAreas()
  }

  grab(ent) {
    this.carriedEnt = ent
    this.carriedEnt.parent = this
    this.carriedEnt.hitArea = new Path2D()
    this.carriedOffsetRad = this.headingRadians
      - this.carriedEnt.headingRadians
  }

  drop() {
    // TODO use helper:
    this.carriedEnt.parent = getGameObject.call(this)
    // let parent = this.parent
    // while (parent) {
    //   this.carriedEnt.parent = parent
    //   parent = parent.parent
    // }
    
    this.carriedEnt.setHitAreas()
    this.carriedOffsetRad = null
    this.carriedEnt = null
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
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)

    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  move() {
    if (this.isMobile) {
      if (Math.random() < 0.8) {
        this.position.x += this.currMoveSpeed * Math.cos(this.headingRadians)
        this.position.y += this.currMoveSpeed * Math.sin(this.headingRadians)
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
    this.drawInitWrapper(this.headingRadians)
    this.carriedEnt?.render()
  }

  update() {
    this.move()
    // TODO carriedEnt renders at 2 times its own positional coordinates
    if (this.carriedEnt) {
      this.carriedEnt.position = this.mouthCoords
      this.carriedEnt.headingRadians = this.headingRadians + this.carriedOffsetRad
      // console.log(`mouthcoords`, this.mouthCoords)
      // console.log(`carriedent.pos`, this.carriedEnt.position)
      
      // ! hitArea null, may be used for snatch mechanic
      // ! current snek will eat both ant and carriedEnt
    }

  }
}