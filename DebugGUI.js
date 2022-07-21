import GUI from 'lil-gui'
import CONSTANTS from './Constants'
import { resetGame, } from '.'

export default class DebugGUI {

  frames = { fps: 0, times: []}

  constructor(game) {
    const gui = new GUI()
    this.gui = gui
    this.game = game

    // Set debug state from sessionStorage
    function setDebugBoolean(name) {
      const isTrue = window.sessionStorage.getItem(name) 
        === 'true' ? true : false
      this.game.debugState[name] = isTrue
    }

    

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

    const addSessionBooleanToggle = (obj, name) => { 
      return () => {
        if (
          window.sessionStorage.getItem(name) === 'false'
          || !window.sessionStorage.getItem(name)
        ) {
          obj[name] = true
          window.sessionStorage.setItem(name, 'true')
        } else {
          obj[name] = false
          window.sessionStorage.setItem(name, 'false')
        }
      }
    }
     
    // Manually set and persist debug state changes
    const setupBooleanToggler = (obj, name) => {
      const toggleSessionObjBoolean = addSessionBooleanToggle(obj, name)
      guiGameTest.add(obj, name).onChange(toggleSessionObjBoolean)
    }
    setupBooleanToggler(this.game, 'debugGame')
    setupBooleanToggler(this.game.debugState, 'randomTurns')
    // const toggleDebugGame = addSessionBooleanToggle(this.game, 'debugGame')
    // guiGameTest.add({ toggleDebugGame }, 'toggleDebugGame')
    // guiGameTest.add(this.game, 'debugGame').onChange(toggleDebugGame)

    guiGameTest.add(this.game, 'gamespeed', 0.1, 1, 0.1)

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

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case '`':
          if (gui._hidden === true) {
            gui.show()
            window.sessionStorage.setItem('isDebugGUIHidden', 'true' )
          } else {
            gui.hide()
            window.sessionStorage.setItem('isDebugGUIHidden', 'false' )
          }
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