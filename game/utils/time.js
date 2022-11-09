export function intRep(n, t, f) {
  // intervallic repeater
  // do f, n times, every d milliseconds
  // wrap f in closure, increment i every time it runs until i = n - 1
    let i = 0
    let id

    function limitedRepeat() {
      (i === n - 1) && clearInterval(id)
      f()
      i++
    }

    id = setInterval(limitedRepeat, t)
}