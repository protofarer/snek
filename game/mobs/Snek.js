import Mob from './Mob'
import Segment from './Segment'
import { cancelPostDigestionEffects } from '../behaviors/digestion'
import { intRep } from '../utils/helpers'

/**
 * The main player controllable character.
 * @property {String[]} swallowables - defines what Snek can swallow
 */
export default class Snek extends Mob {
  static species = 'snek'
  species = 'snek'

  swallowables = [ 'apple', 'mango', 'ant', 'pebble', 'banana' ]
  enemySpecies = ['centipede']

  r = 10

  level = 1
  levelMultiplier = 2
  segLevelMultiplier = 1.25
  baseExp = 100
  currExp = 0

  currSegExp = this.currExp

  expForLevel(level) {
    return (this.levelMultiplier**(level - 2)) * this.baseExp
  }

  // * segCount is equivalent to seg level
  segExpForLevel(segCount) {
    return (this.segLevelMultiplier**(segCount - 2)) * this.baseExp
  }

  get expGainedThisLevelOnly() {
    const expGained = this.currExp - (this.level === 1 ? 0 : this.expForLevel(this.level))
    return expGained
  }

  get mouthCoords() { return {
      x: this.position.x + this.r * Math.cos(this.headingRadians),
      y: this.position.y + this.r * Math.sin(this.headingRadians),
    }}

  isTongueOut = false
  tongueDirection = 0

  baseSegmentCount = 3
  downstreamSegment
  currKnownSegmentCount = 0
  get maxSegmentCount() { return this.level }

  activeEffects = []
  postDigestionEffects = []

  isVisible = true
  wasHarmed = false

  constructor(ctx, startPosition=null, parent=null, initSegmentCount=null) {
    super(ctx, startPosition, parent)
    
    this.basePrimaryColor = 'hsl(100, 100%, 32%)'
    this.currPrimaryColor = this.basePrimaryColor

    this.baseTurnRate = this.baseMoveSpeed + 5
    this.currTurnRate = this.baseTurnRate

    this.baseMoveSpeed = 1
    this.currMoveSpeed = this.baseMoveSpeed

    this.birthTime = this.parent.t < 0 ? 0 : this.parent.t
    this.lifeSpan = 0
    console.log(`new snek birthtime`, this.birthTime)
    

    this.addSegments(initSegmentCount || this.baseSegmentCount)
    this.setHitAreas()
    this.initEventListeners()
  }

  addSegments(n) {
    for(let i = 0; i < n; i++) {
      // TODO for death implement, segmentless snake is considered dead
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
      this.currKnownSegmentCount++
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

  harmed() {
    const toggleVis = (obj) => {
      return () => obj.isVisible = !obj.isVisible
    }
    intRep(16, 100, toggleVis(this))
  }

  render() {
    // ! game should end before downstreamSegment is gone?
    // this.downstreamSegment.render()

    if (this.isVisible) {
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
  }

  move() {
    this.position.x += this.currMoveSpeed 
      * Math.cos(this.headingRadians)
    this.position.y += this.currMoveSpeed 
      * Math.sin(this.headingRadians)
    this.setHitAreas()
  }

  activateEffects(effectDataList) {
    effectDataList.forEach( effectData => {
      switch (effectData.effect) {
        case 'panic':
          this.currMoveSpeed += effectData.moveSpeed
          this.currTurnRate += effectData.turnRate
          this.activeEffects.push(effectData)
          break
        default:
          console.log(`snek defaulted on activateEffects data`, )
      }
    })
  }

  deactivateEffect(effectData) {
    switch (effectData.effect) {
      case 'panic':
        this.currMoveSpeed -= effectData.moveSpeed
        this.currTurnRate -= effectData.turnRate
        break
      default:
        console.log(`snek default deactivateEffect`, )
    }
  }

  processEffects() {
    const expiredEffects = this.activeEffects.filter(effect => effect.timeLeft === 0)
    expiredEffects.forEach(effect => this.deactivateEffect(effect))

    this.activeEffects = this.activeEffects.filter(effect => effect.timeLeft > 0)

    this.activeEffects = this.activeEffects.map(effect => {
      const timeLeft = effect.timeLeft - 17 < 0
        ? 0
        : effect.timeLeft - 17
      return { ...effect, timeLeft}
    })
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
    // * Post Digestion Effects: occur after content is fully digested

    // * Expire used up effects

    const expiredPostDigestionEffects = this.postDigestionEffects
    .filter(e => 
        e.timeLeft <= 0
    )

    if (this.postDigestionEffects.length > 0 ) {

      cancelPostDigestionEffects.call(this, expiredPostDigestionEffects)

      this.postDigestionEffects = this
        .postDigestionEffects.filter(postDigestionData =>
          postDigestionData.timeLeft >= 0
      )

      this.postDigestionEffects.forEach(postDigestionData => {
        postDigestionData.timeLeft -= 17
      })

    }
  }

  update(t) {
    console.log(`t in snek`, t)
    
    this.lifeSpan = t - this.birthTime
    console.log(`lifeSpan in snek`, this.lifeSpan)

    this.updatePostDigestionEffects()

    // * currKnownSegmentCount updated on a need to know basis, eg
    // * when segCount decrease event occurs or manually via growth adds aka
    // * segExp level ups
    if (this.countSegments < this.currKnownSegmentCount) {
      // Panic
      this.activateEffects([
        {
          effect: 'panic',
          moveSpeed: 3,
          turnRate: 10,
          timeLeft: 5000,
          duration: 5000
        }
      ])
      this.currKnownSegmentCount = this.countSegments
      this.currSegExp = this.expForLevel(this.countSegments)
    }
    this.processEffects()

    this.isMobile && this.move()

    while(this.currExp >= this.expForLevel(this.level + 1)) {
      console.log(`Level up!`, )
      this.level++
    }
    
    while(this.currSegExp >= this.segExpForLevel(this.countSegments + 1)
      && this.countSegments < this.maxSegmentCount) {
      console.log(`New seg from seg level up`, )
      this.addSegments(1)
    }
  }
}
