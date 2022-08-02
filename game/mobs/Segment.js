import Poop from '../immobs/Poop'
import Entity from '../Entity'
import { baseSwallowEffect } from '../behaviors'
import { baseAbsorbExp } from '../behaviors'

export default class Segment {
  static entGroup = 'segment'
  entGroup = 'segment'

  // * Species initialized upon attachment to a head

  position = {x:0,y:0}

  directionAngleRadians = 0
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }
  get hitR() { return this.r + 1 }

  baseExp = 10
  get expAbsorbRate() {
    const rate = (17 / this.digestion.baseTime) * this.baseExp / 2
    return rate
  }

  swallowEffect = baseSwallowEffect

  digestion = {
    timeLeft: 6000,
    baseTime: 6000
  }

  headPositionHistory = []

  entUnderDigestion
  upstreamSegment
  downstreamSegment
  postDigestionEffects = []
  underDigestionEffects = []

  constructor(ctx, upstreamSegment) {
    this.ctx = ctx
    this.upstreamSegment = upstreamSegment
    this.parentEnt = this.getHeadEnt().parentEnt
    this.r = this.upstreamSegment.r
    this.scale = this.getHeadEnt().scale
    this.directionAngleRadians = this.upstreamSegment.directionAngleRadians
    this.position = {
      x: this.upstreamSegment.position.x,
      y: this.upstreamSegment.position.y
    }
    this.currPrimaryColor = this.upstreamSegment.currPrimaryColor
    this.postDigestionData = [
      {
        effect: 'moveSpeed',
        moveSpeed: 0.5,
        duration: 24000,
        timeLeft: 24000
      },
    ]
    this.setHitAreas()
  }

  swallowBehavior(entAffected) {
    if (!this.wasExcreted && this.swallowEffect) {
      this.swallowEffect.call(this, entAffected)
    } else {
      console.log(`no swalloweffect triggered, either wasExcreted or missing`, )
    }
  }

  absorbExp(entAffected) {
    baseAbsorbExp.call(this, entAffected)
  }

  getPostDigestionData() {
    if (!this.wasExcreted) {
      return this.postDigestionData
    }
    return null
  }

  getHeadEnt() {
    let upstreamSegment = this.upstreamSegment
    while (upstreamSegment?.upstreamSegment) {
        upstreamSegment = upstreamSegment.upstreamSegment
    }
    return upstreamSegment ? upstreamSegment : this
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
            console.log(`snek underDigestionEffect switch/case defaulted`, )
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
    this.drawInitWrapper()
    this.entUnderDigestion?.render()
  }

  detach() {
  // * Digestion: halt, reverse effects, maintain digestion contents state
    console.log('seg detaching')
    this.upstreamSegment = null
  }

  update() {
    // * When upstreamSegment defined, segment follows its trail
    // * both positioning itself along the path trodded by the segment
    // * ahead and pointing at mentioned segments' tail end.

    if (
      this.getHeadEnt().species === 'snek' 
      || this.getHeadEnt().species === 'centipede'
    ) {
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
  }

  // * Without an upstream segment/head, the segment acts as the head
  // * and maintains last known state, eg position, direction, color
  // * state of contents' digestion processes.

    this.currPrimaryColor = this.getHeadEnt().currPrimaryColor
    
    // ! Should this be before physics?
    if (this.entUnderDigestion 
      && (
        this.getHeadEnt().species === 'snek' 
        || this.getHeadEnt().species === 'centipede'
      )
    ) {
      this.entUnderDigestion.position = this.position
      this.digest()
    }

    // ! inefficient, running whether moving or not. Segment has no awareness of
    // ! its own movement except if it were to know about head's isMobile
    this.setHitAreas()
    this.downstreamSegment?.update()
  }
}