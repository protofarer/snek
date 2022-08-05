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
<<<<<<< HEAD
  let currentEnt = this.parent
  while (currentEnt.parent) {
      currentEnt = currentEnt.parent
=======
  let currentEnt = this.parentEnt
  while (currentEnt.parentEnt) {
      currentEnt = currentEnt.parentEnt
>>>>>>> dede83c40f5d66d6e3612719391b6fdb22679d3e
  }
  return currentEnt
}

// TODO improve
export function recycle(ent) {
  ent.hitArea = new Path2D()
  ent.position = {x: -100, y: -100}
  Entity.remove(ent.id)
}