export default class Snek {
  name = 'snek'
  state = {
    r: 7,
    headCoords: { x: 400, y: 400 },
    slitherSpeed: 2,
    directionAngle: -90,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnRate: function () { return this.slitherSpeed + 10 },
    getMouthCoords: function () {
      return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }
    },
    exp: 0,
    scaleColor: 'hsl(90, 80%, 50%)',
  }

  constructor(ctx, parentEnt=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.parentEnt = parentEnt
    this.initEventListeners()
    this.body = new Body(this.ctx, this.state, 1)
  }

  initEventListeners() {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'd':
          this.turnRight()
          break
        case 'a':
          this.turnLeft()
          break
        default:
          break
      }
      this.state.directionAngle %= 360
    }
    document.addEventListener('keydown', handleKeyDown)
  }

  turnLeft() {
    this.state.directionAngle += this.state.turnRate() * -1
  }

  turnRight() {
    this.state.directionAngle += this.state.turnRate() * 1
  }

  step() {
    this.state.headCoords.x += this.state.slitherSpeed 
      * Math.cos(this.state.directionRad)
    this.state.headCoords.y += this.state.slitherSpeed 
      * Math.sin(this.state.directionRad)
    
    this.drawSnake()
    this.body.step(this.state.headCoords)
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
        console.info(`snek.consume() defaulted`, )
    }
  }

  drawSnake() {
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
}

export class Body {
  headTrail = []
  constructor(ctx, snekState, nSegments=0) {
    this.ctx = ctx
    this.snekState = snekState
    this.nSegments = nSegments 
    this.linkLength = Math.floor(snekState.r * 0.6)
  }

  step(headCoords) {
    while (
      this.headTrail.length >= this.nSegments * this.linkLength 
      && this.nSegments > 0
    ) {
      this.headTrail.shift()
    }
    this.headTrail.push({ x: headCoords.x, y: headCoords.y })
    this.draw()
  }
  
  draw() {
    for(let i = 1; i < this.headTrail.length; i++) {
      if (i % this.linkLength === 0) {
        this.ctx.save()
        this.ctx.translate(this.headTrail[i].x, this.headTrail[i].y)
        let dy, dx
        if (i === 1) {
          dy = this.snekState.headCoords.y - this.headTrail[i].y
          dx = this.snekState.headCoords.x - this.headTrail[i].x
        } else {
          dy = this.headTrail[i-1].y - this.headTrail[i].y
          dx = this.headTrail[i-1].x - this.headTrail[i].x
        }
        const segmentAngle = Math.atan(dy/dx)
        this.ctx.rotate(segmentAngle)
        this.ctx.scale(1, 0.8)

        this.ctx.beginPath()
        this.ctx.arc(0, 0, this.snekState.r * 0.8, 0, 2 * Math.PI)
        this.ctx.fillStyle = this.snekState.scaleColor
        this.ctx.fill()

        this.ctx.restore()
      }
    }

  }
}