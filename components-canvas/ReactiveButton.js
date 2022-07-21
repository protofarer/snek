import Button from './Button'

export default class ReactiveButton extends Button {
  // A button that changes its style in response to
  // a change in some state variable
  //    f: acts on prop and changes something
  //      about the button's draw, eg fill color for text
  constructor(ctx, buttonData, offset, handleClick, listenerOptions, fn) {
    super(ctx, buttonData, offset, handleClick, listenerOptions)
    this.fn = fn
  }
  
  draw() {
    this.fn(this)
    super.draw()
  }
}