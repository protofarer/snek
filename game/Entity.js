export default class Entity {
  static ix = 0
  static stack = new Map()

  constructor(ent) {
    this.id = Entity.ix++
    Entity.stack.set(this.id, ent)
    ent.id = this.id
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