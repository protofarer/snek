import Clock from "../utils/Clock"

export default class Snek {
  static entGroup = 'mob'
  static species = 'snek'
  entGroup = 'mob'
  species = 'snek'

  swallowables = ['apple', 'mango', 'ant', 'pebble', 'segment']

  state = {
    r: 10,
    get headCoords() { return {
      x: this.position.x,
      y: this.position.y
    }},
    position: { x: 400, y: 400},
    moveSpeed: 2,
    nSegments: 2,
    directionAngle: 0,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnRate() { return this.moveSpeed + 5 },
    get mouthCoords() { return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }},
    bodyColor: 'hsl(100, 100%, 32%)',
    mobile: true,
    hasTongueOut: false,
    tongueDirection: 0,
    exp: 0,
    scale: 1,
    downstreamSegment: {},
  }

  constructor(ctx, startPosition=null, parentEnt=null, nSegments=null) {
    this.ctx = ctx
    this.state.position = startPosition || this.state.position
    this.parentEnt = parentEnt
    this.nSegments = nSegments || this.state.nSegments
    for(let i = 0; i < this.nSegments; i++) {
      console.log(`snek adding seg`, )
      
      if (i === 0){
        this.state.downstreamSegment = new Segment(this.ctx, this)
        this.state.downstreamSegment.id = 0
      } else {
        const newSegment = new Segment(this.ctx, this)
        newSegment.id = 1
        const oldSegment = this.state.downstreamSegment
        oldSegment.state.upstreamSegment = newSegment
        newSegment.state.downstreamSegment = oldSegment
        this.state.downstreamSegment = newSegment
      }
    }
    // this.segments = new Segments(this.ctx, this)
    this.hitSideLength = this.state.r + 1
    this.initEventListeners()
  }

  isMobile(isMobile) {
    this.state.mobile = isMobile
    return this
  }

  addSegment() {
    this.state.nSegments++
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
      // this.state.directionAngle %= 360 ...why did I even... *_+
    }
    document.addEventListener('keydown', handleKeyDown)
  }

  turnLeft() {
    this.state.directionAngle += this.state.turnRate() * -1
  }

  turnRight() {
    this.state.directionAngle += this.state.turnRate() * 1
  }

  swallow(ent) {
    ent.parentEnt = this
    ent.state.position = {x: -1000, y: -1000}
    ent.hitArea = new Path2D()
    ent.swallowEffect(this)

    switch (ent.species) {
      case 'apple':
        this.state.downstreamSegment.ingest(ent)
        break
      case 'pebble':
        break
      case 'ant':
        // this.addSegment()
        break
      case 'mango':
        break
      default:
        console.info(`snek.consume() case-switch defaulted`, )
    }
    this.state.exp += ent.state.exp

    if (this.swallowables.includes(ent.carriedEnt?.species)) {
      this.swallow(ent.carriedEnt)
    } else {
      // Drop any non-swallowable carried ents
    }
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - this.hitSideLength, 
      this.state.position.y - this.hitSideLength,
      2 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  drawHitOverlays() {
    this.ctx.beginPath()
    this.ctx.arc(this.state.mouthCoords.x, this.state.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  drawHead() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.bodyColor
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 2
    this.ctx.shadowColor = 'hsl(0,0%,0%)'
    this.ctx.fill()
    this.ctx.shadowBlur = this.ctx.shadowOffsetY = this.ctx.shadowColor = null 

    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r * 0.85, -Math.PI / 3, Math.PI / 3)
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(0.9*this.state.r * 0.6, -0.4 * this.state.r)
    this.ctx.lineTo(0.9*this.state.r, -0.4 * this.state.r)
    this.ctx.moveTo(0.9*this.state.r * 0.6, 0.4 * this.state.r)
    this.ctx.lineTo(0.9*this.state.r, 0.4 * this.state.r)
    this.ctx.strokeStyle = 'white'
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(0, 0.45 * this.state.r, 0.34 * this.state.r, 0, 2*Math.PI)
    this.ctx.arc(0, -0.45 * this.state.r, 0.34 * this.state.r, 0, 2*Math.PI)
    this.ctx.fillStyle ='white'
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(0.1 * this.state.r, 0.40 * this.state.r, 0.19 * this.state.r, 0, 2*Math.PI)
    this.ctx.fillStyle = 'black'
    this.ctx.fill()
    this.ctx.lineWidth = 1.5
    this.ctx.strokeStyle = 'hsl(230,100%,80%)'
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(0.1 * this.state.r, -0.40 * this.state.r, 0.19 * this.state.r, 0, 2*Math.PI)
    this.ctx.fill()
    this.ctx.strokeStyle = 'hsl(55, 100%, 25%)'
    this.ctx.stroke()
  }

  drawTongue() {
    this.ctx.beginPath()
    this.ctx.moveTo(0.8*this.state.r, 0)
    this.ctx.lineTo(1.6*this.state.r, 0,)
    this.ctx.lineTo(2*this.state.r, 0.3 * this.state.r)
    this.ctx.moveTo(1.6*this.state.r, 0)
    this.ctx.lineTo(2*this.state.r, -0.3 * this.state.r)
    this.ctx.lineWidth = this.state.r * .09
    this.ctx.strokeStyle='red'
    this.ctx.stroke()
  }

  render() {
    this.state.downstreamSegment.render()
    // this.segments.render()
    this.ctx.save()
    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.rotate(this.state.directionRad)
    this.ctx.save()
    this.ctx.scale(this.state.scale, this.state.scale * 0.8)

    this.drawHead()

    this.ctx.restore()
    if (!this.state.hasTongueOut) {
      if (Math.random() < 0.05) {
        this.state.hasTongueOut = true
        this.state.tongueDirection = Math.floor(Math.random() * 3 - 1)
        setTimeout(() => this.state.hasTongueOut = false, 100 + Math.random()*700)
      }
    }

    if (this.state.hasTongueOut) {
        this.ctx.save()
        this.ctx.rotate(0.3 * this.state.tongueDirection)
        this.drawTongue()
        this.ctx.restore()
    }
    this.ctx.restore()

  }

  move() {
    this.state.position.x += this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += this.state.moveSpeed 
      * Math.sin(this.state.directionRad)
    this.setHitAreas()
  }

  update() {
    this.state.mobile && this.move()
    // this.segments.update(this.state.position)
    // console.log(`this.state.downstreamseg`, this.state.downstreamSegment)
    
    this.state?.downstreamSegment.update()
  }

}

