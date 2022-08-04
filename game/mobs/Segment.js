import Poop from '../immobs/Poop'
import Immob from '../immobs/Immob'
import { recycle } from '../utils/helpers'

export default class Segment extends Immob {
  static species = 'segment'
  species = 'segment'
  subSpecies = ''

  get hitR() { return this.r }

  digestion = {
    timeLeft: 20000,
    baseTime: 20000
  }

  baseExp = 20
  currExp = this.baseExp

  headPositionHistory = []

  entUnderDigestion = undefined
  upstreamSegment = undefined
  downstreamSegment = undefined
  underDigestionEffects = []

  constructor(ctx, upstreamSegment) {
    super(ctx)
    this.upstreamSegment = upstreamSegment
    this.parentEnt = this.getHeadEnt().parentEnt
    this.r = this.getHeadEnt().r
    this.scale = this.getHeadEnt().scale
    this.headingRadians = this.upstreamSegment.headingRadians
    this.position = {
      x: this.upstreamSegment.position.x,
      y: this.upstreamSegment.position.y
    }
    this.currPrimaryColor = this.upstreamSegment.currPrimaryColor
    this.postDigestionData = [
      {
        effect: 'moveSpeed',
        moveSpeed: 0.5,
        duration: 20000,
        timeLeft: 20000
      },
    ]
    this.setHitAreas()
  }

  getHeadEnt() {
    let upstreamSegment = this.upstreamSegment
    while (upstreamSegment?.upstreamSegment) {
        upstreamSegment = upstreamSegment.upstreamSegment
    }
    return upstreamSegment ? upstreamSegment : this
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
    this.entUnderDigestion.position = this.position
    this.entUnderDigestion.parentEnt = this.getHeadEnt()

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
          console.log(`adding underdigfx`, underDigestionEffect)
          
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

        expiredUnderDigestionEffects.length > 0 
          && console.log(`expiredDigFx`, expiredUnderDigestionEffects)

        const reversibleEffects = expiredUnderDigestionEffects.filter(e =>
          e.type === 'boolean'
        )

        reversibleEffects.forEach(e => {
          console.log(`reversing underDigFx`, e)
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

        functionEffects.forEach(effect => 
          effect[effect.effect](this.getHeadEnt())
        )

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

      // * Upon fully digesting contents:
      // * - Active Post Digestion Effects

      const postDigestionData = this.entUnderDigestion.postDigestionData

      if (postDigestionData) {
        postDigestionData.forEach(pDD => {
          this.getHeadEnt().postDigestionEffects.push(pDD)

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
          console.log(`\
            postDigestEffect ${pDD.effect} from \
            ${this.entUnderDigestion.species} activated`, 
          )
        })
      }
        
      // * - If digested ent was poop, pass it immediately?
      if (this.entUnderDigestion.species === 'poop'
        || this.entUnderDigestion.species === 'pebble') {
        this.pass()
      } else {
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
      console.log(`Reversing underDigFx`, d)
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
    if (this.entUnderDigestion.entGroup === 'immob') {
      this.entUnderDigestion.setHitAreas()
    }
    this.restoreEntUnderDigestion()
  }

  restoreEntUnderDigestion() {
    this.entUnderDigestion.setMobile?.(true)
    this.entUnderDigestion.parentEnt = this.getHeadEnt().parentEnt
    this.entUnderDigestion = null
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
    console.log('seg detaching')
    this.cancelUnderDigestionBooleanEffects()

    if (this.entUnderDigestion) {
      this.restoreEntUnderDigestion()
    }

    
    this.upstreamSegment.downstreamSegment = null
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

      // * Post Digestion Effects: occur after content is fully digested

      // * Expire used up effects

      const expiredPostDigestionEffects = this.getHeadEnt()
        .postDigestionEffects.filter(e => 
          e.timeLeft <= 0
      )

      if (this.getHeadEnt().postDigestionEffects.length > 0 ) {

        expiredPostDigestionEffects.forEach(postDigestionData => {
          switch (postDigestionData.effect) {
            case 'moveSpeed':
              this.getHeadEnt().currMoveSpeed -= postDigestionData.moveSpeed
              break
            case 'turnRate':
              this.getHeadEnt().currTurnRate -= postDigestionData.turnRate
              break
            default:
              console.log(`snek expiredDigestionEffect switch/case defaulted`, )
          }
          console.log(`postDigestEffect ${postDigestionData.effect} ended`, )
        })
  
        this.getHeadEnt().postDigestionEffects = this.getHeadEnt()
          .postDigestionEffects.filter(postDigestionData =>
            postDigestionData.timeLeft >= 0
        )
  
        this.getHeadEnt().postDigestionEffects.forEach(postDigestionData => {
          postDigestionData.timeLeft -= 17
        })

      }

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