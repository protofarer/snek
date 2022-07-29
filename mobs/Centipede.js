import { moveEdgeWrap } from '../behaviors'
import { Segment } from './Snek'
import { turnRandomlySmoothly } from '../behaviors'

export default class Centipede {
  static entGroup = 'mob'
  static species = 'centipede'
  entGroup = 'mob'
  species = 'centipede'

  swallowables = ['snek']

  r = 10
  get headCoords() { return {
    x: this.position.x,
    y: this.position.y
  }}
  position = { x: 0, y: 0 }
  moveSpeed = 3
  nSegments = 8
  directionAngle = 0
  turnDirection = 0
  mobile = true
  set directionRad(val) { this.directionAngle = val * 180 / Math.PI }
  get directionRad() { return this.directionAngle * Math.PI / 180 }
  get turnRate() { return this.moveSpeed + 10 }
  get mouthCoords() { return {
      x: this.headCoords.x + this.r * Math.cos(this.directionRad),
      y: this.headCoords.y + this.r * Math.sin(this.directionRad)
  }}
  bodyColor = 'hsl(35, 50%, 55%)'
  legColor = 'hsl(30, 70%, 7%)'
  exp = 10
  scale = {
    x: 1,
    y: 1,
  }

  constructor(ctx, startPosition=null, parentEnt=null, nSegments=null) {
    this.ctx = ctx
    this.state.position = startPosition || this.state.position
    this.parentEnt = parentEnt

    this.nSegments = nSegments || this.state.nSegments
    this.segments = new LeggedSegments(this.ctx, this.state, nSegments || 15)
    this.hitSideLength = this.state.r
    this.setHitAreas()
  }

  turnLeft() {
    this.state.directionAngle += this.state.turnRate * -1
  }

  turnRight() {
    this.state.directionAngle += this.state.turnRate * 1
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - this.hitSideLength * this.state.scale, 
      this.state.position.y - this.hitSideLength * this.state.scale,
      2 * this.hitSideLength * this.state.scale,
      2 * this.hitSideLength * this.state.scale
    )
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)

    this.ctx.beginPath()
    this.ctx.arc(this.state.mouthCoords.x, this.state.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  swallow(ent) {
    ent.parentEnt = this
    ent.state.position = { x: -1000, y: -1000 }
    ent.hitArea = null

    switch (ent.species) {
      case 'ant':
        break
      case 'pebble':
        break
      default:
        console.info(`centipede.consume() defaulted`, )
    }
    this.state.exp += ent.state.exp
  }

  drawHead() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.lineWidth = 2
    this.ctx.fillStyle = this.state.bodyColor
    this.ctx.fill()

    // eyes
    this.ctx.beginPath()
    this.ctx.arc(
      0.7 * this.state.r, 
      0.33 * this.state.r, 
      0.2 * this.state.r, 
      2.5, 
      -1,
      true
    )
    this.ctx.fillStyle = 'hsl(0, 100%, 50%)'
    this.ctx.fill()
    this.ctx.beginPath()
    this.ctx.arc(
      0.7 * this.state.r,
      -0.33 * this.state.r, 
      0.2 * this.state.r, 
      1, 
      -2.5,
      true
    )
    this.ctx.fill()

    // fangs
    this.ctx.beginPath()
    this.ctx.arc(.5*this.state.r, -1.8*this.state.r, 2.5 * this.state.r, .9, 1.6)
    this.ctx.lineWidth = 0.15*this.state.r
    this.ctx.strokeStyle = 'hsl(0,0%,0%)'
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(.5*this.state.r, 1.8*this.state.r, 2.5*this.state.r, -1.6, -.9)
    this.ctx.stroke()
  }


  drawMouthHitOverlay() {
  }

  move() {
    this.state.position.x += this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += this.state.moveSpeed 
      * Math.sin(this.state.directionRad)

    turnRandomlySmoothly.call(this)
    moveEdgeWrap.call(this)
  }

  update() {
    if (this.state.mobile) {
      if (Math.random() < 0.005) {
        this.state.mobile = false
        setTimeout(() => this.state.mobile = true, 200 + Math.random() * 2000)
      } else {
        this.move()
      }
    }
    this.setHitAreas()
    this.segments.update(this.state.headCoords)
  }

  render() {
    this.ctx.save()
    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.rotate(this.state.directionRad)
    this.ctx.scale(this.state.scale, this.state.scale)
    this.ctx.scale(1, this.scale * 0.8)

    this.drawHead()

    this.ctx.restore()
  }

}

export class LeggedSegments extends Segment {
  constructor(ctx, state, nSegments=0) {
    super(ctx, state, nSegments)
    this.ctx = ctx
    this.state = state
  }

  drawLegs() {
    const ctx = this.ctx
    const r = this.state.r
    
    ctx.beginPath()
    ctx.moveTo(0, -3*r)
    ctx.lineTo(0, 3*r)
    ctx.lineWidth = 1
    ctx.strokeStyle = this.state.legColor
    ctx.stroke()
  }
}