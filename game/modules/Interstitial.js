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
            defeatCondition: Constants.survival.defeatConditions.POOPIFICATION
          })
        }
      }
    }
  }

  stepRenderProcesses() {
    for (let i = this.renderProcesses.length; i >= 0; i--) {
      this.renderProcesses[i]?.step()
      if (this.renderProcesses[i]?.hasCompleted) {
        this.renderProcesses.splice(i, 1)
      }
    }
  }

  stepUpdateProcesses() {
    for (let i = this.updateProcesses.length; i >= 0; i--) {
      this.updateProcesses[i]?.step();
      if (this.updateProcesses[i]?.hasCompleted) this.updateProcesses.splice(i, 1)
    }
  }

}