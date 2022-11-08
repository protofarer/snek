import BaseState from './BaseState'

export default class PlayState extends BaseState {
  mode
  level

  constructor(game, params) {
    super()
    this.game = game
    this.mode = params.mode
    this.snek = params.snek
    this.level = params.level
  }

  update() {

  }

  render() {
  }

  exit() {
  }
}