export class Segment {
  static species = 'segment'
  species = 'segment'
  state = {
    r: 0,
    position: {x:0,y:0},
    directionAngle: 0,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    entUnderDigestion: null,
    upstreamSegment: null,
    downstreamSegment: null,
    digestionEffect: '',
    linkLength: 0,
    headPositionHistory: [],
    bodyColor: null,
    scale: 0,
  }
  finishDigestionEffect = null

  constructor(ctx, upstreamSegment=null) {
    this.ctx = ctx
    this.state.upstreamSegment = upstreamSegment
    this.state.r = this.state.upstreamSegment.state.r
    this.state.bodyColor = this.state.upstreamSegment.state.bodyColor
    this.state.scale = this.state.upstreamSegment.state.scale
    console.log(`upstreamSegment`, upstreamSegment)

    /** 
     * * linkLength is the size of headPositionHistory needed to properly position
     * * the segment.  Estimated by subtracting upstreamSeg movespeed from
     * * upstreamSeg cardinal radius/length, aka "r"
     */

    // TODO adjust the moveSpeed factor
    this.state.linkLength = Math.floor(
      this.state.r + this.state.upstreamSegment.state.r 
        - this.state.upstreamSegment.state.moveSpeed
    )

    this.state.directionRad = this.state.upstreamSegment.state.directionRad
    this.state.position = {
      x: this.state.upstreamSegment.state.position.x,
      y: this.state.upstreamSegment.state.position.y
    }
  }

  ingest(ent) {
    if (this.state.entUnderDigestion !== null) {
      // Forces segment to pass
      if (!this.downstreamSegment) {
        this.pass()
      }
    }
    this.state.entUnderDigestion = ent
    this.state.entUnderDigestion.parentEnt = this
    this.state.entUnderDigestion.state.position = this.state.position
    this.finishDigestionEffect = this.state.entUnderDigestion.digestionEffect(this)
    console.log(`ent started being digested`)
  }

  digest() {
    // console.log(`IN digest`, )
    // console.log(`entunderDigest.state`, this.state.entUnderDigestion.state.digestionTimeLeft)
    // console.log(`typeof digestiontime`, typeof this.state.entUnderDigestion.state.digestionTimeleft)
    
    if (this.state.entUnderDigestion.state.digestionTimeLeft > 0) {
      this.state.entUnderDigestion.state.digestionTimeLeft -= 17    // TODO subtract timeElapsed since last digest tick
      // console.log(`digestionTimeLeft`, this.state.entUnderDigestion.state.digestionTimeLeft)
    } else {
      // * Upon fully digesting contents transform ent into poop and pass
      // TODO transform ent into poop and pass it
    console.log(`canceling digestion effect`, )
      this.digestionEffect = null
      this.pass()
    }
  }

  pass() {
    console.log(`passing`, )
    // TODO call the digestionEffect function to reverse state
    // TODO reverse state change
    console.log(`canceling digestion effect`, )
    
    if (!this.downStreamSegment) {
      console.log(`seg is pooping`, )
      this.excrete()
    } else {
      console.log(`seg transferring to next seg`, )
      this.downstreamSegment.ingest(this.state.entUnderDigestion)
      this.state.entUnderDigestion = null
    }
    
  }

