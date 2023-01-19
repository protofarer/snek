export default class StateMachine {
  constructor(states, game) {
    this.states = states
    this.current = {
      stateName: 'base',
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

  update(t) {
    this.current.update(t)
  }

  render(t) {
    this.current.render(t)
  }
}