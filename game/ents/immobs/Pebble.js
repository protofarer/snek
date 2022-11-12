import { loadTraits } from '../../utils/helpers'
import Immob from './Immob'
import Traits from '../Traits'

export default class Pebble extends Immob {
  static species ='pebble'
  species = 'pebble'

  constructor(ctx, startPosition, parent) {
    super(ctx, startPosition, parent)
    loadTraits.call(this, Traits.Pebble)
    this.r = this.r + Math.ceil(Math.random() * 2)     // TODO skewed gaussian random dist
    this.headingDegrees = Math.random() * 359
    this.setHitAreas()
  }

  drawShadow(ctx) {
    ctx.shadowOffsetY = 0.5 * this.r
    ctx.shadowColor='hsl(0,0%,10%)'
    ctx.shadowBlur = 0.33 * this.r
  }

  drawBody(ctx) {
    ctx.save()
    ctx.rotate(Math.PI / 3)
    ctx.beginPath()
    ctx.arc(this.r/6, 0, this.r, 0, 2 * Math.PI)
    ctx.arc(-this.r/6, 0, 0.8*this.r, 0, 2 * Math.PI)

    this.drawShadow(ctx)

    ctx.fillStyle = this.primaryColor
    ctx.fill()

    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }
}