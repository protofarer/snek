import CONSTANTS from './Constants'
import Clock from './utils/Clock'
import World from './ents/World'
import Panel from './Panel'

import Snek from './mobs/Snek'
import Centipede from './mobs/Centipede'
import Ant from './mobs/Ant'

import Apple from './immobs/Apple'
import Mango from './immobs/Mango'
import Pebble from './immobs/Pebble'

export default class Game {
  species = 'game'
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
      // * capped at 1 on test slider because of how it divides the elapsed time 't' from draw= {
      speed: 1,
    }

    this.snek = null

    this.world = new World(this.ctx, this),
    this.clock = new Clock(this.ctx, this)

    this.mobs = []
    this.immobs = []

    // Step code not belonging to entity
    this.stepFunctions = []

    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)

    const isDebugOn = window.sessionStorage.getItem('isDebugOn') 
    if (isDebugOn === 'false' || isDebugOn === null) {
      this.initSpawn()
    }
  }

  addFunctionToStep(f) {
    this.stepFunctions.push(f)
  }

  seamlessMove(mob) {
    if (mob.state.position.x > this.canvas.width) {
      mob.state.position.x = 0
    } else if (mob.state.position.x <= 0) {
      mob.state.position.x = this.canvas.width
    }

    if (mob.state.position.y > this.canvas.height) {
      mob.state.position.y = 0
    } else if (mob.state.position.y <= 0) {
      mob.state.position.y = this.canvas.height
    }
  }

  isContactingMouth(mouthCoords, objHitArea) {
    return this.ctx.isPointInPath(objHitArea, mouthCoords.x, mouthCoords.y)
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

  initSpawn() {
    this.snek = new Snek(this.ctx, null, this)

    this.spawnEnts(Apple, 15)
    this.spawnEnts(Pebble, 55)
    this.spawnEnts(Ant, 25)
    this.spawnEnts(Mango, 3)

    this.mobs.push(new Centipede(this.ctx, {x:50, y:50}, this))
  }

  spawnEnts(classObj, n=1, position=null) {
    const entGroup = classObj.entGroup === 'mob' ? this.mobs : this.immobs
    
    for(let i = 0; i < n; i++) {
      entGroup.push(new classObj(
        this.ctx, 
        {
          x:Math.random()*this.canvas.width,
          y:Math.random()*this.canvas.height
        },
        this
      ))
    }
    // entGroup.push(new Apple(this.ctx, null, this))
  }

  step() {
    this.clock.step()
    this.world.step()

    this.seamlessMove(this.snek)
    this.snek.step()

    this.mobs.forEach(m => {
      m.step()
      this.seamlessMove(m)
    })

    this.immobs.forEach(immob => {
      immob.step()

      const isContacting = this.isContactingMouth(
        this.snek.state.getMouthCoords(), 
        immob.hitArea
      )

      if (isContacting) {
        if (this.snek.swallowables.includes(immob.species)) {
          this.snek.swallow(immob)
          this.snek.state.exp++
          this.state.score++
        }
      }
    })
    this.immobs = this.immobs.filter(i => i.parentEnt.species === 'game')


    // TODO make more efficient... ensure all obj get moved to proper parent and parent tracking list
    
    this.mobs.forEach( 
      mob => {
        const isContacting = this.isContactingMouth(
          this.snek.state.getMouthCoords(), 
          mob.hitArea)
        if (isContacting) {
          if (this.snek.swallowables.includes(mob.species)) {
            this.snek.swallow(mob)
            this.snek.state.exp++
            this.state.score++
          }
        }
      }
    )
    this.mobs = this.mobs.filter(mob => mob.parentEnt.species === 'game')

    this.panel.step()
    this.stepFunctions.forEach(f => f())
  }
}