import Poop from '../immobs/Poop'
import Entity from '../Entity'
import { moveEdgeWrap } from '../behaviors'
import Mob from './Mob'

export default class Snek extends Mob {
  static species = 'snek'
  species = 'snek'

  swallowables = ['apple', 'mango', 'ant', 'pebble', 'banana']

  r = 10
  get hitR() { return this.r }
  level = 1
  levelMultiplier = 2
  baseExp = 100
  currExp = 0
  
  expForLevel(level) {
    return (this.levelMultiplier**(level - 2)) * this.baseExp
  }

  get expGainedThisLevelOnly() {
    const expGained = this.currExp - (this.level === 1 ? 0 : this.expForLevel(this.level))
    return expGained
  }


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

  nInitSegments = 3
  downstreamSegment

  constructor(ctx, startPosition=null, parentEnt=null, nInitSegments=null) {
    super(ctx, startPosition, parentEnt)
    
    this.basePrimaryColor = 'hsl(100, 100%, 32%)'
    this.currPrimaryColor = this.basePrimaryColor

    this.baseTurnRate = this.baseMoveSpeed + 5
    this.currTurnRate = this.baseTurnRate

    this.baseMoveSpeed = 1
    this.currMoveSpeed = this.baseMoveSpeed

    this.nInitSegments = nInitSegments || this.nInitSegments
    this.addSegments(this.nInitSegments)

    this.setHitAreas()
    this.initEventListeners()
  }

  addSegments(n) {
    for(let i = 0; i < n; i++) {
      if (!this.downstreamSegment){
        this.downstreamSegment = new Segment(this.ctx, this)
      } else {
        const newSegment = new Segment(this.ctx, this)
        const oldSegment = this.downstreamSegment
        oldSegment.upstreamSegment = newSegment
        newSegment.downstreamSegment = oldSegment
        this.downstreamSegment = newSegment
      }
      this.nSegments++
    }
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
    ent.swallowBehavior(this)
    console.log(`IN snek, swallow:`, ent.species)

    switch (ent.species) {
      case 'apple':
        this.downstreamSegment.ingest(ent)
        break
      case 'pebble':
        this.downstreamSegment.ingest(ent)
        break
      case 'ant':
        this.downstreamSegment.ingest(ent)
        break
      case 'mango':
        this.downstreamSegment.ingest(ent)
        break
      case 'banana':
        this.downstreamSegment.ingest(ent)
        break
      default:
        console.info(`snek.consume() case-switch defaulted`, )
    }

    if (this.swallowables.includes(ent.carriedEnt?.species)) {
      this.swallowBehavior(ent.carriedEnt)
      ent.carriedEnt = null
    } else {
      // Drop any non-swallowable carried ents
    }
  }
  drawHitOverlays() {
    // Head Hit (from Mob)
    super.drawHitOverlays()

    // Mouth Hit
    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  drawDebugOverlays() {
    this.drawHitOverlays()
    // this.downstreamSegment.drawDebugOverlays()
    if (this.downstreamSegment) {
      let downSeg = this.downstreamSegment
      while(downSeg) {
        downSeg.drawDebugOverlays()
        downSeg = downSeg.downstreamSegment
      }
    }
  }

  drawHead() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.currPrimaryColor
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
    // ! game should end before downstreamSegment is gone?
    this.downstreamSegment.render()

    this.ctx.save()
    this.ctx.translate(this.headCoords.x, this.headCoords.y)
    this.ctx.rotate(this.directionAngleRadians)
    this.ctx.save()
    this.ctx.scale(this.scale.x, 0.8 * this.scale.y)

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
    this.position.x += this.currMoveSpeed 
      * Math.cos(this.directionAngleRadians)
    this.position.y += this.currMoveSpeed 
      * Math.sin(this.directionAngleRadians)
    moveEdgeWrap.call(this)
    this.setHitAreas()
  }

  update() {
    this.isMobile && this.move()
    // this.segments.update(this.position)
    // console.log(`this.downstreamseg`, this.downstreamSegment)
    this.downstreamSegment?.update()

    while(this.currExp >= this.expForLevel(this.level + 1)) {
      console.log(`Level up!`, )
      this.level++
      this.addSegments(1)
    }
  }
}

