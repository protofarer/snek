import ModalButton from './ModalButton'
import { animatedTextLine } from '../utils/colormorph'

export default class SnekEndDialog {
  // Stops and Starts the play loop
  // CSDR removing start stop and letting draw run in background
  // for simplicity sake, after playing with this approach
  level
  score
  lifeSpan
  snek
  isVictory

  constructor(game, data) {
    this.game = game
    this.data = data

    this.isShown = false
    this.modalChildren = []

    this.size = {
      w: this.game.canvas.width * 0.8,
      h: this.game.canvas.height * 0.75
    }

    // coord of origin of dialog container relative to canvas origin
    this.offset = {
      x: this.game.canvas.width * 0.1,
      y: this.game.canvas.height * 0.1,      
    }

    this.pos = {
      top: 0,
      left: 0,
      right: this.offset.x + this.size.w,
      bottom: this.offset.y + this.size.h
    }

    // **********************************************************************
    // ******************** Start Menu Button
    // **********************************************************************
    const startMenuButtonData = {
      origin: {
        x: 50,
        y: 50,
      },
      label: 'Start Menu',
      base: {
        w: 100
      },
      name: 'ED-startMenu',
    }

    this.startMenuButton = new ModalButton(
      this.game.ctx,
      startMenuButtonData,
      this.offset,
      // TODO goto start menu... refersh
      this.game.stateMachine.change('start'),
      { once: true},
    )

    this.modalChildren.push(this.startMenuButton)

    // Start this and its children initialize hidden
    this.hide()
    this.animatedHeadline = animatedTextLine(
      this.game.ctx,
      'Snek! flourishes!', 
      { x: 0, y: 15 }
    )
  }

  hide() {
    // This Modal Dialog must stop drawing when in a hidden state 
    this.isShown = false
    this.modalChildren.forEach(c => {
      c.isShown && c.hide()
    })
  }

  show() {
    // This Modal Dialog start drawing in shown state 
    // (setup as needed)
    if (this.data?.isVictory) {
      this.game.play.playRandomVictorySound()
    } else {
      // TODO play lose audio
      // this.game.sounds.draw[0].currentTime = 0
      // this.game.sounds.draw[0].play()
    }
    this.isShown = true
    this.render()
  }

  drawText() {
    this.game.ctx.font = '12px Arial'
    this.game.ctx.fillStyle = 'black'
    this.game.ctx.fillText(
      `${this.data.isVictory
            ? 'Snek Flourished!'
            : 'Snek Perished!'
        }`,
      55, 55
    )
  }

  render() {
    if (this.isShown) {
      this.game.ctx.save()
      this.game.ctx.translate(this.offset.x, this.offset.y)

      this.game.ctx.beginPath()
      this.game.ctx.fillStyle = 'hsla(220, 50%, 55%, 0.85)'
      this.game.ctx.fillRect(0, 0, this.size.w, this.size.h)

      this.drawText()
      this.animatedHeadline()

      this.game.ctx.restore()
    } else {
      console.log(`Attempted to draw EndDialog while isShown=false`, )
    }
  }
}