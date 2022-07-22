import Apple from './Apple'

export default class Mango extends Apple {
  constructor(canvas, position, parentEnt=null, id=null) {
    super(canvas, position, parentEnt, id)
    this.primaryColor = 'hsl(35, 100%, 60%)'
  }

  drawLeaf() {}
  drawBody() {
    this.ctx.save()
    this.ctx.rotate(-Math.PI)
    this.ctx.scale(.7, 1)
    super.drawBody()
    this.ctx.restore()
  }
}