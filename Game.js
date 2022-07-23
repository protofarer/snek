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
import Entity from './Entity'

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

    this.spawnEnts(Apple, 30)
    this.spawnEnts(Pebble, 85)
    this.spawnEnts(Ant, 25)
    this.spawnEnts(Centipede, 2)
    // this.spawnEnts(Mango, 50)

    this.world.randomSpawns()

  }

  addEnt(entClass) {
    const ent = new entClass(
      this.ctx, 
      {
        x: 400,
        y: 400,
      }, 
      this
    )
    
    const bigEnt = new Entity(ent)
    
    ent.state.position.y -= 40 * bigEnt.id
    ent.state.directionAngle = -90
    ent.state.mobile = false
    return ent
  }

  spawnEnts(entClass, n=1, position=null) {
    const ents = []
    for(let i = 0; i < n; i++) {
      const ent = new entClass(
        this.ctx, 
        position || 
        {
          x:Math.random()*this.canvas.width,
          y:Math.random()*this.canvas.height,
        }, 
        this
      )
      if (ent.entGroup === 'mob') ent.state.directionAngle = Math.random() * 360
      new Entity(ent)
      ents.push(ent)
    }
    return ents
  }

  removeEnt(id) {
    delete Entity.stack[id]
  }

  step() {
    this.clock.step()
    this.world.step()

    this.stepFunctions.forEach(f => f())

    this.snek && this.seamlessMove(this.snek)
    this.snek?.step()

    for(const [id, ent] of Object.entries(Entity.stack)) {
      ent.step()
        if (ent.species === 'ant' && !ent.carriedEnt) {
          let sweets = Entity.bySpecies(['apple', 'mango'])
          for(let [id, sweet] of Object.entries(sweets)) {
            const isContacting = this.isContactingMouth(
              ent.state.getMouthCoords(), 
              sweet.hitArea
            )
            if (isContacting) {
              ent.grab(sweet)
              this.removeEnt(id)
            }
          }
        }
      if (ent.entGroup === 'mob') {
        
        this.seamlessMove(ent)

        if (this.snek) {
          const isContacting = this.isContactingMouth(
            this.snek.state.getMouthCoords(), 
            ent.hitArea)
  
          if (isContacting) {
            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.swallow(ent)
              this.state.score++
              this.removeEnt(id)
            }
          }
        }
      } else if (ent.entGroup === 'immob') {

        if (this.snek) {
          const isContacting = this.isContactingMouth(
            this.snek.state.getMouthCoords(), 
            ent.hitArea
          )
          if (isContacting) {
            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.swallow(ent)
              this.state.score++
              this.removeEnt(id)
            }
          }
        }
      }
      this.panel.step()
    }
  }
}