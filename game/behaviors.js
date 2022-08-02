import Entity from './Entity'

export function moveEdgeWrap() {
  if (this.position.x >= this.ctx.canvas.width) {
    this.position.x = 0
  } else if (this.position.x < 0) {
    this.position.x = this.ctx.canvas.width - 1
  }

  if (this.position.y >= this.ctx.canvas.height) {
    this.position.y = 0
  } else if (this.position.y < 0) {
    this.position.y = this.ctx.canvas.height - 1
  }
}

export function turnRandomlySmoothly() {
  const rng = Math.random()
  if (rng < 0.15) {
    this.turnDirection = 0
  } else if (rng < 0.3) {
    this.turnDirection = 1
  } else if (rng < 0.5) {
    this.turnDirection = 2
  }
  if (this.turnDirection === 0) {
    this.turnLeft()
  } else if (this.turnDirection === 1) {
    this.turnRight()
  }
}

export function turnErratically() {
  const rng = Math.random()
  if (rng < 0.2) {
    this.turnDirection = 1
  } else if (rng < 0.4) {
    this.turnDirection = 2
  } else if (rng < 0.8) {
    this.turnDirection = 0
  }
  if (this.turnDirection === 1) {
    this.turnLeft()
  } else if (this.turnDirection === 2) {
    this.turnRight()
  }
}

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

export function baseAbsorbExp(entAffected) {
  if (this.currExp > 0) {
    entAffected.currExp += this.expAbsorbRate
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.expAbsorbRate
    }
    this.currExp -= this.expAbsorbRate
  }
}