export default class Snek {
  stats = {
    r: 5,
  }
  state = {
    headCoords: { x: 400, y: 400 },
    direction: -90,
    slitherSpeed: 1,
    // turnRate: function () { return this.slitherSpeed }
    turnRate: 10
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
          this.state.direction += this.state.turnRate * 1
          break
        case 'a':
          this.state.direction += this.state.turnRate * -1
          break
        default:
          break
      }
      this.state.direction %= 360
    }
    document.addEventListener('keydown', handleKeyDown)
  }


  step() {
    this.state.headCoords.x += this.state.slitherSpeed * Math.cos(this.state.direction * Math.PI / 180)
    this.state.headCoords.y += this.state.slitherSpeed * Math.sin(this.state.direction * Math.PI / 180)
    if (
      this.state.headCoords.x >= this.canvas.width ||
      this.state.headCoords.x <= 0 ||
      this.state.headCoords.y >= this.canvas.height ||
      this.state.headCoords.y <= 0
    ) {
      this.state.headCoords = { x: 400, y: 400 }
    }
    console.log(`this.state.turnRate()`, this.state.turnRate)
    console.log(`direction`, this.state.direction)
    console.log(`headcoords`, this.state.headCoords)
    
    this.drawSnake()
  }

  drawSnake() {
    this.ctx.save()
    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.stats.r, 0, 2 * Math.PI)
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'green'
    this.ctx.stroke()
    this.ctx.restore()
  }
}
