import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../ents/mobs/Snek'

/**
 * 
 * @property {Number} score - proportional to number of items snek has swallowed
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
    this.score = params.score
    this.game.phase = CONSTANTS.PHASE_PLAY

    this.startT = this.game.t
    this.game.levelMaker.spawn(this.level, this.snek)
    this.spawner = this.game.levelMaker.spawnSurvival(this.startT)
    this.hasCheckedLevel = false
  }

  update(t) {
    this.game.world.update(t)
    this.spawner(t)
    if (!this.hasCheckedLevel) {
      this.hasCheckedLevel = true
      setTimeout(() => {
        if (this.snek.segments.length >= 20) {
          this.game.stateMachine.change('gameOver', {
            snek: this.game.stateMachine.current.snek,
            level: this.game.stateMachine.current.level,
            score: this.game.stateMachine.current.score,
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