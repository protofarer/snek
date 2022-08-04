export default class Entity {
  static entGroup = 'entity'
  entGroup = 'entity'

  static idx = 0   // Class's simple id counter
  static stack = new Map()    // Game's account of ents

  constructor() {
    this.id = Entity.idx++
    Entity.stack.set(this.id, this)

    // TODO
    // this.parentEnt = Game
  }

  static byId(id) { return Entity.stack.get(id)}

  static bySpecies(speciesList) {
    let found = new Map()
    for(const [k,v] of Entity.stack) {
      speciesList.forEach(s => {
        if (v.species === s) found.set(k, v)
      })
    }
    return found
  }

  static byEntGroup(entGroup) {
    let found = new Map()
    for(const [k,v] of Entity.stack) {
      if (v.entGroup === entGroup) found.set(k, v)
    }
    return found
  }

  static remove(id) {
    Entity.stack.delete(id)
  }
}