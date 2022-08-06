/**
 * Utility class for reading and triggering off of the game loop time variable
 * @class
 * @property {number} clockCycle60 - perpetually ticks [0, 60) on the game loop
 * @property {number} clockCycle5Min - perpetually ticks [0, 18000) on the 
 *    game loop
 * @property {boolean} isClockDrawn - flag for showing the debug clock 
 *    animation
 * @property {number} elapsed - time (ms) elapsed since start of frame
 * @property {number} t - time (ms) of current game loop provided by 
 *    requestAnimationFrame
 */
export default class Clock {
  typename = 'clock'
  clockCycle60 = 0
  clockCycle5Min = 0
  isClockDrawn = false
  elapsed = 0
  t
  
  constructor(ctx, parent=null) {
    this.ctx = ctx
    this.parent = parent
  }

  getElapsedSeconds() {
    return Math.floor(this.t / 1000)
  }

  show() {
    this.isClockDrawn = true
  }

  hide() {
    this.isClockDrawn = false
  }

  toggle() {
    this.isClockDrawn = !this.isClockDrawn
    console.log(`clock toggled to`, this.isClockDrawn )
  }

  drawClock() {
    this.ctx.beginPath()
    this.ctx.moveTo(30, 5)
    this.ctx.lineTo(30, 10)

    if (this.clockCycle60 > 0 && this.clockCycle60 < 5){
      this.ctx.moveTo(55, 30)
      this.ctx.arc(30, 30, 25, 0, 2 * Math.PI)
    }

    this.ctx.save()
    this.ctx.translate(30, 30)
    this.ctx.moveTo(0,0)
    this.ctx.rotate((this.clockCycle60 * 2 * Math.PI / 60) - 0.5 * Math.PI)
    this.ctx.lineTo(20,0)
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
    this.ctx.restore()
  }

  update() {
    this.isClockDrawn = window.sessionStorage
      .getItem('isClockDrawn') === 'true' ? true : false
    this.clockCycle60 = this.clockCycle60 === 60 ? 0 : this.clockCycle60 + 1
    this.clockCycle5Min = this.clockCycle5Min === 18000 ? 0 : this.clockCycle5Min + 1
  }

  render() {
    this.isClockDrawn && this.drawClock()
  }
}

