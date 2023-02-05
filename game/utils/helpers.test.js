import { afterEach, describe, expect, vi, it } from "vitest";
import { intRep } from "./helpers.js";

vi.useFakeTimers()

describe('unit testing', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('intRep', () => {
    // mock fn
    const n = 5
    const t = 250
    const f = vi.fn().mockImplementation(
      (
        () => {
          let i = 0 
          return () => { console.log(++i); return i; }
        }
      )()
    )

    intRep(n,t,f)
    vi.runAllTimers()
    expect(f).toHaveBeenCalledTimes(n)

    // invalid param types and ranges
    expect(() => intRep(-1,t,f)).toThrow()
    expect(() => intRep(n,-1,f)).toThrow()
    expect(() => intRep(n,t,5)).toThrow()

    expect(() => intRep(null,t,f)).toThrow()
    expect(() => intRep(n,null,f)).toThrow()
    expect(() => intRep(n,t,null)).toThrow()
  })
})