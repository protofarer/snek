import Constants from './Constants'
import Loop from './modules/Loop'
import Background from './ui-components/Background'
import Panel from './ui-components/Panel'
import World from './World'
import Clock from './modules/Clock'
import StateMachine from './modules/StateMachine'
import * as States from './states'
import { newGame } from '..'

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

    this.setupCanvas(container)
    this.load()

    this.stateMachine = new StateMachine({
        start: States.StartState,
        playNormal: States.PlayNormalState,
        playSurvival: States.PlaySurvivalState,
        gameOver: States.GameOverState
      }, this)

    if (!this.setupDebug()) {
      this.stateMachine.change('start')
    }

    this.loop = new Loop(this)
  }

  load() {
    new Background(this.container, this.canvas.width, this.canvas.height)
    this.clock = new Clock(this.ctx, this)
    this.world = new World(this)
    const Sounds = Audio()
    this.play = Sounds.play
    this.levelMaker = new LevelMaker(this)
  }

  setupDebug() {
    if (import.meta.env.DEV) {
      this.isDebugOn = window.sessionStorage.getItem('isDebugOn') === 'true' ? true : false
      this.debugGUI = new DebugGUI(this)
      this.debugGUI.params.isDebugOn = this.isDebugOn

      if (this.isDebugOn === true) {
        this.stateMachine.change('playSurvival', { level: 0, score: 0 })
        return true
      }
    }
    return false
  }

  setupCanvas(container) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = 400
    this.canvas.height = 600
    this.container.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)
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