import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../ents/mobs/Snek'
import Constants from '../Constants'

/**
 * 
 */
export class PlaySurvivalState extends BaseState {
  stateName = 'playSurvival'

  constructor(game, params) {
    super()
    this.game = game
    this.game.mode = 'survival'

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.setSnek(this.snek)

    this.level = params?.level ?? 's'
    this.game.phase = CONSTANTS.PHASE_PLAY

    this.spawner = this.game.levelMaker.generateLevel(this.level, this.snek)

    this.game.world.interstitial.initializeEndConditions(this, [
      Constants[this.game.mode].endConditions.loseByDeath.WORD,
      Constants[this.game.mode].endConditions.loseByPoop.WORD,
      Constants[this.game.mode].endConditions.winByLevel.WORD,
    ])
  }

  update(t) {
    this.game.world.update(t)
    this.spawner?.(t)
  }

  render() {
    this.game.world.render()
    this.game.panel.render()
  }

  exit() {
  }
}