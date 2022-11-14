import ModalButton from '../../components-canvas/ModalButton'
import { animatedTextLine } from '../utils/colormorph'

export default class SnekEndDialog {
  // Stops and Starts the play loop
  // CSDR removing start stop and letting draw run in background
  // for simplicity sake, after playing with this approach
  isShown = false

  constructor(game, data) {
    this.game = game
    
    this.data = data

    // summary stats
    this.summary = [
      ['level', this.data.snek.level],
      ['experience', Math.trunc(this.data.snek.totalExpGained)],
      ['lifeSpan', `${Math.trunc(this.data.snek.lifeSpan / 1000)}s`],
      ['score', this.data.score],
    ]

    this.size = {
      w: this.game.canvas.width * 0.8,
      h: this.game.canvas.height * 0.75
    }

    const x = this.game.canvas.width * 0.1
    const y = this.game.canvas.height * 0.1
    this.origin = { x, y }

    this.pos = {
      top: 0,
      left: 0,
      right: this.origin.x + this.size.w,
      bottom: this.origin.y + this.size.h
    }

    const newGameButtonData = {
      origin: {
        x: this.size.w * 0.5 - 65,
        y: this.size.h * 0.5,
      },
      label: 'New Game  ',
      base: {
        w: 100
      },
      name: 'ED-startMenu',
      offset: { x: this.origin.x , y: this.origin.y }
    }

    this.newGameButton = new ModalButton(
      this.origin,
      this.game.ctx,
      newGameButtonData,
      () => this.game.resetGame(this.game.isDebugOn),
      { once: true},
    )
    this.newGameButton.show()
    console.log(`topleft newGameButt: ${this.newGameButton.origin.x - 2},${this.newGameButton.origin.y - 2}`, )
    console.log(`newGameButt parentOrigin:${this.origin.x}=${this.newGameButton.parentOrigin.x}`, )
    

    this.animatedHeadline = animatedTextLine(
      this.game.ctx,
      { size: 16, family: 'Arial', weight: 'bold' },
      { x: 15, y: 25 },
      this.data.isVictory ? 'Sssnek WINSSSS!' : 'Sssnek got sssquished!', 
    )
  }

  hide() {
    // This Modal Dialog must stop drawing when in a hidden state 
    this.isShown = false
  }

  show() {
    // This Modal Dialog start drawing in shown state 
    // (setup as needed)
    if (this.data?.isVictory) {
      // this.game.play.playRandomVictorySound()
    } else {
      // TODO play lose audio
      // this.game.sounds.draw[0].currentTime = 0
      // this.game.sounds.draw[0].play()
    }
    this.isShown = true
    this.render()
    this.newGameButton.show()
  }

  drawText(offset, text) {
    this.game.ctx.font = '16px Arial'
    this.game.ctx.fillStyle = 'white'
    this.game.ctx.fillText(text, offset.x, offset.y)
  }

  render() {
    if (this.isShown) {
      this.game.ctx.save()
      this.game.ctx.translate(this.origin.x, this.origin.y)

      this.game.ctx.beginPath()
      this.game.ctx.fillStyle = 'hsla(220, 70%, 65%, .75)'
      this.game.ctx.fillRect(0, 0, this.size.w, this.size.h)

      this.animatedHeadline()

      this.game.ctx.save()
      this.game.ctx.translate(0, 70)
      for (let i = 0; i < this.summary.length; ++i) {
        this.drawText({ x: this.origin.x + 75, y: 18 * i }, `${this.summary[i][0]}: ${this.summary[i][1]}`)
      }
      this.game.ctx.restore()

      this.newGameButton.render()

      this.game.ctx.restore()

    } else {
      console.log(`Attempted to draw EndDialog while isShown=false`, )
    }
  }
}