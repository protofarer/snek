export default class Ant {
  typename = 'ant'
  mobile = true
  swallowables = ['apple', 'mango', 'ant', 'pebble', ]
  state = {
    r: 8,
    headCoords: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    moveSpeed: 2,
    directionAngle: -90,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnDirection: 3,
    turnRate: function () { return this.moveSpeed + 8},
    getMouthCoords: function () {
      return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }
    },
    exp: 0,
    primaryColor: 'black',
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.state.position = startPosition || {x:400, y:270}
    this.parentEnt = parentEnt
    this.hitSideLength = this.state.r
    this.setHitArea()
  }

  turnLeft() {
    this.state.directionAngle += this.state.turnRate() * -1
  }

  turnRight() {
    this.state.directionAngle += this.state.turnRate() * 1
  }

  turnErratically() {
    const rng = Math.random()
    if (rng < 0.2) {
      this.turnDirection = 1
    } else if (rng < 0.4) {
      this.turnDirection = 2
    } else if (rng < 0.8) {
      this.turnDirection = 0
    }
    if (this.turnDirection === 1) {
      this.turnLeft()
    } else if (this.turnDirection === 2) {
      this.turnRight()
    }
  }

  move() {
    this.state.position.x += this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += this.state.moveSpeed 
      * Math.sin(this.state.directionRad)
    this.state.headCoords.x = this.state.position.x + Math.cos(this.state.directionRad) * this.r
    this.state.headCoords.y = this.state.position.y + Math.sin(this.state.directionRad) * this.r
    this.turnErratically()
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitArea() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - 0.5 * this.hitSideLength,
      this.state.position.y - 1 * this.hitSideLength, 
      1 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  swallow(entity) {
    if (!this.swallowables.includes(entity.typename)) {
      throw new Error(`${this.typename} cannot swallow a ${entity.typename}!`)
    }
    switch (entity.typename) {
      case 'apple':
        this.exp += 2
        // TODO add apple to body segment(s) for digestion
        break
      case 'pebble':
        this.exp += 1
        break
      default:
        console.info(`${this.typname}.swallow() defaulted`, )
    }
  }


  draw() {
    const r = this.state.r
    const ctx = this.ctx
    const pi = Math.PI

    ctx.save()
    ctx.translate(this.state.position.x, this.state.position.y)
    ctx.rotate(this.state.directionRad)
    ctx.scale(0.6, 0.6)

    // Draw Head
    ctx.save()
    ctx.translate(r * 1.1, 0)
    ctx.beginPath()
    ctx.arc(0, 0, r*0.65, 0, 2 * pi)
    ctx.fillStyle = this.state.primaryColor
    ctx.fill()

    ctx.beginPath()
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.arc(0, 0, r * 0.4, -pi / 4, pi / 4)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(0, 0.3 * r, 0.2 * r, 0, 2 * pi)
    ctx.arc(0, -0.3 * r, 0.2 * r, 0, 2 * pi)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.restore()

    // Draw Thorax
    ctx.beginPath()
    ctx.arc(0, 0, 0.5 * r, 0, 2 * pi)

    // Draw Abdomen
    ctx.arc(-r, 0, 0.5 * r, 0, 2 * pi)
    ctx.fillStyle = 'black'
    ctx.fill()

    ctx.moveTo(r, 1.2*r)
    ctx.lineTo(-r, -1.2*r)
    ctx.moveTo(r, -1.2*r)
    ctx.lineTo(-r, 1.2*r)
    ctx.moveTo(0, -1.5*r)
    ctx.lineTo(0, 1.5*r)
    ctx.moveTo(0,0)
    ctx.strokeStyle = 'black'
    ctx.stroke()

    ctx.restore()
  }

  step() {
    if (this.mobile) {
      this.setHitArea
      this.move()
    }
    this.draw()
  }
}