const con = document.createElement('div')
con.id ='con'

const body = document.querySelector('body')
body.appendChild(con)

const wild = document.createElement('span')
// con.appendChild(wild)

const can = document.createElement('canvas')
can.id='can'
con.appendChild(can)

const pan = document.createElement('div')
pan.id = 'pan'
con.appendChild(pan)

const topgrid = document.createElement('div')
topgrid.id ='topgrid'
topgrid.className = 'grid'
pan.appendChild(topgrid)

const midbox = document.createElement('div')
midbox.id='midbox'
pan.appendChild(midbox)

const shrinkChiks = document.createElement('button')
shrinkChiks.id='shrinkchiks'
shrinkChiks.innerText = 'shrink\'em'
midbox.appendChild(shrinkChiks)

shrinkChiks.addEventListener('click', () => {
  chiks.forEach((chik) => {
    // ! cannot get a properly scaled height because the grid(parent)
    // ! doesn't shrink!, it fits its children no matter what
    chik.width = chik.height = chik.parentNode.clientHeight * 3 / 16
    drawChik(chik)
  })
})

const botgrid = document.createElement('div')
botgrid.id='botgrid'
botgrid.className = 'grid'
pan.appendChild(botgrid)

let chiks = []
function fillChiks(par, ele='div', side=null, n=12) {
  for(let i = 0; i < n; i++) {
    const chik = document.createElement(ele)
    chik.className = 'chik'
    if (side) {
      chik.width = chik.height = side
    }
    if (ele='canvas') {
      drawChik(chik)
    }
    par.appendChild(chik)
    chiks.push(chik)
  }
}

function drawChik(chik) {
  const ctx = chik.getContext('2d')
  const h = chik.height
  const w = chik.width
  ctx.moveTo(w/2, 0)
  ctx.lineTo(w/2,h)
  ctx.moveTo(0, h/2)
  ctx.lineTo(w, h/2)
  ctx.stroke()
}

fillChiks(topgrid,'canvas', 50)
fillChiks(botgrid,'canvas', 50)


const ctx = can.getContext('2d')


function fluxingWidth() {
  let x = 0
  setInterval(() => {
    if (x) {
      wild.innerText = 'WWWWWWWWWWWWWWWWWWWw'
      x = 0
    } else {
      wild.innerText = ''
      x = 1
    }
  }, 1000)
}

can.width = can.height = 800

let center = {
  x: can.width / 2,
  y: can.height / 2
}

setInterval(() => {
  // console.log('logical', { w: can.width, h: can.height })
  // console.log('browsal', { w: can.clientWidth, h: can.clientHeight})
  // console.log(`center:`, { x: can.width / 2, y: can.height / 2 })
  console.log(`--------------------`, )
  
}, 100)


ctx.arc(center.x, center.y, can.width/2 -2, 0, 2*Math.PI)
ctx.moveTo(center.x, 0)
ctx.lineTo(center.x, can.height)
ctx.moveTo(0, center.y)
ctx.lineTo(can.width, center.y)
ctx.stroke()

window.addEventListener('resize', () => {
  chiks.forEach(() => {

  })

})