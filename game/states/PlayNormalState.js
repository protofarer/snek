import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../ents/mobs/Snek'

/**
 * 
 */
export class PlayNormalState extends BaseState {
  level
  stateName = 'playNormal'

  constructor(game, params) {
    super()
    this.game = game
    this.game.mode = 'normal'

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)

    this.game.setSnek(this.snek)

    this.level = params.level
    this.game.phase = CONSTANTS.PHASE_PLAY

    this.game.levelMaker.generateLevel(this.level, this.snek)
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