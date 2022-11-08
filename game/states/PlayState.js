import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Entity from '../Entity'
import { moveEdgeWrap } from '../behaviors/movements'

/**
 * 
 * @property {Number} score - number of items snek has swallowed
 */
export default class PlayState extends BaseState {
  mode
  level

  constructor(game, params) {
    super()
    this.game = game
    this.mode = params.mode
    this.snek = params.snek
    this.level = params.level
    this.score = params.score
    console.log(`score in playstate`, this.score)
    

    this.game.phase = CONSTANTS.PHASE_PLAY
    this.game.snek = this.snek

    this.game.levelMaker.spawn(this.level)
  }

  update() {
    for(const ent of Entity.stack.values()) {

      // Generally, immobs don't have an update function since they are *acted
      // upon* or manipulated by other ents
      ent.update?.()

      // **********************************************************************
      // * Hit Detection
      // * - only when parent = game
      // **********************************************************************

      if (ent.parent === this.game) {

        if (ent.species === 'ant' && !ent.carriedEnt) {

          let sweets = Entity.bySpecies([{species: 'apple'}, {species:'mango'},{species: 'banana'}])
          for(let sweet of sweets.values()) {
            this.collisionResolver(ent, sweet, () => ent.grab(sweet))
          }

        }
  
        if (ent.entGroup === 'mob') {
          
          moveEdgeWrap.call(ent)

          const sneksegs = Entity.bySpecies([
            {
              species: 'segment',
              subSpecies: 'snek'
            }
          ]) 

          if (ent.species === 'centipede' && Array.from(sneksegs.values()).length > 0) {

            for(let snekseg of sneksegs.values()) {

              this.collisionResolver(ent, snekseg, () => {
                snekseg.detach()
                ent.chomp(snekseg)
              })

            }

          }

        }

        if (this.snek && this.snek.swallowables.includes(ent.species)) {

          this.collisionResolver(this.snek, ent, () => {

            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.chomp(ent)
              this.game.play.playRandomSwallowSound()
              this.score++
            }

          })

        }
      }
    }
  }

  isContactingMouth(objHitArea, mouthCoords) {
    return this.game.ctx.isPointInPath(objHitArea, mouthCoords.x, mouthCoords.y)
  }

  /** Determine whether ent mouth is contacting another ent's body 
   * @function
   * @param {Entity} aggressor - entity with an initiating action, 
   *    e.g. chomp or carry
   * @param {Entity} defender - entity being initiated upon
   * @param {function} resolver - aggressor ent initiating action method
  */
  collisionResolver(aggressor, defender, resolver) {
    const isContacting = this.isContactingMouth(
      defender.hitArea,
      aggressor.mouthCoords,
    )
    isContacting && resolver()
  }


  render() {
    for(const ent of Entity.stack.values()) {
      ent.render()
    }

    this.game.panel.render()
  }

  exit() {
  }
}