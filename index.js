import Game from './game/Game'
import DebugGUI from './game/tools/DebugGUI'
import CONSTANTS from './game/Constants'

export const ENV = new (function() {
  this.MODE = import.meta.env ? import.meta.env.MODE : 'production' 
})()

document.title = 'Snek!'
const container = document.createElement('div')
container.id = 'container'
document.body.appendChild(container)

// **********************************************************************
// * Play Game: PHASE_PLAY

/** 
 * The game object contains a render and update method that is the parent of all
 * subobjects that run in the game, e.g. have their own update and render
 * methods which are called by the game. 
 * @function
 * @property start - time (ms) at start of a frame
 * @property elapsed - time (ms) elapsed since start of a frame
 * @property loopID - return value of requestAnimationFrame, used to stop the
 *    function 
 */
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
      debugGUI && debugGUI.update(t, loopID)

      game.render()
      debugGUI && debugGUI.render()
    }

    loopID = requestAnimationFrame(draw)
  }

  document.addEventListener('keydown', async (e) => {
    if(e.key === 'b') {
      game.phase = game.phase === CONSTANTS.PHASE_PAUSE 
        ? CONSTANTS.PHASE_PLAY
        : CONSTANTS.PHASE_PAUSE

      if (game.phase === CONSTANTS.PHASE_PAUSE ) {
        cancelAnimationFrame(loopID)
      } else if (game.phase === CONSTANTS.PHASE_PLAY) (
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