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

    if (arrayEndWords.includes(Constants[this.game.mode].endConditions.loseByDeath.WORD)) {
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

    if (arrayEndWords.includes(Constants[this.game.mode].endConditions.loseByPoop.WORD)) {
      currentState.hasCheckedPoopification = false
      endFunctions.push(() => {
        // poopification check every 200ms
        if (!currentState.hasCheckedPoopification) {
          currentState.hasCheckedPoopification = true
          setTimeout(() => {
            if (currentState.snek.poopExcretionCount > Constants.survival.endConditions.loseByPoop.limit) {
              this.initializePoopification()
            } else {
              currentState.hasCheckedPoopification = false
            }
          }, 200)
        }
      })
    }

    if (arrayEndWords.includes(Constants[this.game.mode].endConditions.winByLevel.WORD)) {
      currentState.hasCheckedLevel = false
      endFunctions.push(() => {
        // level check every 200ms
        if (!currentState.hasCheckedLevel) {
          currentState.hasCheckedLevel = true
          setTimeout(() => {
            if (currentState.snek.level >= Constants[this.game.mode].endConditions.winByLevel.segCount) {
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

  initializeSurvivalCentSwarmCountdown() {
    // countdown to begin 1 min in advance of swarm
    this.renderProcesses.push(Animations.countdown(
      this.ctx, 
      'A centipede swarm is coming for you in:', 
      Constants.events.centipedeSwarm.warningDuration,
      {
        delayMS: Constants.events.centipedeSwarm.initial 
          - Constants.events.centipedeSwarm.warningDuration
      }
    ))

    // actual swarm
    this.updateProcesses.push(((world) => {
      let t = 0
      return {
        hasCompleted: false,
        step() {
          t += Constants.TICK
          if (t >= Constants.events.centipedeSwarm.initial) {
            world.getEntClass('centipede').spawnSwarm(world)
            this.hasCompleted = true
          }
        }
      }
    })(this.game.world)
    )
  }


  initializePoopification() {
    this.renderProcesses.push(
      Animations.countdown(
        this.ctx,
        'You will be overpowered by the toxicity emanating \
          from the prolifically strewn poop in:',
        Constants[this.game.mode].endConditions.loseByPoop.warningDuration,
      )
    )
    this.updateProcesses.push(((game) => {
      let t = 0
      return {
        hasCompleted: false,
        step() {
          t += Constants.TICK
          if (t >= Constants[game.mode].endConditions.loseByPoop.warningDuration) {
            game.stateMachine.change('gameOver', {
              snek: game.world.snek,
              score: game.world.snek.points,
              loseCondition: Constants[game.mode].endConditions.loseByPoop.WORD,
              isVictory: false,
            })
          }
        }
      }
    })(this.game))
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