/** Produces a design space oriented CSS color string that responds to a set of
 * parameters that specify how the color changes over the period of digestion 
 * @return {string} "hsl(hue, saturation, luminance)"
 */
export function getColorParameters() { return (
    `hsl(
      ${
        this.primaryColorParameters.hue.start 
        + (this.primaryColorParameters.hue.end - this.primaryColorParameters.hue.start)
        * (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
      },
      ${
        this.primaryColorParameters.sat.start 
        + (this.primaryColorParameters.sat.end - this.primaryColorParameters.sat.start)
        * (this.digestion.baseTime - this.digestion.timeLeft)
            / this.digestion.baseTime
      }%,
      ${
        this.primaryColorParameters.lum.start
        + (this.primaryColorParameters.lum.end - this.primaryColorParameters.lum.start)
        * (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
      }%
    )`
  )}

  /** Validates the colormorph parameters and sets them respectively
   * @function
   * @return undefined
  */
export function setColorParameters({hueStart, hueEnd, satStart, satEnd, lumStart, lumEnd}) {
  // ! Doesn't catch out of range (x < 0, x > 255)
  if (typeof hueStart === 'number' || typeof hueEnd === 'number') {
    if (typeof hueStart !== 'number' || typeof hueEnd !== 'number') {
      throw Error(`Must specify both start & end values for primaryColorParameters.hue`)
    } else if (hueStart < 0 || hueStart > 255 || hueEnd < 0 || hueEnd > 255) {
      throw Error(`${this.species} primaryColorParameters.hue values must be in [0, 255]`)
    } else {
      this.primaryColorParameters.hue = { start: hueStart, end: hueEnd } 
        || this.primaryColorParameters.hue
    }
  }
  if (typeof satStart === 'number' || typeof satEnd === 'number') {
    if (typeof satStart !== 'number' || typeof satEnd !== 'number') {
        throw Error(`Must specify both start & end values for primaryColorParameters.hue`)
    } else if (satStart < 0 || satStart > 100 || satEnd < 0 || satEnd > 100) {
      throw Error(`${this.species} primaryColorParameters.sat values must be in [0, 100]`)
    } else {
      this.primaryColorParameters.sat = { start: satStart, end: satEnd } 
        || this.primaryColorParameters.sat
    }
  }
  if (typeof lumStart === 'number' || typeof lumEnd === 'number') {
    if (typeof lumStart !== 'number' || typeof lumEnd !== 'number') {
        throw Error(`Must specify both start & end values for primaryColorParameters.hue`)
    } else if (lumStart < 0 || lumStart > 100 || lumEnd < 0 || lumEnd > 100) {
      throw Error(`${this.species} primaryColorParameters.hue values must be in [0, 255]`)
    } else {
      this.primaryColorParameters.lum = { start: lumStart, end: lumEnd } 
        || this.primaryColorParameters.lum
    }
  }
}

export function animatedTextLine(ctx, text, offset) {
  // canvas.style.border = '1px dotted green'
  let animateStep = 0

  const drawLetter = (char, superKerning, phase=0) => {
    const colorAngle = Math.floor((animateStep + phase)) % 360
    ctx.fillStyle = `hsl(${colorAngle}, 100%, 40%)`
    ctx.fillText(char, superKerning + 5, 0)
  }

  return () => {
    animateStep++
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = 'hsl(0, 50%, 50%)'
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') {
        drawLetter(text[i], i*25, i*20)
      }
    }
    ctx.restore()
  }
}