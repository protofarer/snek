import BaseState from './BaseState'
import Snek from '../ents/mobs/Snek'
import ModalButton from '../../components-canvas/ModalButton'
import { recycle } from '../utils/helpers'

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

    // const normalButtData = {
    //   origin: { 
    //     x: this.game.canvas.width * 0.35, 
    //     y: this.game.canvas.height * 0.35, 
    //   },
    //   base: { w: 125, },
    //   label: 'Normal Mode',
    // }
    // this.normalButt = new ModalButton(
    //   null
    //   this.game.ctx,
    //   normalButtData,
    //   () => this.game.stateMachine.change('playNormal', {
    //     level: 1,
    //     score: 0
    //   }),
    //   { once: true }
    // )
    // this.normalButt.show()

    const survivalButtData = {
      origin: { 
        x: this.game.canvas.width * 0.35, 
        y: this.game.canvas.height * 0.45, 
      },
      base: { w: 125, },
      label: 'Survival Mode',
    }
    this.survivalButt = new ModalButton(
      null,
      this.game.ctx,
      survivalButtData,
      () => this.game.stateMachine.change('playSurvival', {
        score: 0
      }),
      { once: true }
    )
    this.survivalButt.show()

    // this.snek = new Snek(this.game.ctx, {x: 90, y: 300}, this.game, 40)
    // this.snek.currTurnRate = 1
    // this.game.setSnek(this.snek)
    // this.apple1 = this.game.world.addEnt('apple').position = { x: 200, y: 225 }
    // this.apple2 = this.game.world.addEnt('apple').position = { x: 200, y: 345 }
  }

  update() {
    // this.game.world.update()
    // console.log(this.snek.position.x, this.snek.position.y)
    // this.snek.turnRight()
  }

  render() {
    this.game.ctx.beginPath()
    this.game.ctx.fillStyle = 'hsla(135, 70%, 35%)'
    this.game.ctx.fillRect(
      0, 0, 
      this.game.canvas.width, this.game.canvas.height
    )

    // this.normalButt.render()
    this.survivalButt.render()
    this.game.ctx.font = '16px Arial'
    this.game.ctx.fillStyle = 'darkred'
    this.game.ctx.fillText('- works only in portrait orientation', 55, 100)
    this.game.ctx.fillText('- A for left, D for right on desktop', 55, 125)
    this.game.ctx.font = '12px Mono'
    this.game.ctx.fillText('pre-alpha v0.l.0, survival prototype', 10, 550)
    this.game.world.render()
  }

  exit() {
    document.removeEventListener('keydown', this.handleKeyDown)

    // recycle(this.snek)
    // recycle(this.apple1)
    // recycle(this.apple2)

    // ! TODO removeEventListener in class Button not working as intended
    // this.normalButt.removeClickListener()
    this.survivalButt.removeClickListener()
    // ! workaround
    // this.normalButt.path = new Path2D()
    this.survivalButt.path = new Path2D()
    this.game.panel.panelContainer.style.setProperty('visibility', 'visible')
  }
}