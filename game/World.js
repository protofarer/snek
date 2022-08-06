import Apple from './immobs/Apple'
import Pebble from './immobs/Pebble'
import Ant from './mobs/Ant'
import Centipede from './mobs/Centipede'

/** Runs world events and behaviors
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
}
