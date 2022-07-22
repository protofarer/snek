import CONSTANTS from './Constants'
import World from './ents/World'
import Ant from './swallowables/Ant'
import Centipede from './ents/Centipede'
import Panel from './Panel'
import Apple from './swallowables/Apple'
import Pebble from './swallowables/Pebble'
import Snek from './ents/Snek'
import Clock from './utils/Clock'

export default class Game {
  typename = 'game'
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

    window.sessionStorage.getItem('isDebugOn') === 'false' && this.initSpawn()
  }

  addMob(mob) {
    // id?
    this.mobs.push(mob)
  }

  addImmob(immob) {
    immob.parentEnt = this
    this.immobs.push(immob)
  }

  addFunctionToStep(f) {
    this.stepFunctions.push(f)
  }

  seamlessMove(mob) {
    if (mob.state.headCoords.x > this.canvas.width) {
      mob.state.headCoords.x = 0
    } else if (mob.state.headCoords.x <= 0) {
      mob.state.headCoords.x = this.canvas.width
    }

    if (mob.state.headCoords.y > this.canvas.height) {
      mob.state.headCoords.y = 0
    } else if (mob.state.headCoords.y <= 0) {
      mob.state.headCoords.y = this.canvas.height
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
    this.addImmob(new Apple(this.ctx, null, this))
    // this.spawnFieldOfImmob('apple', 9)
    // this.spawnFieldOfImmob('pebble', 9)
    // this.mobs.push(new Centipede(this.ctx, {x:50, y:50}, this))
    // for(let i = 0; i < 8; i++) {
    //   this.mobs.push(new Ant(
    //     this.ctx, 
    //     { 
    //       x:Math.random()*this.canvas.width, 
    //       y:Math.random()*this.canvas.height
    //     }, 
    //     this
    //   ))
    // }
  }

  spawnFieldOfImmob(typename, n) {
    for(let i = 0; i < n; i++) {
      switch(typename) {
        case 'apple':
          this.immobs.push(new Apple(
            this.ctx,
            { 
              x: Math.random()*this.canvas.width, 
              y: Math.random()*this.canvas.height 
            },
            this,
          ))
          break
        case 'pebble':
          this.immobs.push(new Pebble(
            this.ctx,
            { 
              x: Math.random()*this.canvas.width, 
              y: Math.random()*this.canvas.height 
            },
            this,
          ))
          break
        default:
          console.log('createFieldOf defaulted')
      }
    }
  }

  step() {
    // ! seems problematic
    this.clock.step()
    this.world.step()

    this.snek.step()
    this.seamlessMove(this.snek)

    this.mobs.forEach(m => {
      m.step()
      this.seamlessMove(m)
    })

    this.immobs.forEach(immob => immob.step())
    this.immobs.forEach(immob => {
    
      const isContacting = this.isContactingMouth(
        this.snek.state.getMouthCoords(), 
        immob.hitArea)

      if (isContacting) {
        if (this.snek.swallowables.includes(immob.typename)) {
          this.snek.swallow(immob)
          this.snek.state.exp++
          this.state.score++
        }
      }
    })
    this.immobs = this.immobs.filter(i => i.parentEnt.typename === 'game')


    // TODO make more efficient... ensure all obj get moved to proper parent and parent tracking list
    this.mobs.forEach( 
      mob => {
        const isContacting = this.isContactingMouth(
          this.snek.state.getMouthCoords(), 
          mob.hitArea)
        if (isContacting) {
          if (this.snek.swallowables.includes(mob.typename)) {
            this.snek.swallow(mob)
            this.snek.state.exp++
            this.state.score++
          }
        }
      }
    )
    this.mobs = this.mobs.filter(mob => mob.parentEnt.typename === 'game')

    this.panel.step()
    this.stepFunctions.forEach(f => f())
  }
}