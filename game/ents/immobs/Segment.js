import Poop from './Poop'
import Traits from '../Traits'
import Immob from './Immob'
import { getGameObject, loadTraits, recycle } from '../../utils/helpers'
import { getTraitFunction } from '../../utils/helpers'
import Digestion from '../../behaviors/Digestion'

export default class Segment extends Immob {
  static species = 'segment'
  species = 'segment'
  subSpecies = ''

  get hitR() { return this.r }

  headPositionHistory = []

  entUnderDigestion = undefined
  upstreamSegment = undefined
  downstreamSegment = undefined
  underDigestionEffects = []

  constructor(ctx, upstreamSegment) {
    super(ctx)
    loadTraits.call(this, Traits.Segment)
    this.currExp = this.baseExp
    this.upstreamSegment = upstreamSegment
    this.parent = this.getHeadEnt().parent
    this.r = this.getHeadEnt().r
    this.scale = this.getHeadEnt().scale
    this.headingRadians = this.upstreamSegment.headingRadians
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
    return upstreamSegment ? upstreamSegment : this
  }

  harmed() {
    this.getHeadEnt()?.harmed?.()
  }

  ingest(ent) {

    // * Digestion starts by setting up ownership of ingest ent and
    // * collecting digestion effects data for segment's head 
    // * (ent being affected by effects)

    // * Ingesting another ent while an existing ent is under
    // * digestion forces the latter to be passed regardless of it's
    // * digestion state
    
    if (this.entUnderDigestion) {
      this.pass()
    }

    this.entUnderDigestion = ent
    this.entUnderDigestion.setMobile?.(false)
    this.entUnderDigestion.position = this.position
    this.entUnderDigestion.parent = this.getHeadEnt()

    // TODO modifications to consumers' state should be guarded by public method
    this.entUnderDigestion.underDigestionData?.forEach( underDigestionEffect => 
      {
        if (underDigestionEffect.type === 'boolean') {
          switch (underDigestionEffect.effect) {
            case 'moveSpeed':
              this.getHeadEnt().currMoveSpeed += underDigestionEffect.moveSpeed
              break
            case 'turnRate':
              this.getHeadEnt().currTurnRate += underDigestionEffect.turnRate
              break
            case 'primaryColor':
              this.getHeadEnt().currPrimaryColor = 
                underDigestionEffect.primaryColor
              break
            default:
              console.log(`snek underDigestionEffect switch/case defaulted`, )
          }
        }
        this.underDigestionEffects.push(underDigestionEffect)
      }
    )

    // * Segment enlarges to fit ingested ent
    // TODO scale with ent or have ent scale to segment
    this.scale = { x: 1, y: 1.3 }
  }

