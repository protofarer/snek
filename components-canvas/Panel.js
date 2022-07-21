import CONSTANTS from '../Constants'
import Button from './Button'
import ReactiveButton from './ReactiveButton'
export default class Panel {
  constructor (offset, dims, game) {
    // All distances and lengths are in pixels, unfortunately for now
    this.drawableChildren = []
    this.game = game

    // Panel Origin
    this.offset = {
      x: offset.x,
      y: offset.y
    }

    this.width = dims.w
    this.height = dims.h
    this.centerX = this.width / 2
    this.centerY = this.height / 2

    // Define vertical separation for all vertically aligned items
    this.verticalAlignmentGap = 280

    this.separatorVerticalGap = this.verticalAlignmentGap
    this.separatorUpperY = this.centerY - this.separatorVerticalGap/2
    this.separatorLowerY = this.centerY + this.separatorVerticalGap/2
    
    this.redJailOffsetX = 20   // relative to panel origin
    this.redJailOffsetY = 20  // relative to panel origin

    this.blackJailOffsetX = 20
    this.blackJailOffsetY = this.height - 20

    // **********************************************************************
    // ********************   Reset Button (deprecated, placeholder for new button)
    // **********************************************************************
    // const resetButtonData = {
    //   origin: {
    //     x: this.centerX - 35,
    //     y: this.separatorLowerY - 30 - 20,    // button height and gap
    //   },
    //   label: 'Restart',
    //   labelColor: 'red',
    //   areaFill: 'hsl(220,40%,97%)',
    //   borderStroke: 'red'
    // }
    // this.resetButton = new Button(
    //   this.game.ctx, 
    //   resetButtonData,
    //   this.offset,
    //   startNewGame,
    //   { signal: this.game.controller.signal }
    // )
    // this.drawableChildren.push(this.resetButton)

    // **********************************************************************
    // ******************** New Match
    // **********************************************************************
    const newMatchButtonData = {
      origin: {
        x: this.centerX - 80,
        y: this.separatorLowerY - 45,    // button height and gap
      },
      base: {
        w: 160,
      },
      name: 'Pan-newMatch',
      label: 'Setup New Match',
      labelColor: 'Black',
      areaFill: 'hsl(220,40%,97%)',
      borderStroke: 'hsl(0,0%,5%)',
    }
    this.newMatchButton = new Button(
      this.game.ctx, 
      newMatchButtonData,
      this.offset,
      () => window.location.replace('/'), // access via wormhole
      // { signal: this.game.controller.signal }
    )
    this.drawableChildren.push(this.newMatchButton)

    // Basic reactive button colors
    function reactTurnColor(game, playerColor) {
      return (button) => {
        game.ctx.font = '16px Arial'
        button.labelColor = game.turnColor === playerColor 
          ? 'hsl(0, 0%, 20%)' 
          : button.areaFill
        button.areaFill = game.turnColor === playerColor
          ? 'hsl(210,90%,85%'
          : 'hsl(210,20%,85%)'
      }
    }

    // **********************************************************************
    // ********************   Pass Buttons
    // **********************************************************************
    const passButtonsVerticalGap = this.separatorVerticalGap + 84
    const passButtonDims = { w: 160, h: 30 }

    // **********************************************************************
    // ********************   Red Pass Button
    // **********************************************************************
    const redPassButtonData = {
      origin: {
        x: this.centerX - passButtonDims.w/2,
        y: this.centerY - passButtonsVerticalGap/2 - passButtonDims.h/2
      },
      base: {
        w: passButtonDims.w
      },
      name: 'redPass',
      label: 'Pass',
    }
    this.redPassButton = new ReactiveButton(
      this.game.ctx, 
      redPassButtonData,
      this.offset,
      this.game.passTurn(CONSTANTS.RED), 
      {}, // { signal: this.game.controller.signal },
      reactTurnColor(game, CONSTANTS.RED),
    )
    this.drawableChildren.push(this.redPassButton)
    // **********************************************************************
    // ********************   Black Pass Button
    // **********************************************************************
    const blackPassButtonData = {
      origin: {
        x: this.centerX - passButtonDims.w/2,
        y: this.centerY + passButtonsVerticalGap/2 - passButtonDims.h/2
      },
      base: {
        w: passButtonDims.w
      },
      name: 'blackPass',
      label: 'Pass',
    }
    this.blackPassButton = new ReactiveButton(
      this.game.ctx, 
      blackPassButtonData,
      this.offset,
      this.game.passTurn(CONSTANTS.BLACK), 
      {}, // { signal: this.game.controller.signal },
      reactTurnColor(game, CONSTANTS.BLACK),
    )
    this.drawableChildren.push(this.blackPassButton)

    // **********************************************************************
    // ********************   Turn Indicators
    // **********************************************************************
    this.turnIndicatorColor = 'hsl(100, 100%, 45%)'
    this.turnIndicatorRadius = 8
    this.turnIndicatorX = this.centerX - 60
    this.turnIndicatorCenterY = this.centerY
    this.turnIndicatorVerticalGap = this.separatorVerticalGap + 84

    // **********************************************************************
    // ********************   Informational Messssage Area
    // **********************************************************************
    this.infoBox = document.createElement('div')
    this.infoBox.style.position = 'absolute'
    this.infoBox.style.left = `${offset.x + 25}px`
    this.infoBox.style.top = `${this.separatorUpperY + 15}px`
    this.infoBox.style.height = `${this.verticalAlignmentGap - 65}px`
    this.infoBox.style.width = `${this.width - 30}px`
    this.infoBox.style.fontFamily = 'Arial'
    this.infoBox.style.display = 'flex'
    this.infoBox.style.flexFlow = 'column nowrap'
    this.infoBox.style.alignItems = 'stretch'
    this.infoBox.style.gap = '1px'
    this.infoBox.style.padding = '1px'
    document.body.append(this.infoBox)

    this.scoreInfo = document.createElement('div')
    this.scoreInfo.style.flexGrow = 0
    this.scoreInfo.style.textAlign = 'center'
    this.infoBox.append(this.scoreInfo)

    this.turnInfo = document.createElement('div')
    this.turnInfo.style.flexGrow = 0
    this.turnInfo.style.textAlign = 'center'
    this.infoBox.append(this.turnInfo)

    this.statusInfo = document.createElement('div')
    this.statusInfo.style.flexGrow = 1
    this.infoBox.append(this.statusInfo)
  }

