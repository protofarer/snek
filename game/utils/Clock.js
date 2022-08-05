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

