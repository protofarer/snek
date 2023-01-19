import Game from './game/Game'
import './index.css';   // vitejs injects into page https://vitejs.dev/guide/features.html#css

export const ENV = new (function() {
  this.MODE = import.meta.env ? import.meta.env.MODE : 'production' 
})()

document.title = 'Snek!'
const container = document.createElement('main')
container.id = 'container'
document.body.appendChild(container)
 
export function newGame() {
  new Game(container)
}

newGame()


async function af() {
const data = {
  playMode: 'test',
  state: 'gameover',
  username: 'parmenides',
  score: 300,
  lifespan: 3600,
  submitted_at: new Date().toISOString(),
}

const rawResponse = await fetch(`http://localhost:3000/snek/submit-data`, {
  method: 'POST',
  // change to same-origin after debug
  // mode: 'no-cors',
  headers: {
    'Accept': 'application/json; charset=utf-8',
  },
  body: JSON.stringify(data),
})
  
  console.log(`rawResponse`, rawResponse)
  const responseObj = await rawResponse.json()
  console.log(`parsed response`, responseObj)
}

// await af()
