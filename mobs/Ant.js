export default class Ant {
  static species = 'ant'
  species = 'ant'
  static entGroup = 'mob'
  entGroup = 'mob'
  static swallowables = ['apple', 'mango', 'ant', 'pebble', ]

  r = 4
  position = { x: 0, y: 0 }
  get headCoords() { return { 
    x: this.position.x 
      + Math.cos(this.directionRad) * this.r * 1.1,
    y: this.position.y 
      + Math.sin(this.directionRad) * this.r * 1.1
  }}

  directionAngle = 0
  set directionRad(val) { this.directionAngle = val * 180 / Math.PI }
  get directionRad() { return this.directionAngle * Math.PI / 180 }

  moveSpeed = 2
  turnDirection = 3
  turnRate() { return this.moveSpeed + 8}
  get mouthCoords() { return {
      x: this.headCoords.x + 0.6 * this.r * Math.cos(this.directionRad),
      y: this.headCoords.y + 0.6 * this.r * Math.sin(this.directionRad),
  }}

  primaryColor = 'black'

  mobile = true
  canTurn = true

  exp = 1
  scale = 1

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.position = startPosition || this.position
    this.parentEnt = parentEnt
    this.hitSideLength = this.r
    this.carriedEnt = null
    this.carriedOffsetRad = null
    this.setHitAreas()
    // console.log(`ant headcoords`, this.headCoords)
    // console.log(`ant mouthcoords`, this.mouthCoords)
    // console.log(`ant pos`, this.position)
    
  }

  turnLeft(k=1) {
    this.directionAngle += k * this.turnRate() * -1
  }

  turnRight(k=1) {
    this.directionAngle += k * this.turnRate() * 1
  }

  turnErratically(k=1) {
    const rng = Math.random()
    if (rng < 0.2) {
      this.turnDirection = 1
    } else if (rng < 0.4) {
      this.turnDirection = 2
    } else if (rng < 0.8) {
      this.turnDirection = 0
    }
    if (this.turnDirection === 1) {
      this.turnLeft(k)
    } else if (this.turnDirection === 2) {
      this.turnRight(k)
    }
  }

  move(speedMultiplier=1) {
    this.position.x += speedMultiplier * this.moveSpeed 
      * Math.cos(this.directionRad)
    this.position.y += speedMultiplier * this.moveSpeed 
      * Math.sin(this.directionRad)
  }

  grab(ent) {
    ent.parentEnt = this
    ent.hitArea = new Path2D()
    this.carriedEnt = ent
    this.carriedOffsetRad = this.directionRad 
      - this.carriedEnt.directionRad
  }

  canTurn(setCanTurn) {
    this.canTurn = setCanTurn
    return this
  }

  isMobile(setMobile) {
    this.mobile = setMobile
    return this
  }
  
  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - 2 * this.hitSideLength,
      this.position.y - 2 * this.hitSideLength,
      4 * this.hitSideLength,
      4 * this.hitSideLength
    )
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  drawShadow() {
    this.ctx.shadowColor = 'hsl(0,0%,25%)'
    this.ctx.shadowBlur = 6
  }

  render() {
    const pi = Math.trunc(1000 * Math.PI) / 1000

    this.ctx.save()
    this.ctx.translate(this.position.x, this.position.y)
    this.ctx.rotate(this.directionRad)
    this.ctx.scale(this.scale,this.scale)

    // Draw Head
    this.ctx.beginPath()
    this.ctx.arc(1.1*this.r,0,0.5*this.r,0,2*Math.PI)

    // Draw Thorax
    this.ctx.rect(this.r*-1, -this.r/4, this.r*2, this.r/2 )
    this.ctx.fill()

    // Draw Abdomen
    this.ctx.arc(-1.4*this.r, 0, 0.7*this.r, 0, 2 * pi)
    this.ctx.fillStyle = this.primaryColor
    this.ctx.fill()

    // Draw Eyes
    // this.ctx.beginPath()
    // this.ctx.arc(1.4*this.r, -0.4*this.r, 0.2 * this.r, 0, 2 * pi)
    // this.ctx.arc(1.4*this.r, 0.4*this.r, 0.2 * this.r, 0, 2 * pi)
    // this.ctx.fillStyle = 'white'
    // this.ctx.fill()


    this.ctx.beginPath()
    this.ctx.moveTo(this.r, 1.2*this.r)
    this.ctx.lineTo(-this.r, -1.2*this.r)
    this.ctx.moveTo(this.r, -1.2*this.r)
    this.ctx.lineTo(-this.r, 1.2*this.r)
    this.ctx.moveTo(0, -1.5*this.r)
    this.ctx.lineTo(0, 1.5*this.r)
    this.ctx.moveTo(0,0)
    this.ctx.strokeStyle = 'black'
    this.ctx.stroke()

    this.ctx.restore()
  }

  update() {
    if (this.mobile) {
      if (Math.random() < 0.8) {
        this.move()
      } else {
        this.canTurn && this.turnErratically(0.8)
      }
      this.setHitAreas()
    }
    // console.log(`ant mouthcoords`, this.mouthCoords)
    // console.log(`ant headcoords`, this.headCoords)
    // console.log(`ant pos`, this.position)

    //   this.setHitAreas()
    //   this.move()
    if (this.carriedEnt) {
      this.carriedEnt.position = this.mouthCoords
      this.carriedEnt.directionRad = this.directionRad + this.carriedOffsetRad
      // ! hitArea null, may be used for snatch mechanic
      this.carriedEnt.update()
    }
  }
}