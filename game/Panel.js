export default class Panel {
  panelContainer = document.createElement('div')
  expbar = document.createElement('div')
  infobox = document.createElement('div')
  score = document.createElement('div')
  level = document.createElement('div')
  gameInfo = document.createElement('div')
  statusMsg = document.createElement('div')
  newGameButton = document.createElement('button')

  constructor(game) {
    this.game = game
    this.panelContainer.id = 'panel'
    this.expbar.id = 'expbar'
    this.panelContainer.appendChild(this.expbar)
    this.expSegments = []

    for (let i = 0; i < 10; i++) {
      const expSegment = document.createElement('div')
      expSegment.id = `expSegment${i}`
      expSegment.className = 'expSegment'
      this.expSegments.push(expSegment)
      this.expbar.appendChild(expSegment)
    }

    this.infobox.id = 'infobox'
    this.panelContainer.appendChild(this.infobox)
  
    this.score.id = 'info-score'
    this.infobox.appendChild(this.score)

    this.level.id = 'info-level'
    this.infobox.appendChild(this.level)
  
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
    this.level.innerText = '$level'
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
    this.statusMsg.innerHTML = `${this.game.msg}`
    
    const delayClr = (delay) => new Promise(res => setTimeout(res, delay))
    delayClr(4000)
      .then(() => this.statusMsg.innerHTML = '')
  }

  render() {
    this.score.innerHTML = `score: ${this.game.score}`
    if (this.game.snek) {
      this.level.innerHTML = `level: ${this.game.snek.level}`
      this.gameInfo.innerHTML = `exp: ${Math.trunc(this.game.snek.currExp)}&nbsp;&nbsp;&nbsp;lifespan: ${this.game.clock.getElapsedSeconds()}s`
      this.expSegments.forEach((seg, idx) => {
        const segmentsFilled = Math.floor(
          10* this.game.snek.expGainedThisLevelOnly
          / (
            this.game.snek.expForLevel(this.game.snek.level + 1)
            - (
              this.game.snek.level === 1 
                ? 0
                : this.game.snek.expForLevel(this.game.snek.level)
            )
          )
        ) 
        
        if (segmentsFilled > idx ) {
          seg.style.backgroundColor = 'purple'
        } else {
          seg.style.backgroundColor = 'transparent'
        }
      })
    }
  }
}