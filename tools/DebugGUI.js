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
import Poop from '../immobs/Poop'
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
      resetAfterElapsed: false,
      gameTickMultiplier: 1,
      set gameSpeed(val) { game.params.speed = val},
      get gameSpeed() { return game.params.speed }
    }

    this.setParamsFromSessionStorage()
    this.invokeOnDebugGameStart()

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
    this.setupNumericSlider({
      obj: this.params,
      key: 'gameTickMultiplier',
      folder: guiTestParams,
      minVal: 1,
      maxVal: 5,
      stepVal: 1,
    })

    const guiGameTest = gui.addFolder('GameTest')
    guiGameTest.add({ resetGame }, 'resetGame')
      .name('reset: normal')

    guiGameTest.add({ debugreset() { resetGame(true)} }, 'debugreset')
      .name('reset: debug')

// **********************************************************************
// * Game Start Functions
// **********************************************************************
    const guiStartFunctions = gui.addFolder('GameStartFunctions')
    // guiStartFunctions.add(this.params, 'timeToReset', 1000, 5000, 500)

    this.setupBooleanToggler(this.params, 'resetAfterElapsed', guiStartFunctions, 'reset: after elapsed ms')

    // guiStartFunctions.add(this.gameStartFunctions, 'resetAfterElapsed')
    //   .name('reset after elapsed')

    this.setupNumericSlider({
      obj: this.params,
      key: 'timeToReset',
      folder: guiStartFunctions,
      minVal: 1000,
      maxVal: 60000,
      stepVal: 250,
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
    this.setupNumericSlider({
      obj: this.params,
      key: 'gameSpeed',
      folder: guiGameTest,
      minVal: 0.005,
      maxVal: 1,
      stepVal: 0.05,
    })
    // guiGameTest.add(this.game.params, 'speed', 0.05, 1, 0.05)

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
          this.game.params.pauseLength = 3000
          this.game.phase = this.game.phase === CONSTANTS.PHASE_PAUSE 
            ? CONSTANTS.PHASE_PLAY
            : CONSTANTS.PHASE_PAUSE
          console.log(`%c*************** Game ${this.game.phase === CONSTANTS.PHASE_PAUSE ? 'Slowed' : 'Set to Play'} ***************`, 'color: orange')
          break
        case 'v':
          // Very Long Pause
          this.game.params.pauseLength = 3600000
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

  
  setParamsFromSessionStorage() {
    // Read debug and game params from sessionStorage for persistence across game runs
    const setParamFromSession = (key) => {
      const sessionVal = window.sessionStorage.getItem(key)
      let paramVal
  
      if (sessionVal === 'true') {
        paramVal = true
      } else if (sessionVal === 'false') {
        paramVal = false
      } else if (!isNaN(sessionVal && sessionVal)) {
        paramVal = Number(sessionVal)
      } else if (sessionVal === 'undefined') {
        // Clean out undefined's, they break lil-gui gui.add()
        window.sessionStorage.removeItem(key)
        // window.sessionStorage.setItem()
      }
      if (this.params.isDebugOn) console.log(`window.sessionStorage: ${key}: ${sessionVal}`)
      this.params[key] = paramVal ? paramVal : this.params[key]
    }

    for (const key of Object.keys(this.params)) {
      setParamFromSession(key)
    }
  }

  setupNumericSlider = ({
    obj, key, folder, minVal, maxVal, stepVal, label
  }) => {
    const setSessionNumeric = (val) => {
        window.sessionStorage.setItem(key, val)
        obj[key] = val
        console.log(`setting windowseshstore, k/v:`,key,val )
    }
    folder.add(obj, key, minVal, maxVal, stepVal).onChange(setSessionNumeric).listen()
      .name(label || key)
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
        console.info(`sessionStorage/debug.params [${key}] toggled to:`, obj[key])
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
  
  drawHitOverlays() {
    Object.values(Entity.stack).forEach( ent => ent.drawHitOverlays())
  }

  async invokeOnDebugGameStart() {
    if (this.params.isDebugOn) {
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`, )
      console.log(`% Running debug funcs on game start:`, )
      if (this.params.resetAfterElapsed) {
        await setTimeout(() => resetGame(this.params.isDebugOn), this.params.timeToReset)
      }
      
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`, )
    }
  }


  addTestObjects() {
    const spawnEnts = this.game.spawnEnts.bind(this.game)

    if (this.params.isDebugOn) {

      const addEnt = this.game.addEnt.bind(this.game)
      const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game)
      // snek.state.directionAngle = 0
      this.game.snek = snek
      // snek.state.mobile = false

      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      addEnt(Apple)
      // const poo = addEnt(Poop, {x:170,y:400})
      
      // const ant = addEnt(Ant).canTurn(false)
      // addEnt(Apple)
      // addEnt(Mango)
      // addEnt(Pebble)
      // addEnt(Centipede).state.mobile = true


      // spawnEnts(Pebble, 100)
      // spawnEnts(Apple, 50)
      // spawnEnts(Ant, 50)
      // spawnEnts(Mango, 50)
    }
  }

  step() {

    // Debug Mode only
    if (this.params.isDebugOn){
      for(let i = 0; i < this.params.gameTickMultiplier - 1; i++) {
        this.game.update()
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

}