  drawDebugJail() {
    // Draw red's jail
    this.game.ctx.beginPath()
    this.game.ctx.font = '16px Arial'
    this.game.ctx.fillStyle = 'black'
    this.game.ctx.fillText(
      `Blacks captured: ${this.game.captures.capturedBlacks.length}`, 
      this.redJailOffsetX, 
      this.redJailOffsetY
    )

    // Draw black's jail
    this.game.ctx.fillText(
      `Reds captured: ${this.game.captures.capturedReds.length}`, 
      this.blackJailOffsetX, 
      this.blackJailOffsetY + 12
    )
    this.game.ctx.restore()
  }

  drawCapturedDiscs() {
    const scaleRatio = 0.5
    const horizontalOffset = 100
    const verticalOffset = 100

    const redJailTop = 45
    this.game.ctx.save()
    this.game.ctx.translate(this.centerX - 50, redJailTop)
    this.game.ctx.scale(scaleRatio, scaleRatio)
    this.game.captures.capturedBlacks.forEach((disc, ndx) => {
      if (ndx > 0 && ndx % 3 === 0) {
        this.game.ctx.translate(-3 * horizontalOffset,verticalOffset)
      }
      disc.draw()
      this.game.ctx.translate(horizontalOffset, 0)
    })
    this.game.ctx.restore()

    const blackJailBottom = this.height - 45
    this.game.ctx.save()
    this.game.ctx.translate(this.centerX - 50, blackJailBottom)
    this.game.ctx.scale(scaleRatio, scaleRatio)
    this.game.captures.capturedReds.forEach((disc, ndx) => {
      if (ndx > 0 && ndx % 3 === 0) {
        this.game.ctx.translate(-3 * horizontalOffset, -verticalOffset)
      }
      disc.draw()
      this.game.ctx.translate(horizontalOffset, 0)
    })
    this.game.ctx.restore()
  }

