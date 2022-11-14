import { loadTraits } from '../../utils/helpers'
import Immob from '../immobs/Immob'
import Traits from '../Traits'

export default class Mob extends Immob {
  // Mobs are entities that are generally more dynamic than immobs. They can
  // change their own position via a move function and have some level of
  // autonomy in the form of swallows, bites, grabs, and have sets of behaviors
  // and state-modifying effects.

  static entGroup = 'mob'
  entGroup = 'mob'

  // * Override in instance constructor: 1) field specify baseMS 2) this.moveSpeed = this.baseMS
  // * otherwise will be set to below
  isMobile = true
  currMoveSpeed = this.baseMoveSpeed
  
  // get moveSpeed() { return this.currMoveSpeed }
  // set moveSpeed(val) { this.currMoveSpeed = Math.max(this.minMoveSpeed, val)}
  
  // * Override in instance constructor: 1) field specify baseTR 2) this.turnRate = this.baseTR
  // * otherwise will be set to below
  isTurnable = true
  turnDirection = 0
  isTurningLeft = false
  isTurningRight = false
  activeEffects = []

  constructor(ctx, startPosition=null, parent=null) {
    super(ctx, startPosition, parent)
    loadTraits.call(this, Traits.Mob)
    this.normalizeTurnRate()
  }

  normalizeTurnRate() {
    let sumTurnRates = 0
    if (this.activeEffects.length > 0) {
      sumTurnRates = this.activeEffects.reduce((prev, curr) => {
        if (curr?.offsets?.turnRate) {
          return prev + curr.offsets.turnRate
        }
        return prev
      }, 0)
    }
    
    this.currTurnRate = this.baseMoveSpeed 
      + (this.turnRateOffset - (this.level * 0.15))
      + sumTurnRates
  }

  setTurnable(setTurnable) {
    this.isTurnable = setTurnable
    return this
  }

  setMobile(setMobile) {
    this.isMobile = setMobile
    return this
  }
  
  turnLeft() {
    this.headingDegrees += -this.currTurnRate
  }

  turnRight() {
    this.headingDegrees += this.currTurnRate
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.rect(0,0,10,10)
    ctx.strokeStyle = this.primaryColor
    ctx.lineWidth = 2
    ctx.stroke()
  }

  drawInitWrapper(radians=null) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    if (this.scale.x !== 1 || this.scale.y !== 1) {
      ctx.scale(this.scale.x, this.scale.y)
    }
    radians && ctx.rotate(radians)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }

  render() {
    this.drawInitWrapper(this.headingRadians)
  }
}