/**
 * @description - Game behavior that runs in the space between World, Graphics, Ents. Active glue.
 */

import Constants from "../Constants.js"
import Animations from "./Animations.js"

export default class Interstitial {
  renderProcesses = []
  updateProcesses = []

  constructor(game) {
    this.game = game
    this.ctx = game.ctx
  }

  dScore(agg, def) {
    const dPoints = def.points

    if (dPoints === 0) return

    agg.points += dPoints
    def.points -= dPoints
    this.renderProcesses.push(
      Animations.risePointsInPlace(agg.position, dPoints, this.ctx)
    )
  }

  addEndConditions(currentState, arrayEndWords) {
    let endFunctions = []

    if (arrayEndWords.includes(Constants.endConditions.LOSE_BY_DEATH)) {
      endFunctions.push(() => {
        // catch all gameover
        if (currentState.snek.segments.length === 0) {
          currentState.game.stateMachine.change('gameOver', {
            snek: currentState.game.stateMachine.current.snek,
            score: currentState.snek.points,
            isVictory: false
          })
        }
      })
    }

    if (arrayEndWords.includes(Constants.endConditions.LOSE_BY_POOP)) {
      currentState.hasCheckedPoopification = false
      endFunctions.push(() => {
        // poopification check every 200ms
        if (!currentState.hasCheckedPoopification) {
          currentState.hasCheckedPoopification = true
          setTimeout(() => {
            if (currentState.snek.poopExcretionCount > Constants.survival.poopification.limit) {
              this.startPoopificationCountdown()
            } else {
              currentState.hasCheckedPoopification = false
            }
          }, 200)
        }
      })
    }

    if (arrayEndWords.includes(Constants.endConditions.WIN_BY_LEVEL)) {
      currentState.hasCheckedLevel = false
      endFunctions.push(() => {
        // level check every 200ms
        if (!currentState.hasCheckedLevel) {
          currentState.hasCheckedLevel = true
          setTimeout(() => {
            if (currentState.snek.level >= Constants.survival.victory.segcount) {
              currentState.game.stateMachine.change('gameOver', {
                snek: currentState.game.stateMachine.current.snek,
                score: currentState.snek.points,
                isVictory: true,
              })
            } else {
              currentState.hasCheckedLevel = false
            }
          }, 200)
        }
      })
    }

    return endFunctions
  }

  detectTimeForEvent(t) {

  }

  startCentSwarmCountdown() {
    this.renderProcesses.push(
      Animations.centSwarmCountdown(this.ctx)
    )
    this.updateProcesses.push(
      this.centSwarmCountdown(this.game)
    )
  }

  centSwarmCountdown(game) {
    console.log(`implement centswarmcountdown`, )
    
  }

  startPoopificationCountdown() {
    this.renderProcesses.push(
      Animations.poopificationCountdown(this.ctx)
    )
    this.updateProcesses.push(
      this.poopificationCountdown(this.game)
    )
  }

  poopificationCountdown(game) {
    let t = 0
    return {
      hasCompleted: false,
      step() {
        t += Constants.TICK
        if (t >= Constants.survival.poopification.countdownMS) {
          game.stateMachine.change('gameOver', {
            snek: game.world.snek,
            score: game.world.snek.points,
            loseCondition: Constants.survival.loseConditions.POOPIFICATION,
            isVictory: false,
          })
        }
      }
    }
  }

  stepRenderProcesses() {
    for (let i = this.renderProcesses.length - 1; i >= 0; i--) {
      this.renderProcesses[i].step()
      if (this.renderProcesses[i].hasCompleted) {
        this.renderProcesses.splice(i, 1)
      }
    }
  }

  stepUpdateProcesses() {
    for (let i = this.updateProcesses.length - 1; i >= 0; i--) {
      this.updateProcesses[i].step();
      if (this.updateProcesses[i].hasCompleted) this.updateProcesses.splice(i, 1)
    }
  }

}