import { smallChompEffect } from '../behaviors/digestion'
import Immob from './Immob'

export default class Mango extends Immob {
  static species = 'mango'
  species = 'mango'

  r = 6
  digestion = {
    timeLeft: 16000,
    baseTime: 16000
  }

  baseExp = 40
  currExp = this.baseExp

  secondaryColor = 'green'

  chompEffect = smallChompEffect

    // TODO
    // const refreshEffect = (entAffected) => {
    // }
    postDigestionData = [
      {
        effect: 'turnRate',
        type: 'boolean',
        turnRate: 1,
        duration: 32000,
        timeLeft: 32000
      },
      {
        effect: 'moveSpeed',
        type: 'boolean',
        moveSpeed: 0.5,
        duration: 32000,
        timeLeft: 32000
      },
      // TODO
      // {
      //   effect: 'refresh',
      //   type: 'function',
      //   refresh:
      // }
    ]

  constructor(ctx, position, parentEnt=null) {
    super(ctx, position, parentEnt)

    this.primaryColor = {
      hueStart: 35,
      hueEnd: 35,
      satStart: 100,
      satEnd: 25,
      lumStart: 50,
      lumEnd: 40
    }

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