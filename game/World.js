import Apple from './ents/immobs/Apple'
import Constants from './Constants'
import Mango from './ents/immobs/Mango'
import Banana from './ents/immobs/Banana'
import Pebble from './ents/immobs/Pebble'
import Ant from './ents/mobs/Ant'
import Centipede from './ents/mobs/Centipede'
import Poop from './ents/immobs/Poop'
import Entity from './ents/Entity'

import { moveEdgeWrap } from './behaviors/movements'
import Collisions from './behaviors/Collisions'
import Traits from './ents/Traits'

/** Runs world events and spawning behaviors
 * @class
 * @property {boolean} isSpawning - flag used for timing spawn functions
 */
export default class World {
  species = 'world'
  inactiveEnts = []

  constructor(game) {
    this.game = game
    this.ctx = this.game.ctx
    this.canvas = this.game.canvas
    this.isSpawning = false
  }

  /** Controlled ent placement in world. 
   *  - automatically positions ents for testing.
   *  - immobilizes ent
   * @function
   */
  addEnt(entWord, position=null) {
    const entClass = this.getEntClass(entWord)
    const ent = new entClass(
      this.ctx, 
      {
        x: position?.x || this.game.canvas.width * 0.5,
        y: position?.y || this.game.canvas.height * 0.85,
      }, 
      this.game
    )
    ent.parent = this.game
    
    if (!position) {

      const xInterval = this.game.canvas.width * 0.10
      const yInterval = this.game.canvas.height * 0.10

      ent.position.y -= (yInterval * (ent.id - Traits.Snek.baseSegmentCount))

      if (ent.position.y < 0) {
        let n = Math.floor(Math.abs(ent.position.y) 
          / this.game.canvas.height) + 1
        ent.position.y += n * this.game.canvas.height
        ent.position.x += n * xInterval
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
  spawnEnts(entWord, n=1, position=null) {
    const ents = []
    const entClass = this.getEntClass(entWord)
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
   *  @method
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
        this.game.spawnEnts('apple')
      } else if (rng < 0.6) {
        this.game.spawnEnts('ant')
      } else if (rng < 0.65 ) {
        this.game.spawnEnts('centipede')
      } else if (rng < 0.7) {
        this.game.spawnEnts('pebble')
      }
    }
  }

  render() {
    for(const ent of Entity.stack.values()) {
      ent.isVisible && ent.render()
    }
  }

  countAnts() {
    return Entity.bySpecies({ species: 'ant' }).size
  }

  countSweets() {
    const sweetsQuery = Constants.sweets.map(s => { return { species: s } })
    let sweetsMap = Entity.bySpecies(sweetsQuery)
    return sweetsMap.size
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
            const sweetsQuery = Constants.sweets.map(s => { return { species: s } })
            let sweetsMap = Entity.bySpecies(sweetsQuery)
            for(let sweet of sweetsMap.values()) {
              this.collisionResolver(() => ent.grab(sweet), ent, sweet)
            }
          }

          if (
            this.snek.enemySpecies.includes(ent.species) && 
            ent.canHarm === true
          ) {
            // enemies vs snek head
            if (!this.collisionResolver(Collisions.harm, ent, this.snek)) {
              // if head not collided, check segs
              for(let i = 0; i < this.snek.segments.length; ++i) {
                // harm attached segs
                this.collisionResolver(Collisions.harm, ent, this.snek.segments[i])
              }
            }

            // ? CSDR resolving via catch all block at end of update
            // if (wasSegLost > 0 && snekSegCount === 1) {
            //   this.game.stateMachine.change('gameOver', {
            //     snek: this.game.stateMachine.current.snek,
            //     level: this.game.stateMachine.current.level,
            //     score: this.game.stateMachine.current.score,
            //   })
            // }
          }
        }

        // snek vs swallowables
        if (this.snek && this.snek.swallowables.includes(ent.species)) {
          this.collisionResolver(
            () => {
              Collisions.chomp(this.snek, ent)
              this.game.randomSounds.playRandomSwallowSound()
              this.game.stateMachine.current.score++
            },
            this.snek, 
            ent,
          )
        }
      }
    }
    // catch all gameover
    if (this.snek.segments.length === 0) {
      this.game.stateMachine.change('gameOver', {
        snek: this.game.stateMachine.current.snek,
        level: this.game.stateMachine.current.level,
        score: this.game.stateMachine.current.score,
      })
    }
  }

  /** Determine whether ent mouth is contacting another ent's body 
   * @function
   * @param {Entity} agg aka aggressor - entity with an initiating action, 
   *    e.g. chomp or carry
   * @param {Entity} def aka defender - entity being initiated upon
   * @param {function} collider - resolves collision
  */
  collisionResolver(resolver, agg, def, collisionDetector=this.pointCollisionDetector.bind(this)) {
    const isContacting = collisionDetector(agg, def)
    isContacting && resolver(agg, def)
    return isContacting
  }

  AABBCollisionDetector(rect1, rect2) {
    return !(
      rect2.left > rect1.right
      || rect2.right < rect1.left
      || rect2.bottom < rect1.top 
      || rect2.top > rect1.bottom
    )
  }

  pointCollisionDetector(agg, def) {
    return this.game.ctx.isPointInPath(
      def.hitArea, 
      agg.mouthCoords.x, 
      agg.mouthCoords.y
    )
  }

  getEntClass(entWord) {
    switch (entWord) {
      case 'apple':
        return Apple
      case 'mango':
        return Mango
      case 'banana':
        return Banana
      case 'ant':
        return Ant
      case 'centipede':
        return Centipede
      case 'pebble':
        return Pebble
      case 'poop':
        return Poop
      default:
        throw Error(`Invalid spawnRandom class key: ${entWord}`)
    }
  }
}
