import Apple from './immobs/Apple'
import Pebble from './immobs/Pebble'
import Ant from './mobs/Ant'
import Centipede from './mobs/Centipede'
import Mango from './immobs/Mango'
import Entity from './Entity'
import { moveEdgeWrap } from './behaviors/movements'
import Collisions from './behaviors/Collisions'

/** Runs world events and spawning behaviors
 * @class
 * @property {boolean} isSpawning - flag used for timing spawn functions
 */
export default class World {
  species = 'world'

  constructor(game) {
    this.game = game
    this.ctx = this.game.ctx
    this.canvas = this.ctx.canvas
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
        x: position?.x || this.game.canvas.width * 0.25,
        y: position?.y || this.game.canvas.height/2,
      }, 
      this.game
    )
    ent.parent = this.game
    
    // const bigEnt = new Entity(ent)
    
    if (!position) {
      // * For testing purposes so snek segs don't count toward displacement
      // * along x
      const minsSegsLength = Array.from(Entity.stack.values()).filter(e => 
        e.species === 'segment'
      ).length

      const xInterval = this.game.canvas.width * 0.10
      const yInterval = this.game.canvas.height * 0.10

      ent.position.x += (xInterval * (ent.id - minsSegsLength))

      if (ent.position.x > this.game.canvas.width) {
        let n = Math.floor(ent.position.x / this.game.canvas.width)
        ent.position.x -= n * this.game.canvas.width
        ent.position.y += n * yInterval
      }
    }

    ent.isMobile = false

    ent.setHitAreas()   // for good measure
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
      // eslint-disable-next-line no-unused-vars
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

  update(t) {
    for(const ent of Entity.stack.values()) {

      // Generally, immobs don't have an update function since they are *acted
      // upon* or manipulated by other ents
      ent.update?.(t)

      // **********************************************************************
      // * Hit Detection
      // * - only when parent = game
      // **********************************************************************

      if (ent.parent === this.game) {
        if (ent.entGroup === 'mob') {

          moveEdgeWrap.call(ent)

          if (ent.species === 'ant' && !ent.carriedEnt) {
            let sweets = Entity.bySpecies([{species: 'apple'}, {species:'mango'},{species: 'banana'}])
            for(let sweet of sweets.values()) {
              this.collisionResolver(ent, sweet, () => ent.grab(sweet))
            }
          }

          if (
            this.snek.enemySpecies.includes(ent.species) && 
            ent.canHarm === true
          ) {

            // TODO opt track segs in an array incrementally instead of a full query
            // on every loop, or make it a snek method

            // enemies vs snek segs
            const sneksegs = Entity.bySpecies([{
              species: 'segment',
              subSpecies: 'snek'
            }])

            const snekSegCount = Array.from(sneksegs.values())
              .filter(s => s.getHeadEnt().species === 'snek')
              .length

            let wasSegLost = 0

            // segs still attached
            if (snekSegCount > 0) {

              // enemies vs snek head
              if (this.collisionResolver(ent, this.snek, Collisions.harm))
                wasSegLost++

              for(let snekseg of sneksegs.values()) {

                // harm attached segs
                if (snekseg.getHeadEnt().species === 'snek') {
                  if (this.collisionResolver(ent, snekseg, Collisions.harm))
                    wasSegLost++

                // chomp unattached segs
                } else {
                  this.collisionResolver(ent, snekseg, Collisions.chomp)
                }
              }
            }

            if (wasSegLost > 0 && snekSegCount === 1) {
              console.log(`SNEK DIES`, )
              this.game.stateMachine.change('gameOver', {
                snek: this.game.stateMachine.current.snek,
                level: this.game.stateMachine.current.level,
                score: this.game.stateMachine.current.score,
              })
              // TODO SNEK DED: change state to game over
            }

          }
        }


        // snek vs swallowables
        if (this.snek && this.snek.swallowables.includes(ent.species)) {
          this.collisionResolver(this.snek, ent, () => {
            if (this.snek.swallowables.includes(ent.species)) {
              Collisions.chomp(this.snek, ent)
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
   * @param {Entity} agg aka aggressor - entity with an initiating action, 
   *    e.g. chomp or carry
   * @param {Entity} def aka defender - entity being initiated upon
   * @param {function} collider - resolves collision
  */
  collisionResolver(agg, def, collider) {
    const isContacting = this.isContactingMouth(
      def.hitArea,
      agg.mouthCoords,
    )
    isContacting && collider(agg, def)
    return isContacting
  }


}
