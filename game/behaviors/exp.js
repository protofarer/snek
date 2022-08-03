export function baseAbsorbExp(entAffected) {
  if (this.currExp > 0) {
    entAffected.currExp += this.expAbsorbRate
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.expAbsorbRate
    }
    this.currExp -= this.expAbsorbRate
  }
}