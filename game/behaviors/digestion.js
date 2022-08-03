import Entity from '../Entity'

export function baseSwallowEffect(entAffected) {
    // Consume all on the 3rd bite
    if (this.currExp / this.baseExp <= 0.25) {
      entAffected.currExp += this.currExp
      if (entAffected.currSegExp) {
        
        entAffected.currSegExp += this.currExp
      }
      this.currExp = 0
      this.digestion.timeLeft = 0

      // TODO recycle ent
      this.hitArea = new Path2D()
      this.position = {x: -100, y: -100}
      Entity.remove(this.id)
    } else {
      const expDiff = this.currExp / 2
      entAffected.currExp += expDiff
      if (entAffected.currSegExp) {
        entAffected.currSegExp += expDiff
      }
      this.currExp -= expDiff
      this.digestion.timeLeft *= 0.5
    }
}

export function lowSwallowEffect(entAffected) {
  if (this.digestion.timeLeft === this.digestion.baseTime) {
    const expDiff = this.currExp / 5
    entAffected.currExp += expDiff
      if (entAffected.currSegExp != undefined) {
        entAffected.currSegExp += expDiff
      }
    this.currExp -= expDiff
  }
}

export function highSwallowEffect(entAffected) {
  if (this.digestion.timeLeft === this.digestion.baseTime) {
    const expDiff = this.currExp * 4 / 5
    entAffected.currExp += expDiff
    this.currExp -= expDiff
  }
}