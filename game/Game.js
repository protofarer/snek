import CONSTANTS from './Constants'
import Audio from './audio'
import Clock from './utils/Clock'
import Panel from './Panel'
import Background from './Background'

import Entity from './Entity'
import World from './World'

import Apple from './immobs/Apple'
import Mango from './immobs/Mango'
import Pebble from './immobs/Pebble'

import Snek from './mobs/Snek'
import Centipede from './mobs/Centipede'
import Ant from './mobs/Ant'

import { moveEdgeWrap } from './behaviors/movements'

export default class Game {

  // * Game object is a singleton (or will be) that:
  // * - sets up html containers
  // * - initializes sound, external panel, world objects
  // * - generally invokes objects' update and render functions
  // * - keeps a list of all ents aka entities (interactive objects)
  // * - defines interstitial behavior: defines interaction between objects at the root layer aka world
  // *   - eg collision detection, spawning, world events
  // * - provides ent instantiation via addEnt(test) and spawnEnt(random position/orientation for production)


  constructor (container) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    this.isDebugOn = window.sessionStorage.getItem('isDebugOn') 

    // * Adjustable parameters for testing design, performance, and debugging
    this.params = {
      // speed capped at 1 on test slider because of how it divides the elapsed time 't' from draw= {
      speed: 1,
      pauseInterval: 1000
    }

    // * Related to normal game flow and info directly relevant to player
    // * Used by: game.panel
    this.msg = ''
    this.phase = CONSTANTS.PHASE_PLAY
    this.score = 0

    this.snek = null
    this.mobs = []
    this.immobs = []

    new Background(container, 'hsl(51, 50%, 20%)')
    this.clock = new Clock(this.ctx, this)
    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)
    this.world = new World(this.ctx, this)

    const Sounds = Audio()
    this.play = Sounds.play

    this.initSpawn()
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
    ent.parentEnt = this
    
    const bigEnt = new Entity(ent)
    
    if (!position) {
      // * For testing purposes so snek segs don't count toward displacement
      // * along x
      const minsSegsLength = Object.values(Entity.stack).filter(e => 
        e.entGroup === 'segment'
      ).length
      ent.position.x += (50 * (bigEnt.id - minsSegsLength))
    }

    ent.isMobile = false

    // * Handle setting hit area when position arg specified since immobs
    // * set it only once during their instantiation by design
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
          x:Math.random()*this.canvas.width - 1,
          y:Math.random()*this.canvas.height - 1,
        }, 
        this
      )

      if (ent.entGroup === 'mob') {
        ent.headingDegrees = Math.random() * 360
      }

      new Entity(ent)
      ents.push(ent)
    }
    
    return ents
  }

  removeEnt(id) {
    // ! Placeholder until ent recycling in working order
    delete Entity.stack[id]
  }

  render() {
    this.clock.render()
    for(const ent of Object.values(Entity.stack)) {
      ent.render()
    }
    this.snek?.render()
    this.panel.render()
  }

  update(loopID) {
    // **********************************************************************
    // * 1. Add new objects
    // **********************************************************************

    // Reserved for gameplay testing
    // this.world.randomSpawns()

    // **********************************************************************
    // * 2. Update all objects
    // **********************************************************************

    this.clock.update()

    if (this.snek) {
      this.snek.update()
      moveEdgeWrap.call(this.snek)
    }

    for(const ent of Object.values(Entity.stack)) {

      // Generally, immobs don't have an update function since they are *acted
      // upon* or manipulated by other ents
      ent.update?.()

      // **********************************************************************
      // * Hit Detection
      // * - only when parentEnt = game
      // **********************************************************************

      if (ent.parentEnt === this) {

        if (ent.species === 'ant' && !ent.carriedEnt) {
          let sweets = Entity.bySpecies(['apple', 'mango'])
          for(let sweet of Object.values(sweets)) {
            // TODO collisionresolver
            const isContacting = this.isContactingMouth(
              sweet.hitArea,
              ent.mouthCoords
            )
              
            if (isContacting) {
              console.log(`iscontacting`, )
              
              ent.grab(sweet)
            }
          }
        }
  
        if (ent.entGroup === 'mob') {
          
          moveEdgeWrap.call(ent)
  
          if (this.snek && this.snek.swallowables.includes(ent.species)) {

            // TODO collisionresolver
            const isContacting = this.isContactingMouth(
              ent.hitArea,
              this.snek.mouthCoords,
            )
    
            if (isContacting) {
              this.snek.chomp(ent)
              this.play.playRandomSwallowSound()
              this.score++
            }
          }

          const sneksegs = Entity.bySpecies(['snek-segment']) 
          if (ent.species === 'centipede' && sneksegs.length > 0) {
            for(let snekseg of Object.values(sneksegs)) {
            // TODO collisionresolver
              const isContacting = this.isContactingMouth(
                snekseg.hitArea,
                ent.mouthCoords,
              )
  
              if (isContacting) {
                console.log(`IN game, cent bite:`, ent.species)
                snekseg.detach()
                console.log(`snekseg species`, snekseg.species)
                
                ent.swallow(snekseg)
                // TODO detach segments
                // TODO ent.bite(snekseg)
                // TODO playRandomBiteSound
              }
  
            }
          }
        } else if (ent.entGroup === 'immob') {
  
          if (this.snek) {
            // TODO collisionresolver
            const isContacting = this.isContactingMouth(
              ent.hitArea,
              this.snek.mouthCoords, 
            )
  
            if (isContacting) {
              if (this.snek.swallowables.includes(ent.species)) {
                this.snek.chomp(ent)
                this.play.playRandomSwallowSound()
                this.score++
              }
            }
          }
        }
      }
    }


    // **********************************************************************
    // * 3. Update UI
    // **********************************************************************
      // this.panel.updateMsg()

    // **********************************************************************
    // * 4. Misc
    // **********************************************************************

    // * Enter PHASE_END via game.checkEndCondition()
    if (this.phase === CONSTANTS.PHASE_END) {
      cancelAnimationFrame(loopID)
      this.end()
    }
  }

  collisionResolver(aggressor, defender, resolver) {
    const isContacting = this.isContactingMouth(
      defender.hitArea,
      aggressor.mouthCoords,
    )
    isContacting && resolver()
  }

  initSpawn() {
    if (this.isDebugOn === 'false' || this.isDebugOn === null) {
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
}