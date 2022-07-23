import Apple from '../immobs/Apple'

export default class Mango extends Apple {
  static species = 'mango'
  species = 'mango'
  static entGroup = 'immob'
  entGroup = 'immob'
  constructor(ctx, position, parentEnt=null, id=null) {
    super(ctx, position, parentEnt, id)
    this.primaryColor = 'hsl(35, 100%, 60%)'
    // self frames for animation
  }

  drawLeaf() {}

}