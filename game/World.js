import Apple from './immobs/Apple'
import Pebble from './immobs/Pebble'
import Ant from './mobs/Ant'
import Centipede from './mobs/Centipede'
import Mango from './immobs/Mango'
import Entity from './Entity'
import { moveEdgeWrap } from './behaviors/movements'

/** Runs world events and spawning behaviors
 * @class
 * @property {boolean} isSpawning - flag used for timing spawn functions
 */
export default class World {
  species = 'world'

  constructor(ctx, game) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.game = game
    this.isSpawning = false
  }

  /** Controlled ent placement in world. 
   *  - automatically positions ents for testing.
   *  - immobilizes ent
   * @function
   */
  addEnt(entClass, position=null) {
    const ent = new entClass(
      this.ctx, 
      {
        x: position?.x || 170,
        y: position?.y || 400,
      }, 
      this
    )
    ent.parent = this
    
    // const bigEnt = new Entity(ent)
    
    if (!position) {
      // * For testing purposes so snek segs don't count toward displacement
      // * along x
      const minsSegsLength = Array.from(Entity.stack.values()).filter(e => 
        e.species === 'segment'
      ).length
      ent.position.x += (50 * (ent.id - minsSegsLength))
    }

    ent.isMobile = false

    // * Handle setting hit area when position arg specified since immobs
    // * set it only once during their instantiation by design
    if (entClass.entGroup === 'immob') ent.setHitAreas()
    return ent
  }

  removeEnt(id) {
    // ! Placeholder until ent recycling in working order
    Entity.stack.delete(id)
  }

  /** Randomized ent placement in world
   * @method
   */
  spawnEnts(entClass, n=1, position=null) {
    const ents = []
    for(let i = 0; i < n; i++) {
      const ent = new entClass(
        this.ctx, 
        position || 
        {
          x:Math.random()*this.canvas.width - 1,
          y:Math.random()*this.canvas.height - 1,
        }, 
        this.game
      )

      if (ent.entGroup === 'mob') {
        ent.headingDegrees = Math.random() * 360
      }
      ents.push(ent)
    }
    
    return ents
  }
  

  /** Base world spawning function
   * @method
   */
  async randomSpawns() {
    if (
      this.game.clock.getElapsedSeconds() % 5 === 0 
        && this.game.clock.getElapsedSeconds() !== 0 && this.isSpawning === false
    ) {
      this.isSpawning = true
      await new Promise (_ => { setTimeout(_ => this.isSpawning = false, 1000) })
      
      const rng = Math.random()
      if (rng < 0.3) {
        this.game.spawnEnts(Apple)
      } else if (rng < 0.6) {
        this.game.spawnEnts(Ant)
      } else if (rng < 0.65 ) {
        this.game.spawnEnts(Centipede)
      } else if (rng < 0.7) {
        this.game.spawnEnts(Pebble)
      }
    }
  }

  /** Initial spawn method used for playable game/levels.
   * @method
   */
  initSurvivalSpawn() {
    if (this.game.isDebugOn === 'false' || this.isDebugOn === null) {
      this.game.snek.position = { x: 200, y: 400 }

      this.spawnEnts(Apple, 45)
      this.spawnEnts(Pebble, 55)
      this.spawnEnts(Mango, 5)
      this.spawnEnts(Ant, 25)
      this.spawnEnts(Centipede, 2)

      // this.spawnEnts(Apple, 50)
      // this.spawnEnts(Pebble, 75)
      // this.spawnEnts(Ant, 70)
      // this.spawnEnts(Mango, 25)
      // this.spawnEnts(Centipede, 5)
    }
  }

  update() {
    for(const ent of Entity.stack.values()) {

      // Generally, immobs don't have an update function since they are *acted
      // upon* or manipulated by other ents
      ent.update?.()

      // **********************************************************************
      // * Hit Detection
      // * - only when parent = game
      // **********************************************************************

      if (ent.parent === this.game) {

        if (ent.species === 'ant' && !ent.carriedEnt) {

          let sweets = Entity.bySpecies([{species: 'apple'}, {species:'mango'},{species: 'banana'}])
          for(let sweet of sweets.values()) {
            this.collisionResolver(ent, sweet, () => ent.grab(sweet))
          }

        }
  
        if (ent.entGroup === 'mob') {
          
          moveEdgeWrap.call(ent)

          const sneksegs = Entity.bySpecies([
            {
              species: 'segment',
              subSpecies: 'snek'
            }
          ]) 

          if (ent.species === 'centipede' && Array.from(sneksegs.values()).length > 0) {

            for(let snekseg of sneksegs.values()) {

              this.collisionResolver(ent, snekseg, () => {
                snekseg.detach()
                ent.chomp(snekseg)
              })

            }

          }

        }

        if (this.snek && this.snek.swallowables.includes(ent.species)) {

          this.collisionResolver(this.snek, ent, () => {

            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.chomp(ent)
              this.game.play.playRandomSwallowSound()
              this.game.stateMachine.current.score++
            }

          })

        }
      }
    }
  }

  isContactingMouth(objHitArea, mouthCoords) {
    return this.game.ctx.isPointInPath(objHitArea, mouthCoords.x, mouthCoords.y)
  }

  /** Determine whether ent mouth is contacting another ent's body 
   * @function
   * @param {Entity} aggressor - entity with an initiating action, 
   *    e.g. chomp or carry
   * @param {Entity} defender - entity being initiated upon
   * @param {function} resolver - aggressor ent initiating action method
  */
  collisionResolver(aggressor, defender, resolver) {
    const isContacting = this.isContactingMouth(
      defender.hitArea,
      aggressor.mouthCoords,
    )
    isContacting && resolver()
  }


}
