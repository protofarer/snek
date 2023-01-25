import BaseState from './BaseState'
import Snek from '../ents/mobs/Snek'
import SnekEndDialog from '../ui/SnekEndDialog'

/**
 * 
 */
export class GameOverState extends BaseState {
  stateName = 'gameOver'

  constructor(game, params) {
    super()
    this.game = game
    this.snek = params.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.setSnek(this.snek)

    // TODO get username from web session
    const dbData = {
      play_mode: this.game.mode,
      current_state_machine: 'gameOver',
      score: this.snek.points,
      life_span: this.snek.lifeSpan,
      submitted_at: new Date().toISOString(),
      user: "placeholder",
      version: import.meta.env.VITE_APP_VERSION
    }
    console.log(`DBdata`, dbData)
    

    let linesEntsDigested = []
    for (let [k, v] of this.snek.entsDigested.entries()) {
      linesEntsDigested.push(`${v} x ${k}`)
    }

    const dialogData = {
      snek: this.snek,
      isVictory: params?.isVictory,
      linesEntsDigested
    }

    this.endDialog = new SnekEndDialog(this.game, dialogData)
    this.endDialog.show()
    this.game.touchAreaContainer.style.display = 'none'
    this.game.panel.render()
  }

  update() {
  }

  render() {
    this.endDialog.render()
  }

  exit() {
  }
}