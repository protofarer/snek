export default class Immob {
  static entGroup = 'immob'
  static species = 'immob'
  entGroup = 'immob'
  species = 'immob'

  r = 1
  position = { x: 400, y: 400 }
  secondaryColor
  exp = 10
  expAbsorbRate = 1
  digestion = {
    timeLeft: 1000,
    baseTime: 1000,
  }
  directionAngleRadian = 0

  #primaryColorHue = { start: 125, end: 125 }
  #primaryColorSat = { start: 70, end: 30 }
  #primaryColorLum = { start: 50, end: 25 }
  get primaryColor() { return (
    `hsl(
      ${
        this.#primaryColorHue.start 
        + (this.#primaryColorHue.end - this.#primaryColorHue.start)
        * Math.ceil(
          (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
        )
      },
      ${
        this.#primaryColorSat.start 
        + (this.#primaryColorSat.end - this.#primaryColorSat.start)
        * Math.ceil(
            (this.digestion.baseTime - this.digestion.timeLeft)
            / this.digestion.baseTime
          )
      }%,
      ${
        this.#primaryColorLum.start
        + (this.#primaryColorLum.end - this.#primaryColorLum.start)
        * Math.ceil(
          (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
        )
      }%
    )`
  )}
  set primaryColor({hueStart,hueEnd,satStart, satEnd, lumStart, lumEnd}) {
    // ! Doesn't catch out of range (x < 0, x > 255)
    if (typeof hueStart === 'number' || typeof hueEnd === 'number') {
      if (typeof hueStart !== 'number' || typeof hueEnd !== 'number') {
        throw Error(`Must specify both start & end values for #primaryColorHue`)
      } else if (hueStart < 0 || hueStart > 255 || hueEnd < 0 || hueEnd > 255) {
        throw Error(`${this.species} #primaryColorHue values must be in [0, 255]`)
      } else {
        this.#primaryColorHue = { start: hueStart, end: hueEnd } 
          || this.#primaryColorHue
      }
    }
    if (typeof satStart === 'number' || typeof satEnd === 'number') {
      if (typeof satStart !== 'number' || typeof satEnd !== 'number') {
          throw Error(`Must specify both start & end values for #primaryColorHue`)
      } else if (satStart < 0 || satStart > 100 || satEnd < 0 || satEnd > 100) {
        throw Error(`${this.species} #primaryColorSat values must be in [0, 100]`)
      } else {
        this.#primaryColorSat = { start: satStart, end: satEnd } 
          || this.#primaryColorSat
      }
    }
    if (typeof lumStart === 'number' || typeof lumEnd === 'number') {
      if (typeof lumStart !== 'number' || typeof lumEnd !== 'number') {
          throw Error(`Must specify both start & end values for #primaryColorHue`)
      } else if (lumStart < 0 || lumStart > 100 || lumEnd < 0 || lumEnd > 100) {
        throw Error(`${this.species} #primaryColorHue values must be in [0, 255]`)
      } else {
        this.#primaryColorLum = { start: lumStart, end: lumEnd } 
          || this.#primaryColorLum
      }
    }
  }
  get directionAngleDegrees() { return this.directionAngleRadians * 180 / Math.PI }
  set directionAngleDegrees(val) { this.directionAngleRadians = val * Math.PI / 180 }
  get hitR() { return this.r + 1 }

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.parentEnt = parentEnt || Error(`Must place ${this.species} under a Parent Entity!`)
    this.position = startPosition || this.position
    this.setHitAreas()
  }

  swallowEffect(entAffected) {
    entAffected.exp += Math.floor(this.exp / 2)
    this.exp -= Math.floor(this.exp / 2)
  }

  absorbExp(entAffected) {
    if (this.exp > 0) {
      entAffected.exp += this.expAbsorbRate
      this.exp -= this.expAbsorbRate
    }
  }

  left() {
    return { x:this.position.x - this.hitSideLength, y: this.position.y}
  }
  right() {
    return { x:this.position.x + this.hitSideLength, y:this.position.y}
  }
  top() {
    return { x: this.position.x,y: this.position.y - this.hitSideLength }
  }
  bottom() {
    return { x: this.position.x, y: this.position.y + this.hitSideLength }
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - this.hitR, 
      this.position.y - this.hitR,
      2 * this.hitR,
      2 * this.hitR
    )
  }

  drawInitWrapper(radians=null) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    radians && ctx.rotate(radians)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.rect(0,0,10,10)
    ctx.strokeStyle = this.primaryColor
    ctx.lineWidth = 2
    ctx.stroke()
  }

  update() {
  }

  render() {
    this.drawInitWrapper(this.directionRad)
    console.log(`primarycolor immob`, this.primaryColor)
    
  // console.log(`primarycolor`, this.#primaryColor)
  
  }
}