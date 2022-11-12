import Constants from '../Constants'

export function baseAbsorbExp(entAffected) {
  if (this.currExp > 0) {
    const rate = (Constants.TICK / this.digestion.timeLeft) * this.currExp
    entAffected.currExp += rate
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += rate
    }
    this.currExp -= rate
  }
}