import { loadTraits } from '../../utils/helpers'
import Immob from './Immob'
import Traits from '../Traits'

export default class Poop extends Immob {
  static species = 'poop'
  species = 'poop'

  constructor(ctx, startPosition=null, parent=null) {
    super(ctx, startPosition, parent)
    loadTraits.call(this, Traits.Poop)
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