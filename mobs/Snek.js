import Poop from '../immobs/Poop'
import Entity from '../Entity'
import { moveEdgeWrap } from '../behaviors'
import Mob from './Mob'

export default class Snek extends Mob {
  static species = 'snek'
  species = 'snek'

  swallowables = ['apple', 'mango', 'ant', 'pebble', 'segment']

  r = 10
  position = { x: 4000, y: 400 }

  directionAngleRadians = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }

  exp = 0

  primaryColor = 'hsl(100, 100%, 32%)'

  get headCoords() { return {
    x: this.position.x,
    y: this.position.y
  }}

  get mouthCoords() { return {
      x: this.headCoords.x + this.r * Math.cos(this.directionAngleRadians),
      y: this.headCoords.y + this.r * Math.sin(this.directionAngleRadians),
    }}

  isTongueOut = false
  tongueDirection = 0

  nSegments = 2
  downstreamSegment = {}

  constructor(ctx, startPosition=null, parentEnt=null, nSegments=null) {
    super(ctx, startPosition, parentEnt)

    this.nSegments = nSegments || this.nSegments
    for(let i = 0; i < this.nSegments; i++) {
      if (i === 0){
        this.downstreamSegment = new Segment(this.ctx, this)
      } else {
        const newSegment = new Segment(this.ctx, this)
        const oldSegment = this.downstreamSegment
        oldSegment.upstreamSegment = newSegment
        newSegment.downstreamSegment = oldSegment
        this.downstreamSegment = newSegment
      }
    }

    this.hitR = this.r + 1
    this.initEventListeners()
  }

  addSegment() {
    this.nSegments++
    // this.segments.addSegment()
  }

  initEventListeners() {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'd':
          this.turnRight()
          break
        case 'a':
          this.turnLeft()
          break
        default:
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
  }

  swallow(ent) {
    ent.parentEnt = this
    ent.hitArea = new Path2D()
    ent.swallowEffect(this)

    switch (ent.species) {
      case 'apple':
        this.downstreamSegment.ingest(ent)
        break
      case 'pebble':
        break
      case 'ant':
        break
      case 'mango':
        break
      default:
        console.info(`snek.consume() case-switch defaulted`, )
    }

    if (this.swallowables.includes(ent.carriedEnt?.species)) {
      this.swallow(ent.carriedEnt)
    } else {
      // Drop any non-swallowable carried ents
    }
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - this.hitR, 
      this.position.y - this.hitR,
      2 * this.hitR,
      2 * this.hitR
    )
  }

  drawHitOverlays() {
    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  drawHead() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.primaryColor
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 2
    this.ctx.shadowColor = 'hsl(0,0%,0%)'
    this.ctx.fill()
    this.ctx.shadowBlur = this.ctx.shadowOffsetY = this.ctx.shadowColor = null 

    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r * 0.85, -Math.PI / 3, Math.PI / 3)
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(0.9*this.r * 0.6, -0.4 * this.r)
    this.ctx.lineTo(0.9*this.r, -0.4 * this.r)
    this.ctx.moveTo(0.9*this.r * 0.6, 0.4 * this.r)
    this.ctx.lineTo(0.9*this.r, 0.4 * this.r)
    this.ctx.strokeStyle = 'white'
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(0, 0.45 * this.r, 0.34 * this.r, 0, 2*Math.PI)
    this.ctx.arc(0, -0.45 * this.r, 0.34 * this.r, 0, 2*Math.PI)
    this.ctx.fillStyle ='white'
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(0.1 * this.r, 0.40 * this.r, 0.19 * this.r, 0, 2*Math.PI)
    this.ctx.fillStyle = 'black'
    this.ctx.fill()
    this.ctx.lineWidth = 1.5
    this.ctx.strokeStyle = 'hsl(230,100%,80%)'
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(0.1 * this.r, -0.40 * this.r, 0.19 * this.r, 0, 2*Math.PI)
    this.ctx.fill()
    this.ctx.strokeStyle = 'hsl(55, 100%, 25%)'
    this.ctx.stroke()
  }

  drawTongue() {
    this.ctx.beginPath()
    this.ctx.moveTo(0.8*this.r, 0)
    this.ctx.lineTo(1.6*this.r, 0,)
    this.ctx.lineTo(2*this.r, 0.3 * this.r)
    this.ctx.moveTo(1.6*this.r, 0)
    this.ctx.lineTo(2*this.r, -0.3 * this.r)
    this.ctx.lineWidth = this.r * .09
    this.ctx.strokeStyle='red'
    this.ctx.stroke()
  }

  render() {
    this.downstreamSegment.render()
    // this.segments.render()
    this.ctx.save()
    this.ctx.translate(this.headCoords.x, this.headCoords.y)
    this.ctx.rotate(this.directionAngleRadians)
    this.ctx.save()
    this.ctx.scale(1 * this.scale.x, 0.8 * this.scale.y)

    this.drawHead()

    this.ctx.restore()
    if (!this.isTongueOut) {
      if (Math.random() < 0.05) {
        this.isTongueOut = true
        this.tongueDirection = Math.floor(Math.random() * 3 - 1)
        setTimeout(() => this.isTongueOut = false, 100 + Math.random()*700)
      }
    }

    if (this.isTongueOut) {
        this.ctx.save()
        this.ctx.rotate(0.3 * this.tongueDirection)
        this.drawTongue()
        this.ctx.restore()
    }
    this.ctx.restore()

  }

  move() {
    this.position.x += this.moveSpeed 
      * Math.cos(this.directionAngleRadians)
    this.position.y += this.moveSpeed 
      * Math.sin(this.directionAngleRadians)
    moveEdgeWrap.call(this)
    this.setHitAreas()
  }

  update() {
    this.isMobile && this.move()
    // this.segments.update(this.position)
    // console.log(`this.downstreamseg`, this.downstreamSegment)
    
    this?.downstreamSegment.update()
  }
}

