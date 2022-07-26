import Apple from '../immobs/Apple'

export default class Mango extends Apple {
  static entGroup = 'immob'
  static species = 'mango'
  entGroup = 'immob'
  species = 'mango'

  constructor(ctx, position, parentEnt=null) {
    super(ctx, position, parentEnt)
    this.state.primaryColor = 'hsl(35,100%, 50%)'
    this.state.secondaryColor = 'green'
  }

  drawBody() {
    this.ctx.save()
    this.ctx.rotate(1.25)
    this.ctx.scale(0.8, 1)
    this.ctx.beginPath()

    this.ctx.arc(this.state.r*0.3, 0, this.state.r, 0, 2 * Math.PI)
    let grad = this.ctx.createLinearGradient(
      0.3 * this.state.r,
      this.state.r,
      2 * this.state.r,
      0.5 * this.state.r
    )
    grad.addColorStop(0.2, this.state.primaryColor)
    grad.addColorStop(0.9,'green')
    this.ctx.fillStyle = grad
    this.ctx.fill()

    this.drawShadow()

    this.ctx.restore()
  }

  drawHighlight() {}
  drawStem() {}
  drawLeaf() {}
  update() {
  }
}