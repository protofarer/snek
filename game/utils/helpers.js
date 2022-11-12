import Entity from '../ents/Entity'
import Constants from '../Constants'
import Collisions from '../behaviors/Collisions'
import Digestion from '../behaviors/Digestion'

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

/**
 * intervaled repeater
 * do f, n times, every t milliseconds
 * @param {number} n 
 * @param {number} t 
 * @param {function} f 
 */
export function intRep(n, t, f) {
  let i = 0
  let id

  function limitedRepeat() {
    (i === n - 1) && clearInterval(id)
    f()
    i++
  }

  id = setInterval(limitedRepeat, t)
}

export function loadTraits(traitObject) {
  for (let [k,v] of Object.entries(traitObject)) {
    if (typeof v === 'object') {
      const os = JSON.parse(JSON.stringify(v))
      this[k] = os
    } else {
      this[k] = v
    }
  }
}

export function getTraitFunction(name) {
    if ([
      Constants.collisionFunction.BASE_CHOMP,
      Constants.collisionFunction.SMALL_CHOMP,
      Constants.collisionFunction.BIG_CHOMP,
    ].includes(name)
    ) return Collisions[name]

    if ([
      Constants.underDigestionFunction.BASE_ABSORB_EXP
    ].includes(name)
    ) return Digestion[name]

    throw Error('getTraitFunction called with invalid args')
}