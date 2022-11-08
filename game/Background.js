/** 
 * Background canvas renders at bottom-most layer in canvas stack 
 * @class
 */
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
    this.ctx.fillStyle = 'hsl(35,40%,29%)'
    // this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    const n = 1000
    for(let i = 0; i < n; i++) {
      // Choose random coordinates
      const ry = Math.random() * this.canvas.height
      const rx = Math.random() * this.canvas.width

      // Draw dirt particles
      this.ctx.moveTo(rx, ry)
      this.ctx.lineTo(rx+1, ry)
      this.ctx.strokeStyle=`hsla(0,0%,${Math.random()*40}%,${0.3 + Math.random() * 0.3})`
      this.ctx.stroke()

    }
  }
}