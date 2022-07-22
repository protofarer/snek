import Apple from './Apple'

export default class Mango extends Apple {
  constructor(ctx, position, parentEnt=null, id=null) {
    super(ctx, position, parentEnt, id)
    this.primaryColor = 'hsl(35, 100%, 60%)'
    this.typename = 'mango'
    // self frames for animation
  }

  drawLeaf() {}

  draw() {
    super.draw(-0.4)
  }
}