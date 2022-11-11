import BaseState from './BaseState'
import Constants from '../Constants'
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
    this.game.loop.stop()

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)

    this.game.setSnek(this.snek)

    this.level = params.level
    this.score = params.score
    this.lifeSpan = this.snek.lifeSpan
    
    const data = {
      level: this.level,
      score: this.score,
      snek: this.snek,
      isVictory: this.snek.countSegments >= 1
    }
    this.endDialog = new SnekEndDialog(this.game, data)
    this.endDialog.show()
    this.game.panel.render()
  }

  update() {
  }

  render() {
    this.endDialog.render()
  }

  exit() {
    this.game.resetGame()
  }
}