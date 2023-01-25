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

  initializeEndConditions(currentState, arrayEndWords) {
    if (arrayEndWords.includes(Constants[currentState.game.mode].endConditions.loseByDeath.WORD)) {
      this.updateProcesses.push({
        hasCompleted: false,
        step() {
          if (currentState.snek.segments.length === 0) {
            this.hasCompleted = true
            currentState.game.stateMachine.change('gameOver', {
              snek: currentState.game.stateMachine.current.snek,
              score: currentState.snek.points,
              isVictory: false
            })
          }
        }
      })
    }

    if (arrayEndWords.includes(Constants[currentState.game.mode].endConditions.loseByPoop.WORD)) {
      this.updateProcesses.push(
        ((initializePoopification) => {
          return {
            hasCompleted: false,
            wasRecentlyChecked: false,
            step() {
              if (!this.wasRecentlyChecked) {
                this.wasRecentlyChecked = true
                setTimeout(() => {
                  if (currentState.snek.poopExcretionCount > Constants[currentState.game.mode].endConditions.loseByPoop.limit) {
                    this.hasCompleted = true
                    initializePoopification()
                  } else {
                    this.wasRecentlyChecked = false
                  }
                }, Constants.endConditions.frequencyMS)
              }
            }
          }
        })(this.setupPoopification(this.updateProcesses, this.renderProcesses))
      )
    }

    if (arrayEndWords.includes(Constants[currentState.game.mode].endConditions.winByLevel.WORD)) {
      this.updateProcesses.push({
        hasCompleted: false,
        wasRecentlyChecked: false,
        step() {
          if (!this.wasRecentlyChecked) {
            this.wasRecentlyChecked = true
            setTimeout(() => {
              if (currentState.snek.level >= Constants[currentState.game.mode].endConditions.winByLevel.segCount) {
                this.hasCompleted = true
                currentState.game.stateMachine.change('gameOver', {
                  snek: currentState.game.stateMachine.current.snek,
                  score: currentState.snek.points,
                  isVictory: true,
                })
              } else {
                this.wasRecentlyChecked = false
              }
            }, Constants.endConditions.frequencyMS)
          }
        }
      })
    }
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


  setupPoopification(updateProcesses, renderProcesses) {
    const game = this.game
    return () => {
      renderProcesses.push(
        Animations.countdown(
          this.ctx,
          'You will be overpowered by the toxicity emanating from the prolifically strewn poop in:',
          Constants[game.mode].endConditions.loseByPoop.warningDuration,
        )
      )
  
      updateProcesses.push((() => {
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
      })())

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