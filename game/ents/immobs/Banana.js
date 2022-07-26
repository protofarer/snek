import { loadTraits } from '../../utils/helpers'
import Immob from './Immob'
import Traits from '../Traits'

export default class Banana extends Immob {
  static species = 'banana'
  species = 'banana'

  constructor(ctx, position, parent=null) {
    super(ctx, position, parent)
    loadTraits.call(this, Traits.Banana)
    this.currExp = this.baseExp
    this.setHitAreas()
  }

  drawBody(ctx) {
    ctx.save()
    ctx.translate(-0.75*this.r, -0.75*this.r)
    ctx.beginPath()
    ctx.arc(0.5, 0.5, this.r * 1.5, -0.5, 2)
    ctx.arc(-1.4*this.r, -1.4*this.r, this.r*3, 1.2, 0.4, true)
    ctx.lineJoin = 'bevel'
    ctx.fillStyle = this.primaryColor
    ctx.fill()

    this.drawShadow(ctx)

    ctx.beginPath()
    ctx.moveTo(this.r*1.45*Math.cos(-0.2), this.r*1.45*Math.sin(-0.2))
    ctx.lineTo(
      this.r*1.5*Math.cos(-0.3) - (this.r/6), 
      this.r*1.5*Math.sin(-0.3) - (0.25*this.r)
    )
    ctx.moveTo(this.r*1.45*Math.cos(1.88), this.r*1.5*Math.sin(1.88))
    ctx.lineTo(
      this.r*1.45*Math.cos(1.88) - (this.r/6), 
      this.r*1.45*Math.sin(1.88)
    )
    ctx.lineWidth = this.r/4
    ctx.strokeStyle = this.secondaryColor
    ctx.stroke()

    ctx.restore()
  }

  drawShadow(ctx) {
    ctx.shadowOffsetY = this.r * 0.5
    ctx.shadowColor = 'hsl(0,0%,20%)'
    ctx.shadowBlur = this.r * 0.3
    ctx.fill()
    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }
}