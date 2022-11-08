export default class BaseState {
  enter() {
  }

  exit() {
  }

  update() {
    throw new Error('Abstract method')
  }

  render() {
    throw new Error('Abstract method')
  }
}