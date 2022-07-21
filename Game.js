import CONSTANTS from './Constants'
import Panel from './Panel'

export default class Game {
  constructor (container) {
    this.container = container

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

  drawAll() {
    // this.panel.draw()
  }
}