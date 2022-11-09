// morphing chomp, for both segged and segless ents
export default class Collisions {
  static chomp(agg, def) {
    def.hitArea = new Path2D()
    def.chompEffect?.(agg)
  
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
  
  static harm(agg, def) {
    console.log(`harm@seg#${def.id}`, )
    let curr = def
    while (curr?.downstreamSegment) {
      curr = curr.downstreamSegment
    }

    const head = curr?.getHeadEnt()
    console.log(`head`, head.species)
    head.harmed?.()

    if (curr.species === 'segment') {
      console.log(`calling detach on seg#${curr.id}`, )
      curr?.detach()
      agg.canHarm = false
      setTimeout(() => agg.canHarm = true, 2000)
    }

  }
}