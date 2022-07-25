import GUI from 'lil-gui'
import CONSTANTS from '../Constants'
import { resetGame, } from '..'
import Pebble from '../immobs/Pebble'
import Apple from '../immobs/Apple'
import Mango from '../immobs/Mango'
import Centipede from '../mobs/Centipede'
import Ant from '../mobs/Ant'
import Snek from '../mobs/Snek'
import Entity from '../Entity'
export default class DebugGUI {
  frames = { fps: 0, times: []}

  constructor(game) {
    const gui = new GUI()
    this.gui = gui
    this.game = game
    this.parentEnt = null

    this.params = {
      isDebugOn: false,
      showHitOverlay: false,
      isClockDrawn: false,
      isTurningRandomly: false,
      isGameDoubleSpeed: false,
      timeToReset: 2000,
    }
    this.gameStartFunctions = {
      resetAfterElapsed: false
    }
    this.setParamsFromSessionStorage()

    this.invokeOnGameStart()

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

// **********************************************************************
// * Testing
// **********************************************************************
    const guiTestParams = this.gui.addFolder('Test & Debug')
    this.setupBooleanToggler(this.params, 'isDebugOn', guiTestParams, 'debug mode')
    this.setupBooleanToggler(this.params, 'isClockDrawn', guiTestParams, 'show clock')
    this.setupBooleanToggler(this.params, 'isTurningRandomly', guiTestParams, 'rand walk snek')
    this.setupBooleanToggler(this.params, 'isGameDoubleSpeed', guiTestParams, '2x speed')
    this.setupBooleanToggler(this.params, 'showHitOverlay', guiTestParams, 'show overlay')
    // Game Test Params and Functions
    const guiGameTest = gui.addFolder('GameTest')
    guiGameTest.add({ resetGame }, 
      'resetGame').name('reset: normal')

    guiGameTest.add({ debugreset() { resetGame(true)} }, 
      'debugreset').name('reset: debug')


// **********************************************************************
// * Game Start Functions
// **********************************************************************
    const guiStartFunctions = gui.addFolder('GameStartFunctions')
    // guiStartFunctions.add(this.params, 'timeToReset', 1000, 5000, 500)
    this.setupBooleanToggler(this.gameStartFunctions, 'resetAfterElapsed', guiStartFunctions, 'reset: after elapsed ms')
    guiStartFunctions.add(this.gameStartFunctions, 'resetAfterElapsed')
      .name('reset after elapsed')


    const setupNumericSlider = ({obj, key, folder, minVal, maxVal, stepVal, label}) => {
      const setSessionNumeric = (val) => {
        return () => {
          window.sessionStorage.setItem(key, val)
          obj[key] = val
        }
      }
      folder.add(obj, key, minVal, maxVal, stepVal).onChange(setSessionNumeric).listen()
        .name(label || key)
    }

    setupNumericSlider({
      obj: this.params,
      key: 'timeToReset',
      folder: guiStartFunctions,
      minVal: 1000,
      maxVal: 10000,
      stepVal: 500,
    })


    // TODO set sessionstorage timetoreset on init
    // TODO onChange of timetoreset Slider, update sessionStorage

    // const handleSessionBoolean = toggleSessionBoolean(obj, prop)
    // folder.add(obj, prop).onChange(handleSessionBoolean).listen()
    //   .name(label || prop)


// **********************************************************************
// * Add Mobs
// **********************************************************************
    const addCentipede = () => this.game.spawnEnts(Centipede)
    guiGameTest.add({ addCentipede }, 'addCentipede')

    const endGame = () => { this.game.phase = CONSTANTS.PHASE_END }
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
        case 't':
          this.params.isDebugOn = !this.params.isDebugOn
          window.sessionStorage.setItem('isDebugOn', this.params.isDebugOn)
          break
        case 'q':
          this.params.showHitOverlay = !this.params.showHitOverlay
          window.sessionStorage.setItem('showHitOverlay', this.params.showHitOverlay)
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

  setParamFromSession = (key) => {
    const sessionVal = window.sessionStorage.getItem(key)
    let paramVal

    if (sessionVal === 'true') {
      paramVal = true
    } else if (sessionVal === 'false') {
      paramVal = false
    } else if (!isNaN(sessionVal)) {
      paramVal = Number(sessionVal)
      console.log(`found numeric session value`, sessionVal)
      
    }
    this.params[key] = paramVal
  }

  setParamsFromSessionStorage() {
    // Read debug and game params from sessionStorage for persistence across game runs
    for (const key of Object.keys(this.params)) {
      this.setParamFromSession(key)
    }
  }

  setupBooleanToggler(obj, key, folder, label=null) {
    const toggleSessionBoolean = () => { 
      return () => {
        if (
          window.sessionStorage.getItem(key) === 'false'
          || !window.sessionStorage.getItem(key)
        ) {
          obj[key] = true
          window.sessionStorage.setItem(key, 'true')
        } else {
          obj[key] = false
          window.sessionStorage.setItem(key, 'false')
        }
        console.info(`sessionStorage and params[${key}] set to`, obj[key])
      }
    }

    const handleSessionBoolean = toggleSessionBoolean(obj, key)
    folder.add(obj, key).onChange(handleSessionBoolean).listen()
      .name(label || key)
  }

  calcFPS(t) {
    
    while (this.frames.times.length > 0 && this.frames.times[0] <= t - 1000) {
      this.frames.times.shift()
    }
    this.frames.times.push(t)
    this.frames.fps = this.frames.times.length
  }
  
  step() {
    // Debug Mode only
    if (this.params.isDebugOn){
      // Reset Game on hit border
      if (this.game.snek) {
        if (this.game.snek.state.mouthCoords.y <= 0) {
          this.game.snek.state.position = { x: 400, y: 400 }
          resetGame(true)
        }
      }
    }

    // Can be run in normal mode
    if (this.params.showHitOverlay) {
      this.drawHitOverlays()
    }

    if (this.game.snek) {
      if (this.params.isTurningRandomly) {
        const q = Math.random()
        if (q < 0.25) {
          this.game.snek.turnLeft()
        } else if (q < 0.50){
          this.game.snek.turnRight()
        }
      }
    }
  }

  drawHitOverlays() {
    Object.values(Entity.stack).forEach( ent => ent.drawHitOverlays())
  }

  invokeOnGameStart() {
    const resetAfterElapsedMillisec = async () => {
      console.log(`reset after 5 sec`, )
      setTimeout(() => resetGame(this.params.isDebugOn), this.params.timeToReset)
    }

    console.log(`*******************************************`, )
    console.log(`******** Running debug funcs on game start:`, )
    this.gameStartFunctions.resetAfterElapsed && 
      resetAfterElapsedMillisec()

    
    console.log(`*******************************************`, )
    console.log(`*******************************************`, )
  }


  addTestObjects() {
    const spawnEnts = this.game.spawnEnts.bind(this.game)
    if (this.params.isDebugOn) {
      const addEnt = this.game.addEnt.bind(this.game)
      const snek = new Snek(this.game.ctx, {x:100,y:400}, this.game)
      // snek.state.directionAngle = 0
      this.game.snek = snek
      // snek.mobile = false

      const app = addEnt(Apple)
      // const ant = addEnt(Ant).canTurn(false).isMobile(true)
      // addEnt(Apple)
      // addEnt(Mango)


      // spawnEnts(Pebble, 100)
      // spawnEnts(Apple, 50)
      // spawnEnts(Ant, 50)
      // spawnEnts(Mango, 50)
    }
  }
}