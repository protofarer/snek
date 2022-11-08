import BaseState from './BaseState'
import Snek from '../mobs/Snek'

export default class StartState extends BaseState {
  modes = ['Normal', 'Survival']
  mode = 0

  constructor(game) {
    super()
    this.game = game

    // TODO adapt to whether user is on mobile or desktop
    this.handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          this.mode = (++this.mode) % this.modes.length
          break
        case 'ArrowUp':
          this.mode = (
              --this.mode < 0 ? this.modes.length - 1 : this.mode
            ) % this.modes.length
          break
        case 'Enter':
          this.game.mode = this.modes[this.mode]
          this.game.stateMachine.change('play', {
            mode: this.modes[this.mode],
            snek: new Snek(this.game.ctx),
            level: 0
          })
          break
      }
    }
    document.addEventListener('keydown', this.handleKeyDown)
  }

  update() {

  }

  render() {
    this.game.ctx.save()
    this.game.ctx.beginPath()
    this.game.ctx.fillStyle = 'hsla(0, 0%, 100%, 1)'
    this.game.ctx.fillRect(
      0, 0, 
      this.game.canvas.width, this.game.canvas.height
    )

    // draw game modes
    this.game.ctx.translate(
      this.game.canvas.width / 3, 
      this.game.canvas.height / 3
    )
    this.game.ctx.font = 'bold 20px Arial'
    this.game.ctx.fillStyle = 'black'

    for (let i = 0; i < this.modes.length; ++i) {
      this.game.ctx.fillText(
        `${this.modes[i]}`,
        0, i * 100
      )
      if (i === this.mode) {
        this.game.ctx.strokeRect(0 - 15, i * 100 - 25, 120, 35)
      }
    }
    this.game.ctx.restore()
  }

  exit() {
    // TODO disable touch eventlisteners
    document.removeEventListener('keydown', this.handleKeyDown)
  }
}