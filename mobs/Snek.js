import Poop from '../immobs/Poop'
import Entity from '../Entity'
import { moveEdgeWrap } from '../behaviors'

export default class Snek {
  static entGroup = 'mob'
  static species = 'snek'
  entGroup = 'mob'
  species = 'snek'

  swallowables = ['apple', 'mango', 'ant', 'pebble', 'segment']

  r = 10
  position = { x: 400, y: 400}
  get headCoords() { return {
    x: this.position.x,
    y: this.position.y
  }}
  moveSpeed = 1
  directionAngle = 0
  set directionRad(val) { this.directionAngle = val * 180 / Math.PI }
  get directionRad() { return this.directionAngle * Math.PI / 180 }
  turnRate() { return this.moveSpeed + 5 }
  get mouthCoords() { return {
      x: this.headCoords.x + this.r * Math.cos(this.directionRad),
      y: this.headCoords.y + this.r * Math.sin(this.directionRad),
    }}
  bodyColor = 'hsl(100, 100%, 32%)'
  nSegments = 1
  mobile = true
  hasTongueOut = false
  tongueDirection = 0
  exp = 0
  scale = 1
  downstreamSegment = {}

  constructor(ctx, startPosition=null, parentEnt=null, nSegments=null) {
    this.ctx = ctx
    this.position = startPosition || this.position
    this.parentEnt = parentEnt
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
    // this.segments = new Segments(this.ctx, this)
    this.hitR = this.r + 1
    this.initEventListeners()
  }

  isMobile(isMobile) {
    this.mobile = isMobile
    return this
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
      // this.directionAngle %= 360 ...why did I even... *_+
    }
    document.addEventListener('keydown', handleKeyDown)
  }

  turnLeft() {
    this.directionAngle += this.turnRate() * -1
  }

  turnRight() {
    this.directionAngle += this.turnRate() * 1
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
    this.ctx.fillStyle = this.bodyColor
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
    this.ctx.rotate(this.directionRad)
    this.ctx.save()
    this.ctx.scale(this.scale, this.scale * 0.8)

    this.drawHead()

    this.ctx.restore()
    if (!this.hasTongueOut) {
      if (Math.random() < 0.05) {
        this.hasTongueOut = true
        this.tongueDirection = Math.floor(Math.random() * 3 - 1)
        setTimeout(() => this.hasTongueOut = false, 100 + Math.random()*700)
      }
    }

    if (this.hasTongueOut) {
        this.ctx.save()
        this.ctx.rotate(0.3 * this.tongueDirection)
        this.drawTongue()
        this.ctx.restore()
    }
    this.ctx.restore()

  }

  move() {
    this.position.x += this.moveSpeed 
      * Math.cos(this.directionRad)
    this.position.y += this.moveSpeed 
      * Math.sin(this.directionRad)
    moveEdgeWrap.call(this)
    this.setHitAreas()
  }

  update() {
    this.mobile && this.move()
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
  bodyColor = null

  linkLength = 0
  headPositionHistory = []

  cancelDigestionEffect
  entUnderDigestion
  upstreamSegment
  downstreamSegment

  // TODO replace getHeadEnt with get headState() {}
  scale = { x: 0, y: 0 }
  r = 0

  constructor(ctx, upstreamSegment) {
    this.ctx = ctx
    this.upstreamSegment = upstreamSegment

    this.r = this.getHeadEnt().r
    this.directionAngleRadians = this.upstreamSegment.directionAngleRadians
    this.position = {
      x: this.upstreamSegment.position.x,
      y: this.upstreamSegment.position.y
    }
    this.scale = {x: this.getHeadEnt().scale, y: this.getHeadEnt().scale }
    this.bodyColor = this.upstreamSegment.bodyColor
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

      console.log(`finishing digestion effect`, )


      this.cancelDigestionEffect()
      this.cancelDigestionEffect = null

      if (this.entUnderDigestion.species === 'poop') {
        this.pass()
      } else {
        // TODO recycle or destroy the digested ent object
        const poop = new Poop(this.ctx, this.position, this)
        new Entity(poop)
        this.entUnderDigestion = poop
        this.cancelDigestionEffect = this.entUnderDigestion.digestionEffect(this.getHeadEnt())
        this.scale = { x: 1, y: 1.3 }
        console.log(`Made poo:`, poop)
      }
    }
  }

  pass() {
    // TODO call the digestionEffect function to reverse
    // TODO reverse change
    if (!this.downstreamSegment) {
      this.excrete()
    } else {
      console.log(`Passing`, )
      this.downstreamSegment.ingest(this.entUnderDigestion)
    }
    this.scale = {x: this.getHeadEnt().scale, y: this.getHeadEnt().scale }
    this.entUnderDigestion = null
  }

  excrete() {
    // TODO setup a line based on entity id across bottomn of screen till
    //    digestion code is complete
    console.log(`Excreting: ${this.entUnderDigestion.species}`, )
    
    if (this.entUnderDigestion.entGroup === 'immob') {
      this.entUnderDigestion.setHitAreas()
    }

    // TODO refactor
    let upstreamEnt = this.upstreamSegment
    while (upstreamEnt.upstreamSegment) {
      upstreamEnt = upstreamEnt.upstreamSegment
    }
    this.entUnderDigestion.parentEnt = upstreamEnt.parentEnt
  }

  getHeadMoveSpeed() {
    let upstreamSegment = this.upstreamSegment
    while (upstreamSegment.upstreamSegment) {
        upstreamSegment = upstreamSegment.upstreamSegment
    }
    return upstreamSegment.moveSpeed
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

    this.bodyColor = this.upstreamSegment.bodyColor
    
    if (this.entUnderDigestion) {
      // this.r = this.getHeadEnt().r + 3
      this.entUnderDigestion.position = this.position
      this.digest()
    } else {
    //  this.r = this.getHeadEnt().r
    }
    this?.downstreamSegment?.update()
  }

  drawLegs() {
  }

  render() {
    // console.log(`IN seg render, stae.pos and dir`, this.position, this.directionRad)
    this.downstreamSegment?.render()

    const position = this.position
    const angle = this.directionAngleRadians

    this.ctx.save()
    this.ctx.translate(position.x, position.y)
    this.ctx.rotate(angle)
    this.ctx.scale(this.scale.x, this.scale.y - .6)

    this.drawLegs()

    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.upstreamSegment.bodyColor
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 2
    this.ctx.shadowColor = 'hsl(0,0%,0%)'
    this.ctx.fill()
    this.ctx.shadowBlur = this.ctx.shadowOffsetY = this.ctx.shadowColor = null 

    this.ctx.restore()

    // console.log( 'ent under digestion',this.entUnderDigestion?.species )
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