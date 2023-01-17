import Constants from './Constants'
import Snek from './ents/mobs/Snek'
import Loop from './modules/Loop'
import Background from './modules/Background'
import Panel from './ui/Panel'
import World from './World'
import Clock from './modules/Clock'
import StateMachine from './modules/StateMachine'
import * as States from './states'

import LevelMaker from './modules/LevelMaker'
import DebugGUI from './tools/DebugGUI'

import Audio from './modules/audio'

/** 
 * Game object is used to:
 *  - sets up html container
 *  - initializes sound, external panel, and world utility objects
 *  - calls all entities' update and/or render functions
 *  - keeps a queryable map of all entities
 *  - defines interstitial behavior: the top level interactions between entities
 *      that don't belong to any entity itself, e.g. eollision detection, etc...
 *  - provides entity instantiation via addEnt and spawnEnt methods
 * @param {HTMLDivElement} container - root container for game area and panel
 * @property {boolean} isDebugOn - window session stored debug mode state
 * @property {Number} phase - the phase that the game is currently in
 */
export default class Game {

  constructor (container) {
    this.phase = Constants.PHASE_PAUSE
    this.t = -1

    this.setupPage(container)
    this.load()

    this.stateMachine = new StateMachine({
        start: States.StartState,
        playNormal: States.PlayNormalState,
        playSurvival: States.PlaySurvivalState,
        playTest: States.PlayTestState,
        gameOver: States.GameOverState
      }, this)

    if (this.setupDebug()) {
      this.stateMachine.change('playSurvival', { 
        snek: new Snek(this.ctx,null,this),
        level: 0, 
        score: 0 
      })
    } else {
      this.stateMachine.change('start')
    }

    this.loop = new Loop(this)
  }

  load() {
    this.clock = new Clock(this.ctx, this)
    this.world = new World(this)
    const Sounds = Audio()
    this.randomSounds = Sounds.random
    this.sounds = Sounds.sounds
    this.levelMaker = new LevelMaker(this)
  }

  setupDebug() {
    if (import.meta.env.DEV) {
      this.isDebugOn = window.sessionStorage.getItem('isDebugOn') === 'true' ? true : false
      this.debugGUI = new DebugGUI(this)
      this.debugGUI.params.isDebugOn = this.isDebugOn
      return this.isDebugOn
    }
    return false
  }

  setupPage(container) {
    this.container = container

    // placeholder for Kade user/session bar
    this.tmpKadeBar = document.createElement('div')
    this.tmpKadeBar.id = 'kadeBar'
    this.container.appendChild(this.tmpKadeBar)

    this.tmpUserMenu = document.createElement('button')
    this.tmpUserMenu.innerHTML = `Usr`
    this.tmpKadeBar.appendChild(this.tmpUserMenu)

    this.tmpLabel = document.createElement('button')
    this.tmpLabel.innerHTML = `kade online`
    this.tmpKadeBar.appendChild(this.tmpLabel)

    this.tmpGameMenu = document.createElement('button')
    this.tmpGameMenu.innerHTML = `Menu`
    this.tmpKadeBar.appendChild(this.tmpGameMenu)

    // Background aligned with  canvas
    new Background(this.container)

    // Game canvas
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = Constants.CANVAS_WIDTH
    this.canvas.height = Constants.CANVAS_HEIGHT
    this.container.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    // Web panel interface
    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)

    // Touch Area Controls
    this.touchAreaContainer = document.createElement('div')
    this.touchAreaContainer.id = 'touch-area-container'
    this.container.appendChild(this.touchAreaContainer)

    this.leftTouchArea = document.createElement('button')
    this.leftTouchArea.className = 'touch-area-control'
    this.leftTouchArea.id = 'touch-area-control-left'

    this.rightTouchArea = document.createElement('button')
    this.rightTouchArea.className = 'touch-area-control'
    this.rightTouchArea.id = 'touch-area-control-right'

    this.touchAreaContainer.appendChild(this.leftTouchArea)
    this.touchAreaContainer.appendChild(this.rightTouchArea)

    this.touchAreaContainer.style.width = '500px'
    this.touchAreaContainer.style.height = Constants.CANVAS_HEIGHT

    this.pointerCoords = {
      canvas : { x: 0, y: 0 },
      client: { x: 0, y: 0 },
      display: { x: 0, y: 0 }
    }
    const handlePointerMove = (e) => {
      // Scrolled window is not supported
      
      // pointer coordinates relative to base (unscaled) canvas
      this.pointerCoords.canvas.x = e.clientX - this.rect.left // + window.scrollX
      this.pointerCoords.canvas.y = e.clientY - this.rect.top // + window.scrollY

      // pointer coordinates relative to window
      this.pointerCoords.client.x = e.clientX // + window.scrollX
      this.pointerCoords.client.y = e.clientY // + window.scrollY

      // pointer coordinates relative to scaled/display pixel canvas coordinates
      this.pointerCoords.display.x = this.pointerCoords.canvas.x 
        * this.canvas.width / this.canvas.clientWidth
      this.pointerCoords.display.y = this.pointerCoords.canvas.y 
        * this.canvas.height / this.canvas.clientHeight

    }
    this.canvas.addEventListener('pointermove', handlePointerMove, false)

  }

  clr() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  resetGame(toDebug=false) {
    if (import.meta.env.DEV) {
      window.sessionStorage.setItem('isDebugOn', toDebug)
    }

    // TODO clean this up, why not just reload?
    const currURL = new URL(window.location.href)
    location.replace(currURL.toString())
    window.location.reload()

    // **********************************************************************
    // * WIP restart game more cleanly (without forcing page reload)
    // **********************************************************************
    // this.loop.stop()
    // const removeChildren = (parent) => {
    //   while (parent.lastChild) {
    //     parent.removeChild(parent.lastChild)
    //   }
    // }
    // removeChildren(this.container)
    // newGame()
    // **********************************************************************
    // **********************************************************************
  }

  setSnek(snek) {
    this.world.snek = snek
    this.panel.snek = snek
  }

  render(t) {
    this.clock.render(t)
    this.stateMachine.render(t)
    this.debugGUI && this.debugGUI.render(t)
  }

  update(t) {
    this.t = t
    this.clock.update(t)
    this.stateMachine.update(t)
    this.debugGUI && this.debugGUI.update(t)
  }
}