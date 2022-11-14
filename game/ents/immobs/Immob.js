import Entity from '../Entity'
import { getColorParameters, setColorParameters } from '../../utils/colormorph'
import { loadTraits } from '../../utils/helpers'
import Traits from '../Traits'
import { intRep } from '../../utils/helpers'

export default class Immob extends Entity {
  /**
   * The core interactive game entity. 
   * 
   * The Immob is the essence of all objects in the game, while it is
   * similar to Mobs, Mobs doesn't inherit from Immob due to their irregular
   * shapes and behavioral properties and thus use a separate data description.
   * 
   * Make up the majority of the game's swallowables.
   * 
   * Immobs do not include terrain as the latter belongs solely to the world
   * object and has disparate state structure.
   * 
   * Properties expounded on below will only be included as they are introduced
   * at each subclass in the inheritance chain, e.g.: Immob -> Mob -> ...
   * 
   * This is the exemplar layout and functionality of what constitutes an interactive entity
   * in code form. Because it is immob aka immobile, it does not initiate action
   * and is usually consumed by entities of type "mob"
   * 
   * @property {string} species - used as a basic in-game type 
   * @property {number} r - the fundamental size value, is the canonical size
   *    descriptor. All ents can be compared to each, other and thus states
   *    inferred from this attribute.
   
   * @property {Object} position - primary x and y canvas coordinates of entity
   * @property {Object} scale - primary scale factor for canvas transforms
   * @property {function} hitR - (get) primary value for setting the hit area
   * @property {float} headingRadians - primary axis for rendering and movement
   * @property {function} headingDegrees - (get/set) translates degrees to 
   *    radians
   * @property {Object} digestion - data for entity's base digestion behavior
   * @property {number} digestion.baseTime - constant for total digestion time
   * @property {number} digestion.timeLeft - counts down time left until
   *    fully digested
   * @property {number} baseExp - constant that stores starting experience value
   * @property {number} currExp - variable for current experience
   * @property {function} expEffect - base exp behavior used in under digestion 
   *    phase
   * @property {function} chompEffect - behavior when this ent contacts another ent
   *    with its mouth
   * @property {Array} postDigestionData - data for effects this ent produces 
   *    after it is fully digested by a consuming ent
   * @property {Object} primaryColorParameters - contains parameters for color-
   *    morphing behavior
   * @property {function} primaryColor - (get/set) for primaryColorParameters
   * @property {string} secondaryColor - self-evident
   * @property {Array} underDigestionData - data for effects this ent produces when under
   *    digestion
   */
  
  static entGroup = 'immob'
  entGroup = 'immob'
  static species = 'immob'
  species = 'immob'

  get hitR() { return this.r + this.hitOffset }

  get headingDegrees() { return this.headingRadians * 180 / Math.PI }
  set headingDegrees(val) { this.headingRadians = val * Math.PI / 180 }

  postDigestionData = null

  primaryColorParameters = {}
  getPrimaryColor = getColorParameters.bind(this)
  setPrimaryColor = setColorParameters.bind(this)
  get primaryColor() { return this.getPrimaryColor() }
  set primaryColor({hueStart,hueEnd,satStart, satEnd, lumStart, lumEnd}) { 
    this.setPrimaryColor({hueStart,hueEnd,satStart, satEnd, lumStart, lumEnd}) 
  }

  isVisible = true

  constructor(ctx, startPosition=null, parent=null) {
    super()
    this.ctx = ctx
    this.parent = parent || Error(`Must place ${this.species}:${this.id} under a Parent Entity!`)
    loadTraits.call(this, Traits.Immob)
    this.position = startPosition || this.position
    this.currExp = this.baseExp
    this.setHitAreas()
  }

  /**
   * Utility function for left hit area coordinate
   * @method
   */
  get left() {
    return this.position.x - this.hitR
  }

  /**
   * Utility function for right hit area coordinate
   * @method
   */
  get right() {
    return this.position.x + this.hitR
  }

  /**
   * Utility function for top hit area coordinate
   * @method
   */
  get top() {
    return this.position.y - this.hitR
  }

  /**
   * Utility function for bottom hit area coordinate
   * @method
   */
  get bottom() {
    return this.position.y + this.hitR
  }

  harmed() {
    console.log(`${this.species} harmed`, )
    intRep(16, 100, this.toggleVisibility.bind(this))
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible
  }

  /**
   * Debug render function for hit area
   * @method
   */
  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)
  }

  /**
   * Catch-all render function for all debug renders
   * @method
   */
  drawDebugOverlays() {
    this.drawHitOverlays()
  }

  /**
   * Defines the hit area according to ent's visual occupation
   * @method
   */
  setHitAreas() {
    this.hitArea = new Path2D()
    this.hitArea.rect(
      this.position.x - (this.hitR), 
      this.position.y - (this.hitR),
      2 * this.hitR,
      2 * this.hitR
    )
  }

  /**
   * Wraps canvas transforms and draw functions in a way that subclasses can use
   * as is and simply define component render functions 
   * @method
   */
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

  /**
   * Subclasses should override this function and its nested functions
   * @param {CanvasRenderingContext2D} ctx - passed in so components don't have 
   *    to use "this"
   */
  drawComponents(ctx) {
    // * NB drawShadow not here because invoked by drawBody()
    this.drawBody(ctx)
  }

  /**
   * Essential render method for drawing the ent on the screen
   * @param {CanvasRenderingContext2D} ctx - passed in so components don't have 
   */
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