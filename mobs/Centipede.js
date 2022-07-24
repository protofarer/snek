import { Segments } from './Snek'

export default class Centipede {
  static entGroup = 'mob'
  static species = 'centipede'
  entGroup = 'mob'
  species = 'centipede'

  swallowables = ['snek']
  scaleX = 0.8

  state = {
    r: 7,
    get headCoords() { return {
      x: this.position.x,
      y: this.position.y
    }},
    position: { x: 0, y: 0 },
    moveSpeed: 3,
    directionAngle: 0,
    turnDirection: 0,
    mobile: true,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    get turnRate() { return this.moveSpeed + 10 },
    get mouthCoords() { return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad)
    }},
    scaleColor: 'hsl(35, 50%, 55%)',
    legColor: 'hsl(30, 70%, 7%)',
    exp: 3,
  }

  constructor(ctx, startPosition=null, parentEnt=null, nLinks=null) {
    this.ctx = ctx
    this.state.position = startPosition || this.state.position
    this.parentEnt = parentEnt
    this.segments = new LeggedSegments(this.ctx, this.state, nLinks || 15)
    this.hitSideLength = this.state.r
    this.setHitArea()
  }

  turnLeft() {
    this.state.directionAngle += this.state.turnRate * -1
  }

  turnRight() {
    this.state.directionAngle += this.state.turnRate * 1
  }

  setHitArea() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - this.hitSideLength, 
      this.state.position.y - this.hitSideLength,
      2 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  swallow(ent) {
    ent.parentEnt = this
    ent.state.position = { x: -1000, y: -1000 }
    ent.hitArea = null

    switch (ent.species) {
      case 'ant':
        this.segments.nSegments += 1
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
    this.ctx.fillStyle = this.state.scaleColor
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
    this.ctx.arc(3, -20, 25, 1.1, 1.6)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(3, 20, 25, -1.6, -1.1)
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'hsl(0,0%,0%)'
    this.ctx.stroke()
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.rotate(this.state.directionRad)
    this.ctx.scale(1, this.scaleX)

    this.drawHead()

    this.ctx.restore()
  }

  turnRandomlySmoothly() {
    const rng = Math.random()
    if (rng < 0.15) {
      this.turnDirection = 0
    } else if (rng < 0.3) {
      this.turnDirection = 1
    } else if (rng < 0.5) {
      this.turnDirection = 2
    }
    if (this.turnDirection === 0) {
      this.turnLeft()
    } else if (this.turnDirection === 1) {
      this.turnRight()
    }
  }

  move() {
    this.state.position.x += this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += this.state.moveSpeed 
      * Math.sin(this.state.directionRad)

    this.turnRandomlySmoothly()
  }

  step() {
    this.state.mobile && this.move()

    // this.ctx.save()
    // this.ctx.scale(2,2)
    this.draw()
    // this.ctx.restore()
    this.segments.step(this.state.headCoords)
  }
}

export class LeggedSegments extends Segments {
  constructor(ctx, state, nSegments=0) {
    super(ctx, state, nSegments)
    this.ctx = ctx
    this.state = state
  }

  drawLegs() {
    const ctx = this.ctx
    const r = this.state.r
    
    ctx.beginPath()
    ctx.moveTo(0, -2*r)
    ctx.lineTo(0, 2*r)
    ctx.lineWidth = 1
    ctx.strokeStyle = this.state.legColor
    ctx.stroke()
  }

}