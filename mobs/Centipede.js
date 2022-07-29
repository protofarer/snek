import { moveEdgeWrap } from '../behaviors'
import { Segment } from './Snek'
import { turnRandomlySmoothly } from '../behaviors'
import Mob from './Mob'

export default class Centipede extends Mob {
  static species = 'centipede'
  species = 'centipede'

  swallowables = ['snek']

  r = 10
  get hitR() { return this.r }

  moveSpeed = 3

  primaryColor = 'hsl(35, 50%, 55%)'
  secondaryColor = 'hsl(30, 70%, 7%)'

  get headCoords() { return {
    x: this.position.x,
    y: this.position.y
  }}

  get mouthCoords() { return {
      x: this.headCoords.x + this.r * Math.cos(this.directionAngleRadians),
      y: this.headCoords.y + this.r * Math.sin(this.directionAngleRadians)
  }}

  turnRate = this.moveSpeed + 3

  nInitSegments = 5
  downstreamSegment

  constructor(ctx, startPosition=null, parentEnt=null, nInitSegments=null) {
    super(ctx, startPosition, parentEnt)
    this.nInitSegments = nInitSegments || this.nInitSegments
    this.addSegments(this.nInitSegments)
    this.setHitAreas()
  }

  addSegments(n) {
    const drawLegs = (ctx) => {
      const legColor = 'hsl(30, 70%, 10%)'
      ctx.beginPath()
      ctx.moveTo(0, -4.5*this.r)
      ctx.lineTo(0, 4.5*this.r)
      ctx.lineWidth = 1
      ctx.strokeStyle = legColor
      ctx.stroke()
    }

    function drawComponents (ctx) {
      this.drawLegs(ctx)
      this.drawBody(ctx)
    }

    for(let i = 0; i < n; i++) {
      if (!this.downstreamSegment){
        this.downstreamSegment = new Segment(this.ctx, this)
        this.downstreamSegment.drawLegs = drawLegs
        this.downstreamSegment.drawComponents = drawComponents
      } else {
        const newSegment = new Segment(this.ctx, this)
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

  swallow(ent) {
    ent.parentEnt = this
    ent.hitArea = new Path2D
    ent.swallowEffect(this)

    switch (ent.species) {
      case 'ant':
        this.downstreamSegment.ingest(ent)
        break
      case 'pebble':
        break
      default:
        console.info(`centipede.consume() defaulted`, )
    }
    ent?.carriedEnt && this.swallow(ent.carriedEnt)

    // if (this.swallowables.includes(ent.carriedEnt?.species)) {
    //   this.swallow(ent.carriedEnt)
    // } else {
    //   // Drop any non-swallowable carried ents
    // }
  }

  drawDebugOverlays() {
    // Mouth Hit
    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()

    let downSeg = this.downstreamSegment
    let downSegs = []
    while(downSeg) {
      downSegs.push(downSeg)
    }
    downSegs.forEach(s => s.drawDebugOverlays())
  }

  drawHead(ctx) {
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    ctx.lineWidth = 2
    ctx.fillStyle = this.bodyColor
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
    ctx.fillStyle = 'hsl(0, 100%, 50%)'
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
    ctx.strokeStyle = 'hsl(0,0%,0%)'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(.5*this.r, 1.8*this.r, 2.5*this.r, -1.6, -.9)
    ctx.stroke()
  }

  render() {
    this.downstreamSegment.render()

    this.ctx.save()
    this.ctx.translate(this.headCoords.x, this.headCoords.y)
    this.ctx.rotate(this.directionAngleRadians)
    this.ctx.scale(this.scale.x, this.scale.y * 0.8)

    this.drawHead(this.ctx)

    this.ctx.restore()
  }

  move() {
    this.position.x += this.moveSpeed 
      * Math.cos(this.directionAngleRadians)
    this.position.y += this.moveSpeed 
      * Math.sin(this.directionAngleRadians)

    turnRandomlySmoothly.call(this)
    moveEdgeWrap.call(this)
    this.setHitAreas()
  }

  update() {
    if (this.isMobile) {
      if (Math.random() < 0.005) {
        this.isMobile = false
        setTimeout(() => this.isMobile = true, 200 + Math.random() * 2000)
      } else {
        this.move()
      }
    }
    this.downstreamSegment?.update()
  }
}

export class LeggedSegment extends Segment {
  constructor(ctx, upstreamSegment) {
    super(ctx, upstreamSegment)
  }

  drawLegs(ctx) {
    ctx.beginPath()
    ctx.moveTo(0, -4.5*this.r)
    ctx.lineTo(0, 4.5*this.r)
    ctx.lineWidth = 1
    ctx.strokeStyle = this.legColor
    ctx.stroke()
  }

  drawComponents(ctx) {
    this.drawLegs(ctx)
    this.drawBody(ctx)
  }
}