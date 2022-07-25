const con = document.createElement('div')
con.id ='con'

const body = document.querySelector('body')
body.appendChild(con)


const can = document.createElement('canvas')
can.id='can'
con.appendChild(can)
const ctx = can.getContext('2d')
can.width = can.height = 800



const pi = Math.PI

ctx.beginPath()
ctx.moveTo(400,0)
ctx.lineTo(400,800)
ctx.moveTo(0,400)
ctx.lineTo(800,400)
ctx.stroke()

ctx.beginPath()

const r = 50
const R = Math.sqrt(5*r**2)
const position = {x:400, y:400}
const directionRad = -Math.PI/4
    const sideLong = 4 * r
    const x1 = position.x - R * Math.cos(Math.atan(1/2) - directionRad)
    const y1 = position.y - R * Math.sin(Math.atan(1/2) - directionRad)
    const x2 = x1 + 4*r*Math.cos(directionRad)
    const y2 = y1 + 4*r*Math.sin(directionRad)
    const x3 = -x1
    const y3 = -y1
    const x4 = -x2
    const y4 = -y2
    console.info(`coords`,
    {x1,y1,x2,y2,x3,y3,x4,y4})
    
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x1,y1,3,0,Math.PI*2)
    // ctx.moveTo(x1,y1)
    // ctx.lineTo(x2,y2)
    // ctx.lineTo(x2,y2)
    // ctx.lineTo(x3,y3)
    // ctx.lineTo(x4,y4)
    ctx.stroke()