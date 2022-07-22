import Game from './Game.js'
import DebugGUI from './tools/DebugGUI.js'
import CONSTANTS from './Constants.js'
import Snek from './ents/Snek.js'
import World from './ents/World.js'
import Clock from './utils/Clock.js'

import Background from './Background.js'

export const ENV = new (function() {
  this.MODE = import.meta.env ? import.meta.env.MODE : 'production' 
})()

document.title = 'Snek!'
const container = document.createElement('div')
container.id = 'container'
document.body.appendChild(container)

// **********************************************************************
// * Play Game: PHASE_PLAY

export function startNewGame() {
  new Background(container, 'hsl(52, 40%, 50%)')
  let game = new Game(container)
  let snek = new Snek(game.ctx)
  let world = new World(game.ctx)
  let clock = new Clock(game.ctx)

  game.addEnt(snek)
  game.addEnt(world)
  game.addEnt(clock)

  let debugGUI = import.meta.env.DEV ? new DebugGUI(game, clock) : null
  game.addEnt(debugGUI)

  let loopID = requestAnimationFrame(draw)
  let start
  function draw(t) {
    if (start === undefined) {
      start = t
    }

    loopID = requestAnimationFrame(draw)

    const elapsed = t - start
    if (elapsed > 16 / game.params.speed) {
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