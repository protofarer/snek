import Game from './Game.js'
import DebugGUI from './DebugGUI.js'
import CONSTANTS from './Constants.js'
import Snek from './Snek.js'
import { World, Apple } from './World.js'
import Background from './Background.js'

export const ENV = new (function() {
  this.MODE = import.meta.env ? import.meta.env.MODE : 'production' 
})()

// **********************************************************************
// * Setup Document
// **********************************************************************

document.title = 'Snake!'
const container = document.createElement('div')
container.id = 'container'
document.body.appendChild(container)

let initDebugGame
if (window.sessionStorage.getItem('debugGame') === 'true') {
  initDebugGame = true
} else if (!window.sessionStorage.getItem('debugGame')) {
  initDebugGame = window.location.hash === '#debuggame' ? true : false
} else if (window.sessionStorage.getItem('debugGame') === 'false') {
  initDebugGame = false
}

// **********************************************************************
// * Play Game: PHASE_PLAY
// **********************************************************************


export function startNewGame(debugGame=false) {
  new Background(container, 'hsl(52, 40%, 50%)')
  let game = new Game(container, debugGame)
  let snek = new Snek(game.canvas)
  let world = new World(game.canvas)
  game.addObjectToStep(snek)
  game.addObjectToStep(world)

  game.addEntity('snek', snek)
  game.addEntity('world', world)

  let debugGUI = import.meta.env.DEV ? new DebugGUI(game) : null

  let loopID = requestAnimationFrame(draw)
  let start
  function draw(t) {
    if (start === undefined) {
      start = t
    }

    loopID = requestAnimationFrame(draw)

    const elapsed = t - start
    if (elapsed > 16 / game.gamespeed) {
      start = t
      game.clr()
      game.step()
  
      debugGUI ?? debugGUI.calcFPS(t)
  
      // * Enter PHASE_END via game.checkEndCondition()
      if (game.phase === CONSTANTS.PHASE_END) {
        cancelAnimationFrame(loopID)
        game.end()
      }
    }
  }
  return this
}
startNewGame(initDebugGame)

export function resetGame(toDebug=false) {
  const currURL = new URL(window.location.href)
  if (import.meta.env.DEV) {
    currURL.hash = toDebug ? '#debuggame' : '#nodebug'
  }
  location.replace(currURL.toString())
  location.reload()
}