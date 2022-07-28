import Immob from './Immob'

export default class Poop extends Immob {
  static entGroup = 'immob'
  static species = 'poop'
  entGroup = 'immob'
  species = 'poop'

  r = 5
  primaryColor = 'hsl(40, 100%, 13%)'
  digestion = {
    timeLeft: 2000,
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    super(ctx, startPosition, parentEnt)
    this.ctx = ctx
    this.parentEnt = parentEnt
    this.position = startPosition || this.position
  }

  digestionEffect(entAffected) {
    entAffected.moveSpeed -= 0.1
    return () => { entAffected.moveSpeed += 0.1 }
  }

  excretionEffect(entAffected) {
    console.log(`${entAffected} triggered ${this.species} excretion effect`)
  }

  drawBody() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0,this.r, 0, 2 * Math.PI
      )
    this.ctx.fillStyle = this.primaryColor
    this.ctx.fill()
    this.ctx.lineWidth = 0.5
    this.ctx.stroke()
  }
}