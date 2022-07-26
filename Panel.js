export default class Panel {
  panelContainer = document.createElement('div')
  infobox = document.createElement('div')
  score = document.createElement('div')
  gameInfo = document.createElement('div')
  statusMsg = document.createElement('div')
  newGameButton = document.createElement('button')

  constructor(game) {
    this.game = game
    this.panelContainer.id = 'panel'

    this.infobox.id = 'infobox'
    this.panelContainer.appendChild(this.infobox)
  
    this.score.id = 'info-score'
    this.infobox.appendChild(this.score)
  
    this.gameInfo.id = 'info-game'
    this.infobox.appendChild(this.gameInfo)
  
    // this.statusMsg.id = 'info-msg'
    // this.infobox.appendChild(this.statusMsg)

    this.newGameButton.id = 'newGameButton'
    this.newGameButton.innerText = 'New Game'
    this.infobox.appendChild(this.newGameButton)
  
  
    // before init, for debug
    this.infobox.style.color = 'lawngreen'
    this.statusMsg.innerText = '$msg'
    this.score.innerText = '$score'
    this.gameInfo.innerText = '$exp'
    console.info('%cUI initializing', 'color: orange')

    this.setupEventListeners()
    this.updateMsg()
  }

  setupEventListeners() {
    this.newGameButton.addEventListener('click', () => {
      window.location.replace('/')
    })
  }

  // Full panel display update outside of step
  // ! unused
  updateMsg() {
    this.statusMsg.innerHTML = `${this.game.state.msg}`
    
    const delayClr = (delay) => new Promise(res => setTimeout(res, delay))
    delayClr(4000)
      .then(() => this.statusMsg.innerHTML = '')
  }

  render() {
    this.score.innerHTML = `score: ${this.game.state.score}`
    this.gameInfo.innerHTML = `exp: ${this.game.snek?.state.exp}&nbsp;&nbsp;&nbsp;lifespan: ${this.game.clock.getElapsedSeconds()}s`
  }
}