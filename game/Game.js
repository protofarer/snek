import CONSTANTS from './Constants'
import Audio from './audio'
import Clock from './utils/Clock'
import Panel from './Panel'
import Background from './Background'

import Entity from './Entity'
import World from './World'


import StateMachine from './StateMachine'
import StartState from './states/StartState'
import PlayState from './states/PlayState'

import LevelMaker from './LevelMaker'

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

    new Background(container, 'hsl(51, 50%, 20%)')
    this.clock = new Clock(this.ctx, this)
    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)
    this.world = new World(this.ctx, this)

    const Sounds = Audio()
    this.play = Sounds.play

    this.phase = 1

    this.levelMaker = new LevelMaker(this)

    this.stateMachine = new StateMachine({
        start: StartState,
        play: PlayState
      },
      this
    )

    this.stateMachine.change('start')
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

  removeEnt(id) {
    // ! Placeholder until ent recycling in working order
    Entity.stack.delete(id)
  }

  render() {
    this.clock.render()
    this.stateMachine.render()
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
    this.stateMachine.update()

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

}