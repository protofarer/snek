import CONSTANTS from './Constants'
import Panel from './Panel'
import { resetGame } from '.'
// import EndDialog from './components-canvas/EndDialog'

export default class Game {
  constructor (container, debugGame=false) {
    this.container = container

    this.debugGame = debugGame

    this.debugState = {
      isCycleClockDrawn: false,
      randomTurns: false,
    }

    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)


    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    this.msg = ''
    this.turnCount = 1
    this.phase = CONSTANTS.PHASE_PLAY    // new, playing, end

    // this.endDialog = new EndDialog(this)

    this.panel = new Panel()
    this.container.appendChild(this.panel.panelContainer)

    // trigger steppers from components: may include draw and other forcing functions
    this.steppables = []

    this.cyclicFrame = 0

    this.steppers = []
    this.entities = {}

    this.gamespeed = 1
    this.panel.init(this)
  }
  // Entites are important, feature-full objects that are
  //  highly interactive with each other
  addEntity(name, ent) {
    this.entities[name] = ent
    name === 'snek' && console.log(`snek mouf`, ent.state.getMouthCoords() )
  }

  // Steppables are things that can step
  addObjectToStep(steppable) {
    this.steppables.push(steppable)
  }


  addFunctionToStep(f) {
    this.steppers.push(f)
  }

  step() {
    this.cyclicFrame = this.cyclicFrame === 60 ? 0 : this.cyclicFrame + 1
    this.drawAll()
    this.steppables.forEach(steppable => steppable.step())
    this.steppers.forEach(stepper => stepper())

    this.entities.world.objects.apples.forEach( 
      apple => {
        if (!apple.isEaten) {
          if (this.isContactingMouth(
            this.entities.snek.state.getMouthCoords(), 
            apple.perimeter
          )) {
            this.entities.snek.consume(apple)
            apple.getEaten()
          }
        }
      }
    )

    if (this.debugGame){
      if (this.entities.snek.state.getMouthCoords().y <= 0) {
        this.entities.snek.state.headCoords = { x: 400, y: 400 }
        resetGame()
      }
      this.entities.world.objects.apples.forEach(
        a => {
          a.isEaten !== true && a.drawHitArea()
        }
      )
      if (this.debugGame.randomTurns) {
        const q = Math.random()
        if (q < 0.25) {
          this.entities.snek.turnLeft()
        } else if (q < 0.50){
          this.entitities.snek.turnRight()
        }
      }
    }

    // this.checkEndCondition()
    // this.turnCount++
  }
  
  isContactingMouth(mouthCoords, objPerimeter) {
    return this.ctx.isPointInPath(objPerimeter, mouthCoords.x, mouthCoords.y)
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