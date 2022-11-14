import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../ents/mobs/Snek'

/**
 * 
 * @property {Number} score - number of items snek has swallowed
 */
export class PlayNormalState extends BaseState {
  level
  stateName = 'playNormal'

  constructor(game, params) {
    super()
    this.game = game

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)

    this.game.setSnek(this.snek)

    this.level = params.level
    this.score = params.score
    this.game.phase = CONSTANTS.PHASE_PLAY

    this.game.levelMaker.spawn(this.level, this.snek)
  }

  update(t) {
    this.game.world.update(t)
  }

  render() {
    this.game.world.render()
    this.game.panel.render()
  }

  exit() {
  }
}