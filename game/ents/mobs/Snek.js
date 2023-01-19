import Mob from './Mob'
import Segment from '../immobs/Segment'
import { getGameObject, intRep, loadTraits } from '../../utils/helpers'
import Constants from '../../Constants'
import Digestion from '../../behaviors/Digestion'
import Traits from '../Traits'

/**
 * @description The main player controllable character.
 * Segs are gained via exp progression separate from Snek
 * @property {String[]} swallowables - defines what Snek can swallow
 */
export default class Snek extends Mob {
  static species = 'snek'
  species = 'snek'

  currExp = 0
  totalExpGained = 0

  expForLevel(level) {
    // 1*0 -> 2*5 -> 3*10 -> 4*15
    // make baseExp equiv to desired Ent exp, then next level exp based on eating currSegCount of Ent 
    return level * ((level - 1) * (this.baseExp / 2))
  }

  // // * segCount is equivalent to seg level
  // segExpForLevel(segCount) {
  //   return (
  //     (this.segLevelMultiplier**(Math.max(1, segCount - 2))) 
  //     * (this.baseExp)
  //   )
  // }

  get expGainedThisLevelOnly() {
    const expGained = this.currExp - (this.level === 1 ? 0 : this.expForLevel(this.level))
    return expGained
  }

  get mouthCoords() { return {
      x: this.position.x
        + this.r * 0.5 * Math.cos(this.headingRadians),
      y: this.position.y 
        + this.r * 0.5 * Math.sin(this.headingRadians),
    }}

  isTongueOut = false
  tongueDirection = 0

  downstreamSegment
  // currKnownSegmentCount = 0
  // get maxSegmentCount() { return this.level }

  activeEffects = []
  postDigestionEffects = []
  wasHarmed = false
  lifeSpan = 0
  segments = []
  score = 0

  constructor(ctx, startPosition=null, parent=null, initSegmentCount=null) {
    super(ctx, startPosition, parent)
    loadTraits.call(this, Traits.Snek)
    this.currExp = this.expForLevel(this.level)
    // this.currSegExp = this.currExp
    this.currPrimaryColor = this.basePrimaryColor
    this.currMoveSpeed = this.baseMoveSpeed
    this.normalizeTurnRate()
    this.birthTime = this.parent.t < 0 ? 0 : this.parent.t

    this.addSegment(initSegmentCount ?? this.baseSegmentCount)
    this.setHitAreas()
    this.initEventListeners()
  }

  levelDown() {
    this.segments.shift().detach()
    for (let i = 0; i < this.segments.length; ++i) {
      this.segments[i].harmFlash()
    }

    // only set segExp if segCount changed
    // if (this.countSegments < this.currKnownSegmentCount) {
    //   this.currKnownSegmentCount = this.countSegments
    //   this.currSegExp = this.expForLevel(this.countSegments)
    // }

    this.level = Math.max(1, this.level - 1)
    this.currExp = this.level > 1 ? this.expForLevel(this.level) : 0
    this.normalizeTurnRate()
  }

  levelUp() {
    getGameObject.call(this).sounds.snekLevelup.currentTime = 0
    getGameObject.call(this).sounds.snekLevelup.play()
    this.level++
    this.addSegment()
    this.normalizeTurnRate()
  }

  gainExp(exp) {
    this.currExp += exp
    this.totalExpGained += exp
  }

  addSegment(n=1) {
    for(let i = 0; i < n; i++) {
      if (!this.downstreamSegment){
        this.downstreamSegment = new Segment(this.ctx, this)
        this.downstreamSegment.subSpecies = 'snek'
      } else {
        const newSegment = new Segment(this.ctx, this)
        newSegment.subSpecies = 'snek'
        const oldSegment = this.downstreamSegment
        oldSegment.upstreamSegment = newSegment
        newSegment.downstreamSegment = oldSegment
        this.downstreamSegment = newSegment
      }
      this.segments.push(this.downstreamSegment)
      // this.currKnownSegmentCount++
    }
  }