export class Segment {
  static species = 'segment'
  species = 'segment'

  position = {x:0,y:0}

  directionAngleRadians = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }
  get hitR() { return this.r + 1 }

  headPositionHistory = []

  entUnderDigestion
  upstreamSegment
  downstreamSegment
  postDigestionEffects = []
  underDigestionEffects = []

  constructor(ctx, upstreamSegment) {
    this.ctx = ctx
    this.upstreamSegment = upstreamSegment

    this.r = this.upstreamSegment.r
    this.scale = this.getHeadEnt().scale
    this.directionAngleRadians = this.upstreamSegment.directionAngleRadians
    this.position = {
      x: this.upstreamSegment.position.x,
      y: this.upstreamSegment.position.y
    }
    this.currPrimaryColor = this.upstreamSegment.currPrimaryColor
    this.setHitAreas()
  }

  getHeadEnt() {
    let upstreamSegment = this.upstreamSegment
    while (upstreamSegment?.upstreamSegment) {
        upstreamSegment = upstreamSegment.upstreamSegment
    }
    return upstreamSegment
  }

  ingest(ent) {
    // * All ents to be digested start here
    // * Activates digestion effects data for head ent

    
    // * Core mechanic: Ingesting another ent while an existing ent is under
    // * digestion forces the latter to be passed regardless of digestion state

    console.log(`ingesting ${ent.species}`, )

    if (this.entUnderDigestion) {
      // Force segment to pass contents
      console.log(`ingest-force-passing ${this.entUnderDigestion.species}`, )
      this.pass()
    }

    this.entUnderDigestion = ent
    this.entUnderDigestion.parentEnt = this
    this.entUnderDigestion.position = this.position

    this.entUnderDigestion.underDigestionData?.forEach( underDigestionEffect => {
        switch (underDigestionEffect.effect) {
          case 'moveSpeed':
            this.getHeadEnt().currMoveSpeed += underDigestionEffect.moveSpeed
            break
          case 'turnRate':
            this.getHeadEnt().currTurnRate += underDigestionEffect.turnRate
            break
          case 'primaryColor':
            this.getHeadEnt().currPrimaryColor = underDigestionEffect.primaryColor
            break
          default:
            console.log(`snek postDigestionEffect switch/case defaulted`, )
        }
      console.log(`adding underdigfx`, underDigestionEffect)
      
      this.underDigestionEffects.push(underDigestionEffect)
    })
    this.scale = this.entUnderDigestion.species === 'poop' ? { x: 1, y: 1.2 }: { x: 1, y: 1.5 }
  }

  reverseDigestionEffect(digestionEffect) {
    // * Must be removed by function outer to this one
    switch (digestionEffect.effect) {
      case 'moveSpeed':
        this.getHeadEnt().currMoveSpeed += -digestionEffect.moveSpeed
        break
      case 'turnRate':
        this.getHeadEnt().currTurnRate += -digestionEffect.turnRate
        break
      case 'primaryColor':
        this.getHeadEnt().currPrimaryColor = this.getHeadEnt().basePrimaryColor
        break
      default:
        console.log(`snek postDigestionEffect switch/case defaulted`, )
    }
  }
  
  digest() {
    if (this.entUnderDigestion.digestion.timeLeft > 0) {

      // * Overall digestion time for expAbsorb and passing

      this.entUnderDigestion.digestion.timeLeft = this.entUnderDigestion.digestion.timeLeft - 17 < 0
        ? 0
        : this.entUnderDigestion.digestion.timeLeft - 17
      
      this.entUnderDigestion.species !== 'poop' 
        && this.entUnderDigestion.absorbExp(this.getHeadEnt())

      // TODO put digestion effects here
      const expiredPostDigestionEffects = this.postDigestionEffects.filter(p => 
        p.timeLeft <= 0
      )

      // * Effects that occur only after content is fully digested

      // * Ensure effects are active while duration remains, then expire
      expiredPostDigestionEffects.forEach(postDigestionData => {
        switch (postDigestionData.effect) {
          case 'moveSpeed':
            this.getHeadEnt().currMoveSpeed += -postDigestionData.moveSpeed
            break
          case 'turnRate':
            this.getHeadEnt().currTurnRate += -postDigestionData.turnRate
            break
          default:
            console.log(`snek expiredDigestionEffect switch/case defaulted`, )
        }
        console.log(`postDigestEffect ${postDigestionData.effect} ended`, )
      })

      this.postDigestionEffects = this.postDigestionEffects.filter(postDigestionData =>
        postDigestionData.timeLeft >= 0
      )

      this.postDigestionEffects.forEach(postDigestionData => {
        postDigestionData.timeLeft -= 17
      })

      // * underDigestionEffects
    if (this.underDigestionEffects.length > 0) {
      // Reverse and Remove expended digestion effects
      const expiredUnderDigestionEffects = this.underDigestionEffects.filter(
        underDigestionEffect => underDigestionEffect.timeLeft <= 0
      )
      expiredUnderDigestionEffects.forEach(e => {
        console.log(`reversing underDigFx`, e)
        this.reverseDigestionEffect(e)
      })
      expiredUnderDigestionEffects.length > 0 && console.log(`expiredDigFx`, expiredUnderDigestionEffects)
      
      this.underDigestionEffects = this.underDigestionEffects.filter(underDigestionEffect => 
        underDigestionEffect.timeLeft > 0
      )

      // Tick under digestion effects
      this.underDigestionEffects = this.underDigestionEffects.map(underDigestionEffect => {
        const timeLeft = underDigestionEffect.timeLeft - 17 < 0
          ? 0
          : underDigestionEffect.timeLeft - 17
        return { ...underDigestionEffect, timeLeft }
      })
    }

      } else {
        // * Upon fully digesting contents transform ent into poop and pass

        const postDigestionData = this.entUnderDigestion.getPostDigestionData?.()
        if (postDigestionData) {
          postDigestionData.forEach(pDD => {
            this.postDigestionEffects.push(pDD)

            switch (pDD.effect) {
              case 'moveSpeed':
                this.getHeadEnt().currMoveSpeed += pDD.moveSpeed
                break
              case 'turnRate':
                this.getHeadEnt().currTurnRate += pDD.turnRate
                break
              default:
                console.log(`snek postDigestionEffect switch/case defaulted`, )
            }
            console.log(`postDigestEffect ${pDD.effect} from ${this.entUnderDigestion.species} activated`, )
          })
    
        }
        
      if (this.entUnderDigestion.species === 'poop'
        || this.entUnderDigestion.species === 'pebble') {
        this.pass()
      } else {
        // * "Disintegrate" the fully digested ent
        // ! consider recycling aka ring buffer to restore disintegrated ents
        // ! for reuse
        // ! Below needs to be more thorough
        this.entUnderDigestion.position = {x: -100, y: -100}
        this.entUnderDigestion.hitArea = new Path2D
        Entity.remove(this.entUnderDigestion.id)

        this.makePoop()
      }
    }

  }

  makePoop() {
    // TODO recycle or destroy the digested ent object
    const poop = new Poop(this.ctx, this.position, this)
    
    // ! Patch until interactive, detachable segments implemented
    poop.hitArea = new Path2D()

    new Entity(poop)
    this.entUnderDigestion = poop
    this.scale.y = 1.3
  }

  pass() {
    this.underDigestionEffects.forEach(d => {
      console.log(`Reversing underDigFx`, d)
      this.reverseDigestionEffect(d)
    })
    this.underDigestionEffects = []
      
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
    this.entUnderDigestion.wasExcreted = true
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

    this.currPrimaryColor = this.upstreamSegment.currPrimaryColor
    
    // ! Should this be before physics?
    if (this.entUnderDigestion) {
      this.entUnderDigestion.position = this.position
      this.digest()
    }

    // ! inefficient, running whether moving or not. Segment has no awareness of
    // ! its own movement except if it were to know about head's isMobile
    this.setHitAreas()
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
    ctx.fillStyle = this.currPrimaryColor
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 2
    ctx.shadowColor = 'hsl(0,0%,0%)'
    ctx.fill()
    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 
  }

  render() {
    this.downstreamSegment?.render()
    this.drawInitWrapper()
    this.entUnderDigestion?.render()
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - (this.hitR), 
      this.position.y - (this.hitR),
      2 * this.hitR,
      2 * this.hitR
    )
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
    this.drawHitOverlays()
  }
}