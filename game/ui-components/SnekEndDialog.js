import ModalButton from './ModalButton'
import Constants from '../Constants'

export default class SnekEndDialog {
  // Stops and Starts the play loop
  // CSDR removing start stop and letting draw run in background
  // for simplicity sake, after playing with this approach
  level
  score
  lifeSpan
  snek
  isVictory

  constructor(game, data) {
    this.game = game
    this.data = data

    this.isShown = false
    this.modalChildren = []

    this.size = {
      w: this.game.canvas.width * 0.9,
      h: this.game.canvas.height * 0.75
    }

    this.offset = {
      x: 25,
      y: 25,      
    }

    this.pos = {
      top: 0,
      left: 0,
      right: this.offset.x + this.size.w,
      bottom: this.offset.y + this.size.h
    }

    // **********************************************************************
    // ******************** Start Menu Button
    // **********************************************************************
    const startMenuButtonData = {
      origin: {
        x: 50,
        y: 50,
      },
      label: 'Start Menu',
      base: {
        w: 100
      },
      name: 'ED-startMenu',
    }

    this.startMenuButton = new ModalButton(
      this.game.ctx,
      startMenuButtonData,
      this.offset,
      // TODO goto start menu... refersh
      this.game.stateMachine.change('start'),
      { once: true},
    )

    this.modalChildren.push(this.startMenuButton)

    // Start this and its children initialize hidden
    this.hide()
    this.animateStep = 0
  }

  hide() {
    // This Modal Dialog must stop drawing when in a hidden state 
    this.isShown = false
    this.modalChildren.forEach(c => {
      c.isShown && c.hide()
    })
  }

  show() {
    // This Modal Dialog start drawing in shown state 
    // (setup as needed)
    if (this.data?.isVictory) {
      this.game.play.playRandomVictorySound()
    } else {
      // TODO play lose audio
      // this.game.sounds.draw[0].currentTime = 0
      // this.game.sounds.draw[0].play()
    }
    this.isShown = true
    this.render()
  }

  drawText() {
    this.game.ctx.fillText(
      `${this.data.isVictory
            ? 'Snek Flourished!'
            : 'Snek Perished!'
        }`,
      55, 55
    )
  }

  render() {
    if (this.isShown) {
      this.game.ctx.save()
      this.game.ctx.translate(this.offset.x, this.offset.y)

      this.game.ctx.beginPath()
      this.game.ctx.fillStyle = 'hsla(0, 0%, 95%, 0.75)'
      this.game.ctx.fillRect(0, 0, this.size.w, this.size.h)

      this.game.ctx.font = 'bold 60px Arial'
      
      this.drawText()

      // Present Game Number
      this.game.ctx.font = 'bold 20px Arial'
      this.game.ctx.decoration = 'underlined'
      this.game.ctx.fillStyle = 'black'
      this.game.ctx.fillText(
        `End of Game ${this.game.match.gameNo} of ${this.game.match.matchLength}`,
        200, 200
      )

      // Present Score Summary
      this.game.ctx.font = 'bold 20px Arial'
      this.game.ctx.fillStyle = 'crimson'
      this.game.ctx.fillText(
        `RED: ${this.game.match.red}`,
        200, 250
      ) 
      this.game.ctx.fillStyle = 'black'
      this.game.ctx.fillText(
        `BLACK: ${this.game.match.black}`,
        200, 300
      )

      // Present appropriate action
      if ((this.game.match.gameNo) / this.game.match.matchLength > 0.5
        && Math.abs(this.game.match.red - this.game.match.black) > 0) {
        this.newMatchButton.show()
      } else {
        this.nextGameButton.show()
      }
      this.game.ctx.restore()

      if (
        this.game.match.red === Math.ceil(this.game.match.matchLength / 2) ||
        this.game.match.black === Math.ceil(this.game.match.matchLength / 2)
      ) {
        // this.game.ctx.font = 'bold 48px Arial'
        // this.game.ctx.fillText(
        //   'WINS Game and Match!',
        //   25, 155
        // )
        this.animateMatchVictoryText()
      }
    } else {
      console.log(`Attempted to draw EndDialog while isShown=false`, )
    }
  }

  drawMatchVictoryText() {
    // canvas.style.border = '1px dotted green'
    this.animateStep++
    
    this.game.ctx.font = 'bold 48px courier'
    this.game.ctx.fillStyle = 'hsl(0, 50%, 50%)'

    const drawLetter = (char, x, y, phase=0, ) => {

      const colorAngle = Math.floor((this.animateStep + phase)) % 360
      this.game.ctx.fillStyle = `hsl(${colorAngle}, 100%, 40%)`
      this.game.ctx.fillText(char, x + 5, y)

    }

    const text = 'Wins Game and Match!'
    
    return () => {
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ') {
          drawLetter(text[i], i*30, 150, i*20)
        }
      }
    }
  }

  animateMatchVictoryText() {
    this.game.ctx.save()
    this.game.ctx.translate(this.offset.x, this.offset.y)

    // this.game.ctx.clearRect(0, 0, 600, 40)
    this.drawMatchVictoryText()()

    this.game.ctx.restore()

    requestAnimationFrame(this.animateMatchVictoryText.bind(this))
  }
}