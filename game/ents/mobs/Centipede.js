import Segment from '../immobs/Segment'
import Traits from '../Traits'
import { turnRandomlySmoothly } from '../../behaviors/movements'
import Mob from './Mob'
import { loadTraits } from '../../utils/helpers'

export default class Centipede extends Mob {
  static species = 'centipede'
  species = 'centipede'

  get hitR() { return this.r + this.hitOffset }

  get headCoords() { return {
    x: this.position.x,
    y: this.position.y
  }}

  get mouthCoords() { return {
      x: this.headCoords.x + this.r * 0.5 * Math.cos(this.headingRadians),
      y: this.headCoords.y + this.r * 0.5 * Math.sin(this.headingRadians)
  }}

  baseSegmentCount = 5
  downstreamSegment
  postDigestionEffects = []
  canHarm = true

  constructor(ctx, startPosition=null, parent=null, baseSegmentCount=null) {
    super(ctx, startPosition, parent)
    loadTraits.call(this, Traits.Centipede)
    this.currPrimaryColor = this.basePrimaryColor
    this.currExp = this.baseExp
    this.currMoveSpeed = this.baseMoveSpeed
    this.baseTurnRate = this.baseMoveSpeed + this.turnRateOffset
    this.currTurnRate = this.baseTurnRate
    this.baseSegmentCount = baseSegmentCount || this.baseSegmentCount
    this.addSegments(this.baseSegmentCount)
    this.setHitAreas()
  }

  addSegments(n) {
    const drawLegs = (ctx) => {
      ctx.save()

      // ! janky, need to exclude legs from scaling altogether
      ctx.scale(1,0.5)

      ctx.beginPath()
      ctx.moveTo(0, -4.2*this.r)
      ctx.lineTo(0, 4.2*this.r)
      ctx.lineWidth = 1
      ctx.strokeStyle = this.colorLeg
      ctx.stroke()
      ctx.restore()
    }

    function drawComponents (ctx) {
      this.drawLegs(ctx)
      this.drawBody(ctx)
    }

    for(let i = 0; i < n; i++) {
      if (!this.downstreamSegment){
        this.downstreamSegment = new Segment(this.ctx, this)
        this.downstreamSegment.subSpecies = 'centipede'
        this.downstreamSegment.drawLegs = drawLegs
        this.downstreamSegment.drawComponents = drawComponents
      } else {
        const newSegment = new Segment(this.ctx, this)
        newSegment.subSpecies = 'centipede'
        newSegment.drawLegs = drawLegs
        newSegment.drawComponents = drawComponents

        const oldSegment = this.downstreamSegment
        oldSegment.upstreamSegment = newSegment
        newSegment.downstreamSegment = oldSegment
        this.downstreamSegment = newSegment
      }
      this.nSegments++
    }
  }

  drawDebugOverlays() {
    // Head Hit (from Mob)
    super.drawHitOverlays()
    // Mouth Hit
    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()

    if (this.downstreamSegment) {
      let downSeg = this.downstreamSegment

      while(downSeg) {
        downSeg.drawDebugOverlays()
        downSeg = downSeg.downstreamSegment
      }
    }
  }

  drawHead(ctx) {
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    ctx.lineWidth = 2
    ctx.fillStyle = this.currPrimaryColor
    ctx.fill()

    // eyes
    ctx.beginPath()
    ctx.arc(
      0.7 * this.r, 
      0.33 * this.r, 
      0.2 * this.r, 
      2.5, 
      -1,
      true
    )
    ctx.fillStyle = this.colorEyes
    ctx.fill()
    ctx.beginPath()
    ctx.arc(
      0.7 * this.r,
      -0.33 * this.r, 
      0.2 * this.r, 
      1, 
      -2.5,
      true
    )
    ctx.fill()

    // fangs
    ctx.beginPath()
    ctx.arc(.5*this.r, -1.8*this.r, 2.5 * this.r, .9, 1.6)
    ctx.lineWidth = 0.15*this.r
    ctx.strokeStyle = this.colorFangs
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(.5*this.r, 1.8*this.r, 2.5*this.r, -1.6, -.9)
    ctx.stroke()
  }

  render() {
    this.downstreamSegment.render()

    this.ctx.save()
    this.ctx.translate(this.headCoords.x, this.headCoords.y)
    this.ctx.rotate(this.headingRadians)
    this.ctx.scale(this.scale.x, this.scale.y * 0.8)

    this.drawHead(this.ctx)

    this.ctx.restore()
  }

  move() {
    if (this.isMobile) {
      if (Math.random() < 0.007) {
        this.isMobile = false
        setTimeout(() => this.isMobile = true, 200 + Math.random() * 2000)
      } else {
        this.position.x += this.currMoveSpeed 
          * Math.cos(this.headingRadians)
        this.position.y += this.currMoveSpeed 
          * Math.sin(this.headingRadians)
        this.isTurnable && turnRandomlySmoothly.call(this)
        this.setHitAreas()
      }
    }
  }

  update() {
    this.move()
    this.downstreamSegment?.update()
  }
}