  digest() {
    if (this.entUnderDigestion.digestion.timeLeft > 0) {

      // * Overall digestion time for expAbsorb and passing
      
      this.entUnderDigestion.digestion.timeLeft = 
        this.entUnderDigestion.digestion.timeLeft - 17 < 0
          ? 0
          : this.entUnderDigestion.digestion.timeLeft - 17
      


      // * Under Digestion Effects
      if (this.underDigestionEffects.length > 0) {

        // Reverse and Remove expirable digestion effects
        const expiredUnderDigestionEffects = this.underDigestionEffects.filter(
          underDigestionEffect => 
            underDigestionEffect.type === 'boolean' 
            && underDigestionEffect.timeLeft <= 0
        )

        // expiredUnderDigestionEffects.length > 0 
        //   && console.log(`expiredDigFx`, expiredUnderDigestionEffects)

        const reversibleEffects = expiredUnderDigestionEffects.filter(e =>
          e.type === 'boolean'
        )

        reversibleEffects.forEach(e => {
          this.reverseDigestionEffect(e)
        })

        
        this.underDigestionEffects = this.underDigestionEffects
        .filter(underDigestionEffect => 
          (
            underDigestionEffect.type === 'boolean' 
            && underDigestionEffect.timeLeft > 0
          ) 
          || underDigestionEffect.type === 'function'
        )

        // Execute function effect types

        const functionEffects = this.underDigestionEffects
          .filter(underDigestionEffect => 
            underDigestionEffect.type === 'function'
          )

        functionEffects.forEach(e => {
          const effectFunction = getTraitFunction(e.effect)
          effectFunction(this.entUnderDigestion, this.getHeadEnt())
        })

        // Tick duration tickType effects
        this.underDigestionEffects = this.underDigestionEffects
          .map(underDigestionEffect => {
            if (underDigestionEffect.type === 'boolean') {
              const timeLeft = underDigestionEffect.timeLeft - 17 < 0
                ? 0
                : underDigestionEffect.timeLeft - 17
              return { ...underDigestionEffect, timeLeft }
            }
            return underDigestionEffect
          })
      }

    } else {
      // * Contents completely digested:
      // * - Activate Post Digestion Effects at Ent's Head
      // * - Recycle ent
      // * - Create poop

      const postDigestionData = this.entUnderDigestion.postDigestionData

      if (postDigestionData.length > 0) {
        Digestion.activatePostDigestionEffects.call(this, postDigestionData, this.getHeadEnt())
      }
        
      if (this.entUnderDigestion.species !== 'poop') {
        const map = this.getHeadEnt().entsDigested
        const keyExists = map.has(this.entUnderDigestion.species)
        map.set(this.entUnderDigestion.species, keyExists 
          ? map.get(this.entUnderDigestion.species) + 1
          : 1
        )
      }
      // * - If digested ent was poop, pass it immediately?
      if (this.entUnderDigestion.species === 'poop'
        || this.entUnderDigestion.species === 'pebble') {
        this.pass()
      } else {
        // * absorb remaining exp, this is current, simplified exp absorb approach
        this.getHeadEnt().currExp += this.entUnderDigestion.currExp
        this.entUnderDigestion.currExp = 0

        // * - Recycle the fully digested ent
        // * - Transform digested ent into poop
        // ! consider recycling aka ring buffer to restore disintegrated ents
        // ! for reuse
        recycle(this.entUnderDigestion)
        this.makePoop()
      }
    }

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
  
  makePoop() {
    const poop = new Poop(this.ctx, this.position, this)
    
    // ! Patch for until interactive, detachable segments implemented
    poop.hitArea = new Path2D()

    this.entUnderDigestion = poop
    this.scale.y = 1.3
  }

  cancelUnderDigestionBooleanEffects() {
    const reversibleEffects = this.underDigestionEffects.filter(e =>
      e.type === 'boolean')

    reversibleEffects.forEach(d => {
      this.reverseDigestionEffect(d)
    })

    this.underDigestionEffects = []
  }

  pass() {
    this.cancelUnderDigestionBooleanEffects()

    if (!this.downstreamSegment) {
      this.excrete()
    } else {
      this.downstreamSegment.ingest(this.entUnderDigestion)
    }
    this.scale = this.getHeadEnt().scale
    this.entUnderDigestion = null
  }

  excrete() {
    if (this.entUnderDigestion) {
      getGameObject.call(this).sounds.snekExcrete.currentTime = 0
      getGameObject.call(this).sounds.snekExcrete.play()
      this.entUnderDigestion.setMobile?.(true)
      this.entUnderDigestion.parent = this.getHeadEnt().parent
  
      this.entUnderDigestion.position = {
        x: this.entUnderDigestion.position.x - this.r * Math.cos(this.headingRadians),
        y: this.entUnderDigestion.position.y - this.r * Math.sin(this.headingRadians)
      }
      
      this.entUnderDigestion.entGroup === 'immob' 
        && this.entUnderDigestion.setHitAreas()

      if (this.entUnderDigestion.species === 'poop') {
        this.getHeadEnt().poopExcretionCount++
      }
  
      this.entUnderDigestion = null
      this.scale = { x: 1, y: 1 }
    }
  }

  drawDebugOverlays() {
    // Draw the trail of the upstream segment/head this segment is tracking to
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

  drawBody(ctx) {
    ctx.save()

    ctx.scale(this.scale.x, this.scale.y - .6)

    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.currPrimaryColor

    this.drawShadow(ctx)

    ctx.fill()

    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 

    ctx.restore()
  }

  drawShadow(ctx) {
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 2
    ctx.shadowColor = 'hsl(0,0%,0%)'
  }

  render() {
    this.drawInitWrapper()
    this.entUnderDigestion?.render()
  }

  detach() {
    // * Digestion: halt, reverse effects, maintain digestion contents state

    // only if connected to something upstream like a head,... tighten this up to only detach if connected to a living being aka has a head
    if (this.upstreamSegment) {

      // TODO use force-pass all downstream segs instead of weirdly having them excrete
      let currSeg = this
      this.excrete()
      while (currSeg.downstreamSegment) {
        currSeg = currSeg.downstreamSegment
        currSeg.excrete()
      }

      this.cancelUnderDigestionBooleanEffects()

      this.upstreamSegment.downstreamSegment = null
      this.upstreamSegment = null
    }
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
          (
            this.headPositionHistory[i].x 
            - this.headPositionHistory[i-1].x
          )**2
          + (
            this.headPositionHistory[i].y 
            - this.headPositionHistory[i-1].y
          )**2
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
            * Math.cos(this.upstreamSegment.headingRadians),
        y: this.upstreamSegment.position.y 
          - this.upstreamSegment.r 
            * Math.sin(this.upstreamSegment.headingRadians),
      }
      const dy = (this.upstreamSegmentTailPosition.y - this.position.y)
      const dx = (this.upstreamSegmentTailPosition.x - this.position.x)
      this.headingRadians = Math.atan(dy/dx)


      // ! Should this be before physics?
      if (this.entUnderDigestion) {
        this.entUnderDigestion.position = this.position
        this.digest()
      }

    }

    // * Without an upstream segment/head, the segment acts as the head
    // * and maintains last known state, eg position, direction, color
    // * state of contents' digestion processes.

    this.currPrimaryColor = this.getHeadEnt().currPrimaryColor
    

    // ! inefficient, running whether moving or not. Segment has no awareness of
    // ! its own movement except if it were to know about head's isMobile
    this.setHitAreas()
    this.downstreamSegment?.update()
  }
}