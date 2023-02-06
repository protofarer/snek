import Entity from '../ents/Entity'
import Constants from '../Constants'
import Collisions from '../behaviors/Collisions'
import Digestion from '../behaviors/Digestion'

/**
 * Returns the topmost parent object aka game
 * @function
 * @returns Game
 */
export function getGameObject() {
  let currentEnt = this.parent
  while (currentEnt?.parent) {
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
  Entity.inactives.push(ent)
}

/**
 * intervaled repeater
 * do f, n times, every t milliseconds
 * @param {number} n 
 * @param {number} t 
 * @param {function} f 
 */
export function intRep(n, t, f) {
  if (!n) throw Error('intRep: missing n param')
  if (typeof n !== 'number') throw Error('intRep: invalid n param type, must be number')
  if (n <= 0) throw Error('intRep: invalid n param')

  if (!t) throw Error('intRep: missing t param')
  if (typeof t !== 'number') throw Error('intRep: invalid t param type, must be number')
  if (t <= 0) throw Error('intRep: invalid t param')

  if (!f) throw Error('intRep: missing f param')
  if (typeof f !== 'function') throw Error('intRep: invalid f param, isn\'t a function')


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
      // TODO throw if any user-defined / non-prototype property is also an object, fail... until loadTraits upgraded
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