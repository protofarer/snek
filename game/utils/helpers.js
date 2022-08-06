import Entity from '../Entity'

/**
 * Returns upstream-most entity in a segment chain, including head ents
 * @function
 * @returns {Entity} upstreamSegment
 */
export function getHead() {
  // * For Segments
  let upstreamSegment = this.upstreamSegment
  while (upstreamSegment?.upstreamSegment) {
      upstreamSegment = upstreamSegment.upstreamSegment
  }
  return upstreamSegment ? upstreamSegment : this
}

/**
 * Returns the topmost parent object aka game
 * @function
 * @returns Game
 */
export function getGameObject() {
  let currentEnt = this.parent
  while (currentEnt.parent) {
      currentEnt = currentEnt.parent
  }
  return currentEnt
}

/**
 * Janky way to recycle an entity that's no longer used. Needs improvement.
 * @function
 * @param {Entity} ent 
 */
export function recycle(ent) {
  ent.hitArea = new Path2D()
  ent.position = {x: -100, y: -100}
  Entity.remove(ent.id)
}