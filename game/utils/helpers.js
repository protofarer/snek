export function getHead() {
  // * For Segments
  let upstreamSegment = this.upstreamSegment
  while (upstreamSegment?.upstreamSegment) {
      upstreamSegment = upstreamSegment.upstreamSegment
  }
  return upstreamSegment ? upstreamSegment : this
}

export function getGameObject() {
  let currentEnt = this.parentEnt
  while (currentEnt) {
    if (currentEnt.parentEnt) {
      currentEnt = currentEnt.parentEnt
    } else {
      return currentEnt
    }
  }
  return currentEnt
}