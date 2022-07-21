export default class Background {
  canvas = document.createElement('canvas')
  constructor(container, color) {
    this.container = container
    this.canvas.id = 'layerBackground'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)
    this.color = color
    this.ctx = this.canvas.getContext('2d')
    this.draw()
  }

  draw() {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

}