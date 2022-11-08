export default class StateMachine {
  constructor(states, game) {
    this.states = states
    this.current = {
      render() {},
      update() {},
      enter() {},
      exit() {}
    }
    this.game = game
  }

  change(stateName, params) {
    if (!Object.keys(this.states).includes(stateName)) {
      throw Error('Cannot change state, invalid state name')
    }
    this.current.exit()
    this.current = new this.states[stateName](this.game, params)
  }

  update() {
    this.current.update()
  }

  render() {
    this.current.render()
  }
}