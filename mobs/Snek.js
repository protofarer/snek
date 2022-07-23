export default class Snek {
  static species = 'snek'
  species = 'snek'
  static entGroup = 'mob'
  entGroup = 'mob'

  swallowables = ['apple', 'mango', 'ant', 'pebble', 'segment']
  scaleX = 0.8

  state = {
    r: 10,
    headCoords: { x: 0, y: 0 },
    position: {x:0,y:0},
    moveSpeed: 2,
    directionAngle: -90,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnRate: function () { return this.moveSpeed + 10 },
    getMouthCoords: function () {
      return {
        x: this.headCoords.x + this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + this.r * Math.sin(this.directionRad),
      }
    },
    exp: 0,
    scaleColor: 'hsl(100, 100%, 32%)',
    mobile: true,
    hasTongueOut: false,
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.state.position = startPosition || {x:400,y:400}
    this.parentEnt = parentEnt
    this.initEventListeners()
    this.segments = new Segments(this.ctx, this.state, 3)
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
      this.state.directionAngle %= 360
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
    this.state.headCoords.x = this.state.position.x
    this.state.headCoords.y = this.state.position.y

    this.segments.step(this.state.position)
    this.draw()
  }

  swallow(ent) {
    ent.parentEnt = this
    ent.state.position = {x: -1000, y: -1000}
    ent.hitArea = null

    switch (ent.species) {
      case 'apple':
        this.segments.nSegments += 1
        break
      case 'pebble':
        break
      case 'ant':
        this.segments.nSegments += 1
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
    this.ctx.scale(1 ,this.scaleX)
    this.ctx.arc(0, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.scaleColor
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r * 0.7, -Math.PI / 3, Math.PI / 3)
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(this.state.r * 0.5, -0.4 * this.state.r)
    this.ctx.lineTo(this.state.r, -0.4 * this.state.r)
    this.ctx.moveTo(this.state.r * 0.5, 0.4 * this.state.r)
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
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle='red'
    this.ctx.stroke()
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.state.headCoords.x, this.state.headCoords.y)
    this.ctx.rotate(this.state.directionRad)

    this.drawHead()

    if (!this.state.hasTongueOut) {
      if (Math.random() < 0.05) {
        this.state.hasTongueOut = true
        setTimeout(() => this.state.hasTongueOut = false, 100 + Math.random()*800)
      }
    }
    this.state.hasTongueOut && this.drawTongue()

    this.ctx.restore()
  }
}

export class Segments {
  headTrail = []
  constructor(ctx, headState, nSegments=0) {
    this.ctx = ctx
    this.headState = headState
    this.nSegments = nSegments 
    this.linkLength = Math.floor(headState.r * 0.6)
  }

  step(headCoords) {
    while (
      this.headTrail.length >= this.nSegments * this.linkLength 
      && this.nSegments > 0
    ) {
      this.headTrail.shift()
    }
    this.headTrail.push({ x: headCoords.x, y: headCoords.y })
    this.draw()
  }
  
  drawSegments() {
    for(let i = 1; i < this.headTrail.length; i++) {
      if (i % this.linkLength === 0) {
        this.ctx.save()
        this.ctx.translate(this.headTrail[i].x, this.headTrail[i].y)
        let dy, dx

        // * 
        if (i === 1) {
          dy = this.headState.headCoords.y - this.headTrail[i].y
          dx = this.headState.headCoords.x - this.headTrail[i].x
        } else {
          dy = this.headTrail[i-1].y - this.headTrail[i].y
          dx = this.headTrail[i-1].x - this.headTrail[i].x
        }
        const segmentAngle = Math.atan(dy/dx)
        this.ctx.rotate(segmentAngle)
        this.ctx.scale(1, 0.8)

        this.drawLegs()

        this.ctx.beginPath()
        this.ctx.arc(0, 0, this.headState.r * 0.8, 0, 2 * Math.PI)
        this.ctx.fillStyle = this.headState.scaleColor
        this.ctx.fill()

        this.ctx.restore()
      }
    }
  }

  drawLegs() {
  }

  draw() {
    this.drawSegments()
  }
}