export default class Background {
  canvas = document.createElement('canvas')
  constructor(container) {
    this.container = container
    this.canvas.id = 'layerBackground'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)
    // this.color = color
    this.ctx = this.canvas.getContext('2d')
    this.draw()
  }

  draw() {
    // night color hsl 52 30 32
    this.ctx.fillStyle = 'hsl(35,25%,30%)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}