import { Body } from './Snek'

export default class Centipede {
  typename = 'centipede'
  static entGroup = 'mob'
  mobile = true
  swallowables = ['snek', 'ant']
  state = {
    r: 7,
    headCoords: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    moveSpeed: 4,
    directionAngle: -90,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnRate: function () { return this.moveSpeed + 5 },
    getMouthCoords: function () {
      return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }
    },
    exp: 0,
    scaleColor: 'hsl(30, 100%, 70%)',
    turnDirection: 0,
  }

  constructor(ctx, startPosition=null, parentEnt=null, nLinks=null) {
    if (!parentEnt) throw new Error('New centipede needs a parentEnt')

    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.state.headCoords = startPosition || {x:300, y:400}
    this.parentEnt = parentEnt

    this.body = new Body(this.ctx, this.state, nLinks || 5)
    this.body.linkLength = Math.floor(this.state.r * 0.5)

    this.hitSideLength = this.state.r
    this.setHitArea()
  }

  turnLeft() {
    this.state.directionAngle += this.state.turnRate() * -1
  }

  turnRight() {
    this.state.directionAngle += this.state.turnRate() * 1
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

  swallow(entity) {
    switch (entity.class) {
      case 'apple':
        this.body.nSegments += 1
        this.exp += 2
        // TODO add apple to body segment(s) for digestion
        break
      case 'pebble':
        this.exp += 1
        break
      default:
        console.info(`centipede.consume() defaulted`, )
    }
  }

  draw() {
    this.ctx.save()

    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.rotate(this.state.directionRad)

    this.ctx.beginPath()
    const k = 0.8
    this.ctx.scale(1,k)
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.lineWidth = 2
    this.ctx.fillStyle = this.state.scaleColor
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    this.ctx.arc(0, 0, this.state.r * 0.7, -Math.PI / 3, Math.PI / 3)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(this.state.r * 0.5, -0.4 * this.state.r)
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 2
    this.ctx.lineTo(this.state.r, -0.4 * this.state.r)
    this.ctx.moveTo(this.state.r * 0.5, 0.4 * this.state.r)
    this.ctx.lineTo(this.state.r, 0.4 * this.state.r)
    this.ctx.stroke()

    this.ctx.restore()

    this.ctx.beginPath()
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

  step() {
    this.state.headCoords.x += this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.headCoords.y += this.state.moveSpeed 
      * Math.sin(this.state.directionRad)
    this.state.position.x = this.state.headCoords.x
    this.state.position.y = this.state.headCoords.y

    this.turnRandomlySmoothly()

    this.draw()
    this.body.step(this.state.headCoords)
  }
}