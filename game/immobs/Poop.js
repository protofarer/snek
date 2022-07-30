import Immob from './Immob'

export default class Poop extends Immob {
  static entGroup = 'immob'
  static species = 'poop'
  entGroup = 'immob'
  species = 'poop'

  r = 5
  exp = 0
  primaryColor = 'hsl(40, 100%, 13%)'
  digestion = {
    timeLeft: 2000,
    baseTime: 2000,
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    super(ctx, startPosition, parentEnt)
  }

  // digestionEffect(entAffected) {
  //   entAffected.moveSpeed -= 0.1
  //   return () => { entAffected.moveSpeed += 0.1 }
  // }

  excretionEffect(entAffected) {
    console.log(`${entAffected} triggered ${this.species} excretion effect`)
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