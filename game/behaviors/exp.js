export function baseAbsorbExp(entAffected) {
  if (this.currExp > 0) {
    const rate = (17 / this.digestion.timeLeft) * this.currExp
    entAffected.currExp += rate
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += rate
    }
    this.currExp -= rate
  }
}