  draw() {
    // **********************************************************************
    // ********************   PANEL
    // **********************************************************************
    // Topmost panel container
    this.game.ctx.save()
    this.game.ctx.translate(this.offset.x, this.offset.y)

    this.game.ctx.beginPath()
    this.game.ctx.lineWidth = 1
    this.game.ctx.strokeStyle = 'rgb(0,0,0,0.5)'
    this.game.ctx.strokeRect(0, 2, this.width - 2, this.height - 4)
    this.game.ctx.fillStyle = 'hsl(45,80%,93%)'
    this.game.ctx.fillRect(0, 2, this.width - 2, this.height - 4)

    // Dividing line between players' respective info subpanels
    this.game.ctx.moveTo(15, this.separatorUpperY)
    this.game.ctx.lineTo(15 + this.width - 30, this.separatorUpperY)
    this.game.ctx.moveTo(15, this.separatorLowerY)
    this.game.ctx.lineTo(15 + this.width - 30, this.separatorLowerY)


    this.drawCapturedDiscs()
    this.drawableChildren.forEach(c => c.draw())

    // Red's empty turn indicator
    this.game.ctx.moveTo(this.turnIndicatorX + this.turnIndicatorRadius, this.turnIndicatorCenterY - this.turnIndicatorVerticalGap/2)
    this.game.ctx.arc(
      this.turnIndicatorX, 
      this.turnIndicatorCenterY - this.turnIndicatorVerticalGap/2, 
      this.turnIndicatorRadius, 0, 2*Math.PI
    )
    this.game.ctx.fillStyle = 'hsl(0, 0%, 88%)'
    this.game.ctx.fill()
    this.game.ctx.lineWidth = 1
    this.game.ctx.strokeStyle = 'hsl(0, 0%, 30%)'
    this.game.ctx.stroke()

    // Black's empty turn indicator
    this.game.ctx.moveTo(this.turnIndicatorX + this.turnIndicatorRadius, this.turnIndicatorCenterY + this.turnIndicatorVerticalGap/2)
    this.game.ctx.arc(
      this.turnIndicatorX, 
      this.turnIndicatorCenterY + this.turnIndicatorVerticalGap/2,
      this.turnIndicatorRadius, 0, 2*Math.PI)
    this.game.ctx.fillStyle = 'hsl(0, 0%, 88%)'
    this.game.ctx.fill()
    this.game.ctx.lineWidth = 1
    this.game.ctx.strokeStyle = 'hsl(0, 0%, 30%)'
    this.game.ctx.stroke()

    this.game.ctx.beginPath()
    this.game.turnColor === CONSTANTS.RED
      ? this.game.ctx.arc(this.turnIndicatorX, this.turnIndicatorCenterY - this.turnIndicatorVerticalGap/2, this.turnIndicatorRadius - 1, 0, 2*Math.PI)
      : this.game.ctx.arc(this.turnIndicatorX, this.turnIndicatorCenterY + this.turnIndicatorVerticalGap/2, this.turnIndicatorRadius - 1, 0, 2*Math.PI)
    this.game.ctx.fillStyle = this.turnIndicatorColor
    this.game.ctx.fill()

    this.turnInfo.innerHTML = `\
      <span>Game: ${this.game.match.gameNo}/${this.game.match.matchLength}&nbsp;&nbsp;</span><span>Turn: ${this.game.turnCount} </span>
      `
    this.statusInfo.innerHTML = `\
      <span style="color: blue;">${this.game.msg}</span>
    `
    this.scoreInfo.innerHTML = `\
      <span style="color: crimson;">Red: ${this.game.match.red}</span>&nbsp;
      <span style="color: black;">Black: ${this.game.match.black}</span>
    `
    
    // debuggery
    this.game.debugMode && this.drawDebugJail()
    this.infoBox.style.border = this.game.debugOverlay 
      ? '1px solid blue' 
      : 'none'
    this.turnInfo.style.border = this.game.debugOverlay 
      ? '1px solid orange'
      : 'none'
    this.statusInfo.style.border = this.game.debugOverlay 
    ? '1px solid red'
    : 'none'
    this.scoreInfo.style.border = this.game.debugOverlay 
    ? '1px solid green'
    : 'none'

    // Restore from Panel Offset
    this.game.ctx.restore()
  }
}
