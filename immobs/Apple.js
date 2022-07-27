import Immob from "./Immob"

export default class Apple extends Immob {

  // ! Unsure if entGroup is defined, inherit from Immob

  static species = 'apple'
  species = 'apple'

  r = 6
  position = { x: 400, y: 400 }
  exp = 10
  expAbsorbRate = 1
  digestion = {
    timeLeft: 7000,
    baseTime: 7000
  }

  primaryColorHue = { start: 0, end: 25 }
  primaryColorSat = { start: 70, end: 30 }
  primaryColorLum = { start: 50, end: 30 }
  get primaryColor() { return (
    `hsl(
      ${
        this.primaryColorHue.start 
        + (this.primaryColorHue.end - this.primaryColorHue.start)
        * Math.ceil(
          (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
        )
      },
      ${
        this.primaryColorSat.start 
        + (this.primaryColorSat.end - this.primaryColorSat.start)
        + Math.ceil(
            (this.digestion.baseTime - this.digestion.timeLeft)
            / this.digestion.baseTime
          )
      }%,
      ${
        this.primaryColorLum.start
        + (this.primaryColorLum.end - this.primaryColorLum.start)
        + Math.ceil(
          (this.digestion.baseTime - this.digestion.timeLeft)
          / this.digestion.baseTime
        )
      }%
    )`
  )}
  set primaryColor({hueStart,hueEnd,satStart, satEnd, lumStart, lumEnd}) {
    // ! Doesn't catch out of range (x < 0, x > 255)
    if (typeof hueStart === 'number' || typeof hueEnd === 'number') {
      if (typeof hueStart !== 'number' || typeof hueEnd !== 'number') {
        throw Error(`Must specify both start & end values for primaryColorHue`)
      } else if (hueStart < 0 || hueStart > 255 || hueEnd < 0 || hueEnd > 255) {
        throw Error(`${this.species} primaryColorHue values must be in [0, 255]`)
      }
    }
    if ((typeof satStart === 'number' || typeof satEnd === 'number') 
    && (typeof satStart !== 'number' || typeof satEnd !== 'number')) {
        throw Error(`Must specify both start & end values for primaryColorHue`)
    }
    if ((typeof lumStart === 'number' || typeof lumEnd === 'number') 
    && (typeof lumStart !== 'number' || typeof lumEnd !== 'number')) {
        throw Error(`Must specify both start & end values for primaryColorHue`)
    }
    this.primaryColorHue = { start: hueStart, end: hueEnd } 
      || this.primaryColorHue
    this.primaryColorSat = { start: satStart, end: satEnd } 
      || this.primaryColorSat
    this.primaryColorLum = { start: lumStart, end: lumEnd } 
      || this.primaryColorLum
  }
  secondaryColor = `hsl(95 60% 50%)`

  get hitR() { return this.r + 1 }

  digestionEffect (entAffected) {
    entAffected.moveSpeed += 1
    return () => { entAffected.moveSpeed -= 1 }
  }

  absorbExp(entAffected) {
    if (this.exp > 0) {
      entAffected.exp += 1
      this.exp -= 1
    }
  }
  
  swallowEffect(entAffected) {
    entAffected.exp += Math.ceil(this.exp / 2)
    this.exp = Math.ceil(this.exp / 2)
  }

  drawInitWrapper(radians=null) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    radians && ctx.rotate(radians)

    this.drawComponents(ctx)

    ctx.restore()
  }

  drawBody(ctx) {
    ctx.save()
    ctx.rotate(Math.PI / 4)
    ctx.scale(0.8, 1)
    ctx.beginPath()
    ctx.arc(this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    ctx.arc(-this.r*0.3, 0, this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.primaryColor
    ctx.fill()

    this.drawShadow(ctx)

    ctx.restore()
  }

  drawShadow(ctx) {
    ctx.shadowOffsetY = this.r * 0.4
    ctx.shadowColor = 'hsl(0,0%,20%)'
    ctx.shadowBlur = this.r * 0.2
    ctx.fill()
  }

  drawLeaf(ctx) {
    ctx.save()
    ctx.rotate(-Math.PI/6)
    ctx.translate(this.r*0.8, 0.2 * this.r)
    ctx.beginPath()
    ctx.arc(0, 0, 0.4 * this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.leafColor
    ctx.fill()
    ctx.restore()
  }

  drawHighlight(ctx) {
    ctx.rotate(-.55 * Math.PI)
    ctx.translate(this.r*0.8, 0)
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 0.28, 0, 2 * Math.PI)
    ctx.fillStyle = 'hsla(0,0%,100%, 0.6)'
    ctx.fill()
  }

  drawStem(ctx) {
    ctx.save()
    ctx.rotate(-1)
    ctx.beginPath()
    ctx.moveTo(0.55*this.r,0)
    ctx.lineTo(1.1*this.r,0)
    ctx.lineWidth = 1.5
    ctx.strokeStyle = 'hsl(40, 60%, 20%)'
    ctx.stroke()
    ctx.restore()
  }

  drawComponents(ctx) {
    this.drawBody(ctx)
    this.drawLeaf(ctx)
    this.drawStem(ctx)
    this.drawHighlight(ctx)
  }

  update() {
  }
}