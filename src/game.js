

class Point {
  constructor (x, y, z, last) {

    this.x = x
    this.y = y
    this.z = z

    this.timestamp = window.performance.now()

    if (last) last.next = this

  }
}


function* points(p) {
    do yield p
    while (p = p.next)
}


const range = (points) => {

    let x_min, x_max, y_min, y_max, z_min, z_max, first = true;

    for(let n of points) {
        if(first){
            x_min = x_max = n.x
            y_min = y_max = n.y
            z_min = z_max = n.z
            first = false
            continue
        }

        if (n.x < x_min) {x_min = n.x}
        else if (n.x > x_max ) {x_max = n.x}

        if (n.y < y_min) {y_min = n.y}
        else if (n.y > y_max) {y_max = n.y}


        if (n.z < z_min) {z_min = n.z}
        else if (n.z > z_max) {z_max = n.z}
    }

    return {
      x: {min: x_min, max: x_max},
      y: {min: y_min, max: y_max},
      z: {min: z_min, max: z_max}
    }

}


const extent = (r) => {
  const x = r.x.max - r.x.min,
        y = r.y.max - r.y.min,
        z = r.z.max - r.z.min

  return {x, y, z}
}


const distance = (e) =>
  Math.sqrt(
    Math.pow(e.x, 2) +
    Math.pow(e.y, 2) +
    Math.pow(e.z, 2)
  )



const scale = a => b => a * b

const clamp = max => d => Math.min(max, Math.max(0, d))

const colour = i => `rgb(${i}, ${255-i}, 0)`


const READY = 1, STARTED = 2, LOST = 4
let state = READY

const button = document.getElementsByTagName('button')[0];

const start = () => {
  if(state & READY | LOST) {
    state = STARTED
    button.className = 'hidden'
  }
}

const lose = () => {
  if(state & STARTED) {
    state = LOST;
    button.className = ''
  }
}




// gather points
let current = null

window.addEventListener('deviceorientation', e => {
  current = new Point(e.gamma, e.beta, e.alpha, current)
});



// render points
let first = null

// handy to save distance for other stuff
let _distance = 0;

let _first, _current;

const render = timestamp => {
  requestAnimationFrame(render)

  if(!current) return

  for(first of points(first || current))
    if(first.timestamp > timestamp - 1500)
      break

  if(state & LOST) return;

  // optimisation to not have to redraw same thing
  if((_first == first) && (_current == current)) return
  [_first, _current] = [first, current]


  const d = distance(
    extent(
      range(
        points(
          first
        )
      )
    )
  )

  const c = Math.round(
    clamp(255)(
      scale(255 / 80)(
        d
      )
    )
  )

  document.body.style.background = colour(c);

  if(c > 254) lose();

  //console.log(d, c)


}


requestAnimationFrame(render);


const handle = e => {
  e.preventDefault()
  start()
}

button.addEventListener('click', handle, false)
button.addEventListener('touchstart', handle, false)
