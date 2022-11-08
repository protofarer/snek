import GUI from 'lil-gui'
import CONSTANTS from '../Constants'

import Entity from '../Entity'
import Banana from '../immobs/Banana'
import Pebble from '../immobs/Pebble'
import Apple from '../immobs/Apple'
import Mango from '../immobs/Mango'
import Centipede from '../mobs/Centipede'
import Ant from '../mobs/Ant'
import Snek from '../mobs/Snek'
import Poop from '../immobs/Poop'

/**
 * Contains debug GUI functionality (uses lil-gui package) and includes
 * capability for manual game design and testing
 * @class
 * @property {Object} frames - Object containing framerate data
 * @property {Object} params - Contains flags that save to window session
 * @property {function} params.gameSpeed - get/set game's speed
 */
export default class DebugGUI {
  frames = { fps: 0, times: []}

  constructor(game) {
    const gui = new GUI()
    this.gui = gui
    this.game = game
    this.parent = undefined

    this.params = {
      isDebugOn: false,
      showDebugOverlays: false,
      isClockDrawn: false,
      isTurningRandomly: false,
      timeToReset: 2000,
      resetAfterElapsed: false,
      gameTickMultiplier: 1,
      isGridVisible: false,
      isSnekInitialized: false,
      set gameSpeed(val) { game.params.speed = val},
      get gameSpeed() { return game.params.speed }
    }

    const resetGame = this.game.resetGame

    this.setParamsFromSessionStorage()
    this.invokeOnDebugGameStart(resetGame)

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
    guiGameState.add(this.game, 'phase').name('phase').listen()

// **********************************************************************
// * Testing
// **********************************************************************
    const guiTestParams = this.gui.addFolder('Test & Debug')

    this.setupBooleanToggler(this.params, 'isDebugOn', guiTestParams, 'debug mode')
    this.setupBooleanToggler(this.params, 'isClockDrawn', guiTestParams, 'show clock')
    this.setupBooleanToggler(this.params, 'isTurningRandomly', guiTestParams, 'rand walk snek')
    this.setupBooleanToggler(this.params, 'showDebugOverlays', guiTestParams, 'show overlays')
    this.setupBooleanToggler(this.params, 'isGridVisible', guiTestParams, 'show grid')
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

    guiGameTest.add({ resetGame: () => resetGame(true) }, 'resetGame')
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
          this.params.showDebugOverlays = !this.params.showDebugOverlays
          window.sessionStorage.setItem('showDebugOverlays', this.params.showDebugOverlays)
          break
        default:
          break
      }
    })
    this.addTestObjects()
  }

  /**
   * Initializes the gui for snek's state.
   * @function
   */
  initSnekStateGUI() {
    const snek = this.game.snek
    if (snek) {
      const guiSnek = this.gui.addFolder('Snek')

      guiSnek.add(snek, 'currExp').listen()
      guiSnek.add(snek, 'level').listen()
      guiSnek.add(snek, 'currMoveSpeed').listen()
      guiSnek.add(snek, 'currTurnRate').listen()

      // const nPostDigestionEffects = {
      //   n: snek.postDigestionEffects.length
      // }

      guiSnek.add(snek.postDigestionEffects, 'length').listen().name('nPDE')

      const seg = guiSnek.addFolder('Segments')
      seg.add(snek, 'currKnownSegmentCount').listen()
      seg.add(snek, 'countSegments').listen()
      seg.add(snek, 'maxSegmentCount').listen()

      seg.add(snek, 'currSegExp').listen()
      const nextSegExp = () => {
        return this.game.snek.segExpForLevel(this.game.snek.countSegments + 1)
      }
      const segexpObj = { get nextSegExp() { return nextSegExp() }}
      seg.add(segexpObj, 'nextSegExp').listen()
    }

  }

  /**
   * Sets debug flags from window session storage and removes 
   * undefined/null values.
   */
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

  drawHitOverlays() {
    Entity.stack.values().forEach( ent => ent.drawHitOverlays())
  }

  drawGrid() {
    const ctx = this.game.ctx
    const n = 10
    ctx.beginPath()
    for (let i = 1; i < n; i++) {
      ctx.moveTo(0, i*(this.game.canvas.height/n))
      ctx.lineTo(this.game.canvas.width, i*(this.game.canvas.height/n))
      ctx.moveTo(i*(this.game.canvas.width/n), 0)
      ctx.lineTo(i*(this.game.canvas.width/n), this.game.canvas.height)
    }
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.font = 'normal 10px Arial'
    ctx.fillStyle = 'blue'
    for (let i = 1; i < n; i++) {
      ctx.fillText(`${i*(this.game.canvas.width/n)}`, i*(this.game.canvas.width/n) + 3, 12)
    }
    for (let i = 1; i < n; i++) {
      ctx.fillText(`${i*(this.game.canvas.height/n)}`, 3, i*(this.game.canvas.height/n) + 12)
    }
  }

  drawDebugOverlays() {
    Array.from(Entity.stack.values()).forEach( ent => ent.drawDebugOverlays())
    this.game.snek?.drawDebugOverlays()
  }

  async invokeOnDebugGameStart(resetGame) {
    if (this.params.isDebugOn) {
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`, )
      console.log(`% Running debug funcs on game start:`, )
      if (this.params.resetAfterElapsed) {
        await setTimeout(() => resetGame(this.params.isDebugOn), this.params.timeToReset)
      }
      
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`, )
    }
  }

  update(t, loopID) {
    this.loopID = loopID
    
    while (this.frames.times.length > 0 && this.frames.times[0] <= t - 1000) {
      this.frames.times.shift()
    }
    this.frames.times.push(t)
    this.frames.fps = this.frames.times.length

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

    if (this.game.snek && this.params.isSnekInitialized === false) {
      this.params.isSnekInitialized = true
      this.initSnekStateGUI()
    }

    if (this.params.isDebugOn){
      for(let i = 0; i < this.params.gameTickMultiplier - 1; i++) {
        this.game.update()
      }
    }
  }

  render() {
    if (this.params.showDebugOverlays) {
      this.drawDebugOverlays()

      if (this.params.isGridVisible) {
        this.drawGrid()
      }
    }
    // if (this.params.showHitOverlay) {
    //   this.drawHitOverlays()
    // }
  }

  /**
   * Manual design and testing functionality
   * @function
   */
  addTestObjects() {
    const spawnEnts = this.game.spawnEnts.bind(this.game)
    const addEnt = this.game.addEnt.bind(this.game)

    const testAntCarry = () => {
      const b = addEnt(Ant).setMobile(true).setTurnable(false)
      b.headingRadians = 0
      b.position = {x: 170, y:400}
      b.setHitAreas()

      const a = addEnt(Apple)
      a.position = {x: 200, y:400}
      a.setHitAreas()
      return {a, b}
    }

    const testSnekEatAntCarry = () => {
      const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
      this.game.snek = snek
      let {a,b} = testAntCarry()
      b.setMobile(false)
      b.position = {x: 190, y:400}
    }

    const testSnekEatWalkingAntCarry = () => {
      const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
      this.game.snek = snek
      let {a,b} = testAntCarry()
      b.setMobile(true)
      b.position = {x: 240, y:400}
      b.headingDegrees = 180
    }

    const testSnekEatAllFruit = () => {
      const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
      this.game.snek = snek
      addEnt(Apple)
      addEnt(Mango)
      addEnt(Banana)
    }

    const testSnekEatWalkingAnt = () => {
      const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
      this.game.snek = snek

      const b = addEnt(Ant).setMobile(true).setTurnable(false)
      b.position = {x: 230, y:400}
      b.headingDegrees = 180
      b.setHitAreas()
    }

    const testCentBiteSnek = () => {
      const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
      this.game.snek = snek
      const f = addEnt(Centipede).setMobile(true).setTurnable(false)
      f.headingRadians = - Math.PI/2
      f.position = {x:150,y:550}
    }

    const testForcePass = () => {
      const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
      this.game.snek = snek
      addEnt(Pebble)
      addEnt(Apple)
    }

    const testDetachedSegmentsDigestion = () => {
      const snek = new Snek(this.game.ctx, {x:180,y:400}, this.game).setMobile(true)
      this.game.snek = snek
      addEnt(Mango)
      addEnt(Mango)

      const f = addEnt(Centipede).setMobile(true).setTurnable(false)
      f.headingRadians = - Math.PI/2
      f.position = {x:250,y:650}

    }

    if (this.params.isDebugOn) {
      // const snek = new Snek(this.game.ctx, {x:120,y:400}, this.game).setMobile(true)
      // this.game.snek = snek

      // addEnt(Pebble)
      // addEnt(Mango)
      // addEnt(Apple)

      // testSnekEatAllFruit()
      // testSnekEatWalkingAnt ()
      // testAntCarry()
      // testSnekEatAntCarry()
      // testSnekEatWalkingAntCarry()
      // testCentBiteSnek()
      // testDetachedSegmentsDigestion()
    }
  }
}