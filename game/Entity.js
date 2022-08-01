export default class Entity {
  static ix = 0
  static stack = {}

  constructor(ent) {
    this.id = Entity.ix++
    Entity.stack[ this.id ] = ent
    ent.id = this.id
  }

  static byId(id) { return Entity.stack[ id ]}

  static bySpecies(species) {
    let found = {}
    for(const [k,v] of Object.entries(Entity.stack)) {
      species.forEach(s => {
        if (v.species === s) found[k] =  v
      })
    }
    return found
  }

  static byEntGroup(entGroup) {
    let found = {}
    for(const [k,v] of Object.entries(Entity.stack)) {
      if (v.entGroup === entGroup) found[k] = v
    }
    return found
  }

  static remove(id) {
    delete Entity.stack[id]
  }
}