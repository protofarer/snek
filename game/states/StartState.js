import BaseState from './BaseState'
import ModalButton from '../../components-canvas/ModalButton'

export class StartState extends BaseState {
  modes = ['Normal', 'Survival']
  mode = 0
  stateName = 'start'

  constructor(game) {
    super()
    this.game = game
    this.game.panel.panelContainer.style.setProperty('visibility', 'hidden')

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
          if (this.modes[this.mode] === 'Survival') {
            this.game.stateMachine.change('playSurvival', {
              level: 's',
              score: 0
            })
          } else if (this.modes[this.mode] === 'Normal') {
            this.game.stateMachine.change('playNormal', {
              level: 1,
              score: 0
            })
          }
          break
      }
    }
    document.addEventListener('keydown', this.handleKeyDown)

    this.normalButt = new ModalButton(
      this.game.ctx,
      {
        origin: { x: 25, y: 25 },
        base: { w: 125, },
        label: 'Normal Mode',
      },
      () => {
        this.game.stateMachine.change('playNormal', {
          level: 1,
          score: 0
        })
      },
    )
    this.normalButt.show()

    this.survivalButt = new ModalButton(
      this.game.ctx,
      {
        origin: { x: 25, y: 105 },
        base: { w: 125, },
        label: 'Survival Mode',
      },
      () => {
        this.game.stateMachine.change('playSurvival', {
          score: 0
        })
      },
    )
    this.survivalButt.show()
  }

  update() {
  }

  render() {
    this.game.ctx.save()
    this.game.ctx.beginPath()
    this.game.ctx.fillStyle = 'hsla(135, 70%, 35%, 1)'
    this.game.ctx.fillRect(
      0, 0, 
      this.game.canvas.width, this.game.canvas.height
    )

    this.normalButt.render()
    this.survivalButt.render()

    // draw game modes
    // this.game.ctx.translate(
    //   this.game.canvas.width / 3, 
    //   this.game.canvas.height / 3
    // )
    // this.game.ctx.font = 'bold 20px Arial'
    // this.game.ctx.fillStyle = 'black'

    // for (let i = 0; i < this.modes.length; ++i) {
    //   this.game.ctx.fillText(
    //     `${this.modes[i]}`,
    //     0, i * 100
    //   )
    //   if (i === this.mode) {
    //     this.game.ctx.strokeRect(0 - 15, i * 100 - 25, 120, 35)
    //   }
    // }
    this.game.ctx.restore()
  }

  exit() {
    document.removeEventListener('keydown', this.handleKeyDown)
    this.game.panel.panelContainer.style.setProperty('visibility', 'visible')
  }
}