import Immob from './Immob'

export default class Pebble extends Immob {
  static species ='pebble'
  species = 'pebble'

  // * "r" is the canonical size descriptor. All ents can be compared to each
  // * other and thus states inferred from this attribute.
  r = 3

  primaryColor = 'hsl(220, 10%, 48%)'

  digestion = {
    baseTime: 600000,
    timeLeft: 600000
  }

  chompEffect = undefined
  expEffect = undefined

  constructor(ctx, startPosition, parent, r=null) {
    super(ctx, startPosition, parent)
    this.r = r || 2 + Math.ceil(Math.random() * 2)     // TODO skewed gaussian random dist
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