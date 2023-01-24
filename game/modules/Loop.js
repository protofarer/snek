import Constants from '../Constants'

export default class Loop {
  constructor(game) {
    this.game = game
    this.startT = null
    this.loopID = -1
    this.start()

    document.addEventListener('keydown', async (e) => {
      if(e.key === 'b') {
        this.togglePause()
      }
    })
  }

  start() {
    this.loop()
  }

  play() {
    if (
      this.game.phase !== Constants.PHASE_PLAY &&
      this.game.phase !== Constants.PHASE_END
    ) {
      this.game.phase = Constants.PHASE_PLAY
      this.loopID = requestAnimationFrame(this.loop.bind(this))
      console.log(`%c*************** Game UnPaused ***************`,
        'color: orange')
    }
  }

  pause() {
    if (
      this.game.phase !== Constants.PHASE_PAUSE && 
      this.game.phase !== Constants.PHASE_END
    ) {
      this.game.phase = Constants.PHASE_PAUSE
      cancelAnimationFrame(this.loopID)
      console.log(`%c*************** Game Paused ***************`,
        'color: orange')
    }
  }

  togglePause() {
    if (this.game.phase === Constants.PHASE_PLAY)
      this.pause()
    else if (this.game.phase === Constants.PHASE_PAUSE)
      this.play()
  }

  stop() {
    if (this.game.phase !== Constants.PHASE_END) {
      this.game.phase = Constants.PHASE_END
      cancelAnimationFrame(this.loopID)
      console.log(`%c*************** Game Stopped ***************`,
      'color: orange')
    }
  }
  
  /**
   * @property start - time (ms) at start of a frame
   * @property elapsed - time (ms) elapsed since start of a frame
   * @property loopID - return value of requestAnimationFrame, used to stop the
   *    function 
   */
  loop(t) {
    if (this.startT == undefined) {
      this.startT = t
      this.game.clock.start(t)
    }

    const elapsed = t - this.startT
    if (import.meta.env.DEV) {
      if (elapsed > Constants.TICK / this.game.debugGUI.params.gameSpeed) {
        this.startT = t
        this.game.clr()

        this.game.update(t)

        if (
          this.game.isDebugOn && 
          this.game.debugGUI.params.gameTickMultiplier > 1
        ) {
          for (let i = 0; i < this.game.debugGUI.params.gameTickMultiplier - 1; i++) {
            this.game.update(t)
          }
        }

        this.game.render(t)
      }
    } else if (elapsed > Constants.TICK) {
      this.startT = t
      this.game.clr()
      this.game.update(t)
      this.game.render(t)
    }

    this.loopID = requestAnimationFrame(this.loop.bind(this))
  }
}