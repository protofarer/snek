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