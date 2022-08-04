import Immob from './Immob'
import { baseSwallowEffect } from '../behaviors'
export default class Apple extends Immob {

  // ! Unsure if entGroup is defined, inherit from Immob

  static species = 'apple'
  species = 'apple'

  r = 6
  digestion = {
    timeLeft: 12000,
    baseTime: 12000
  }

  baseExp = 10
  currExp = this.baseExp

  secondaryColor = `hsl(95 60% 50%)`

  constructor(ctx, startPosition, parentEnt) {
    super(ctx, startPosition, parentEnt)

    this.directionAngleDegrees = -135 + 135*Math.random()
    this.primaryColor = { 
      hueStart: 0, 
      hueEnd: 25, 
      satStart: 70,
      satEnd: 30,
      lumStart: 50,
      lumEnd: 25,
    }
    this.postDigestionData = [
      {
        effect: 'moveSpeed',
        moveSpeed: 0.25,
        duration: 18000,
        timeLeft: 18000
      },
    ]
      // TEST
    // this.underDigestionData = [
      // {
      //   effect: 'moveSpeed',
      //   moveSpeed: 0.25,
      //   duration: 3000,
      //   timeLeft: 3000
      // },
    //   {
    //     effect: 'primaryColor',
    //     primaryColor: 'red',
    //     duration: 5000,
    //     timeLeft: 5000
    //   }
    // ]
    this.setHitAreas()
  }

  // onDigestionEffect (entAffected) {
    // entAffected.moveSpeed = entAffected.moveSpeed + 1
    // return () => { entAffected.moveSpeed = entAffected.moveSpeed - 1 }
  // }

  // postDigestionEffect () {
  //   if (!this.wasExcreted) {
  //     return {
  //       effect: 'moveSpeed',
  //       moveSpeed: 0.25,
  //       duration: 12000,
  //       timeLeft: 12000
  //     }
  //   } else {
  //     return null
  //   }
  // }
  
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

  // TODO double-filling body here
  drawShadow(ctx) {
    ctx.shadowOffsetY = this.r * 0.4
    ctx.shadowColor = 'hsl(0,0%,20%)'
    ctx.shadowBlur = this.r * 0.2
    ctx.fill()
    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 
  }

  drawLeaf(ctx) {
    ctx.save()
    ctx.rotate(-Math.PI/6)
    ctx.translate(this.r*0.8, 0.2 * this.r)
    ctx.beginPath()
    ctx.arc(0, 0, 0.4 * this.r, 0, 2 * Math.PI)
    ctx.fillStyle = this.secondaryColor
    ctx.fill()
    ctx.restore()
  }

  drawHighlight(ctx) {
    ctx.save()
    ctx.rotate(-.55 * Math.PI)
    ctx.translate(this.r*0.8, 0)
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 0.28, 0, 2 * Math.PI)
    ctx.fillStyle = 'hsla(0,0%,100%, 0.6)'
    ctx.fill()
    ctx.restore()
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
}