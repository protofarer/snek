import { turnErratically } from '../../behaviors/movements'
import Mob from './Mob'
import { getGameObject, loadTraits } from '../../utils/helpers'
import Traits from '../Traits'
import Constants from '../../Constants.js'

export default class Ant extends Mob {
  static species = 'ant'
  species = 'ant'

  carriedEnt = null
  carriedOffsetRad = null

  get hitR() { return this.r + this.hitOffset }

  get headCoords() { return { 
    x: this.position.x 
      + Math.cos(this.headingRadians) * this.r * 1.1,
    y: this.position.y 
      + Math.sin(this.headingRadians) * this.r * 1.1
  }}

  get mouthCoords() { return {
      x: this.headCoords.x + 0.6 * this.r * Math.cos(this.headingRadians),
      y: this.headCoords.y + 0.6 * this.r * Math.sin(this.headingRadians),
  }}

  constructor(ctx, startPosition=null, parent=null) {
    super(ctx, startPosition, parent)
    loadTraits.call(this, Traits.Ant)
    this.baseTurnRate = this.baseMoveSpeed + this.turnRateOffset
    this.currExp = this.baseExp
    this.currMoveSpeed = this.baseMoveSpeed
    this.currTurnRate = this.baseTurnRate
    this.setHitAreas()
  }

  static spawnCondition(world) {
    return () => world.countSweets() > 4
  }

  static swarmListener(playStartT, world) {
    let lastSpawnT = playStartT

    let tickCount = 0
    let tick1 = null
    let tickDetected = null

    return (t) => {
      if (tickCount < 30) {
        tickCount++
        if (tickCount === 29) tick1 = t
      }      
      if (tickCount === 30 && tick1 > 0) {
        tickDetected = t - tick1
        tick1 = null
      }
      if (t !== playStartT && tickDetected === null) {
        tickDetected = t - playStartT
      }
      if (world.countSweets() > 5 && (t - lastSpawnT >= Constants.events.antSwarm.cooldown)) {
        lastSpawnT = t
        world.spawnEnts('ant', 5)
        for (let i = 1; i < 6; ++i) {
          setTimeout(() => world.spawnEnts('ant', 3), i*1000*(tickDetected/Constants.TICK))
        }
      }
    }
  }

  grab(ent) {
    this.carriedEnt = ent
    this.carriedEnt.parent = this
    this.carriedEnt.hitArea = new Path2D()
    this.carriedOffsetRad = this.headingRadians
      - this.carriedEnt.headingRadians
  }

  drop() {
    this.carriedEnt.parent = getGameObject.call(this)
    this.carriedEnt.setHitAreas()
    this.carriedOffsetRad = null
    this.carriedEnt = null
  }

  drawHitOverlays() {
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke(this.hitArea)

    this.ctx.beginPath()
    this.ctx.arc(this.mouthCoords.x, this.mouthCoords.y, 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
  }

  move() {
    if (this.isMobile) {
      if (Math.random() < 0.8) {
        this.position.x += this.currMoveSpeed * Math.cos(this.headingRadians)
        this.position.y += this.currMoveSpeed * Math.sin(this.headingRadians)
      } else {
        this.isTurnable && turnErratically.call(this)
      }
      this.setHitAreas()
    }
  }

  drawHead(ctx) {
    // Draw Head
    ctx.beginPath()
    ctx.arc(1.1*this.r,0,0.5*this.r,0,2*Math.PI)
    ctx.fill()
  }

  drawBody(ctx) {
    // Draw Thorax
    ctx.rect(this.r*-1, -this.r/4, this.r*2, this.r/2 )
    ctx.shadowColor = 'hsl(0,0%,25%)'
    ctx.shadowBlur = 6
    ctx.fillStyle = this.primaryColor
    ctx.fill()

    // Draw Abdomen
    ctx.arc(-1.4*this.r, 0, 0.7*this.r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.shadowBlur = ctx.shadowOffsetY = ctx.shadowColor = null 
  }

  drawLegs(ctx) {
    // Draw Legs
    ctx.beginPath()
    ctx.moveTo(this.r, 1.2*this.r)
    ctx.lineTo(-this.r, -1.2*this.r)
    ctx.moveTo(this.r, -1.2*this.r)
    ctx.lineTo(-this.r, 1.2*this.r)
    ctx.moveTo(0, -1.5*this.r)
    ctx.lineTo(0, 1.5*this.r)
    ctx.moveTo(0,0)
    ctx.strokeStyle = this.primaryColor
    ctx.stroke()
  }

  drawComponents(ctx) {
    this.drawLegs(ctx)
    this.drawBody(ctx)
    this.drawHead(ctx)
  }
  render() {
    this.drawInitWrapper(this.headingRadians)
    this.carriedEnt?.render()
  }

  update() {
    this.move()
    // TODO carriedEnt renders at 2 times its own positional coordinates
    if (this.carriedEnt) {
      this.carriedEnt.position = this.mouthCoords
      this.carriedEnt.headingRadians = this.headingRadians + this.carriedOffsetRad
      // console.log(`mouthcoords`, this.mouthCoords)
      // console.log(`carriedent.pos`, this.carriedEnt.position)
      
      // ! hitArea null, may be used for snatch mechanic
      // ! current snek will eat both ant and carriedEnt
    }

  }
}