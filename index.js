import Game from './Game.js'
import DebugGUI from './tools/DebugGUI.js'
import CONSTANTS from './Constants.js'
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
  new Background(container, 'hsl(51, 50%, 20%)')

  let game = new Game(container)

  let debugGUI = import.meta.env.DEV ? new DebugGUI(game) : null

  let loopID = requestAnimationFrame(draw)
  let start
  async function draw(t) {
    if (game.phase === CONSTANTS.PHASE_PAUSE) {
      console.log(`%c**** Next tick in ${game.params.pauseLength/1000} sec ****`, 'color: orange')
      await new Promise (res => { setTimeout(res, game.params.pauseLength) })
      console.log('%c****    Game Ticking below    ****', 'color: orange')
    }

    if (start === undefined) {
      start = t
    }
    game.clock.t = t

    const elapsed = t - start
    if (elapsed > 16 / game.params.speed) {
      start = t
      game.clr()
      game.update()

      debugGUI && debugGUI.step()

      // if (debugGUI?.params.isGameDoubleSpeed) {
      //   game.update()
      //   debugGUI.update()
      // }
  
      debugGUI && debugGUI.calcFPS(t)
  
      game.render()
      // * Enter PHASE_END via game.checkEndCondition()
      if (game.phase === CONSTANTS.PHASE_END) {
        cancelAnimationFrame(loopID)
        game.end()
      }
    }

    loopID = requestAnimationFrame(draw)
  }
  return this
}
startNewGame()

export function resetGame(toDebug=false) {
  const currURL = new URL(window.location.href)
  if (import.meta.env.DEV) {
    window.sessionStorage.setItem('isDebugOn', toDebug)
  }
  location.replace(currURL.toString())
  location.reload()
}