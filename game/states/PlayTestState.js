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
    this.game.mode = 'survival'
    this.game.phase = CONSTANTS.PHASE_PLAY
    this.startT = this.game.t
    this.level = 't'

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.setSnek(this.snek)

    // need a better name than spawner, since it includes events
    this.levelUpdate = this.game.levelMaker.generateLevel(
      this.level, 
      this.snek, 
      this.startT
    )

    this.game.world.interstitial.initializeEndConditions(this, [
      Constants.survival.endConditions.loseByDeath.WORD,
      Constants.survival.endConditions.loseByPoop.WORD,
      Constants.survival.endConditions.winByLevel.WORD,
    ])
  }

  update(t) {
    this.game.world.update(t)
    this.levelUpdate(t)
  }

  render() {
    this.game.world.render()
    this.game.panel.render()
  }

  exit() {
  }
}