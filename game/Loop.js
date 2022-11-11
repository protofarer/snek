import Constants from './Constants'

export default class Loop {
  constructor(game) {
    this.game = game
    this.startT = null
    this.loopID = -1
    this.start()

    document.addEventListener('keydown', async (e) => {
      if(e.key === 'b') {
        this.togglePause()
        // this.game.phase = this.game.phase === Constants.PHASE_PAUSE 
        //   ? Constants.PHASE_PLAY
        //   : Constants.PHASE_PAUSE

        // if (this.game.phase === Constants.PHASE_PAUSE) {
        //   cancelAnimationFrame(this.loopID)
        // } else 
        // if (this.game.phase === Constants.PHASE_PLAY) (
        //   this.game.loopID = requestAnimationFrame(this.game.draw)
        // )

        // console.log(`%c*************** Game ${
        //     this.game.phase === Constants.PHASE_PAUSE 
        //       ? 'Paused' 
        //       : 'Playing'
        //   } ***************`, 'color: orange'
        // )
      }
    })
  }

  start() {
    this.draw()
  }

  access() {
    console.log(`this.startT`, this.startT)
  }

  pause() {
    if (this.game.phase !== Constants.PHASE_PAUSE) {
      this.game.phase = Constants.PHASE_PAUSE
      cancelAnimationFrame(this.loopID)
      console.log(`%c*************** Game Paused ***************`,
        'color: orange')
    }
  }

  play() {
    if (this.game.phase !== Constants.PHASE_PLAY)
    this.game.phase = Constants.PHASE_PLAY
    this.loopID = requestAnimationFrame(this.draw.bind(this))
    console.log(`%c*************** Game UnPaused ***************`,
      'color: orange')
  }

  togglePause() {
    if (this.game.phase === Constants.PHASE_PLAY)
      this.pause()
    else if (this.game.phase === Constants.PHASE_PAUSE)
      this.play()
  }

  stop() {
    if (this.game.phase !== Constants.PHASE_END) {
      cancelAnimationFrame(this.loopID)
      console.log(`%c*************** Game Paused ***************`,
      'color: orange')
    }
  }
  
  draw(t) {
    if (this.startT == undefined) {
      this.startT = t
      this.game.clock.start(t)
    }

    const elapsed = t - this.startT
    if (elapsed > 16 / this.game.debugGUI.params.gameSpeed) {
      this.startT = t
      this.game.clr()

      this.game.update(t, this.loopID)
      this.game.debugGUI && this.game.debugGUI.update(t, this.loopID)

      this.game.render(t)
      this.game.debugGUI && this.game.debugGUI.render(t)
    }

    // bind draw here?
    this.loopID = requestAnimationFrame(this.draw.bind(this))
  }
}