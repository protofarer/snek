import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Entity from '../Entity'
import Snek from '../mobs/Snek'

/**
 * 
 * @property {Number} score - number of items snek has swallowed
 */
export class PlayNormalState extends BaseState {
  level

  constructor(game, params) {
    super()
    this.game = game

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.world.snek = this.snek 
    this.game.panel.snek = this.snek

    this.level = params.level
    this.score = params.score
    this.game.phase = CONSTANTS.PHASE_PLAY

    this.game.levelMaker.spawn(this.level, this.snek)
  }

  update() {
    this.game.world.update()
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