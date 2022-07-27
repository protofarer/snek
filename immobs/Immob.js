export default class Immob {
  static entGroup = 'immob'
  static species = 'immob'
  entGroup = 'immob'
  species = 'immob'

  state = {
    r: 0,
    get hitSideLength() { return this.r + 1 },
    position: { x: 400, y: 400 },
    directionAngle: 0,
    set directionRad(val) {
      this.directionAngle = val * 180 / Math.PI
    },
    get directionRad() { return this.directionAngle * Math.PI / 180 },
    primaryColor: '',
    exp: 0,
    digestion: {
      timeLeft: 0,
      effect() { }
    },
    swallowEffect() {}
  }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.parentEnt = parentEnt
    this.state.position = startPosition || this.state.position
    
    this.setHitAreas()
  }

  swallowEffect(entAffected) {
    entAffected.state.exp += Math.floor(this.state.exp / 2)
    this.state.exp -= Math.floor(this.state.exp/2)
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

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
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

  drawComponents() {
    this.drawBody()
  }

  drawBody() {
  }

  drawShadow() {
  }

  update() {
  }

  render() {
    this.drawInitWrapper(this.state.directionRad)
  }
}