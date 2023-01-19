import Constants from '../Constants'
/** Informational and Player Controls panel external to canvas element 
 * @class
 * @property {HTMLDivElement} panelContainer - Panel's top level container
 * @property {HTMLDivElement} expbar - displays Snek's exp graphically
 * @property {HTMLDivElement} infobox - container for informational elements
 * @property {HTMLDivElement} score - displays score for current level
 * @property {HTMLDivElement} level - displays Snek's level
 * @property {HTMLDivElement} gameInfo - displays Snek's exp numerically
*/
export default class Panel {
  panelContainer = document.createElement('div')

  expbar = document.createElement('div')

  infobox = document.createElement('div')
  infoA = document.createElement('div')
  score = document.createElement('div')
  lifespan = document.createElement('div')
  segcount = document.createElement('div')

  touchContainer = document.createElement('div')
  actionButt = document.createElement('button')

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

    this.lifespan.id = 'info-lifespan'
    this.infoA.appendChild(this.lifespan)

    this.segcount.id = 'info-segmentcount'
    this.infoA.appendChild(this.segcount)

    this.score.id = 'info-score'
    this.infoA.appendChild(this.score)

    this.touchContainer.id = 'panel-touch-container'
    this.panelContainer.appendChild(this.touchContainer)

    this.actionButt.id= 'action-butt'
    this.actionButt.className = 'touch-control'
    this.actionButt.innerText = 'A'
    this.touchContainer.appendChild(this.actionButt)
  
    // before init, for debug
    this.segcount.innerText = '$segcount'
    this.score.innerText = '$score'
    this.lifespan.innerText = '$lifespan'
  }

  render() {
    this.score.innerHTML = `Score: ${this.game.stateMachine.current.snek.score}`

    if (this.snek) {
      this.lifespan.innerHTML = 
        `Lifespan: ${Math.trunc(this.snek.lifeSpan / 1000)}s`
      this.segcount.innerHTML =
        `Length: <strong>${this.snek.segments.length} / ${Constants.survival.victory.segcount}</strong>`

      this.expSegments.forEach((seg, idx) => {
        const segmentsFilled = Math.floor(
          10 * this.snek.expGainedThisLevelOnly
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