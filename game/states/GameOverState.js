import BaseState from './BaseState'
import Snek from '../ents/mobs/Snek'
import SnekEndDialog from '../ui/SnekEndDialog'

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

    const data = {
      level: params?.level ?? 'null',
      score: params?.score ?? 'null',
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