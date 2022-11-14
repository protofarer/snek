/** 
 * Creates a new Entity.
 * 
 * This is the base game sub-object that defines the minimum state for any
 * thing that should interact within the game world and is generally a gameplay
 * element. This enables quick, global access to any entity and is used for calling
 * the updates and/or render functions of all entities in the game. This excludes
 * game utilities like the debugGUI or clock, and method library components like
 * those found within behaviors.js 
 * 
 * @class
 */
export default class Entity {
  static entGroup = 'entity'
  entGroup = 'entity'

  static idx = 0              // Class's simple id counter
  static stack = new Map()    // Game's account of ents
  static inactives = []

  constructor() {
    this.id = Entity.idx++
    Entity.stack.set(this.id, this)
    // TODO this.parent = game
  }

  /** 
   * Search the entity store by id 
   * @method
   * @param {Number} id - property assigned to ent by Entity upon creation.
   */
  static byId(id) { return Entity.stack.get(id)}

  /** Search the entity store by specifying an array of dictionaries, entities
   * that match query are returned in an array.  
   * @method
   * @param {Object[]} queryList - list of query items
   * @param {string} queryList[].species - primary search key
   * @param {string} queryList[].[subSpecies] - optional search key
   */
  static bySpecies(queryList) {
    let found = new Map()
    for(const [k,v] of Entity.stack) {
      queryList.forEach(queryItem => {
        if (v.species === queryItem.species) {
          if (queryItem?.subSpecies) {
            if (queryItem.subSpecies === v?.subSpecies) {
              found.set(k, v)
            }
          } else {
            found.set(k, v)
          }
        }
      })
    }
    return found
  }

  /** Search the entity store by specifying an entity group 
   * @method
   * @param {string} entGroup - group to which an ent belongs to, generally
   *    split between "mob" and "immob" 
   */
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