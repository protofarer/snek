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
      ['exp', Math.trunc(this.data.snek.currExp)],
      ['level', this.data.snek.level],
      ['lifeSpan', `${Math.trunc(this.data.snek.lifeSpan / 1000)}s`],
      ['score', this.data.score],
    ]

    this.size = {
      w: this.game.canvas.width * 0.8,
      h: this.game.canvas.height * 0.75
    }

    // coord of origin of dialog container relative to canvas origin
    const x = this.game.canvas.width * 0.1
    const y = this.game.canvas.height * 0.1
    this.offset = {
      x: x,
      y: y,
    }

    this.pos = {
      top: 0,
      left: 0,
      right: this.offset.x + this.size.w,
      bottom: this.offset.y + this.size.h
    }

    const startMenuButtonData = {
      origin: {
        x: this.game.canvas.width * 0.35,
        y: this.game.canvas.height * 0.5,
      },
      label: 'Start Menu',
      base: {
        w: 100
      },
      name: 'ED-startMenu',
      offset: { x, y }
    }

    this.startMenuButton = new ModalButton(
      this.game.ctx,
      startMenuButtonData,
      this.game.resetGame,
      { once: true},
    )

    this.animatedHeadline = animatedTextLine(
      this.game.ctx,
      { size: 16, family: 'Arial', weight: 'bold' },
      { x: 55, y: 25 },
      this.data.isVictory ? 'Snek! flourishes!' : 'Snek got squashed!', 
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
    this.startMenuButton.show()
  }

  drawText(offset, text) {
    this.game.ctx.font = '12px Arial'
    this.game.ctx.fillStyle = 'black'
    this.game.ctx.fillText(text, offset.x, offset.y)
  }

  render() {
    if (this.isShown) {
      this.game.ctx.save()
      this.game.ctx.translate(this.offset.x, this.offset.y)

      this.game.ctx.beginPath()
      this.game.ctx.fillStyle = 'hsla(220, 50%, 65%, .85)'
      this.game.ctx.fillRect(0, 0, this.size.w, this.size.h)

      this.animatedHeadline()

      this.game.ctx.translate(0, 50)
      for (let i = 0; i < this.summary.length; ++i) {
        this.drawText({ x: 10, y: 15 * i }, `${this.summary[i][0]}: ${this.summary[i][1]}`)
      }

      this.game.ctx.restore()
      this.startMenuButton.render()
    } else {
      console.log(`Attempted to draw EndDialog while isShown=false`, )
    }
  }
}