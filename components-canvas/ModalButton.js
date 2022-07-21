import Button from './Button'

export default class ModalButton extends Button {
  // Modal Button
  // Transient click listener
  // Uses addEventListener option: once: true, under assumption
  // That ModalButtons are used with Modal Windows and that
  // ModelButtons cause "modal exit" logic to execute and thus
  // close the Modal Window
  // Use a show() instead of draw() (one-time render vs animate, semantically different)
  //      CSDR tightening up terms based on usage, since
  //      overlap with draw in implementation but merely differ
  //      in how they are invoked (continuous draw vs one-shot draw)
  // Modal Buttons are hooked in to a Modal Object which is typically
  // a parent component with a show and hide method that modifies'
  // parent's AND childrens' (eg this components') states with a helpful
  // layer of abstraction and streamlined usage (button knows how to show and
  // hide itself since it is aware of and reacts to parents' state).
  //
  // ModalButtons gain the ability set or unset (add or kill)
  // its own clickListener. handleClick and listenerOptions must be remembered
  // when hidden and are set up again using Button's methods
  constructor(ctx, buttonData, offset, handleClick, listenerOptions) {
    // isParentShown is a variable by reference (eg object property)
    // that determines whether this shows or hides
    super(ctx, buttonData, offset, handleClick, listenerOptions)

    // Assuming Modal Object is initialized without being shown/activated
    this.isShown = false
    this.hide()
  }
  
  hide() {
    this.isShown = false
    super.removeClickListener()
  }

  show() {
    // Upon show, draw once as is the expected usage of Modal Components
    // overlaid on a suddenly un-animated background
    this.isShown = true
    super.addClickListener()
    this.draw()
  }

  draw() {
    if (this.isShown) {
      super.draw()
    }
  }
}