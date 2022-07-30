import CONSTANTS from './Constants'
import Audio from './audio'
import Clock from './utils/Clock'
import World from './World'
import Panel from './Panel'

import Snek from './mobs/Snek'
import Centipede from './mobs/Centipede'
import Ant from './mobs/Ant'

import Apple from './immobs/Apple'
import Mango from './immobs/Mango'
import Pebble from './immobs/Pebble'
import Poop from './immobs/Poop'
import Background from './Background'
import Entity from './Entity'
import { moveEdgeWrap } from './behaviors'

export default class Game {
  species = 'game'

  // * Related to normal game flow and info directly relevant to player
  msg = ''
  phase = CONSTANTS.PHASE_PLAY
  score = 0

  constructor (container) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    // * Adjustable parameters for testing design, performance, and debugging
    this.params = {
      // * capped at 1 on test slider because of how it divides the elapsed time 't' from draw= {
      speed: 1,
      pauseInterval: 1000
    }

    this.snek = null
    this.mobs = []
    this.immobs = []

    new Background(container, 'hsl(51, 50%, 20%)')
    this.world = new World(this.ctx, this),
    this.clock = new Clock(this.ctx, this)
    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)

    const Sounds = Audio()
    this.play = Sounds.play

    const isDebugOn = window.sessionStorage.getItem('isDebugOn') 
    if (isDebugOn === 'false' || isDebugOn === null) {
      this.initSpawn()
    }
  }

  isContactingMouth(objHitArea, mouthCoords) {
    return this.ctx.isPointInPath(objHitArea, mouthCoords.x, mouthCoords.y)
  }

  checkEndCondition() {
    // Set game.phase to PHASE_END conditionally
    console.log('IN checkEndCondition()')
  }

  end() {
    console.log(`Ending game...`, )
  }

  clr() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  resetGame(toDebug=false) {
    const currURL = new URL(window.location.href)
    if (import.meta.env.DEV) {
      window.sessionStorage.setItem('isDebugOn', toDebug)
    }
    location.replace(currURL.toString())
    location.reload()
  }

  addEnt(entClass, position=null) {
    const ent = new entClass(
      this.ctx, 
      {
        x: position?.x || 170,
        y: position?.y || 400,
      }, 
      this
    )
    
    const bigEnt = new Entity(ent)
    
    if (!position) {
      ent.position.x += (50 * bigEnt.id)
    }
    ent.isMobile = false
    // * Handle setting hit area when position arg specified since immobs
    //  only set it only once at instantiation
    if (entClass.entGroup === 'immob') ent.setHitAreas()
    
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

      if (ent.entGroup === 'mob') {
        ent.directionAngleDegrees = Math.random() * 360
      }

      new Entity(ent)
      ents.push(ent)
    }
    
    return ents
  }

  removeEnt(id) {
    delete Entity.stack[id]
  }

  reAddEnt(ent) {
    new Entity(ent)
  }

  render() {
    this.clock.render()
    for(const ent of Object.values(Entity.stack)) {
      if (ent.parentEnt === this) {
        ent.render()
      }
    }
    this.snek?.render()
    this.panel.render()
  }

  update(loopID) {
    // **********************************************************************
    // * 1. Add new objects
    // **********************************************************************
    // this.world.randomSpawns()

    // **********************************************************************
    // * 2. Update all objects
    // **********************************************************************
    this.clock.update()
    this.snek?.update()

    for(const [id, ent] of Object.entries(Entity.stack)) {

      ent.update?.()

      if (ent.species === 'ant' && !ent.carriedEnt) {
        let sweets = Entity.bySpecies(['apple', 'mango'])
        for(let [id, sweet] of Object.entries(sweets)) {
          const isContacting = this.isContactingMouth(
            sweet.hitArea,
            ent.mouthCoords
          )
            
          if (isContacting) {
            ent.grab(sweet)
            this.removeEnt(id)
          }
        }
      }
      if (ent.entGroup === 'mob') {
        
        moveEdgeWrap.call(ent)

        if (this.snek) {
          const isContacting = this.isContactingMouth(
            ent.hitArea,
            this.snek.mouthCoords,
          )
  
          if (isContacting) {
            if (this.snek.swallowables.includes(ent.species)) {
              console.log(`IN game, snek swallow:`, ent.species)
              
              this.snek.swallow(ent)
              this.play.playRandomSwallowSound()
              this.score++
              // this.removeEnt(id)
            }
          }
        } // * DRY
      } else if (ent.entGroup === 'immob') {

        if (this.snek) {
          const isContacting = this.isContactingMouth(
            ent.hitArea,
            this.snek.mouthCoords, 
          )

          if (isContacting) {
            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.swallow(ent)
              this.play.playRandomSwallowSound()
              this.score++
            }
          }
        }
      }
    }
    // **********************************************************************
    // * 3. Update UI
    // **********************************************************************
      // this.panel.updateMsg()

    // * Enter PHASE_END via game.checkEndCondition()
    if (this.phase === CONSTANTS.PHASE_END) {
      cancelAnimationFrame(loopID)
      this.end()
    }
  }

  initSpawn() {
    this.snek = new Snek(this.ctx, null, this)
    this.snek.position = { x: 200, y: 400 }

    this.spawnEnts(Apple, 35)
    this.spawnEnts(Pebble, 55)
    this.spawnEnts(Mango, 5)
    this.spawnEnts(Ant, 25)
    this.spawnEnts(Centipede, 2)

    // this.spawnEnts(Apple, 50)
    // this.spawnEnts(Pebble, 75)
    // this.spawnEnts(Ant, 70)
    // this.spawnEnts(Mango, 25)
    // this.spawnEnts(Centipede, 5)
  }
}