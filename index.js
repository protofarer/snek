import Game from './Game.js'
import DebugGUI from './DebugGUI.js'
import CONSTANTS from './Constants.js'
import Snek from './Snek.js'
import World from './World.js'
import Clock from './Clock.js'

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


// **********************************************************************
// * Play Game: PHASE_PLAY
// **********************************************************************


export function startNewGame() {
  new Background(container, 'hsl(52, 40%, 50%)')
  let game = new Game(container)
  let snek = new Snek(game.canvas)
  let world = new World(game.canvas)
  let clock = new Clock(game.ctx)

  game.addObjectToStep(snek)
  game.addObjectToStep(world)
  game.addEntity('snek', snek)
  game.addEntity('world', world)

  let debugGUI = import.meta.env.DEV ? new DebugGUI(game, clock) : null

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
startNewGame()

export function resetGame(toDebug=false) {
  const currURL = new URL(window.location.href)
  if (import.meta.env.DEV) {
    currURL.hash = toDebug ? '#debuggame' : '#nodebug'
  }
  location.replace(currURL.toString())
  location.reload()
}