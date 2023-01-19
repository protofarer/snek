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

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.setSnek(this.snek)

    this.level = params?.level ?? 's'
    this.game.phase = CONSTANTS.PHASE_PLAY

    this.spawner = this.game.levelMaker.generateLevel(this.level, this.snek)
    this.hasCheckedLevel = false
  }

  update(t) {
    this.game.world.update(t)
    this.spawner?.a(t)
    if (!this.hasCheckedLevel) {
      this.hasCheckedLevel = true
      setTimeout(() => {
        if (this.snek.level >= Constants.survival.victory.segcount) {
          this.game.stateMachine.change('gameOver', {
            snek: this.game.stateMachine.current.snek,
            level: this.game.stateMachine.current.level,
            score: this.snek.score,
            isVictory: true,
          })
        }
        this.hasCheckedLevel = false
      }, 200)
    }
  }

  render() {
    this.game.world.render()
    this.game.panel.render()
  }

  exit() {
  }
}