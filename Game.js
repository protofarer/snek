import CONSTANTS from './Constants'
import Panel from './Panel'
// import EndDialog from './components-canvas/EndDialog'

export default class Game {
  constructor (container, debugGame=false) {
    this.container = container

    this.debugGame = debugGame
    this.debugDiscPositionMarker = ''

    this.debugState = {
      isCycleClockDrawn: false,
    }

    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)


    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    this.board = this.debugGame
      ? CONSTANTS.BOARD_INIT_DEBUG
      : CONSTANTS.BOARD_INIT_PROD
    
    this.msg = ''
    this.turnCount = 1
    this.phase = CONSTANTS.PHASE_PLAY    // new, playing, end

    // this.endDialog = new EndDialog(this)

    this.panel = new Panel()
    this.container.appendChild(this.panel.panelContainer)

    // trigger steppers from components: may include draw and other forcing functions
    this.substeps = []
    this.panel.init(this)

    this.cyclicFrame = 0
  }

  addToStep(substep) {
    this.substeps.push(substep)
  }

  step() {
    this.cyclicFrame = this.cyclicFrame === 60 ? 0 : this.cyclicFrame + 1
    this.drawAll()
    // this.checkEndCondition()
    // this.turnCount++
    this.substeps.forEach(substep => substep.step())
  }

  checkEndCondition() {
    console.log('IN checkEndCondition()')
  }

  end() {
    // exec end game phase
    console.log(`IN end()`, )
    // this.endDialog.show()
  }

  clr() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  // TODO add to debugGUI
  drawGameCycle() {
    if (this.debugState.isCycleClockDrawn) {
      this.ctx.beginPath()
      this.ctx.moveTo(30, 5)
      this.ctx.lineTo(30, 10)

      if (this.cyclicFrame > 0 && this.cyclicFrame < 5){
        this.ctx.moveTo(55, 30)
        this.ctx.arc(30, 30, 25, 0, 2 * Math.PI)
      }
  
      this.ctx.save()
      this.ctx.translate(30, 30)
      this.ctx.moveTo(0,0)
      this.ctx.rotate((this.cyclicFrame * 2 * Math.PI / 60) - 0.5 * Math.PI)
      this.ctx.lineTo(20,0)
      this.ctx.lineWidth = 3
      this.ctx.strokeStyle = 'red'
      this.ctx.stroke()
      this.ctx.restore()
    }
  }

  drawAll() {
    this.drawGameCycle()
    // this.panel.draw()
  }
}