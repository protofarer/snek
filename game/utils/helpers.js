import Entity from '../Entity'

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

// TODO improve
export function recycle(ent) {
  ent.hitArea = new Path2D()
  ent.position = {x: -100, y: -100}
  Entity.remove(ent.id)
}