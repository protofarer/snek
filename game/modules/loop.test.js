import { describe, it, vi } from "vitest";
import Constants from "../Constants.js";
import Loop from "./Loop.js";

describe('loop', () => {
  it('pauses', () => {
    const game = {
      phase: Constants.PHASE_PLAY,
      clock: {
        start(){}
      },
      debugGUI: {
        params: {
          gameSpeed: 1
        }
      },
      clr(){},
      render(){},
      update(){},
    }

    const requestAnimationFrame = vi.fn().mockImplementation((f) => {
      // console.log(`rAF`, )
      f()
      return 1
    })
    requestAnimationFrame(()=>{})
    global.requestAnimationFrame = requestAnimationFrame

    // TODO ensure loop loops
    // TODO get loop to run a few times then stop
    // TODO get loop to step
    // ? why isnt rAF sending loop `t`

    const loop = new Loop(game)
    // console.log(`startT`, loop.startT)

    // TODO loop runs once, verify state
    // TODO loop pauses, verify state
    // TODO trigger keydown 'b', verify pause/play
    // ? is requestAnimationFrame testable in node?
  })
})