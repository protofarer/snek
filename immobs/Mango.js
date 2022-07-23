import Apple from '../immobs/Apple'

export default class Mango extends Apple {
  static species = 'mango'
  species = 'mango'
  static entGroup = 'immob'
  entGroup = 'immob'
  constructor(ctx, position, parentEnt=null, id=null) {
    super(ctx, position, parentEnt, id)
    this.state.primaryColor = 'hsl(35,100%, 50%)'
    this.state.secondaryColor = 'green'
    // self frames for animation
  }

  drawBody() {
    const ctx = this.ctx
    ctx.save()
    ctx.rotate(1.25)
    ctx.scale(0.8, 1)
    ctx.beginPath()

    ctx.arc(this.state.r*0.3, 0, this.state.r, 0, 2 * Math.PI)
    let grad = ctx.createLinearGradient(
      0.3 * this.state.r,
      this.state.r,
      2 * this.state.r,
      0.5 * this.state.r
    )
    grad.addColorStop(0.2, this.state.primaryColor)
    grad.addColorStop(0.9,'green')
    ctx.fillStyle = grad
    ctx.fill()

    this.drawShadow()

    ctx.restore()
  }

  drawHighlight() {

  }

  drawLeaf() {}

}