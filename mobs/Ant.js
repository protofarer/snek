export default class Ant {
  static species = 'ant'
  species = 'ant'
  static entGroup = 'mob'
  entGroup = 'mob'
  static swallowables = ['apple', 'mango', 'ant', 'pebble', ]
  canTurn = true
  state = {
    r: 5,
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
        x: this.headCoords.x + 0.6 * this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + 0.6 * this.r * Math.sin(this.directionRad),
      }
    },
    exp: 1,
    primaryColor: 'black',
    mobile: true,
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.state.position = startPosition || {x:400, y:270}
    this.parentEnt = parentEnt
    this.hitSideLength = this.state.r
    this.carriedEnt = null
    this.carriedOffsetRad = null
    this.setHitArea()
  }

  turnLeft(k=1) {
    this.state.directionAngle += k * this.state.turnRate() * -1
  }

  turnRight(k=1) {
    this.state.directionAngle += k * this.state.turnRate() * 1
  }

  turnErratically(k=1) {
    const rng = Math.random()
    if (rng < 0.2) {
      this.turnDirection = 1
    } else if (rng < 0.4) {
      this.turnDirection = 2
    } else if (rng < 0.8) {
      this.turnDirection = 0
    }
    if (this.turnDirection === 1) {
      this.turnLeft(k)
    } else if (this.turnDirection === 2) {
      this.turnRight(k)
    }
  }

  move(speedMultiplier=1) {
    this.state.position.x += speedMultiplier * this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += speedMultiplier * this.state.moveSpeed 
      * Math.sin(this.state.directionRad)
  }

  grab(ent) {
    ent.parentEnt = this
    ent.hitArea = null
    this.carriedEnt = ent
    this.carriedOffsetRad = this.state.directionRad - this.carriedEnt.state.directionRad
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitArea() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - 1 * this.hitSideLength,
      this.state.position.y - 2 * this.hitSideLength, 
      2 * this.hitSideLength,
      4.2 * this.hitSideLength
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
      default:
        console.info(`${this.typname}.swallow() defaulted`, )
    }
  }

  drawShadow() {
    this.ctx.shadowColor = 'hsl(0,0%,25%)'
    this.ctx.shadowBlur = 6
  }


  draw() {
    const r = this.state.r
    const ctx = this.ctx
    const pi = Math.trunc(1000 * Math.PI) / 1000

    ctx.save()
    ctx.translate(this.state.position.x, this.state.position.y)
    ctx.rotate(this.state.directionRad)
    ctx.save()
    ctx.scale(1, 0.2)

    // Draw Head + Thorax
    ctx.beginPath()
    ctx.arc(0, 0, 2*r, 0, 2 * pi)
    ctx.restore()

    // Draw Abdomen
    ctx.arc(-1.4*r, 0, 0.7*r, 0, 2 * pi)
    ctx.fillStyle = this.state.primaryColor
    ctx.fill()

    // Draw Eyes
    ctx.beginPath()
    ctx.arc(1.4*r, -0.4*r, 0.3 * r, 0, 2 * pi)
    ctx.arc(1.4*r, 0.4*r, 0.3 * r, 0, 2 * pi)
    ctx.fillStyle = 'white'
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
    this.state.headCoords.x = this.state.position.x 
      + Math.cos(this.state.directionRad) * this.state.r * 1.1
    this.state.headCoords.y = this.state.position.y 
      + Math.sin(this.state.directionRad) * this.state.r * 1.1
    
    if (this.state.mobile) {
      if (Math.random() < 0.8) {
        this.move(1)
        this.setHitArea()
      } else {
        this.canTurn && this.turnErratically(0.8)
      }
    }

    this.draw()

    if (this.carriedEnt) {
      this.carriedEnt.state.position = this.state.getMouthCoords()
      this.carriedEnt.state.directionRad = this.state.directionRad + this.carriedOffsetRad
      // ! hitArea null, may be used for snatch mechanic
      this.carriedEnt.step()
    }
  }
}