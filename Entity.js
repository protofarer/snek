export default class Entity {
  static ix = 0
  static stack = {}

  constructor(ent) {
    this.id = Entity.ix++
    Entity.stack[ this.id ] = ent
  }

  static byId(id) { return Entity.stack[ id ]}
}