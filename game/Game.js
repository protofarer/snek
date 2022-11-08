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

import StateMachine from './StateMachine'
import StartState from './states/StartState'
import PlayState from './states/PlayState'

/** 
 * Game object is used to:
 *  - sets up html container
 *  - initializes sound, external panel, and world utility objects
 *  - calls all entities' update and/or render functions
 *  - keeps a queryable map of all entities
 *  - defines interstitial behavior: the top level interactions between entities
 *      that don't belong to any entity itself, e.g. collision detection, etc...
 *  - provides entity instantiation via addEnt and spawnEnt methods
 * @param {HTMLDivElement} container - Top level container
 * @property {boolean} isDebugOn - window session stored debug mode state
 * @property {Object} params - adjustable game parameters
 * @property {Number} params.speed - speed game can be tweaked to run for debug purposes, range is [0.005, 1]
 * @property {string} msg - information for player
 * @property {Number} phase - the phase that the game is currently in
 * @property {Number} score - number of items snek has swallowed
 */
export default class Game {
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
      speed: 1,
    }

    this.msg = ''
    this.phase = CONSTANTS.PHASE_PLAY
    this.score = 0

    this.snek = null

    new Background(container, 'hsl(51, 50%, 20%)')
    this.clock = new Clock(this.ctx, this)
    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)
    this.world = new World(this.ctx, this)

    const Sounds = Audio()
    this.play = Sounds.play

    this.stateMachine = new StateMachine({
        start: StartState,
        play: PlayState
      },
      this
    )

    this.stateMachine.change('start')

    // this.initSpawn()
  }

  isContactingMouth(objHitArea, mouthCoords) {
    return this.ctx.isPointInPath(objHitArea, mouthCoords.x, mouthCoords.y)
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

  /** Controlled ent placement in world. 
   *  - automatically positions ents for testing.
   *  - immobilizes ent
   * @function
   */
  addEnt(entClass, position=null) {
    const ent = new entClass(
      this.ctx, 
      {
        x: position?.x || 170,
        y: position?.y || 400,
      }, 
      this
    )
    ent.parent = this
    
    // const bigEnt = new Entity(ent)
    
    if (!position) {
      // * For testing purposes so snek segs don't count toward displacement
      // * along x
      const minsSegsLength = Array.from(Entity.stack.values()).filter(e => 
        e.species === 'segment'
      ).length
      ent.position.x += (50 * (ent.id - minsSegsLength))
    }

    ent.isMobile = false

    // * Handle setting hit area when position arg specified since immobs
    // * set it only once during their instantiation by design
    if (entClass.entGroup === 'immob') ent.setHitAreas()
    return ent
  }

  /** Randomized ent placement in world
   * @method
   */
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
      ents.push(ent)
    }
    
    return ents
  }

  removeEnt(id) {
    // ! Placeholder until ent recycling in working order
    Entity.stack.delete(id)
  }

  render() {
    this.clock.render()

    this.stateMachine.render()

    // for(const ent of Entity.stack.values()) {
    //   ent.render()
    // }

    // this.panel.render()
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

    for(const ent of Entity.stack.values()) {

      // Generally, immobs don't have an update function since they are *acted
      // upon* or manipulated by other ents
      ent.update?.()

      // **********************************************************************
      // * Hit Detection
      // * - only when parent = game
      // **********************************************************************

      if (ent.parent === this) {

        if (ent.species === 'ant' && !ent.carriedEnt) {

          let sweets = Entity.bySpecies([{species: 'apple'}, {species:'mango'},{species: 'banana'}])
          for(let sweet of sweets.values()) {
            this.collisionResolver(ent, sweet, () => ent.grab(sweet))
          }

        }
  
        if (ent.entGroup === 'mob') {
          
          moveEdgeWrap.call(ent)

          const sneksegs = Entity.bySpecies([
            {
              species: 'segment',
              subSpecies: 'snek'
            }
          ]) 

          if (ent.species === 'centipede' && Array.from(sneksegs.values()).length > 0) {

            for(let snekseg of sneksegs.values()) {

              this.collisionResolver(ent, snekseg, () => {
                snekseg.detach()
                ent.chomp(snekseg)
              })

            }

          }

        }

        if (this.snek && this.snek.swallowables.includes(ent.species)) {

          this.collisionResolver(this.snek, ent, () => {

            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.chomp(ent)
              this.play.playRandomSwallowSound()
              this.score++
            }

          })

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

  /** Determine whether ent mouth is contacting another ent's body 
   * @function
   * @param {Entity} aggressor - entity with an initiating action, 
   *    e.g. chomp or carry
   * @param {Entity} defender - entity being initiated upon
   * @param {function} resolver - aggressor ent initiating action method
  */
  collisionResolver(aggressor, defender, resolver) {
    const isContacting = this.isContactingMouth(
      defender.hitArea,
      aggressor.mouthCoords,
    )
    isContacting && resolver()
  }

  /** Initial spawn method used for playable game/levels.
   * @method
   */
  initSpawn() {
    if (this.isDebugOn === 'false' || this.isDebugOn === null) {
      this.snek = new Snek(this.ctx, null, this)
      this.snek.position = { x: 200, y: 400 }

      this.spawnEnts(Apple, 45)
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