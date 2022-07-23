import Apple from '../immobs/Apple'
import Pebble from '../immobs/Pebble'
import Ant from '../mobs/Ant'
import Centipede from '../mobs/Centipede'
export default class World {
  species = 'world'
  chilId = 0
  constructor(ctx, game) {
    this.ctx = ctx
    this.canvas = this.ctx.canvas
    this.game = game
    this.fieldEnts = []
    this.mobs = []
  }

  randomSpawns() {
    const rng = Math.random()
    if (rng < 0.03) {
      this.game.spawnEnts(Apple)
    } else if (rng < 0.04) {
      this.game.spawnEnts(Pebble)
    } else if (rng < 0.06 ) {
      this.game.spawnEnts(Ant)
    } else if (rng < 0.065) {
      this.game.spawnEnts(Centipede)
    }
  }

  step() {
    this.fieldEnts.forEach(e => e.step())
    // this.randomSpawns()
  }
}
