import Immob from './Immob'
import Traits from '../Traits'
import { loadTraits } from '../../utils/helpers'

export default class Mango extends Immob {
  static species = 'mango'
  species = 'mango'

  constructor(ctx, position, parent=null) {
    super(ctx, position, parent)
    loadTraits.call(this, Traits.Mango)
    this.currExp = this.baseExp
    this.setHitAreas()
  }

  drawBody(ctx) {
    ctx.save()
    ctx.translate(-0.1*this.r, -0.2*this.r)
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

    this.drawShadow(ctx)

    ctx.fill()

    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 

    ctx.restore()
  }

  drawShadow(ctx) {
    ctx.shadowOffsetY = this.r * 0.4
    ctx.shadowColor = 'hsl(0,0%,20%)'
    ctx.shadowBlur = this.r * 0.2
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }
}