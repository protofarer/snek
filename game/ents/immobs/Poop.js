import Immob from './Immob'

export default class Poop extends Immob {
  static entGroup = 'immob'
  entGroup = 'immob'

  static species = 'poop'
  species = 'poop'

  r = 5

  digestion = {
    timeLeft: 2000,
    baseTime: 2000,
  }

  currExp = this.baseExp

  primaryColor = 'hsl(40, 100%, 13%)'

  chompEffect = undefined
  underDigestionData = []

  constructor(ctx, startPosition=null, parent=null) {
    super(ctx, startPosition, parent)
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.arc(0, 0,this.r, 0, 2 * Math.PI
      )
    ctx.fillStyle = this.primaryColor
    ctx.fill()
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }
}