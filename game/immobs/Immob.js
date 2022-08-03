import { baseAbsorbExp, baseSwallowEffect } from '../behaviors/digestion'

export default class Immob {
  // * Generally are simple, non-moving, squared or circular interactable
  // * objects. The Immob is the essence of all objects in the game, while it is
  // * similar to Mobs, Mobs doesn't inherit from Immob due to their irregular
  // * shapes and behavioral properties and thus use a separate data description.

  // * Make up the majority of the game's swallowables

  // * Immobs do not include terrain as the latter belongs solely to the world
  // * object and has disparate state structure

  // ! This is not a clear distinction and a resolution is being considered:
  // * use entity at top of hierarchy, with child Immob with child Mob as a sort
  // * of evolution of increasing complexity and specificity.
  
  static entGroup = 'immob'
  entGroup = 'immob'

  r = 1
  position = { x: 400, y: 400 }
  scale = { x: 1, y: 1 }
  get hitR() { return this.r + 3 }

  headingRadians = 0
  get headingDegrees() { return this.headingRadians * 180 / Math.PI }
  set headingDegrees(val) { this.headingRadians = val * Math.PI / 180 }

  digestion = {
    timeLeft: 0,
    baseTime: 0,
  }

  baseExp = 0
  currExp = 0
  get expAbsorbRate() { 
    const rate = (17 / this.digestion.baseTime) * this.baseExp/2 
    return rate
  }

  swallowEffect = baseSwallowEffect
  postDigestionData = null

  secondaryColor
  #primaryColorHue = { start: 125, end: 125 }
  #primaryColorSat = { start: 70, end: 30 }
  #primaryColorLum = { start: 50, end: 25 }
  get primaryColor() { return (
    `hsl(
      ${
        this.#primaryColorHue.start 
        + (this.#primaryColorHue.end - this.#primaryColorHue.start)
        * (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
      },
      ${
        this.#primaryColorSat.start 
        + (this.#primaryColorSat.end - this.#primaryColorSat.start)
        * (this.digestion.baseTime - this.digestion.timeLeft)
            / this.digestion.baseTime
      }%,
      ${
        this.#primaryColorLum.start
        + (this.#primaryColorLum.end - this.#primaryColorLum.start)
        * (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
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

  constructor(ctx, startPosition=null, parentEnt=null) {
    this.ctx = ctx
    this.parentEnt = parentEnt || Error(`Must place ${this.species} under a Parent Entity!`)
    this.position = startPosition || this.position
    this.setHitAreas()
  }

  getPostDigestionData() {
    return this.postDigestionData
  }

  swallowBehavior(entAffected) {
    if (this.swallowEffect) {
      console.log(`calling swallowEffect`, )
      
      this.swallowEffect.call(this, entAffected)
    } else {
      console.log(`no swalloweffect triggered, either wasExcreted or missing`, )
    }
  }

  absorbExp(entAffected) {
    baseAbsorbExp.call(this, entAffected)
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

  drawDebugOverlays() {
    this.drawHitOverlays()
  }

  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - (this.hitR), 
      this.position.y - (this.hitR),
      2 * this.hitR,
      2 * this.hitR
    )
  }

  drawInitWrapper() {
    // const ctx = this.ctx
    this.ctx.save()
    this.ctx.translate(this.position.x, this.position.y)
    // console.log(`immob position drawinitwrapp`, this.position)
    

    if (this.scale.x !== 1 || this.scale.y !== 1) {
      this.ctx.scale(this.scale.x, this.scale.y)
    }

    this.ctx.rotate(this.headingRadians)

    this.drawComponents(this.ctx)

    this.ctx.restore()
  }

  drawComponents(ctx) {
    // * NB drawShadow not here because invoked by drawBody()
    this.drawBody(ctx)
  }

  drawBody(ctx) {
    ctx.beginPath()
    ctx.rect(0,0,10,10)
    ctx.strokeStyle = this.primaryColor
    ctx.lineWidth = 2
    ctx.stroke()
  }

  render() {
    this.drawInitWrapper()
    
  }
}