import Game from './game/Game'

export const ENV = new (function() {
  this.MODE = import.meta.env ? import.meta.env.MODE : 'production' 
})()

document.title = 'Snek!'
const container = document.createElement('div')
container.id = 'container'
document.body.appendChild(container)

export function newGame() {
  new Game(container)
}

newGame()