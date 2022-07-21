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
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }
    },
  }

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.initEventListeners()
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
      this.state.headCoords.x >= this.canvas.width ||
      this.state.headCoords.x <= 0 ||
      this.state.headCoords.y >= this.canvas.height ||
      this.state.headCoords.y <= 0
    ) {
      this.state.headCoords = { x: 400, y: 400 }
    }
    // console.log(`this.state.turnRate()`, this.state.turnRate)
    // console.log(`direction`, this.state.directionRad)
    // console.log(`headcoords`, this.state.headCoords)
    
    this.drawSnake()
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
    this.ctx.translate(0.6 * this.state.r, 0)
    this.ctx.beginPath()
    this.ctx.fillStyle = 'pink'
    this.ctx.fillRect(-this.state.r/2, -this.state.r/2, this.state.r/2, this.state.r)
    // this.ctx.arc(0, 0, 4, 0, 2 * Math.PI)
    // this.ctx.fill()

    this.ctx.restore()
  }
}
