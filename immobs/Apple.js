export default class Apple {
  static species = 'apple'
  species = 'apple'
  static entGroup = 'immob'
  entGroup = 'immob'

  state = {
    r: 6,
    position: { x: 0, y: 0 },
    directionAngle: 0,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    primaryColor: 'hsl(0,70%, 50%)',
    leafColor: 'hsl(95, 60%, 50%)'
  }
  constructor(ctx, startPosition=null, parentEnt=null, id=null) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.parentEnt = parentEnt
    this.state.position = startPosition || {x:400,y:330}
    this.id = id
    this.hitSideLength = this.state.r + 1
    
    this.setHitArea()
  }

  // Collision helper
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
    // if (this.parentEnt.species === 'ant') {
    //   this.parentEnt.species === 'ant' && console.log(`im getting carried lol`, )
    // }
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
    this.ctx.shadowBlur = this.state.r * 0.2
    this.ctx.shadowColor = 'hsl(0,0%,20%)'
    this.ctx.fill()
  }

  drawLeaf() {
    this.ctx.save()
    this.ctx.rotate(-Math.PI/6)
    this.ctx.translate(this.state.r*0.8, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r / 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.state.leafColor
    this.ctx.fill()
    this.ctx.restore()
  }

  drawHighlight() {
    this.ctx.rotate(-2 * Math.PI / 3)
    this.ctx.translate(this.state.r*0.8, 0)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.state.r * 0.28, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'hsla(0,0%,100%, 0.7)'
    this.ctx.fill()
  }

  drawStem() {
    this.ctx.beginPath()
    
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