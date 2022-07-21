export default class Snek {
  state = {
    r: 7,
    headCoords: { x: 400, y: 400 },
    directionAngle: -90,
    directionRad: function () { return this.directionAngle * Math.PI / 180 },
    slitherSpeed: 2,
    turnRate: function () { return this.slitherSpeed + 10 },
    getMouthCoords: function () {
      return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad()),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad()),
      }
    },
  }

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.initEventListeners()
    this.body = new Body(this.ctx, this.state, 1)
  }

  initEventListeners() {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'd':
          this.state.directionAngle += this.state.turnRate() * 1
          break
        case 'a':
          this.state.directionAngle += this.state.turnRate() * -1
          break
        default:
          break
      }
      this.state.directionAngle %= 360
    }
    document.addEventListener('keydown', handleKeyDown)
  }


  step() {
    this.state.headCoords.x += this.state.slitherSpeed 
      * Math.cos(this.state.directionRad())
    this.state.headCoords.y += this.state.slitherSpeed 
      * Math.sin(this.state.directionRad())
    if (
      this.state.headCoords.x >= this.canvas.width 
      || this.state.headCoords.x <= 0 
      || this.state.headCoords.y >= this.canvas.height 
      || this.state.headCoords.y <= 0
    ) {
      this.state.headCoords = { x: 400, y: 400 }
    }
    // console.log(`this.state.turnRate()`, this.state.turnRate)
    // console.log(`direction`, this.state.directionRad)
    // console.log(`headcoords`, this.state.headCoords)
    
    this.drawSnake()
    this.body.step(this.state.headCoords)
  }

  drawSnake() {
    this.ctx.save()

    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.lineWidth = 2
    this.ctx.fillStyle = 'green'
    this.ctx.fill()

    this.ctx.rotate(this.state.directionRad())
    this.ctx.translate(0.8 * this.state.r, 0)
    this.ctx.beginPath()
    this.ctx.fillStyle = 'pink'
    this.ctx.fillRect(-this.state.r/2, -this.state.r/2, this.state.r/2, this.state.r)

    this.ctx.restore()

    this.ctx.beginPath()
    
    this.ctx.arc(this.state.getMouthCoords().x, this.state.getMouthCoords().y, 1, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }
}

class Body {
  headTrail = []
  constructor(ctx, snekState, nSegments=0) {
    this.ctx = ctx
    this.snekState = snekState
    this.nSegments = nSegments 
    this.linkLength = Math.floor(snekState.r * 0.9)
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
        this.ctx.beginPath()
        this.ctx.arc(0, 0, this.snekState.r, 0, 2 * Math.PI)
        this.ctx.fillStyle = 'green'
        this.ctx.fill()
        this.ctx.restore()
      }
    }

  }
}