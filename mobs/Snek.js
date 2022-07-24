export default class Snek {
  static entGroup = 'mob'
  static species = 'snek'
  entGroup = 'mob'
  species = 'snek'

  swallowables = ['apple', 'mango', 'ant', 'pebble', 'segment']
  scaleX = 0.8

  state = {
    r: 10,
    get headCoords() { return {
      x: this.position.x,
      y: this.position.y
    }},
    position: { x: 400, y: 400},
    moveSpeed: 2,
    nSegments: 3,
    directionAngle: 0,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnRate: function () { return this.moveSpeed + 5 },
    get mouthCoords() { return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }},
    scaleColor: 'hsl(100, 100%, 32%)',
    mobile: true,
    hasTongueOut: false,
    tongueDirection: 0,
    exp: 0,
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.state.position = startPosition || this.state.position
    this.parentEnt = parentEnt
    this.canvas = this.ctx.canvas

    this.segments = new Segments(this.ctx, this.state)

    this.initEventListeners()
  }

  addSegment() {
    this.segments.addSegment()
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

  step() {
    this.state.position.x += this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += this.state.moveSpeed 
      * Math.sin(this.state.directionRad)
    this.segments.step(this.state.position)
    this.draw()
  }

  swallow(ent) {
    ent.parentEnt = this
    ent.state.position = {x: -1000, y: -1000}
    ent.hitArea = null

    switch (ent.species) {
      case 'apple':
        this.addSegment()//.digest(ent)
        break
      case 'pebble':
        break
      case 'ant':
        this.addSegment()
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

  drawHead() {
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.scaleColor
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r * 0.7, -Math.PI / 3, Math.PI / 3)
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(this.state.r * 0.6, -0.4 * this.state.r)
    this.ctx.lineTo(this.state.r, -0.4 * this.state.r)
    this.ctx.moveTo(this.state.r * 0.6, 0.4 * this.state.r)
    this.ctx.lineTo(this.state.r, 0.4 * this.state.r)
    this.ctx.strokeStyle = 'white'
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(0, 0.45 * this.state.r, 0.3 * this.state.r, 0, 2*Math.PI)
    this.ctx.arc(0, -0.45 * this.state.r, 0.3 * this.state.r, 0, 2*Math.PI)
    this.ctx.fillStyle ='white'
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(0.1 * this.state.r, 0.40 * this.state.r, 0.2 * this.state.r, 0, 2*Math.PI)
    this.ctx.arc(0.1 * this.state.r, -0.40 * this.state.r, 0.2 * this.state.r, 0, 2*Math.PI)
    this.ctx.fillStyle = 'black'
    this.ctx.fill()
  }

  drawTongue() {
    this.ctx.beginPath()
    this.ctx.moveTo(0.8*this.state.r, 0)
    this.ctx.lineTo(1.8*this.state.r, 0,)
    this.ctx.lineTo(2.2*this.state.r, 0.5 * this.state.r)
    this.ctx.moveTo(1.8*this.state.r, 0)
    this.ctx.lineTo(2.2*this.state.r, -0.5 * this.state.r)
    this.ctx.lineWidth = 0.7
    this.ctx.strokeStyle='red'
    this.ctx.stroke()
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.rotate(this.state.directionRad)
    this.ctx.save()
    this.ctx.scale(1 ,this.scaleX)

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
}

export class Segment {
  state = {
    position: {x:0,y:0},
    entDigesting: {},
    directionAngle: 0,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
  }

  constructor(head, ent=null) {

  }

  step() {

  }
  draw() {

  }

}
export class Segments {
  headTrail = []
  segments = []
  constructor(ctx, headState) {
    this.ctx = ctx
    this.headState = headState
    this.nSegments = this.headState.nSegments
    this.linkLength = Math.floor(this.headState.r * 0.8)

    for(let i = 0; i < this.headState.nSegments; i++) {
      this.segments.push({
        position: { x: 0, y: 0 },
        entDigesting: null,
      })

      for(let j = 0; j < this.linkLength; j++) {
        this.headTrail.push({ 
          x: this.headState.headCoords.x - (j + 1 + i * this.linkLength) * this.headState.moveSpeed * Math.cos(this.headState.directionRad),
          y: this.headState.headCoords.y - (j + 1 + i * this.linkLength) * this.headState.moveSpeed * Math.sin(this.headState.directionRad) 
        })
      }
    }
  }

  addSegment() {
    
    for(let i = 0; i < this.linkLength; i++) {
      this.headTrail.push({ 
        x: this.headTrail[this.linkLength * this.headState.nSegments - 1].x - (i + 1 + i * this.linkLength) * this.headState.moveSpeed * Math.cos(this.headState.directionRad),
        y: this.headTrail[this.linkLength * this.headState.nSegments - 1].y - (i + 1 + i * this.linkLength) * this.headState.moveSpeed * Math.sin(this.headState.directionRad) 
      })
    }
    const position = this.headTrail[(this.headState.nSegments+1)*this.linkLength - 1]
    this.segments.push({
      position,
      entDigesting: null,
    })
    this.headState.nSegments++
    console.log(`segs`, this.headState.nSegments)
    
  }

  step(headCoords) {
    // while (
    //   this.headTrail.length > this.headState.nSegments * this.linkLength
    //   && this.headState.nSegments > 0
    // ) {
    //   this.headTrail.shift()
    // }
    // ! do I need slack in case game drops an index?
    this.headTrail.pop()
    this.headTrail.splice(0, 0, { 
      x: this.headState.headCoords.x,
      y: this.headState.headCoords.y
    })
    this.draw()
  }
  
  drawSegments() {
    for(let i = 0; i < this.headState.nSegments; i++) {
        const position = this.headTrail[(i+1)*this.linkLength - 1]
        this.segments[i].position = position

        this.ctx.save()
        this.ctx.translate(position.x, position.y)
        let dy, dx
        if (i === 0) {
          dy = this.headState.headCoords.y 
            - this.headTrail[(i+1)*Math.ceil(this.linkLength/2)].y   // TODO get segments pointing at tail end of segment in front of it
          dx = this.headState.headCoords.x 
            - this.headTrail[(i+1)*Math.ceil(this.linkLength/2)].x
        } else {
          dy = this.headTrail[(i-1) * this.linkLength].y 
            - this.headTrail[(i)*Math.ceil(this.linkLength/2)-1].y
          dx = this.headTrail[(i-1) * this.linkLength].x 
            - this.headTrail[(i)*Math.ceil(this.linkLength/2)-1].x
        }

        const segmentAngle = Math.atan(dy/dx)
        this.ctx.rotate(segmentAngle)
        this.ctx.scale(1, 0.6)

        this.drawLegs()

        this.ctx.beginPath()
        this.ctx.arc(0, 0, this.headState.r, 0, 2 * Math.PI)
        this.ctx.fillStyle = this.headState.scaleColor
        this.ctx.fill()

        this.ctx.restore()
      
    }
  }

  drawLegs() {
  }

  draw() {
    this.drawSegments()
  }
}