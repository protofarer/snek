import Entity from '../Entity'

export function baseChompEffect(entAffected) {
  const chompRatio = 0.5
  if (this.currExp / this.baseExp > 0.25) {
    const expDiff = this.currExp * chompRatio
    entAffected.currExp += expDiff
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += expDiff
    }
    this.currExp -= expDiff
    this.digestion.timeLeft *= chompRatio

  } else {
  // Consume all on the 3rd clean bite or when ent low on digestable material
    entAffected.currExp += this.currExp
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.currExp
    }
    this.currExp = 0
    this.digestion.timeLeft = 0
    // recycle(this)

  }
}

export function bigChompEffect(entAffected) {
  // * Fresh chomp is big, second chomp fully consumes, no underDigest effects
  const chompRatio = 0.8
  if (this.digestion.timeLeft === this.digestion.baseTime) {

    const expDiff = this.currExp * chompRatio
    entAffected.currExp += expDiff
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += expDiff
    }
    this.currExp -= expDiff
    this.digestion.timeLeft *= chompRatio

  } else {

    entAffected.currExp += this.currExp
    this.currExp = 0
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.currExp
    }
    this.digestion.timeLeft = 0
    // recycle(this)

  }
}

export function smallChompEffect(entAffected) {
  // * Chomp has small effect magnitude, the effects for ents with small chomp
  // * effects are dominated by digestive effects
  const chompRatio = 0.2
  if (this.digestion.timeLeft/this.digestion.baseTime > 0.60) {

    const expDiff = this.currExp * chompRatio
    entAffected.currExp += expDiff
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += expDiff
    }
    this.currExp -= expDiff
    this.digestion.timeLeft *= chompRatio

  } else {

    entAffected.currExp += this.currExp
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.currExp
    }
    this.currExp = 0
    this.digestion.timeLeft = 0
    // recycle(this)

  }
}

// TODO improve
function recycle(ent) {
  ent.hitArea = new Path2D()
  ent.position = {x: -100, y: -100}
  Entity.remove(ent.id)

}