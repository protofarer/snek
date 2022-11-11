import GUI from 'lil-gui'
import CONSTANTS from '../Constants'

import Entity from '../Entity'
import Centipede from '../mobs/Centipede'

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
      showDebugOverlays: false,
      isClockDrawn: false,
      isTurningRandomly: false,
      timeToReset: 2000,
      resetAfterElapsed: false,
      gameTickMultiplier: 1,
      isGridVisible: false,
      isSnekInitialized: false,
      isDebugGUIShown: true,
      isDebugGUIOpen: true,
      gameSpeed: 1,
    }

    const resetGame = this.game.resetGame.bind(this.game)

    this.setParamsFromSessionStorage()
    this.invokeOnDebugGameStart(resetGame)
    this.reactToParams()

    const rectpos = {
      left: `${Math.floor(game.rect.left)}`,
      top: `${Math.floor(game.rect.top)}`
    }

    gui.add(this.frames, 'fps').listen()
    const guiGamePositioning = gui.addFolder('Positioning') 
    guiGamePositioning.add(rectpos, 'left').name('rect.left').listen()
    guiGamePositioning.add(rectpos, 'top').name('rect.top').listen()
    guiGamePositioning.add(this.game.canvas, 'width').name('canvas.width')
    guiGamePositioning.add(this.game.canvas,'height').name('canvas.height')
    guiGamePositioning.show(false)

    // **********************************************************************
    // * Game State
    // **********************************************************************
    const guiGameState = gui.addFolder('GameState')

    guiGameState.add(this.game, 'phase').name('phase').listen()

    // **********************************************************************
    // * Overlays
    // **********************************************************************
    const guiTestParams = this.gui.addFolder('Overlays')

    this.setupBooleanToggler(this.game, 'isDebugOn', guiTestParams, 'debug mode')
    this.setupBooleanToggler(this.params, 'isClockDrawn', guiTestParams, 'show clock')
    this.setupBooleanToggler(this.params, 'showDebugOverlays', guiTestParams, 'show overlays')
    this.setupBooleanToggler(this.params, 'isGridVisible', guiTestParams, 'show grid')


    // **********************************************************************
    // * Mutations
    // **********************************************************************
    const guiMutate = gui.addFolder('Mutate')

    this.setupNumericSlider({
      obj: this.params,
      key: 'gameTickMultiplier',
      folder: guiMutate,
      minVal: 1,
      maxVal: 5,
      stepVal: 1,
    })

    this.setupNumericSlider({
      obj: this.params,
      key: 'gameSpeed',
      folder: guiMutate,
      minVal: 0.005,
      maxVal: 1,
      stepVal: 0.05,
    })

    guiMutate.add({ resetGame }, 'resetGame')
    .name('reset: normal')

    guiMutate.add({ resetGame: () => resetGame(true) }, 'resetGame')
      .name('reset: debug')

    const endGame = () => { this.game.phase = CONSTANTS.PHASE_END }
     guiMutate.add({ endGame }, 'endGame')

    const guiStartFunctions = gui.addFolder('GameStartFunctions')

    this.setupBooleanToggler(this.params, 'resetAfterElapsed', guiStartFunctions, 'reset: after elapsed ms')
    this.setupNumericSlider({
      obj: this.params,
      key: 'timeToReset',
      folder: guiStartFunctions,
      minVal: 1000,
      maxVal: 60000,
      stepVal: 250,
    })


    // **********************************************************************
    // * Ents
    // **********************************************************************
    const guiEnts = gui.addFolder('Ents')

    this.setupBooleanToggler(this.params, 'isTurningRandomly', guiEnts , 'rand walk snek')

    const addCentipede = () => this.game.world.spawnEnts(Centipede)
    guiEnts.add({ addCentipede }, 'addCentipede')


    document.addEventListener('keydown', async (e) => {
      switch (e.key) {
        case '`':
          if (gui._hidden === true) {
            gui.show()
            window.sessionStorage.setItem('isDebugGUIShown', 'true')
            this.params.isDebugGUIShown = true
          } else {
            gui.hide()
            window.sessionStorage.setItem('isDebugGUIShown', 'false')
            this.params.isDebugGUIShown = false
          }
          break
        case 'r':
          resetGame(this.game.isDebugOn, this.game.container)
          break
        case 't':
          this.game.isDebugOn = !this.game.isDebugOn
          window.sessionStorage.setItem('isDebugOn', this.game.isDebugOn)
          break
        case 'q':
          this.params.showDebugOverlays = !this.params.showDebugOverlays
          window.sessionStorage.setItem('showDebugOverlays', this.params.showDebugOverlays)
          break
        default:
          break
      }
    })
  }

  /**
   * Initializes the gui for snek's state.
   * @function
   */
  initSnekStateGUI() {
    const snek = this.game.world.snek
    if (snek) {
      const guiSnek = this.gui.addFolder('Snek')

      guiSnek.add(snek, 'currExp').listen()
      guiSnek.add(snek, 'level').listen()
      guiSnek.add(snek, 'currMoveSpeed').listen()
      guiSnek.add(snek, 'currTurnRate').listen()
      guiSnek.add(snek.postDigestionEffects, 'length').listen().name('nPDE')

      const seg = guiSnek.addFolder('Segments')
      seg.add(snek, 'currKnownSegmentCount').listen()
      seg.add(snek, 'countSegments').listen()
      seg.add(snek, 'maxSegmentCount').listen()

      seg.add(snek, 'currSegExp').listen()
      const nextSegExp = () => {
        return this.game.world.snek.segExpForLevel(this.game.world.snek.countSegments + 1)
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
      } else if (parseInt(sessionVal) > 0 || parseFloat(sessionVal) > 0) {
        paramVal = Number(sessionVal)
      } else if (sessionVal == undefined) {
        // Clean out undefined's, they break lil-gui gui.add()
        window.sessionStorage.removeItem(key)
      }

      if (this.game.isDebugOn) console.log(`win.sessStore: ${key}: ${sessionVal}; paramVal:${paramVal}`)

      // * diverge from defaults
      if (paramVal != null) {
        this.params[key] = paramVal
      }
    }

    for (const key of Object.keys(this.params)) {
      setParamFromSession(key)
    }
  }

  reactToParams() {
    this.params.isDebugGUIOpen ? this.gui.open() : this.gui.close()
  }

  setupNumericSlider = ({
    obj, key, folder, minVal, maxVal, stepVal, label
  }) => {
    const setSessionNumeric = (val) => {
        window.sessionStorage.setItem(key, val)
        obj[key] = val
        console.log(`setting windowSessionStore, k/v:`,key,val )
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
    this.game.world.snek?.drawDebugOverlays()
  }

  async invokeOnDebugGameStart(resetGame) {
    if (this.game.isDebugOn) {
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`, )
      console.log(`% Running debug funcs on game start:`, )
      if (this.params.resetAfterElapsed) {
        await setTimeout(() => resetGame(this.game.isDebugOn), this.params.timeToReset)
      }
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`, )
    }
  }

  update(t) {
    while (this.frames.times.length > 0 && this.frames.times[0] <= t - 1000) {
      this.frames.times.shift()
    }

    this.frames.times.push(t)
    this.frames.fps = this.frames.times.length

    if (this.game.world.snek) {
      if (this.params.isTurningRandomly) {
        const q = Math.random()
        if (q < 0.25) {
          this.game.world.snek.turnLeft()
        } else if (q < 0.50){
          this.game.world.snek.turnRight()
        }
      }
    }
    
    if (this.game.world.snek && this.params.isSnekInitialized === false) {
      this.params.isSnekInitialized = true
      this.initSnekStateGUI()
    }

    if (this.game.isDebugOn){
      for(let i = 0; i < this.params.gameTickMultiplier - 1; i++) {
        this.game.update()
      }
    }

    // because via hotkey, keyboard handler can toggle gui state variable
    if (this.params.isDebugGUIShown) {
      this.gui.show()
    } else {
      this.gui.hide()
    }

    // because via mouseclick, read state delta here
    if (this.gui._closed === false && !this.params.isDebugGUIOpen) {
      this.params.isDebugGUIOpen = true
      window.sessionStorage.setItem('isDebugGUIOpen', 'true')
    } else if (this.gui._closed === true && this.params.isDebugGUIOpen) {
      this.params.isDebugGUIOpen = false
      window.sessionStorage.setItem('isDebugGUIOpen', 'false')
    }
  }

  render() {
    if (this.params.showDebugOverlays) {
      this.drawDebugOverlays()

      if (this.params.isGridVisible) {
        this.drawGrid()
      }
    }
  }
}