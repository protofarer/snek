import BaseState from './BaseState'
import ModalButton from '../../components-canvas/ModalButton'
import Constants from '../Constants.js'

export class StartState extends BaseState {
  modes = [
    'Survival', 
    'Test', 
    // 'Normal'
  ]
  mode = 0
  stateName = 'start'

  constructor(game) {
    super()
    this.game = game
    this.game.panel.panelContainer.style.setProperty('visibility', 'hidden')
    this.game.sounds.melody1.currentTime = 0
    this.game.sounds.melody1.play()

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
            this.game.stateMachine.change('playSurvival')
          } 
          // else if (this.modes[this.mode] === 'Normal') {
          //   this.game.stateMachine.change('playNormal', {
          //     level: 1,
          //   })
          // }
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
    //   }),
    //   { once: true }
    // )
    // this.normalButt.show()

    const survivalButtData = {
      origin: { 
        x: this.game.canvas.width * 0.35, 
        y: this.game.canvas.height * 0.4444
      },
      base: { w: 125, },
      label: 'Survival Mode',
    }
    this.survivalButt = new ModalButton(
      null,
      this.game.ctx,
      survivalButtData,
      () => this.game.stateMachine.change('playSurvival', {
      }),
      { once: true }
    )
    this.survivalButt.show()

    const testButtData = {
      origin: { 
        x: this.game.canvas.width * 0.35, 
        y: this.game.canvas.height * 0.55, 
      },
      base: { w: 125, },
      label: 'Test: kade data',
    }

    // this.testButt = new ModalButton(
    //   null,
    //   this.game.ctx,
    //   testButtData,
    //   testAction,
    //   // () => this.game.stateMachine.change('playTest', {
    //   // }),
    //   { once: true }
    // )
    // this.testButt.show()

    this.game.touchAreaContainer.style.display = 'none'
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    })
    this.appMode = params.mode
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

    // show left and right touch control areas
    this.game.ctx.strokeStyle = 'hsl(240,50%,50%)'
    const linewidth = 4
    this.game.ctx.lineWidth = linewidth
    this.game.ctx.strokeRect(linewidth/2, linewidth/2, (this.game.canvas.width / 2) - (linewidth/ 2), this.game.canvas.height - (linewidth))
    this.game.ctx.strokeRect((this.game.canvas.width / 2) + (linewidth/2), linewidth/2, (this.game.canvas.width/2) - (linewidth), this.game.canvas.height - (linewidth))

    this.game.ctx.font = '16px Arial'
    this.game.ctx.fillStyle = 'darkred'

    this.game.ctx.fillText('HOLD LEFT AREA', 10, 125)
    this.game.ctx.fillText('TO TURN LEFT', 10, 140)
    this.game.ctx.fillText('HOLD RIGHT AREA', 215, 125)
    this.game.ctx.fillText('TO TURN RIGHT', 215, 140)


    // this.normalButt.render()
    this.survivalButt.render()
    // this.testButt.render()

    const yInstructions = 420
    const xInstructions = 30
    this.game.ctx.fillStyle = 'darkred'
    this.game.ctx.fillText('portrait orientation only',xInstructions,yInstructions )
    this.game.ctx.fillText('A: turn left',xInstructions , yInstructions + 25)
    this.game.ctx.fillText('D: turn right',xInstructions, yInstructions + 50)
    this.game.ctx.fillText('<space>: action',xInstructions, yInstructions + 75)

    this.game.ctx.font = '10px Mono'
    const xFooter = 10
    const yFooter = 540
    this.game.ctx.fillText(`app mode: ${this.appMode}`, xFooter, yFooter)
    this.game.ctx.fillText(`prototype v${import.meta.env.VITE_APP_VERSION}: ${Constants.VERSION_DESCRIPTION}`, xFooter, yFooter + 15)
    this.game.ctx.fillText(
      `created by Kenny Baron @ kennybaron.net 2022-${new Date().getFullYear()}`, 
      xFooter, yFooter + 30
    )

    this.game.world.render()
  }

  exit() {
    this.game.sounds.melody1.pause()
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
    this.game.touchAreaContainer.style.display = 'flex'
    // this.game.rightTouchArea.style.visibility = 'hidden'
    // this.game.leftTouchArea.style.visibility = 'hidden'
  }
}