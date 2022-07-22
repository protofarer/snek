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

    // * Related to normal game flow and info directly relevant to player
    this.state = {
      msg: '',
      phase: CONSTANTS.PHASE_PLAY,
      score: 0,
    }

    // * Adjustable parameters for testing design, performance, and debugging
    this.params = {
      speed: 1,
    }

    this.ents = {}

    // Step code not belonging to entity
    this.stepFunctions = []

    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)
  }
  // Entites are important, feature-full objects that are
  //  highly interactive with each other
  addEnt(ent, name=null) {
    this.ents[name ?? ent.name ?? 'noName'] = ent
    name === 'snek' && console.log(`snek mouf`, ent.state.getMouthCoords() )
    ent.parentEnt = this
  }

  addFunctionToStep(f) {
    this.stepFunctions.push(f)
  }

  step() {
    this.stepFunctions.forEach(f => f())

    this.ents.world.objects.apples.forEach( 
      apple => {
        if (!apple.isEaten) {
          if (this.isContactingMouth(
            this.ents.snek.state.getMouthCoords(), 
            apple.perimeter
          )) {
            this.ents.snek.consume(apple)
            this.ents.snek.state.exp++
            this.state.score++
            apple.getEaten()
          }
        }
      }
    )

    // ! seems problematic
    for(const ent of Object.values(this.ents)) {
      ent?.step?.()
    }
    this.panel.step()
  }
  
  isContactingMouth(mouthCoords, objPerimeter) {
    return this.ctx.isPointInPath(objPerimeter, mouthCoords.x, mouthCoords.y)
  }

  checkEndCondition() {
    console.log('IN checkEndCondition()')
  }

  end() {
    console.log(`Ending game...`, )
  }

  clr() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}