export class Segment {
  static species = 'segment'
  species = 'segment'

  position = {x:0,y:0}

  directionAngleRadians = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }

  digestionEffect = ''
  primaryColor = null

  linkLength = 0
  headPositionHistory = []

  cancelDigestionEffect
  entUnderDigestion
  upstreamSegment
  downstreamSegment

  constructor(ctx, upstreamSegment) {
    this.ctx = ctx
    this.upstreamSegment = upstreamSegment

    this.r = this.getHeadEnt().r
    this.directionAngleRadians = this.upstreamSegment.directionAngleRadians
    this.position = {
      x: this.upstreamSegment.position.x,
      y: this.upstreamSegment.position.y
    }
    this.scale = this.getHeadEnt().scale
    this.primaryColor = this.upstreamSegment.primaryColor
  }

  getHeadEnt() {
    let upstreamSegment = this.upstreamSegment
    while (upstreamSegment?.upstreamSegment) {
        upstreamSegment = upstreamSegment.upstreamSegment
    }
    return upstreamSegment
  }


  ingest(ent) {
    if (this.entUnderDigestion) {
      // Force segment to pass contents
      this.cancelDigestionEffect()
      this.cancelDigestionEffect = null
      this.pass()
    }
    this.entUnderDigestion = ent
    this.entUnderDigestion.parentEnt = this
    this.entUnderDigestion.position = this.position
    this.cancelDigestionEffect = this.entUnderDigestion
      .digestionEffect(this.getHeadEnt())
    this.scale = this.entUnderDigestion.species === 'poop' ? { x: 1, y: 1.2 }: { x: 1, y: 1.5 }
  }
  
  digest() {
    if (this.entUnderDigestion.digestion.timeLeft > 0) {
      // console.log(`digesting timeleft:`, this.entUnderDigestion.digestion.timeLeft)
      this.entUnderDigestion.digestion.timeLeft -= 17    // TODO subtract timeElapsed since last digest tick
      this.entUnderDigestion.species !== 'poop' && this.entUnderDigestion.absorbExp(this.getHeadEnt())
    } else {
      // * Upon fully digesting contents transform ent into poop and pass
      this.cancelDigestionEffect()
      this.cancelDigestionEffect = null

      if (this.entUnderDigestion.species === 'poop') {
        this.pass()
      } else {
        this.makePoop()
      }
    }
  }
  makePoop() {
    // TODO recycle or destroy the digested ent object
    const poop = new Poop(this.ctx, this.position, this)
    new Entity(poop)
    this.entUnderDigestion = poop
    this.cancelDigestionEffect = this.entUnderDigestion.digestionEffect(this.getHeadEnt())
    this.scale.y = 1.3
  }

  pass() {
    if (!this.downstreamSegment) {
      this.excrete()
    } else {
      this.downstreamSegment.ingest(this.entUnderDigestion)
    }
    this.scale = this.getHeadEnt().scale
    this.entUnderDigestion = null
  }

  excrete() {
    if (this.entUnderDigestion.entGroup === 'immob') {
      this.entUnderDigestion.setHitAreas()
    }
    this.entUnderDigestion.parentEnt = this.getHeadEnt().parentEnt
  }

  update() {
    this.headPositionHistory.splice(0, 0, {
      x: this.upstreamSegment.position.x,
      y: this.upstreamSegment.position.y
    })

    let headTrailElementsToKeep = this.headPositionHistory.length
    let headTrailLength = 0

    for (let i = 1; i < this.headPositionHistory.length; i++) {

      headTrailLength += Math.sqrt(
        (this.headPositionHistory[i].x - this.headPositionHistory[i-1].x)**2
        + (this.headPositionHistory[i].y - this.headPositionHistory[i-1].y)**2
      )

      // * Tweak Segment Follow distance here: coefficient to r
      if (headTrailLength >= (this.r*1.8)) {
        headTrailElementsToKeep = i
        break
      }
    }

    this.headPositionHistory.splice(headTrailElementsToKeep)

    this.position = {
      x: this.headPositionHistory.at(-1).x,
      y: this.headPositionHistory.at(-1).y
    }

    this.upstreamSegmentTailPosition = {
      x: this.upstreamSegment.position.x 
        - this.upstreamSegment.r 
          * Math.cos(this.upstreamSegment.directionAngleRadians),
      y: this.upstreamSegment.position.y 
        - this.upstreamSegment.r 
          * Math.sin(this.upstreamSegment.directionAngleRadians),
    }
    const dy = (this.upstreamSegmentTailPosition.y - this.position.y)
    const dx = (this.upstreamSegmentTailPosition.x - this.position.x)
    this.directionAngleRadians = Math.atan(dy/dx)

    this.primaryColor = this.upstreamSegment.primaryColor
    
    if (this.entUnderDigestion) {
      this.entUnderDigestion.position = this.position
      this.digest()
    }
    this.downstreamSegment?.update()
  }

  drawInitWrapper() {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.directionAngleRadians)
    ctx.scale(this.scale.x, this.scale.y - .6)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.primaryColor
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 2
    ctx.shadowColor = 'hsl(0,0%,0%)'
    ctx.fill()
    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 
    ctx.restore()
  }

  render() {
    this.downstreamSegment?.render()
    this.drawInitWrapper()
    this.entUnderDigestion?.render()
  }

  drawDebugOverlays() {
    for(let i = 0; i < this.headPositionHistory.length; i++) {
      this.ctx.beginPath()
      this.ctx.arc(
        this.headPositionHistory[i].x, 
        this.headPositionHistory[i].y, 1, 0, 2*Math.PI)
      this.ctx.fillStyle='red'
      this.ctx.fill()
    }
  }
}