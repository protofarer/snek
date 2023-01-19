import BaseState from './BaseState'
import CONSTANTS from '../Constants'
import Snek from '../ents/mobs/Snek'
import Constants from '../Constants'

/**
 * 
 */
export class PlayTestState extends BaseState {
  stateName = 'playTest'

  constructor(game, params) {
    super()
    this.game = game

    this.snek = params?.snek
      || new Snek(this.game.ctx, null, this.game)
    this.game.setSnek(this.snek)

    this.game.phase = CONSTANTS.PHASE_PLAY

    this.startT = this.game.t

    this.level = 't'
    this.spawner = this.game.levelMaker.generateLevel(this.level, this.snek)
    this.hasCheckedLevel = false
    this.poopificationStartTime
    this.hasCheckedPoopification = false
  }

  update(t) {
    this.game.world.update(t)
    this.spawner?.(t)

    // level check every 200ms
    if (!this.hasCheckedLevel) {
      this.hasCheckedLevel = true
      setTimeout(() => {
        if (this.snek.level >= Constants.survival.victory.segcount) {
          this.game.stateMachine.change('gameOver', {
            snek: this.game.stateMachine.current.snek,
            level: this.game.stateMachine.current.level,
            score: this.snek.points,
            isVictory: true,
          })
        } else {
          this.hasCheckedLevel = false
        }
      }, 200)
    }

    // poopification check every 200ms
    if (!this.hasCheckedPoopification) {
      this.hasCheckedPoopification = true
      setTimeout(() => {
        if (this.snek.poopExcretionCount > Constants.survival.poopification.limit) {
          this.game.world.interstitial.startPoopificationCountdown()
          // TODO show poopification countdown timer, flash on screen until dead
        } else {
          this.hasCheckedPoopification = false
        }
      }, 200)
    }

  }

  render() {
    this.game.world.render()
    this.game.panel.render()
  }

  exit() {
  }
}