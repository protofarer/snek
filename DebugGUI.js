import GUI from 'lil-gui'
import CONSTANTS from './Constants'
import { resetGame, } from '.'

export default class DebugGUI {

  frames = { fps: 0, times: []}

  constructor(game) {
    const gui = new GUI()
    this.game = game

    const rectpos = {
      left: `${Math.floor(game.rect.left)}`,
      top: `${Math.floor(game.rect.top)}`
    }

    const guiGamePositioning = gui.addFolder('GamePositioning') 
    guiGamePositioning.add(rectpos, 'left').name('rect.left').listen()
    guiGamePositioning.add(rectpos, 'top').name('rect.top').listen()
    guiGamePositioning.add(this.game.canvas, 'width').name('canvas.width')
    guiGamePositioning.add(this.game.canvas,'height').name('canvas.height')

    const guiGameState = gui.addFolder('GameState')
    guiGameState.add(this.game, 'turnCount').name('turnCount').listen()
    guiGameState.add(this.game, 'phase').name('phase').listen()

    gui.add(this.frames, 'fps').listen()
    // gui.add(this.game, 'debugOverlay').listen()

    const guiGameTest = gui.addFolder('GameTest')
    guiGameTest.add({ resetGame }, 
      'resetGame')
      .name('reset - prod')

    guiGameTest.add({ debugreset() { resetGame(true)} }, 
      'debugreset')
      .name('reset - full debug')

    const endGame = () => {
      // for debug
      this.game.phase = CONSTANTS.PHASE_END
    }

    guiGameTest.add({ endGame }, 'endGame')

    // const guiPointerTracking = gui.addFolder('PointerTracking')
    // guiPointerTracking.add(this.game.pointerCoords.client, 'x').name('client.x').listen()
    // guiPointerTracking.add(this.game.pointerCoords.client, 'y').name('client.y').listen()
    // guiPointerTracking.add(this.game.pointerCoords.canvas, 'x').name('canvas.x').listen()
    // guiPointerTracking.add(this.game.pointerCoords.canvas, 'y').name('canvas.y').listen()
    // guiPointerTracking.add(this.game.pointerCoords.board, 'x').name('board.x').listen()
    // guiPointerTracking.add(this.game.pointerCoords.board, 'y').name('board.y').listen()
    // guiPointerTracking.add(this.game.pointerCoords.square, 'col').name('pointer.col').listen()
    // guiPointerTracking.add(this.game.pointerCoords.square, 'row').name('pointer.row').listen()

    // guiPointerTracking.show(false)
    guiGamePositioning.show(false)

    const guiDebugState = gui.addFolder('DebugState')
    guiDebugState.add(game.debugState, 'isCycleClockDrawn')

    gui.hide()

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case '`':
          gui._hidden === false ? gui.hide() : gui.show()
          break
        case 'r':
          resetGame()
          break
        default:
          break
      }
    })
  }

  calcFPS(t) {
    while (this.frames.times.length > 0 && this.frames.times[0] <= t - 1000) {
      this.frames.times.shift()
    }
    this.frames.times.push(t)
    this.frames.fps = this.frames.times.length
  }
}