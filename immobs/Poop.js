import Immob from './Immob'

export default class Poop extends Immob {
  static entGroup = 'immob'
  static species = 'poop'
  entGroup = 'immob'
  species = 'poop'

  state = {
    r: 5,
    primaryColor: 'hsl(40, 100%, 13%)',
    digestion: {
      timeLeft: 3000,
      effect(entAffected) {
        let upstreamSegment = entAffected.state.upstreamSegment
        while (upstreamSegment.state.upstreamSegment) {
            upstreamSegment = upstreamSegment.state.upstreamSegment
        }
        upstreamSegment.state.moveSpeed -= 0.3
        return () => {
          upstreamSegment.state.moveSpeed += 0.3
        }
      },
      excrete() { 
      // TODO Excrete before digestion over. Good relief! Speed boost for a few seconds
      }
    },
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    super(ctx, startPosition, parentEnt)
    this.ctx = ctx
    this.parentEnt = parentEnt
    this.state.position = startPosition || this.state.position
  }

  drawBody() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0,this.state.r, 0, 2 * Math.PI
      )
    this.ctx.fillStyle = this.state.primaryColor
    this.ctx.fill()
    this.ctx.lineWidth = 0.5
    this.ctx.stroke()
  }
}