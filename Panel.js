export default class Panel {
  panelContainer = document.createElement('div')
  infobox = document.createElement('div')
  score = document.createElement('div')
  gameInfo = document.createElement('div')
  statusMsg = document.createElement('div')
  newGameButton = document.createElement('button')
  game = null

  constructor() {
    this.panelContainer.id = 'panel'

    this.infobox.id = 'infobox'
    this.panelContainer.appendChild(this.infobox)
  
    this.score.id = 'info-score'
    this.infobox.appendChild(this.score)
  
    this.gameInfo.id = 'info-game'
    this.infobox.appendChild(this.gameInfo)
  
    this.statusMsg.id = 'info-msg'
    this.infobox.appendChild(this.statusMsg)

    this.newGameButton.id = 'newGameButton'
    this.newGameButton.innerText = 'New Game'
    this.infobox.appendChild(this.newGameButton)
  
  
    // before init, for debug
    this.statusMsg.innerText = '$msg'
    console.info('%cUI initializing', 'color: orange')
  }

  init(game) {
    // Call after game is initialized
    this.game = game
    this.setupEventListeners()
    this.update()
  }

  setupEventListeners() {
    this.newGameButton.addEventListener('click', () => {
      window.location.replace('/')
    })
  }

  update() {
    this.statusMsg.innerHTML = `${this.game.msg}`
    const delayClr = (delay) => new Promise(res => setTimeout(res, delay))
    delayClr(4000)
      .then(() => this.statusMsg.innerHTML = '')
  }
}