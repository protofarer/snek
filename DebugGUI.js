import GUI from 'lil-gui'
import CONSTANTS from './Constants'
import { resetGame, } from '.'

export default class DebugGUI {

  frames = { fps: 0, times: []}

  constructor(game, isDebugOn) {
    const gui = new GUI()
    this.gui = gui
    this.game = game
    
    this.params = {
      isDebugOn,
      isClockDrawn: false,
      randomTurns: false,
    }

    this.setStateFromSessionStorage()

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
      .name('reset: normal')

    guiGameTest.add({ debugreset() { resetGame(true)} }, 
      'debugreset')
      .name('reset: debug')

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
        case 'q':
          break
        default:
          break
      }
    })
    this.game.addObjectToStep(this)
  }

  setStateFromSessionStorage() {
    // Read debug state from sessionStorage for persistence across game runs
    function setDebugBoolean(name) {
      const isTrue = window.sessionStorage.getItem(name) 
        === 'true' ? true : false
      this.params[name] = isTrue
    }

    setDebugBoolean('isClockDrawn')
  }

  calcFPS(t) {
    while (this.frames.times.length > 0 && this.frames.times[0] <= t - 1000) {
      this.frames.times.shift()
    }
    this.frames.times.push(t)
    this.frames.fps = this.frames.times.length
  }
  
  drawClock() {
    if (this.game.debugState.isClockDrawn) {
      this.ctx.beginPath()
      this.ctx.moveTo(30, 5)
      this.ctx.lineTo(30, 10)

      if (this.cyclicFrame > 0 && this.cyclicFrame < 5){
        this.ctx.moveTo(55, 30)
        this.ctx.arc(30, 30, 25, 0, 2 * Math.PI)
      }
  
      this.ctx.save()
      this.ctx.translate(30, 30)
      this.ctx.moveTo(0,0)
      this.ctx.rotate((this.cyclicFrame * 2 * Math.PI / 60) - 0.5 * Math.PI)
      this.ctx.lineTo(20,0)
      this.ctx.lineWidth = 3
      this.ctx.strokeStyle = 'red'
      this.ctx.stroke()
      this.ctx.restore()
    }
  }

  step() {
    if (this.game.debugGame){
      if (this.game.entities.snek.state.getMouthCoords().y <= 0) {
        this.game.entities.snek.state.headCoords = { x: 400, y: 400 }
        resetGame()
      }
      this.game.entities.world.objects.apples.forEach(
        a => {
          a.isEaten !== true && a.drawHitArea()
        }
      )
      // if (this.game.debugState.randomTurns) {
      //   const q = Math.random()
      //   if (q < 0.25) {
      //     this.game.entities.snek.turnLeft()
      //   } else if (q < 0.50){
      //     this.game.entitities.snek.turnRight()
      //   }
      // }
    }
    this.drawClock()
  }
}