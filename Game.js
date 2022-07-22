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

    this.ents = {
    }

    // Step code not belonging to entity
    this.stepFunctions = []

    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)
  }

  // Entites are important, feature-full objects that are
  //  highly interactive with each other
  addEnt(ent, name=null) {
    let entName
    if (name) {
      entName = name
    } else if (ent.name !== '' && ent.name) {
      entName = ent.name
    } else {
      console.log('bad ent', ent)
      throw new Error('no name assigned in game.addEnt for obj')
    }

    this.ents[entName] = ent
    ent.parentEnt = this
  }

  addFunctionToStep(f) {
    this.stepFunctions.push(f)
  }

  step() {
    this.stepFunctions.forEach(f => f())

    if (this.ents.snek.state.headCoords.x > this.canvas.width) {
      this.ents.snek.state.headCoords.x = 0
    } else if (this.ents.snek.state.headCoords.x <= 0) {
      this.ents.snek.state.headCoords.x = this.canvas.width
    }

    if (this.ents.snek.state.headCoords.y > this.canvas.height) {
      this.ents.snek.state.headCoords.y = 0
    } else if (this.ents.snek.state.headCoords.y <= 0) {
      this.ents.snek.state.headCoords.y = this.canvas.height
    }
    this.ents.world.fieldEnts.forEach( 
      fieldEnt => {
        if (!fieldEnt.isSwallowed) {
          if (this.isContactingMouth(
            this.ents.snek.state.getMouthCoords(), 
            fieldEnt.perimeter
          )) {
            this.ents.snek.swallow(fieldEnt)
            this.ents.snek.state.exp++
            this.state.score++
            fieldEnt.getSwallowed()
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