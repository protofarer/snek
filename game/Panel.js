/** Informational and Player Controls panel external to canvas element 
 * @class
 * @property {HTMLDivElement} panelContainer - Panel's top level container
 * @property {HTMLDivElement} expbar - displays Snek's exp graphically
 * @property {HTMLDivElement} infobox - container for informational elements
 * @property {HTMLDivElement} score - displays score for current level
 * @property {HTMLDivElement} level - displays Snek's level
 * @property {HTMLDivElement} gameInfo - displays Snek's exp numerically
 * @property {HTMLButtonElement} newGameButton - starts a new game
*/
export default class Panel {
  panelContainer = document.createElement('div')
  expbar = document.createElement('div')

  infobox = document.createElement('div')

  infoA = document.createElement('div')
  level = document.createElement('div')
  exp = document.createElement('div')

  infoB = document.createElement('div')
  score = document.createElement('div')
  lifespan = document.createElement('div')

  newGameButton = document.createElement('button')

  constructor(game) {
    this.game = game
    this.panelContainer.id = 'panel'
    this.panelContainer.className = 'layerUI'
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
  
    this.infoA.id = 'infoA'
    this.infoA.className = 'infoSubBox'
    this.infobox.appendChild(this.infoA)

    this.level.id = 'info-level'
    this.infoA.appendChild(this.level)

    this.exp.id = 'info-exp'
    this.infoA.appendChild(this.exp)

    this.infoB.id = 'infoB'
    this.infoB.className = 'infoSubBox'
    this.infobox.appendChild(this.infoB)

    this.score.id = 'info-score'
    this.infoB.appendChild(this.score)

    this.lifespan.id = 'info-lifespan'
    this.infoB.appendChild(this.lifespan)
  
    this.newGameButton.id = 'newGameButton'
    this.newGameButton.innerText = 'New Game'
    this.panelContainer.appendChild(this.newGameButton)
  
  
    // before init, for debug
    this.infobox.style.color = 'lawngreen'
    this.level.innerText = '$level'
    this.exp.innerText = '$exp'
    this.score.innerText = '$score'
    this.lifespan.innerText = '$lifespan'

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.newGameButton.addEventListener('click', () => {
      window.location.replace('/')
    })
  }

  render() {
    this.score.innerHTML = `Score: ${this.game.stateMachine.current?.score}`

    if (this.snek) {
      this.level.innerHTML = `Snek!'s level: ${this.snek.level}`
      this.exp.innerHTML = `Exp for level up: ${Math.trunc(this.snek.expForLevel(this.snek.level + 1) - this.snek.currExp)}`
      this.lifespan.innerHTML = `Lifespan: ${this.game.clock.getElapsedSeconds()}s`

      this.expSegments.forEach((seg, idx) => {
        const segmentsFilled = Math.floor(
          10* this.snek.expGainedThisLevelOnly
          / (
            this.snek.expForLevel(this.snek.level + 1)
            - (
              this.snek.level === 1 
                ? 0
                : this.snek.expForLevel(this.snek.level)
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