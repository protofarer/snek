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
    this.ctx.save()
    this.ctx.rotate(1.25)
    this.ctx.scale(0.8, 1)
    this.ctx.beginPath()

    this.ctx.arc(this.state.r*0.3, 0, this.state.r, 0, 2 * Math.PI)
    let grad = ctx.createLinearGradient(
      0.3 * this.state.r,
      this.state.r,
      2 * this.state.r,
      0.5 * this.state.r
    )
    grad.addColorStop(0, this.state.primaryColor)
    grad.addColorStop(0.8,'green')
    ctx.fillStyle = grad
    this.ctx.fill()
    this.ctx.restore()
  }

  drawHighlight() {

  }

  drawLeaf() {}

}