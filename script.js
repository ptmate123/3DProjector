/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas")

canvas.width = 800
canvas.height = 800

const BACKGROUND = "#FFFFFF"
const FOREGROUND = "purple"

const ctx = canvas.getContext("2d")

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function point({x, y}) {
    const size = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
}

function line(p1, p2) {
    ctx.lineWidth = 3
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

function screen({x, y}) {
    return {
        x: ((x + 1) / 2) * canvas.width,
        y: (1 - ((y + 1) / 2)) * canvas.height
    }
}

function project({x, y, z}) {
    return {
        x: x / z,
        y: y / z
    }
}

clear()

// vertex
let VE = [
    {x: -0.5, y: 1, z: 0.5},
    {x: -0.5, y: -1, z: 0.5},
    {x: 0.5, y: -1, z: 0.5},
    {x: 0.5, y: 1, z: 0.5},
    {x: -0.5, y: 1, z: -0.5},
    {x: -0.5, y: -1, z: -0.5},
    {x: 0.5, y: -1, z: -0.5},
    {x: 0.5, y: 1, z: -0.5}
]

// edge
let EG = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
]

function translate_z({x, y, z}, dz) {
    return {
        x: x,
        y: y,
        z: z + dz
    }
}

function rotate_xz({x, y, z}, theta) { 
    return {
        x: x * Math.cos(theta) - z * Math.sin(theta),
        y,
        z: x * Math.sin(theta) + z * Math.cos(theta)
    }
}

let dz = 2
let theta = 0
function frame() {
    // dz += 1 / 60
    theta += Math.PI / 2 * 1 / 60
    clear()
    for (const e of EG) {
        for (let i = 0; i < e.length; i++) {
            const a = VE[e[i]]
            const b = VE[e[(i + 1) % e.length]]
            line(
                screen(project(translate_z(rotate_xz(a, theta), dz))),
                screen(project(translate_z(rotate_xz(b, theta), dz)))
            )
        }
    }
    requestAnimationFrame(frame)
}
requestAnimationFrame(frame)