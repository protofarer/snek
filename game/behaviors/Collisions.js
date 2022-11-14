import Constants from '../Constants'
import { recycle } from '../utils/helpers'

// chomp works for both segged and segless ents
export default class Collisions {
  static chomp(agg, def) {
    def.hitArea = new Path2D()
    const chompEffect = Collisions[def.chompEffectWord]
    chompEffect?.call(def, agg)
  
    // If snek has segments, begin digestion process
    if (agg.downstreamSegment) {
      if (def.carriedEnt) {
        def.drop()
      }
      agg.downstreamSegment.ingest(def)
    } else {
      // Chomp when segmentless
      def.position = {
        x: agg.position.x - agg.r * Math.cos(agg.headingRadians),
        y: agg.position.y - agg.r * Math.sin(agg.headingRadians)
      }
      def.setHitAreas()
    }
  }

  static [Constants.collisionFunction.BASE_CHOMP](entAffected) {
    const chompRatio = 0.5
    if (this.currExp / this.baseExp > 0.25) {
      const expDiff = this.currExp * chompRatio
      entAffected.gainExp(expDiff)
      if (entAffected.currSegExp != undefined) {
        entAffected.gainExp(expDiff)
      }
      this.currExp -= expDiff
      this.digestion.timeLeft *= 1 - chompRatio

    } else {
    // Consume all on the 3rd clean bite or when ent low on digestable material
      entAffected.gainExp(this.currExp)
      if (entAffected.currSegExp != undefined) {
        entAffected.gainExp(this.currExp)
      }
      this.currExp = 0
      // ! VIGIL coupling of digestion time and ent lifecycle
      this.digestion.timeLeft = 0
      recycle(this)
    }
  }

  static [Constants.collisionFunction.BIG_CHOMP](entAffected) {
    // * Fresh chomp is big, second chomp fully consumes, no underDigest effects
    const chompRatio = 0.8
    if (this.digestion.timeLeft === this.digestion.baseTime) {

      const expDiff = this.currExp * chompRatio
      entAffected.gainExp(expDiff)
      if (entAffected.currSegExp != undefined) {
        entAffected.gainExp(expDiff)
      }
      this.currExp -= expDiff
      this.digestion.timeLeft *= 1 - chompRatio

    } else {

      entAffected.gainExp(this.currExp)
      this.currExp = 0
      if (entAffected.currSegExp != undefined) {
        entAffected.gainExp(this.currExp)
      }
      this.digestion.timeLeft = 0
      recycle(this)
    }
  }

  static [Constants.collisionFunction.SMALL_CHOMP](entAffected) {
    // * Chomp has small effect magnitude, the effects for ents with small chomp
    // * effects are dominated by digestive effects
    const chompRatio = 0.2
    if (this.digestion.timeLeft/this.digestion.baseTime > 0.60) {

      const expDiff = this.currExp * chompRatio
      entAffected.gainExp(expDiff)
      if (entAffected.currSegExp != undefined) {
        entAffected.gainExp(expDiff)
      }
      this.currExp -= expDiff
      this.digestion.timeLeft *= 1 - chompRatio

    } else {

      entAffected.gainExp(this.currExp)
      if (entAffected.currSegExp != undefined) {
        entAffected.gainExp(this.currExp)
      }
      this.currExp = 0
      this.digestion.timeLeft = 0
      recycle(this)

    }
  }
  
  static harm(agg, def) {
    def.harmed?.()
    agg.canHarm = false
    setTimeout(() => agg.canHarm = true, Constants.HARM_COOLDOWN)
  }
}