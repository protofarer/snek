import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../mobs/Snek'
import SnekEndDialog from '../ui-components/SnekEndDialog'

/**
 * 
 * @property {Number} score - number of items snek has swallowed
 */
export class GameOverState extends BaseState {
  stateName = 'gameOver'

  constructor(game, params) {
    super()
    
    this.game = game

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)

    this.game.setSnek(this.snek)

    this.level = params.level
    this.score = params.score
    this.lifeSpan = this.snek.lifeSpan
    this.game.phase = CONSTANTS.PHASE_PAUSE

    const data = {
      level: this.level,
      score: this.score,
      snek: this.snek,
      isVictory: this.snek.countSegments >= 1
    }
    this.endDialog = new SnekEndDialog(this.game, data)
    this.game.panel.render()
  }

  update() {
    // TODO endDialog.update()
  }

  render() {
    // TODO endDialog.render()
    this.game.ctx.fillText(
      `Snek has perished!`,
      50, 50
    )
  }

  exit() {
    window.location.reload()
  }
}