  initEventListeners() {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'd':
          this.isTurningRight = true
          break
        case 'a':
          this.isTurningLeft = true
          break
        default:
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'd':
          this.isTurningRight = false
          break
        case 'a':
          this.isTurningLeft = false
          break
        default:
          break
      }
    }
    document.addEventListener('keyup', handleKeyUp)

    const leftActivated = () => { this.isTurningLeft = true }
    const leftDeactivated = () => { this.isTurningLeft = false }
    const rightActivated = () => { this.isTurningRight = true }
    const rightDeactivated = () => { this.isTurningRight = false }

    const left = document.querySelector('#touch-area-control-left')
    left.addEventListener('pointerdown', leftActivated)
    left.addEventListener('pointerout', leftDeactivated)
    left.addEventListener('pointerup', leftDeactivated)

    const right = document.querySelector('#touch-area-control-right')
    right.addEventListener('pointerdown', rightActivated)
    right.addEventListener('pointerout', rightDeactivated)
    right.addEventListener('pointerup', rightDeactivated)
  }

  drawHitOverlays() {
    // Head Hit (from Mob)
    super.drawHitOverlays()

   // Point Mouth Hit
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

  harmed() {
    getGameObject.call(this).sounds.snekPanic.currentTime = 0
    getGameObject.call(this).sounds.snekPanic.play()
    this.activateEffect({
      name: 'panic',
      offsets: {
        moveSpeed: 2,
        turnRate: 10,
      },
      timeLeft: 3000,
      duration: 3000
    })

    intRep(16, 100, this.toggleVisibility.bind(this))

    this.levelDown()
  }

  move() {
    this.position.x += this.currMoveSpeed 
      * Math.cos(this.headingRadians)
    this.position.y += this.currMoveSpeed 
      * Math.sin(this.headingRadians)
    this.setHitAreas()
  }

  activateEffect(effectData) {
    for (let [k,v] of Object.entries(effectData?.offsets)) {
      if (k === 'moveSpeed') this.currMoveSpeed += v
      else if (k === 'turnRate') this.currTurnRate += v
    }
    this.activeEffects.push(effectData)
  }

  deactivateEffect(effectData) {
    for (let [k,v] of Object.entries(effectData?.offsets)) {
      if (k === 'moveSpeed') this.currMoveSpeed -= v
      else if (k === 'turnRate') this.currTurnRate -= v
    }
  }

  processEffects() {
    for (let i = 0; i < this.activeEffects.length; ++i) {
      if (this.activeEffects[i].timeLeft <= 0) {
        this.deactivateEffect(this.activeEffects[i])
        this.activeEffects.splice(i, 1)
        i--
      } else {
        this.activeEffects[i].timeLeft = Math.max(0, this.activeEffects[i].timeLeft - Constants.TICK)
      }
    }
  }

  get countSegments() {
    let n = 0
    let downSeg = this.downstreamSegment
    while (downSeg) {
      n++
      downSeg = downSeg.downstreamSegment
    }
    return n
  }


  updatePostDigestionEffects() {
    // * Activate Post Digestion Effects after content is fully digested
    // * Expire when effects' time runs out
    for (let i = 0; i < this.postDigestionEffects.length; ++i) {
      const pDE = this.postDigestionEffects[i]
      pDE.timeLeft -= Constants.TICK
      if (pDE.timeLeft <= 0) {
        this.postDigestionEffects.splice(i,1)
        Digestion.cancelPostDigestionEffects.call(this, pDE )
        --i
      }
    }
  }

  render() {
      this.ctx.save()
      this.ctx.translate(this.position.x, this.position.y)
      this.ctx.rotate(this.headingRadians)
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

  update(t) {
    this.lifeSpan = t - this.birthTime    // non-crit, can be updated less frequently to improve performance
    if (this.isTurningLeft) {
      this.turnLeft()
    } else if (this.isTurningRight) {
      this.turnRight()
    }

    this.processEffects()

    this.updatePostDigestionEffects()

    this.isMobile && this.move()

    while(this.currExp >= this.expForLevel(this.level + 1)) {
      console.log(`Level up!`, )
      this.levelUp()
    }
    
    // while(this.currSegExp >= this.segExpForLevel(this.countSegments + 1)
    //   && this.countSegments < this.maxSegmentCount) {
    //   console.log(`New seg from seg level up`, )
    //   this.addSegment()
    // }
  }
}
