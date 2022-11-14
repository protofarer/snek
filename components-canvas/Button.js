export default class Button {
  // I. Principles
  //  A. The most common and simple button, persistent and unreactive
  //  When used it persistently consumes space on the screen
  //  and invokes a function when clicked
  // II. Properties:
  //  A. positions and dimensions
  //  B. visual styling
  //  C. a default click handler that's overwritten with explicit handler
  //  D. click detection based on mouse client coords (scroll not implemented)
  //  E. sensible defaults for properties
  // III. Methods:
  //  A. add an click listener that can be passed with addEventListener options
  //  B. remove the added clickListener
  //  C. draw
  //  D. set its own path aka clickArea
  // IV. Possibilities
  //  CSDR addEventListener to something more general than a canvas.context paremeter

  // TODO show shape of data arg
  constructor(parentOrigin, ctx, data, handleClick=null, listenerOptions=null) {
    if (ctx === null || ctx === undefined || ctx === {}) {
      throw new TypeError('A button\'s context wasn\'t defined')
    }
    if (!data?.origin?.x || !data?.origin?.y) {
      throw new TypeError('A button\'s origin coordinates weren\'t defined')
    }

    this.name = data.name || 'unnamed'
    this.ctx = ctx

    this.origin = data?.origin ?? { x: 0, y: 0 }
    // needs parentOrigin for setting click path, not used for rendering
    this.parentOrigin = parentOrigin || { x: 0, y: 0 }
    this.label = data.label || 'no-button-label-assigned'
    this.baseWidth = data?.base?.w || 70
    this.baseHeight = data?.base?.h || 30
    this.stretchWidth = data?.stretch?.w || 1
    this.stretchHeight = data?.stretch?.h || 1

    this.areaFill = data.areaFill || 'hsl(210,90%,85%)'
    this.labelColor = data.labelColor || 'hsl(200, 20%, 30%)'
    this.borderStroke = data.borderStroke || this.areaFill

    // ! offset isnt included?
    this.top = this.origin.y
    this.bottom = this.origin.y + this.baseHeight * this.stretchHeight
    this.left = this.origin.x
    this.right = this.origin.x + this.baseWidth * this.stretchWidth
    this.center = {
      x: this.origin.x + (this.baseWidth * this.stretchWidth) / 2,
      y: this.origin.y + (this.baseHeight * this.stretchHeight) / 2,
    }

    this.setPath()

    function defaultHandleClick() {
      console.log(`${this.label} button's click handler hasn't been defined.`)
    }
    this.handleClick = handleClick || defaultHandleClick
    this.listenerOptions = listenerOptions || {}

    this.controller = new AbortController()
    this.listenerOptions.signal = this.controller.signal

    this.addClickListener(this.handleClick, this.listenerOptions)
  }

  setPath() {
    this.path = new Path2D()
    this.path.rect(
      this.parentOrigin.x + this.origin.x - 2, 
      this.parentOrigin.y + this.origin.y - 2,
      this.baseWidth * this.stretchWidth + 4,
      this.baseHeight * this.stretchHeight + 4,
    )
  }

  addClickListener(newHandleClick, listenerOptions) {
    // Click detection handled handled here instead of outside of it!
    // Assuming handler listening to canvas
    this.handleClick = newHandleClick || this.handleClick
    this.listenerOptions = listenerOptions || this.handleClick

    this.handleButtonClick = function hBC(e) {
        if (this.ctx.isPointInPath(
          this.path, 
          // works for display pixels aka CSS scaling
          (e.clientX - this.ctx.canvas.offsetLeft) * this.ctx.canvas.width / this.ctx.canvas.clientWidth, 
          (e.clientY - this.ctx.canvas.offsetTop) * this.ctx.canvas.height / this.ctx.canvas.clientHeight
        )) {
          console.log(`${this.label}'s handleButtonClicked`, )
          this.handleClick()
        }
    }
    this.ctx.canvas.addEventListener('click', this.handleButtonClick.bind(this), this.listenerOptions)
  }

  replaceClickListener(newHandleClick, listenerOptions) {
    this.removeClickListener()
    this.addClickListener(newHandleClick, listenerOptions)
  }

  removeClickListener() {
    // ! TODO NOT WORKING
    this.controller.abort()
    this.ctx.canvas.removeEventListener('click', this.handleButtonClick)
  }

  render() {
    // Init clickArea path here because Panel draw does offset for its components
    // and I don't want to pass in more constructor arguments to this button
    // Indeed, the button is oblivious to its environment at large
    // Thus encapsulated and simplified
    this.ctx.strokeStyle = this.borderStroke
    this.ctx.fillStyle = this.areaFill
    this.ctx.lineWidth = 1

    this.ctx.shadowColor = 'hsla(0, 0%, 0%, 0.7)'
    this.ctx.shadowBlur = 7
    this.ctx.shadowOffsetY = 5

    this.ctx.beginPath()
    this.ctx.fillRect(
      this.origin.x, 
      this.origin.y, 
      this.baseWidth * this.stretchWidth, 
      this.baseHeight * this.stretchHeight
    )
  
    this.ctx.shadowColor = this.ctx.shadowBlur = this.ctx.shadowOffsetY = null

    this.ctx.strokeRect(
      this.origin.x, 
      this.origin.y, 
      this.baseWidth * this.stretchWidth,
      this.baseHeight * this.stretchHeight
    )

    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = this.labelColor
    // Finagling with centering the text here, making estimates based on
    // 16pt font size equivalent in pixels, see label.length * [numeric literal]
    this.ctx.fillText(`${this.label}`, 
      (this.origin.x + (0.5 * this.baseWidth * this.stretchWidth) - (this.label.length*8/2)), this.origin.y + 20
    )
  }
}