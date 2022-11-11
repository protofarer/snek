import Game from './game/Game'
import DebugGUI from './game/tools/DebugGUI'
import Constants from './game/Constants'

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
 * subobjects that run in the game, e.g. have thrir own update and render
 * methods which are called by the game. 
 * @function
 * @property start - time (ms) at start of a frame
 * @property elapsed - time (ms) elapsed since start of a frame
 * @property loopID - return value of requestAnimationFrame, used to stop the
 *    function 
 */

export function newGame() {
  const game = new Game(container)
  // TODO make this exit (return) by listening to a game property or event
}

newGame()