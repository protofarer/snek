export default class Ant {
  static species = 'ant'
  species = 'ant'
  static entGroup = 'mob'
  entGroup = 'mob'
  static swallowables = ['apple', 'mango', 'ant', 'pebble', ]
  canTurn = true
  state = {
    r: 4,
    headCoords() { return { 
        x: this.state.position.x 
          + Math.cos(this.state.directionRad) * this.state.r * 1.1,
        y: this.state.position.y 
          + Math.sin(this.state.directionRad) * this.state.r * 1.1
    }},
    position: { x: 0, y: 0 },
    moveSpeed: 2,
    directionAngle: 0,
    set directionRad(val) { this.directionAngle = val * 180 / Math.PI },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    turnDirection: 3,
    turnRate() { return this.moveSpeed + 8},
    get mouthCoords() { return {
        x: this.headCoords.x + 0.6 * this.r * Math.cos(this.directionRad),
        y: this.headCoords.y + 0.6 * this.r * Math.sin(this.directionRad),
    }},
    primaryColor: 'black',
    mobile: true,
    exp: 1,
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.state.position = startPosition || this.state.position
    this.parentEnt = parentEnt
    this.hitSideLength = this.state.r
    this.carriedEnt = null
    this.carriedOffsetRad = null
    this.setHitArea()
  }

  turnLeft(k=1) {
    this.state.directionAngle += k * this.state.turnRate() * -1
  }

  turnRight(k=1) {
    this.state.directionAngle += k * this.state.turnRate() * 1
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
    this.state.position.x += speedMultiplier * this.state.moveSpeed 
      * Math.cos(this.state.directionRad)
    this.state.position.y += speedMultiplier * this.state.moveSpeed 
      * Math.sin(this.state.directionRad)
  }

  grab(ent) {
    ent.parentEnt = this
    ent.hitArea = null
    this.carriedEnt = ent
    this.carriedOffsetRad = this.state.directionRad 
      - this.carriedEnt.state.directionRad
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitArea() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - 1 * this.hitSideLength,
      this.state.position.y - 2 * this.hitSideLength, 
      2 * this.hitSideLength,
      4.2 * this.hitSideLength
    )
  }

  drawShadow() {
    this.ctx.shadowColor = 'hsl(0,0%,25%)'
    this.ctx.shadowBlur = 6
  }

  draw() {
    const pi = Math.trunc(1000 * Math.PI) / 1000

    this.ctx.save()
    this.ctx.translate(this.state.position.x, this.state.position.y)
    this.ctx.rotate(this.state.directionRad)
    this.ctx.save()
    this.ctx.scale(1, 0.2)

    // Draw Head + Thorax
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 2*this.state.r, 0, 2 * pi)
    this.ctx.restore()

    // Draw Abdomen
    this.ctx.arc(-1.4*this.state.r, 0, 0.7*this.state.r, 0, 2 * pi)
    this.ctx.fillStyle = this.state.primaryColor
    this.ctx.fill()

    // Draw Eyes
    this.ctx.beginPath()
    this.ctx.arc(1.4*this.state.r, -0.4*this.state.r, 0.4 * this.state.r, 0, 2 * pi)
    this.ctx.arc(1.4*this.state.r, 0.4*this.state.r, 0.4 * this.state.r, 0, 2 * pi)
    this.ctx.fillStyle = 'white'
    this.ctx.fill()


    this.ctx.moveTo(this.state.r, 1.2*this.state.r)
    this.ctx.lineTo(-this.state.r, -1.2*this.state.r)
    this.ctx.moveTo(this.state.r, -1.2*this.state.r)
    this.ctx.lineTo(-this.state.r, 1.2*this.state.r)
    this.ctx.moveTo(0, -1.5*this.state.r)
    this.ctx.lineTo(0, 1.5*this.state.r)
    this.ctx.moveTo(0,0)
    this.ctx.strokeStyle = 'black'
    this.ctx.stroke()

    this.ctx.restore()
  }

  step() {
    if (this.state.mobile) {
      if (Math.random() < 0.8) {
        this.move(1)
        this.setHitArea()
      } else {
        this.canTurn && this.turnErratically(0.8)
      }
    }

    this.draw()

    if (this.carriedEnt) {
      this.carriedEnt.state.position = this.state.mouthCoords
      this.carriedEnt.state.directionRad = this.state.directionRad + this.carriedOffsetRad
      // ! hitArea null, may be used for snatch mechanic
      this.carriedEnt.step()
    }
  }
}