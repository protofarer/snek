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
  // TODO make this exit (return) by listening to a game property or event
}

newGame()