  excrete() {
    // TODO setup a line based on entity id across bottomn of screen till
    //    digestion code is complete
    console.log(`pooping`, )
    
    this.state.entUnderDigestion.state.position = {x: 50, y: 700}
    this.state.entUnderDigestion.parentEnt = null
    this.state.entUnderDigestion = null
  }

  getHeadMoveSpeed() {
    let upstreamSegment = this.state.upstreamSegment
    while (upstreamSegment.state.upstreamSegment) {
        upstreamSegment = upstreamSegment.state.upstreamSegment
    }
    return upstreamSegment.state.moveSpeed
  }


  update() {
    // console.log(`*****************************************`, )
    // console.log(`seg stepping`, )
    // console.log(`headposthist.len`, this.state.headPositionHistory.length)
    
    this.state.linkLength = Math.floor(
      this.state.r 
      + this.state.upstreamSegment.state.r
      // - this.getHeadMoveSpeed()
    )
      // console.log(`r`, this.state.r)
      // console.log(`upR`, this.state.upstreamSegment.state.r)
      // console.log(`movespeed`, this.state.upstreamSegment.state.moveSpeed)
    // is considered the tail of the upstreamSegment to follow
    
    this.state.headPositionHistory.splice(0, 0, {
      x: this.state.upstreamSegment.state.position.x,
      y: this.state.upstreamSegment.state.position.y
    })

    while (
      this.state.headPositionHistory.length 
        > this.state.linkLength/this.getHeadMoveSpeed()
    ) {
      this.state.headPositionHistory.pop()
    }
    // console.log(`downstreamseg`, this.state.downstreamSegment)
    
    
//     console.log(`headposhist`, this.state.headPositionHistory)
//     const indexOfUpstreamTailPosition = Math.min(this.state.headPositionHistory.length, Math.floor(this.state.linkLength / 2)) - 1
//     console.log(`%cindexofUpstreamTailPos`, 'color:orange',indexOfUpstreamTailPosition)
// console.log('upsegtail.x', this.state.headPositionHistory[indexOfUpstreamTailPosition].x )
//         console.log('rel seg.s', - this.state.position.x)
//       const dy = this.state.headPositionHistory[indexOfUpstreamTailPosition].y 
//         - this.state.position.y
//       const dx = this.state.headPositionHistory[indexOfUpstreamTailPosition].x 
//         - this.state.position.x

//       console.log(`dy`,dy )
//       console.log(`dx`, dx)
      
//     this.state.directionRad = Math.atan(dy/dx)
    this.upstreamSegmentTailPosition = {
      x: this.state.upstreamSegment.state.position.x 
        - this.state.upstreamSegment.state.r 
          * Math.cos(this.state.upstreamSegment.state.directionRad),
      y: this.state.upstreamSegment.state.position.y 
        - this.state.upstreamSegment.state.r 
          * Math.sin(this.state.upstreamSegment.state.directionRad),
    }
    const dy = (this.upstreamSegmentTailPosition.y - this.state.position.y)
    const dx = (this.upstreamSegmentTailPosition.x - this.state.position.x)
    this.state.directionRad = Math.atan(dy/dx)

    this.state.position = {
      x: this.state.headPositionHistory.at(-1).x,
      y: this.state.headPositionHistory.at(-1).y
    }

    // !
    const dBetweenSegAndUpstream = Math.sqrt((this.state.upstreamSegment.state.position.x - this.state.position.x)**2 + (this.state.upstreamSegment.state.position.y - this.state.position.y)**2)
    console.log(`seg behind: ${this.state.upstreamSegment.species}, dbetweentSegandUp:`, dBetweenSegAndUpstream)
    console.log(`Seg behind ${this.state.upstreamSegment.species.toUpperCase()}:`, this)
    
    

    this.state.bodyColor = this.state.upstreamSegment.state.bodyColor
    this.state.scale = this.state.upstreamSegment.state.scale
    
    if (this.state.entUnderDigestion !== null) {
      this.state.entUnderDigestion.state.position = this.state.position
      // console.log(`entunderdigestion and pos`, this.state.entUnderDigestion.state.position)
      this.digest()
    } else {
      // console.log(`seg is not digesting`, )
    }
    this.state?.downstreamSegment?.update()
  }

  drawLegs() {
  }

  render() {
    // console.log(`IN seg render, stae.pos and dir`, this.state.position, this.state.directionRad)
    this.state.downstreamSegment?.render()

    const position = this.state.position
    const angle = this.state.directionRad

    this.ctx.save()
    this.ctx.translate(position.x, position.y)
    this.ctx.rotate(angle)
    this.ctx.scale(this.state.upstreamSegment.state.scale, this.state.upstreamSegment.state.scale*0.6)

    this.drawLegs()

    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.upstreamSegment.state.bodyColor
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 2
    this.ctx.shadowColor = 'hsl(0,0%,0%)'
    this.ctx.fill()
    this.ctx.shadowBlur = this.ctx.shadowOffsetY = this.ctx.shadowColor = null 

    this.ctx.restore()

    this.state.entUnderDigestion?.render()
  }
}