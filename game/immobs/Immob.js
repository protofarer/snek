import { baseChompEffect } from '../behaviors/digestion'
import { baseAbsorbExp } from '../behaviors/exp'
import Entity from '../Entity'
<<<<<<< HEAD
import { getPrimaryColorParameters, setPrimaryColorParameters } from '../utils/colormorph'
export default class Immob extends Entity {
  // * Generally are simple, non-moving, squared or circular interactable
  // * objects. The Immob is the essence of all objects in the game, while it is
  // * similar to Mobs, Mobs doesn't inherit from Immob due to their irregular
  // * shapes and behavioral properties and thus use a separate data description.

  // * Make up the majority of the game's swallowables

  // * Immobs do not include terrain as the latter belongs solely to the world
  // * object and has disparate state structure

=======

export default class Immob extends Entity {
  // * Generally are simple, non-moving, squared or circular interactable
  // * objects. The Immob is the essence of all objects in the game, while it is
  // * similar to Mobs, Mobs doesn't inherit from Immob due to their irregular
  // * shapes and behavioral properties and thus use a separate data description.

  // * Make up the majority of the game's swallowables

  // * Immobs do not include terrain as the latter belongs solely to the world
  // * object and has disparate state structure

>>>>>>> dede83c40f5d66d6e3612719391b6fdb22679d3e
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
    baseTime: 3000,
    timeLeft: 3000,
  }

  baseExp = 0
  currExp = this.baseExp

  expEffect = baseAbsorbExp.bind(this)
  chompEffect = baseChompEffect
  postDigestionData = []


  primaryColorParameters = {}

  getPrimaryColor = getPrimaryColorParameters.bind(this)
  setPrimaryColor = setPrimaryColorParameters.bind(this)

  get primaryColor() { return this.getPrimaryColor() }
  set primaryColor({hueStart,hueEnd,satStart, satEnd, lumStart, lumEnd}) { 
    this.setPrimaryColor({hueStart,hueEnd,satStart, satEnd, lumStart, lumEnd}) 
  }

  secondaryColor = ''


  underDigestionData = [
    {
      effect: 'exp',
      type: 'function',
      exp: this.expEffect,
    }
  ]

  constructor(ctx, startPosition=null, parent=null) {
    super()
    this.ctx = ctx
    this.parent = parent || Error(`Must place ${this.species}:${this.id} under a Parent Entity!`)
    this.position = startPosition || this.position
    this.primaryColor = {
      hueStart: 125, 
      hueEnd: 125 ,
      satStart: 70, 
      satEnd: 30,
      lumStart: 50, 
      lumEnd: 25,
    }

    this.setHitAreas()
  }

  left() {
    return { x:this.position.x - this.hitR, y: this.position.y}
  }
  right() {
    return { x:this.position.x + this.hitR, y:this.position.y}
  }
  top() {
    return { x: this.position.x,y: this.position.y - this.hitR }
  }
  bottom() {
    return { x: this.position.x, y: this.position.y + this.hitR }
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
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)

    if (this.scale.x !== 1 || this.scale.y !== 1) {
      ctx.scale(this.scale.x, this.scale.y)
    }

    ctx.rotate(this.headingRadians)

    this.drawComponents(ctx)

    ctx.restore()
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