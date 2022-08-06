/** 
 * Provider for the generalized pointer (eg mouse or touch) information and
 * event handling
 * @class
*/
export default class PointerHandler {
  pointerCoords = {
    canvas: {
      x: 0,
      y: 0,
    },
    board: {
      x: null,
      y: null,
    },
    client: {
      x: 0,
      y: 0,
    }
  }

  constructor (canvas) {
    this.canvas = canvas
    this.rect = this.canvas.getBoundingClientRect()
    this.ongoingTouches = new Array()

    const handlePointerStart = (e) => {
      this.ongoingTouches.push(this.copyTouch(e))
    }
  
    const handlePointerEnd = (e) => {
      const idx = this.ongoingTouchIndexById(e.pointerId)
      this.ongoingTouches.splice(idx, 1)
    }
  
    function handlePointerCancel(e) {
      console.log(`pointercancel: id = ${e.pointerId}`, )
      const idx = this.ongoingTouchIndexById(e.pointerId)
      this.ongoingTouches.splice(idx, 1)
    }
  
    this.canvas.addEventListener('pointerdown', handlePointerStart, false)
    this.canvas.addEventListener('pointerup', handlePointerEnd, false)
    this.canvas.addEventListener('pointercancel', handlePointerCancel, false)

    console.info('Pointer EventHandlers initialized')
  }

  trackPointer() {
    const handlePointerMove = (e) => {
      // Scrolled window is not supported
      
      // Mouse coordinates relative to canvas
      this.pointerCoords.canvas.x = e.clientX - this.rect.left // + window.scrollX
      this.pointerCoords.canvas.y = e.clientY - this.rect.top // + window.scrollY
  
      // Mouse coordinates relative to play area
      this.pointerCoords.board.x = e.clientX - this.rect.left - this.playAreaOffset.x // + window.scrollX
      this.pointerCoords.board.y = e.clientY - this.rect.top - this.playAreaOffset.y // + window.scrollYA
  
      // Mouse coordinates relative to window
      this.pointerCoords.client.x = e.clientX // + window.scrollX
      this.pointerCoords.client.y = e.clientY // + window.scrollY
          
      // Calculate row,col from mouse coords
      this.pointerCoords.square.col = Math.floor((parseFloat((this.pointerCoords.board.x)/100,2).toFixed(2)))
      this.pointerCoords.square.row = Math.floor(parseFloat((this.pointerCoords.board.y)/100,2).toFixed(2))
    }

    this.canvas.addEventListener('pointermove', handlePointerMove, false)

    return this.pointerCoords
  }


  ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < this.ongoingTouches.length; i++) {
      let id = this.ongoingTouches[i].identifier

      if (id == idToFind) {
        return i
      }
    }
    return -1
  }

  copyTouch(touch) {
    return { identifier: touch.pointerId, pageX: touch.clientX, pageY: touch.clientY }
  }


}