/**
 * @description - Game behavior that runs in the space between World, Graphics, Ents. Active glue.
 */

import Animations from "./Animations.js"

export default class Interstitial {
  renderProcesses = []
  updateProcesses = []

  constructor(ctx) {
    this.ctx = ctx
  }

  dScore(ent, dPoints) {
    ent.score += dPoints
    this.renderProcesses.push(
      Animations.risePointsInPlace(ent, dPoints, this.ctx)
    )
  }

  stepRenderProcesses() {
    for (let i = this.renderProcesses.length; i >= 0; i--) {
      this.renderProcesses[i]?.step()
      if (this.renderProcesses[i]?.hasCompleted) this.renderProcesses.splice(i, 1)
    }
  }

  stepUpdateProcesses() {
    for (let i = this.updateProcesses.length; i >= 0; i--) {
      this.updateProcesses[i]?.step();
      if (this.updateProcesses[i]?.hasCompleted) this.updateProcesses.splice(i, 1)
    }
  }
}