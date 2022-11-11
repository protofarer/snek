import ModalButton from '../../components-canvas/ModalButton'
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

    // summary stats
    this.summary = [
      ['exp', this.data.snek.currExp],
      ['level', this.data.snek.level],
      ['lifeSpan', `${Math.trunc(this.data.snek.lifeSpan / 1000)}s`],
      ['score', this.data.score],
    ]

    // TODO objects stats

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
      { size: 16, family: 'Arial', weight: 'bold' },
      { x: 55, y: 25 },
      this.data.isVictory ? 'Snek! flourishes!' : 'Snek got squashed!', 
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
      this.game.ctx.fillStyle = 'hsla(220, 50%, 55%, 0.85)'
      this.game.ctx.fillRect(0, 0, this.size.w, this.size.h)

      this.animatedHeadline()

      this.game.ctx.translate(0, 50)
      for (let i = 0; i < this.summary.length; ++i) {
        this.drawText({ x: 10, y: 15 * i }, `${this.summary[i][0]}: ${this.summary[i][1]}`)
      }

      this.game.ctx.restore()
    } else {
      console.log(`Attempted to draw EndDialog while isShown=false`, )
    }
  }
}