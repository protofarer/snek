import Game from './Game.js'
import DebugGUI from './tools/DebugGUI.js'
import CONSTANTS from './Constants.js'

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
  let game = new Game(container)

  let debugGUI = import.meta.env.DEV ? new DebugGUI(game, draw) : null

  let start
  let loopID = requestAnimationFrame(draw)

  function draw(t) {
    if (start === undefined) start = t
    game.clock.t = t

    const elapsed = t - start
    if (elapsed > 16 / game.params.speed) {
      start = t
      game.clr()
      game.update(loopID)

      debugGUI && debugGUI.update(t, loopID) && debugGUI.calcFPS(t)
  
      game.render()
    }
    loopID = requestAnimationFrame(draw)
  }

  document.addEventListener('keydown', async (e) => {
    if(e.key === 'b') {
      game.phase = game.phase === CONSTANTS.PHASE_PAUSE 
        ? CONSTANTS.PHASE_PLAY
        : CONSTANTS.PHASE_PAUSE

      game.phase === CONSTANTS.PHASE_PAUSE 
        && cancelAnimationFrame(loopID)

      if (game.phase === CONSTANTS.PHASE_PLAY) (
        loopID = requestAnimationFrame(draw)
      )

      console.log(`%c*************** Game ${
          game.phase === CONSTANTS.PHASE_PAUSE 
            ? 'Paused' 
            : 'Playing'
        } ***************`, 'color: orange'
      )
    }
  })
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