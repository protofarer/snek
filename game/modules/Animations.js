import Constants from '../Constants'

export default class Animations {
  static risePointsInPlace(position, dPoints, ctx) {
    // TODO add itself to ent's animations array to be run by ent's render method
    // anytime score is increased, run this code should run
    // ... either a score delta check in render
    // ... or an "increaseScore" method that explicitly runs animation
    // for snek, signifcant score deltas happen at food entry and food exit (bite and poop)
    // - exp increments via digestion, but points are more stepwise than
    //   incremental because they are game level (higher) kind of progression
    let totalFrames = Math.floor(1000 / Constants.TICK)
    let currentFrame = 0
    const x = position.x
    let y = position.y - 15
    const dy = (-50 / totalFrames)   // pixels

    let fillStyle = ''
    let sign = ''
    if (dPoints > 0) {
      fillStyle = 'lawngreen'
      sign = '+'
    } else {
      fillStyle = 'red'
    }

    return {
      hasCompleted: false,
      step() {
        ctx.save()
        ctx.translate(x, y)
        ctx.lineWidth = 1
        ctx.font = '16px Arial'
        ctx.fillStyle = fillStyle
  
        // ! tmp does a negative dPoints cause fillText/strokeText methods to draw the negative sign via value itself?
        const text = `${sign}${dPoints}`
        ctx.fillText(text, 0, 0)
        ctx.restore()
  
        y += dy
        currentFrame++

        if (currentFrame === totalFrames) this.hasCompleted = true
      }
    }  
  }
}