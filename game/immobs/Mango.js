import Apple from '../immobs/Apple'

export default class Mango extends Apple {
  static entGroup = 'immob'
  static species = 'mango'
  entGroup = 'immob'
  species = 'mango'

  constructor(ctx, position, parentEnt=null) {
    super(ctx, position, parentEnt)
    this.primaryColor = {
      hueStart: 35,
      hueEnd: 35,
      satStart: 100,
      satEnd: 30,
      lumStart: 50,
      lumEnd: 25
    }
    this.secondaryColor = 'green'
  }

  drawBody(ctx) {
    ctx.save()
    ctx.rotate(1.25)
    ctx.scale(0.8, 1)
    ctx.beginPath()

    ctx.arc(this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    let grad = ctx.createLinearGradient(
      0.3 * this.r,
      this.r,
      2 * this.r,
      0.5 * this.r
    )
    grad.addColorStop(0.2, this.primaryColor)
    grad.addColorStop(0.9,'green')
    ctx.fillStyle = grad
    ctx.fill()

    this.drawShadow(ctx)

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }

  update() {
  }
}