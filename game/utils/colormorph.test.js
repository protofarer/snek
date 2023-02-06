import { describe, expect, it, vi } from "vitest";
import Traits from "../ents/Traits.js";
import { getColorParameters, setColorParameters } from "./colormorph.js";
import { loadTraits } from "./helpers.js";

const colorStringFormatter = (h,s,l,a=1) => (
  `hsl(${h}, ${s}%, ${l}%, ${a})`
)

describe('colormorph tests', () => {
  it('ColorParameters', () => {

    const a = {
      primaryColorParameters: {
        hue: { start: 0, end: 0 }, 
        lum: { start: 0, end: 0 },
        sat: { start: 0, end: 0 },
      },

      getPrimaryColor: getColorParameters,
      setPrimaryColor: setColorParameters,

      get primaryColor() { 
        return this.getPrimaryColor(
          (this.digestion.baseTime - this.digestion.timeLeft) / this.digestion.baseTime
        )
      },

      set primaryColor({ 
        hueStart, hueEnd, satStart, satEnd, lumStart, lumEnd, alphaStart, alphaEnd 
      }) { 
        this.setPrimaryColor({ 
          hueStart, hueEnd, satStart, satEnd, lumStart, lumEnd, alphaStart, alphaEnd
        }) 
      }
    }

    loadTraits.call(a, Traits.Immob)

    // returns start values since no digestion occured
    expect(a.primaryColor).toBe(
      colorStringFormatter(
        Traits.Immob.primaryColor.hueStart,
        Traits.Immob.primaryColor.satStart,
        Traits.Immob.primaryColor.lumStart,
      )
    )

    // returns end values after complete digestion
    a.digestion.timeLeft = 0
    expect(a.primaryColor).toBe(
      colorStringFormatter(
        Traits.Immob.primaryColor.hueEnd,
        Traits.Immob.primaryColor.satEnd,
        Traits.Immob.primaryColor.lumEnd
      )
    )

    // returns middle value after half digestion
    a.digestion.timeLeft = a.digestion.baseTime / 2;
    expect(a.primaryColor).toBe(
      colorStringFormatter(
        Traits.Immob.primaryColor.hueStart + ((Traits.Immob.primaryColor.hueEnd - Traits.Immob.primaryColor.hueStart) / 2),
        Traits.Immob.primaryColor.satStart + ((Traits.Immob.primaryColor.satEnd - Traits.Immob.primaryColor.satStart) / 2),
        Traits.Immob.primaryColor.lumStart + ((Traits.Immob.primaryColor.lumEnd - Traits.Immob.primaryColor.lumStart) / 2),
      )
    )

    // set color to all zeros
    a.primaryColor = {
      hueStart: 0 , 
      hueEnd: 0 , 
      satStart: 0, 
      satEnd: 0,
      lumStart: 0, 
      lumEnd: 0, 
      alphaStart: 0, 
      alphaEnd: 0 ,
    }
    expect(a.primaryColor).toBe(
      colorStringFormatter(
        0, 0, 0, 0
      )
    )
  })
})