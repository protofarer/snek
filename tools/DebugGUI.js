import GUI from 'lil-gui'
import CONSTANTS from '../Constants'
import { resetGame, } from '..'
import Apple from '../immobs/Apple'
import Mango from '../immobs/Mango'
import Centipede from '../mobs/Centipede'
import Ant from '../mobs/Ant'
import Snek from '../mobs/Snek'
export default class DebugGUI {
  frames = { fps: 0, times: []}

  constructor(game) {
    const gui = new GUI()
    this.gui = gui
    this.game = game
    this.parentEnt = null

    this.params = {
      isDebugOn: false,
      isClockDrawn: false,
      isTurningRandomly: false,
      isGameDoubleSpeed: false,
    }

    this.setParamsFromSessionStorage()
    this.setupBooleanTogglers()


    const rectpos = {
      left: `${Math.floor(game.rect.left)}`,
      top: `${Math.floor(game.rect.top)}`
    }

    gui.add(this.frames, 'fps').listen()
    const guiGamePositioning = gui.addFolder('GamePositioning') 
    guiGamePositioning.add(rectpos, 'left').name('rect.left').listen()
    guiGamePositioning.add(rectpos, 'top').name('rect.top').listen()
    guiGamePositioning.add(this.game.canvas, 'width').name('canvas.width')
    guiGamePositioning.add(this.game.canvas,'height').name('canvas.height')

    const guiGameState = gui.addFolder('GameState')
    guiGameState.add(this.game.state, 'phase').name('phase').listen()


    // Game Test Params and Functions
    const guiGameTest = gui.addFolder('GameTest')
    guiGameTest.add({ resetGame }, 
      'resetGame').name('reset: normal')

    guiGameTest.add({ debugreset() { resetGame(true)} }, 
      'debugreset').name('reset: debug')

    const addCentipede = () => {
      this.game.spawnEnts(Centipede)
    }
    guiGameTest.add({ addCentipede }, 'addCentipede')

    const endGame = () => {
      // for debug
      this.game.phase = CONSTANTS.PHASE_END
    }

    guiGameTest.add({ endGame }, 'endGame')
    guiGameTest.add(this.game.params, 'speed', 0.05, 1, 0.05)

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


    document.addEventListener('keydown', async (e) => {
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
          resetGame(this.params.isDebugOn)
          break
        case 'q':
          this.params.isDebugOn = !this.params.isDebugOn
          window.sessionStorage.setItem('isDebugOn', this.params.isDebugOn)
          break
        case 'b':
          this.game.phase = this.game.phase === CONSTANTS.PHASE_PAUSE 
            ? CONSTANTS.PHASE_PLAY
            : CONSTANTS.PHASE_PAUSE
          console.log(`%c*************** Game ${this.game.phase === CONSTANTS.PHASE_PAUSE ? 'Slowed' : 'Set to Play'} ***************`, 'color: orange')
          
          break
        default:
          break
      }
    })
    this.addTestObjects()
  }

  setBooleanParam = (name) => {
    const isTrueFromSession = window.sessionStorage.getItem(name)
    let isParamTrue

    if (isTrueFromSession === 'true') {
      isParamTrue = true
    } else if (isTrueFromSession === 'false') {
      isParamTrue = false
    } else {
      isParamTrue = this.params[name]
    }
    this.params[name] = isParamTrue
  }

  setParamsFromSessionStorage() {
    // Read debug and game params from sessionStorage for persistence across game runs

    for (const key of Object.keys(this.params)) {
      this.setBooleanParam(key)
    }
  }

  setupBooleanTogglers() {
    const toggleSessionBoolean = (obj, name) => { 
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
        console.info(`sessionStorage and params[${name}] set to`, obj[name])
      }
    }

    const setupBooleanToggler = (obj, name, guiFolder, label=null ) => {
      const handleSessionBoolean = toggleSessionBoolean(obj, name)
      guiFolder.add(obj, name).onChange(handleSessionBoolean).listen().name(label || name)
    }

    const guiTestParams = this.gui.addFolder('TestParams')
    setupBooleanToggler(this.params, 'isDebugOn', guiTestParams, 'debug mode')
    setupBooleanToggler(this.params, 'isClockDrawn', guiTestParams, 'show clock')
    setupBooleanToggler(this.params, 'isTurningRandomly', guiTestParams, 'rand walk snek')
    setupBooleanToggler(this.params, 'isGameDoubleSpeed', guiTestParams, '2x speed')
  }

  calcFPS(t) {
    
    while (this.frames.times.length > 0 && this.frames.times[0] <= t - 1000) {
      this.frames.times.shift()
    }
    this.frames.times.push(t)
    this.frames.fps = this.frames.times.length
  }
  
  step() {
    // Debug only
    if (this.params.isDebugOn){
      // Reset Game on hit border
      if (this.game.snek.state.getMouthCoords().y <= 0) {
        this.game.snek.state.headCoords = { x: 400, y: 400 }
        resetGame(true)
      }

      // Show hitareas
      this.game.immobs.forEach(a => a.drawHitArea())
      this.game.mobs.forEach(a => a.drawHitArea())

      this.drawOverlays()
    }

    // Make snek turn randomly
    if (this.params.isTurningRandomly) {
      const q = Math.random()
      if (q < 0.25) {
        this.game.snek.turnLeft()
      } else if (q < 0.50){
        this.game.snek.turnRight()
      }
    }
  }

  drawOverlays() {
    this.game.ctx.beginPath()
    this.game.ctx.arc(this.game.snek.state.getMouthCoords().x, this.game.snek.state.getMouthCoords().y, 2, 0, 2 * Math.PI)
    this.game.ctx.fillStyle = 'blue'
    this.game.ctx.fill()
  }

  addTestObjects() {
    const spawnEnts = this.game.spawnEnts.bind(this.game)
    if (this.params.isDebugOn) {
      // this.game.snek = new Snek(this.game.ctx, {x:400,y:400}, this.game)
      this.game.spawnEnts(Ant, 1, {x:400,y:330})[0].canTurn = false
      this.game.spawnEnts(Apple, 1, {x:400, y:300})
      // spawnEnts(Ant, 20)
      // spawnEnts(Centipede, 5)
      // addEnts(Apple, 20)
      // addEnts(Centipede)
    }
  }
}