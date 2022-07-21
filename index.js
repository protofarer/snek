import Game from './Game.js'
import DebugGUI from './DebugGUI.js'
import CONSTANTS from './Constants.js'
import Snek from './Snek.js'
import World from './World.js'

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

let initDebugGame = window.location.hash === '#debuggame' ? true : false

// **********************************************************************
// * Play Game: PHASE_PLAY
// **********************************************************************

export function startNewGame(debugGame=false) {
  let game = new Game(container, debugGame)
  let snek = new Snek(game.canvas)
  let world = new World(game.canvas)
  game.addToStep(snek)
  game.addToStep(world)

  let debugGUI = import.meta.env.DEV ? new DebugGUI(game) : null

  let loopID = requestAnimationFrame(draw)
  function draw(t) {
    game.clr()
    game.step()

    loopID = requestAnimationFrame(draw)

    debugGUI ?? debugGUI.calcFPS(t)

    // * Enter PHASE_END via game.checkEndCondition()
    if (game.phase === CONSTANTS.PHASE_END) {
      cancelAnimationFrame(loopID)
      game.end()
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