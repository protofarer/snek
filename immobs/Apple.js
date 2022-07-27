import Immob from "./Immob"

export default class Apple extends Immob {
  static entGroup = 'immob'
  static species = 'apple'
  entGroup = 'immob'
  species = 'apple'

  state = {
    r: 6,
    get hitSideLength() { return this.r + 1 },
    position: { x: 400, y: 400 },
    directionAngle: 0,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    primaryColor: 'hsl(0,70%, 50%)',
    leafColor: 'hsl(95, 60%, 50%)',
    exp: 10,
    digestion: {
      timeLeft: 700,
      effect (entAffected) {
        let upstreamSegment = entAffected.state.upstreamSegment
        while (upstreamSegment.state.upstreamSegment) {
            upstreamSegment = upstreamSegment.state.upstreamSegment
        }
        console.log(`looping to head`, )
        upstreamSegment.state.moveSpeed += 5
        // return () => this.state.moveSpeed -= 10
        // return console.log(`hoohaa`, ) 
        return () => {
          console.log(`digestion effect ended`, )
          upstreamSegment.state.moveSpeed -= 5
        }
      },
    },
    swallowEffect(entAffected) {
      entAffected.state.exp += this.state.exp / 2
      this.state.exp /= 2
    },
  }
  constructor(ctx, startPosition=null, parentEnt=null) {
    super(ctx, startPosition, parentEnt)
    this.ctx = ctx
    this.parentEnt = parentEnt
    this.state.position = startPosition || this.state.position
    
    this.setHitAreas()
    // console.log(`IN apple digesttimeleft`, this.state.digestionTimeLeft)
  }

  left() {
    return { x:this.state.position.x - this.state.hitSideLength, y: this.state.position.y}
  }
  right() {
    return { x:this.state.position.x + this.state.hitSideLength, y:this.state.position.y}
  }
  top() {
    return { x: this.state.position.x,y: this.state.position.y - this.state.hitSideLength }
  }
  bottom() {
    return { x: this.state.position.x, y: this.state.position.y + this.state.hitSideLength }
  }


  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - this.state.hitSideLength, 
      this.state.position.y - this.state.hitSideLength,
      2 * this.state.hitSideLength,
      2 * this.state.hitSideLength
    )
  }

  drawInitWrapper(radians=null) {
    this.ctx.save()
    this.ctx.translate(this.state.position.x, this.state.position.y)

    radians && this.ctx.rotate(radians)

    this.drawComponents()

    this.ctx.restore()
  }

  drawBody() {
    this.ctx.save()
    this.ctx.rotate(Math.PI / 4)
    this.ctx.scale(0.8, 1)
    this.ctx.beginPath()
    this.ctx.arc(this.state.r*0.3, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.arc(-this.state.r*0.3, 0, this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.primaryColor
    this.ctx.fill()

    this.drawShadow()

    this.ctx.restore()
  }

  drawShadow() {
    this.ctx.shadowOffsetY = this.state.r * 0.4
    this.ctx.shadowColor = 'hsl(0,0%,20%)'
    this.ctx.shadowBlur = this.state.r * 0.2
    this.ctx.fill()
  }

  drawLeaf() {
    this.ctx.save()
    this.ctx.rotate(-Math.PI/6)
    this.ctx.translate(this.state.r*0.8, 0.2 * this.state.r)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 0.4 * this.state.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.leafColor
    this.ctx.fill()
    this.ctx.restore()
  }

  drawHighlight() {
    this.ctx.rotate(-.55 * Math.PI)
    this.ctx.translate(this.state.r*0.8, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r * 0.28, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'hsla(0,0%,100%, 0.6)'
    this.ctx.fill()
  }

  drawStem() {
    this.ctx.save()
    this.ctx.rotate(-1)
    this.ctx.beginPath()
    this.ctx.moveTo(0.55*this.state.r,0)
    this.ctx.lineTo(1.1*this.state.r,0)
    this.ctx.lineWidth = 1.5
    this.ctx.strokeStyle = 'hsl(40, 60%, 20%)'
    this.ctx.stroke()
    this.ctx.restore()
  }

  drawComponents() {
    this.drawBody()
    this.drawLeaf()
    this.drawStem()
    this.drawHighlight()
  }

  update() {
  }

  render() {
    this.drawInitWrapper(this.state.directionRad)
  }
}