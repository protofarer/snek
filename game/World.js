import Apple from './immobs/Apple'
import Pebble from './immobs/Pebble'
import Ant from './mobs/Ant'
import Centipede from './mobs/Centipede'
import Mango from './immobs/Mango'

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
}
