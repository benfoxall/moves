

class Orientation {
  constructor (gamma, alpha, beta, last) {

    this.gamma = gamma
    this.alpha = alpha
    this.beta = beta

    this.timestamp = window.performance.now()

    if (last) last.next = this

  }
}


function* points(p) {
    do yield p
    while (p = p.next)
}


const range = (points) => {

    let g_min, g_max, a_min, a_max, b_min, b_max, first = true;

    for(let n of points) {
        if(first){
            g_min = g_max = n.gamma
            a_min = a_max = n.alpha
            b_min = b_max = n.beta
            first = false
            continue
        }

        if (n.gamma < g_min) {g_min = n.gamma}
        else if (n.gamma > g_max ) {g_max = n.gamma}

        if (n.alpha < a_min) {a_min = n.alpha}
        else if (n.alpha > a_max) {a_max = n.alpha}

        if (n.beta < b_min) {b_min = n.beta}
        else if (n.beta > b_max) {b_max = n.beta}
    }

    return {
      gamma: {min: g_min, max: g_max},
      alpha: {min: a_min, max: a_max},
      beta:  {min: b_min, max: b_max}
    }

}


const extent = (r) => {
  const gamma = r.gamma.max - r.gamma.min,
        alpha = r.alpha.max - r.alpha.min,
        beta  = r.beta.max - r.beta.min

  return {gamma, alpha, beta}
}


const distance = (e) =>
  Math.sqrt(
    Math.pow(e.gamma, 2) +
    Math.pow(e.alpha, 2) +
    Math.pow(e.beta, 2)
  )


const scale = (d) => Math.min(1, d/2)

const tooFast = (s) => s === 1

const colour = i => `hsl(${~~((1-i) * 120)}, 100%, 45%)`


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
  if(e.gamma !== null){
    current = new Orientation(
        Math.sin(2*Math.PI*(e.gamma /360)),
        Math.sin(2*Math.PI*(e.alpha /360)),
        Math.sin(2*Math.PI*(e.beta /180)),
        current
      )
  }
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
  // console.log(d)

  const c = scale(d);
  console.log(c, d)

  document.body.style.background = colour(c);

  if(tooFast(c)) lose();

  // if(c > 254) lose();

  //console.log(d, c)


}


requestAnimationFrame(render);


const handle = e => {
  e.preventDefault()
  start()
}

button.addEventListener('click', handle, false)
button.addEventListener('touchstart', handle, false)
