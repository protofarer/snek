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

  static countdown(ctx, text, durationMS, params={
    font: '20px Arial',
    fillStyle: 'red',
    x: Constants.CANVAS_WIDTH * 0.1,
    y: Constants.CANVAS_HEIGHT * 0.1,
    isFlashing: true,
    delayMS: 0,
  }) {
    const font = params?.font || '20px Arial'
    const fillStyle = params?.fillStyle || 'red'
    const x = params?.x || Constants.CANVAS_WIDTH * 0.1
    const y = params?.y || Constants.CANVAS_HEIGHT * 0.1
    const isFlashing = Object.hasOwn(params, 'isFlashing') 
      ? params.isFlashing 
      : true
    const delayMS = Object.hasOwn(params, 'delayMS')
      ? params.delayMS
      : 0
    
    let timePassedMS = 0
    let totalFrames = Math.floor((durationMS) / Constants.TICK)
    let currentFrame = 0
    const visibilityIntervalFrames = 250 / Constants.TICK
    let visibilityAccumFrames = 0

    let words = text.split(' ')
    let lines = words.reduce((prev, curr) => {
      if (prev[prev.length - 1]?.length + curr.length + 1 <= 40) {
        prev[prev.length - 1] = prev[prev.length - 1] + " " + curr
        return prev
      } else {
          prev.push(curr)
        return prev
      }
    }, [])

    return {
      hasCompleted: false,
      isVisible: true,
      step() {
        timePassedMS += Constants.TICK
        if (timePassedMS >= delayMS) {
          if (this.isVisible) {
            ctx.save()
            ctx.translate(x, y)
            ctx.font = font
            ctx.fillStyle = fillStyle
      
            for (let i = 0; i < lines.length; ++i) {
              ctx.fillText(lines[i], 0, 25*i)
            }
            const timeLeftSec = Math.floor((totalFrames - currentFrame) * Constants.TICK / 1000)
            const timeLeftMS = Math.floor((totalFrames - currentFrame) * Constants.TICK / 100) % 10
            const timeLeftText = `${timeLeftSec}.${timeLeftMS} seconds!`
            ctx.fillText(timeLeftText, Constants.CANVAS_WIDTH * 0.25, 25 * lines.length)
            ctx.restore()
          }
          currentFrame++
  
          if (isFlashing) {
            visibilityAccumFrames++
            if (visibilityAccumFrames >= visibilityIntervalFrames) {
              this.isVisible = !this.isVisible
              visibilityAccumFrames = 0
            }
          }
          if (currentFrame === totalFrames) this.hasCompleted = true
        }
      }
    }

  }


  static poopificationCountdown(ctx) {
    let totalFrames = Math.floor(Constants.survival.poopification.countdownMS / Constants.TICK)
    let currentFrame = 0
    const x0 = Constants.CANVAS_WIDTH * 0.01
    const y0 = Constants.CANVAS_HEIGHT * 0.2
    const font = '20px Arial'
    const fillStyle = 'red'

    const visibilityIntervalFrames = 500 / Constants.TICK
    let visibilityAccumFrames = 0

    const text1 = `YOU WILL DIE FROM POOPIFICATION IN:`
    const text2 = `${Math.ceil((totalFrames - currentFrame) * Constants.TICK / 1000)} seconds!!!`

    return {
      hasCompleted: false,
      isVisible: true,
      step() {
        if (this.isVisible) {
          ctx.save()
          ctx.translate(x0, y0)
          ctx.font = font
          ctx.fillStyle = fillStyle
    
          ctx.fillText(text1, 0, 0)
          ctx.fillText(text2, Constants.CANVAS_WIDTH * 0.35, 20)
          ctx.restore()
        }
        currentFrame++
        visibilityAccumFrames++
        if (visibilityAccumFrames >= visibilityIntervalFrames) {
          this.isVisible = !this.isVisible
          visibilityAccumFrames = 0
        }
        if (currentFrame === totalFrames) this.hasCompleted = true
      }
    }
  }
}