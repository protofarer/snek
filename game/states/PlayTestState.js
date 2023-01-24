import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../ents/mobs/Snek'
import Constants from '../Constants'

/**
 * 
 */
export class PlayTestState extends BaseState {
  stateName = 'playTest'

  constructor(game, params) {
    super()
    this.game = game
    this.game.phase = CONSTANTS.PHASE_PLAY
    this.startT = this.game.t
    this.level = 't'

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.setSnek(this.snek)

    this.spawner = this.game.levelMaker.generateLevel(this.level, this.snek)

    this.endConditionFunctions = this.game.world.interstitial.addEndConditions(this, [
      Constants.endConditions.LOSE_BY_DEATH,
      Constants.endConditions.LOSE_BY_POOP,
      Constants.endConditions.WIN_BY_LEVEL,
    ])
  }

  update(t) {
    this.game.world.update(t)
    this.spawner?.(t)
    this.endConditionFunctions.forEach(f => f())
  }

  render() {
    this.game.world.render()
    this.game.panel.render()
  }

  exit() {
  }
}