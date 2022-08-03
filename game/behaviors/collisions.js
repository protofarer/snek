export function chomp(ent) {

  ent.hitArea = new Path2D()
  ent.chompEffect(this)

  // If snek has segments, begin digestion process
  if (this.downstreamSegment) {
    if (ent.carriedEnt) {
      ent.drop()
    }
    this.downstreamSegment.ingest(ent)
  } else {
    // Chomp when segmentless
    ent.position = {
      x: this.position.x - this.r * Math.cos(this.headingRadians),
      y: this.position.y - this.r * Math.sin(this.headingRadians)
    }
    ent.setHitAreas()
  }
}