export default class Apple {
  static species = 'apple'
  species = 'apple'
  static entGroup = 'immob'
  entGroup = 'immob'

  state = {
    r: 6,
    position: { x: 400, y: 400 },
    directionAngle: 0,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    primaryColor: 'hsl(0,70%, 50%)',
    leafColor: 'hsl(95, 60%, 50%)',
    exp: 2,
  }
  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.parentEnt = parentEnt
    this.state.position = startPosition || this.state.position
    this.hitSideLength = this.state.r + 1
    
    this.setHitArea()
  }

  left() {
    return { x:this.state.position.x - this.hitSideLength, y: this.state.position.y}
  }
  right() {
    return { x:this.state.position.x + this.hitSideLength, y:this.state.position.y}
  }
  top() {
    return { x: this.state.position.x,y: this.state.position.y - this.hitSideLength }
  }
  bottom() {
    return { x: this.state.position.x, y: this.state.position.y + this.hitSideLength }
  }

  drawHitArea() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitArea() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.state.position.x - this.hitSideLength, 
      this.state.position.y - this.hitSideLength,
      2 * this.hitSideLength,
      2 * this.hitSideLength
    )
  }

  step() {
    this.draw()
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

  draw() {
    this.drawInitWrapper(this.state.directionRad)
  }
}