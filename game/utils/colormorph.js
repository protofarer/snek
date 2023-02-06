/** Produces a design space oriented CSS color string that responds to a set of
 * parameters that specify how the color changes over the period of digestion 
 * @return {string} "hsl(hue, saturation, luminance)"
 */
export function getColorParameters(ratio) { 
  const hueString = `${
    this.primaryColorParameters.hue.start 
    + (this.primaryColorParameters.hue.end - this.primaryColorParameters.hue.start)
    * ratio
    // (this.digestion.baseTime - this.digestion.timeLeft)
    //   / this.digestion.baseTime
  }`

  const satString = `${
    this.primaryColorParameters.sat.start 
    + (this.primaryColorParameters.sat.end - this.primaryColorParameters.sat.start)
    * ratio
    // (this.digestion.baseTime - this.digestion.timeLeft)
    //     / this.digestion.baseTime
  }%`

  const lumString = `${
    this.primaryColorParameters.lum.start
    + (this.primaryColorParameters.lum.end - this.primaryColorParameters.lum.start)
    * ratio
    // (this.digestion.baseTime - this.digestion.timeLeft)
    //   / this.digestion.baseTime
  }%`

  const alphaString = `${this.primaryColorParameters.alpha.start
    + (this.primaryColorParameters.alpha.end - this.primaryColorParameters.alpha.start)
    * ratio
    // (this.digestion.baseTime - this.digestion.timeLeft)
    //   / this.digestion.baseTime
  }`

  return `hsl(${hueString}, ${satString}, ${lumString}, ${alphaString})`
}

  /** Validates the colormorph parameters and sets them respectively
   * @function
   * @return undefined
  */
export function setColorParameters({
  hueStart, 
  hueEnd, 
  satStart, 
  satEnd, 
  lumStart, 
  lumEnd, 
  alphaStart,
  alphaEnd
}) {
  if (typeof hueStart === 'number' || typeof hueEnd === 'number') {
    if (typeof hueStart !== 'number' || typeof hueEnd !== 'number') {
      throw Error(`Must specify both start & end values for primaryColorParameters.hue`)
    } else if (hueStart < 0 || hueStart > 255 || hueEnd < 0 || hueEnd > 255) {
      throw Error(`${this.species} primaryColorParameters.hue values must be in [0,255]`)
    } else {
      this.primaryColorParameters.hue = { start: hueStart, end: hueEnd } 
    }
  }

  if (typeof satStart === 'number' || typeof satEnd === 'number') {
    if (typeof satStart !== 'number' || typeof satEnd !== 'number') {
        throw Error(`Must specify both start & end values for primaryColorParameters.sat`)
    } else if (satStart < 0 || satStart > 100 || satEnd < 0 || satEnd > 100) {
      throw Error(`${this.species} primaryColorParameters.sat values must be in [0,100]`)
    } else {
      this.primaryColorParameters.sat = { start: satStart, end: satEnd } 
    }
  }

  if (typeof lumStart === 'number' || typeof lumEnd === 'number') {
    if (typeof lumStart !== 'number' || typeof lumEnd !== 'number') {
        throw Error(`Must specify both start & end values for primaryColorParameters.lum`)
    } else if (lumStart < 0 || lumStart > 100 || lumEnd < 0 || lumEnd > 100) {
      throw Error(`${this.species} primaryColorParameters.lum values must be in [0,255]`)
    } else {
      this.primaryColorParameters.lum = { start: lumStart, end: lumEnd } 
    }
  }

  if (typeof alphaStart === 'number' || typeof alphaEnd === 'number') {
    if (typeof alphaStart !== 'number' || typeof alphaEnd !== 'number') {
        throw Error(`Must specify both start & end values for primaryColorParameters.alpha`)
    } else if (alphaStart < 0 || alphaStart > 1 || alphaEnd < 0 || alphaEnd > 1) {
      throw Error(`${this.species} primaryColorParameters.alpha values must be in [0,1]`)
    } else {
      this.primaryColorParameters.alpha = { start: alphaStart, end: alphaEnd } 
    }
  }
}

export function animatedTextLine(ctx, font, offset, text ) {
  // canvas.style.border = '1px dotted green'
  let animateStep = 0
  const size = font?.size || 12
  const family = font?.family || 'Arial'
  const weight = font?.weight || 'normal'

  const drawLetter = (char, kerning, phase=0) => {
    const colorAngle = Math.floor((animateStep + phase)) % 360
    ctx.fillStyle = `hsl(${colorAngle}, 100%, 40%)`
    ctx.fillText(char, kerning, 0)
  }

  return () => {
    animateStep++
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.font = `${weight} ${size}px ${family}`
    ctx.fillStyle = 'hsl(0, 50%, 50%)'
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') {
        drawLetter(text[i], i*0.75*size, i*-20)
      }
    }
    ctx.restore()
  }
}