// replace things that aren't allowed in wordpress

const replacements = {
  replace_move_list: '<canvas class="d-key" id="move_list" height="200" width="500"></canvas>',
  replace_orientation_graph: '<canvas height="200" width="300" class="d-key" id="orientation_graph">'
}

Object.keys(replacements).forEach((k) => {
  const el = document.getElementById(k)
  if(!el)
    return console.log("could not find", k)
  el.outerHTML = replacements[k]
})


// Helpers

const move = fn => {
    document.addEventListener('mousemove', (e) => {
        fn.call(null,
            e.pageX - window.scrollX,
            e.pageY - window.scrollY)
    }, false);

    document.addEventListener('touchmove', function(e){
      const l = e.touches.length
      let x = 0, y = 0
      for (let i = 0; i < l; i++) {
        x += e.touches[i].pageX - window.scrollX
        y += e.touches[i].pageY - window.scrollY
      }

      fn.call(null, ~~(x / l), ~~(y / l))
    });
}


let backdoor;

const move3 = fn => {
    window.addEventListener('deviceorientation', (e) => {
      if(e.gamma !== null)
        fn.call(null,
            e.gamma,
            e.beta,
            e.alpha)
    });

    backdoor = fn;
}



// Actual stuff


class Point {
  constructor (x, y, last) {

    this.x = x
    this.y = y

    this.timestamp = window.performance.now()

    if (last) last.next = this

  }
}


let current = null;

// helper function for adding mouse/touch move listeners
move(
	(x, y) => {
    current = new Point(x, y, current)
  }
)


function* points(p) {
    do yield p
    while (p = p.next)
}

const range = (points) => {

    // let min = new Point.Min()
    // let max = new Point.Min()
    //
    // for(let n of points) {
    //   min.min(n);
    //   max.max(n);
    // }
    //
    // return {min, max}
    //



    let x_min, x_max, y_min, y_max, first = true;

    for(let n of points) {
        if(first){
            x_min = x_max = n.x;
            y_min = y_max = n.y;
            first = false;
            continue;
        }

        if (n.x < x_min) {x_min = n.x}
        else if (n.x > x_max ) {x_max = n.x}

        if (n.y < y_min) {y_min = n.y}
        else if (n.y > y_max) {y_max = n.y}
    }

    return {
      x: {min: x_min, max: x_max},
      y: {min: y_min, max: y_max}
    }

}


let extent = (r) => {
  let x = r.x.max - r.x.min,
      y = r.y.max - r.y.min

  return {x, y}
}


let distance = (e) =>
    Math.sqrt(
        Math.pow(e.x, 2) +
        Math.pow(e.y, 2)
  )


const scale = (d) => Math.min(1, d / 300)

const tooFar = (s) => s === 1

const colour = i => `hsl(${~~((1-i) * 120)}, 100%, 45%)`



// let scale = a => b => a * b

// let clamp = max => d => Math.min(max, Math.max(0, d))




// 3d versions

const range3 = (points) => {

    let x_min, x_max, y_min, y_max, z_min, z_max, first = true;

    for(let n of points) {
        if(first){
            x_min = x_max = n.x;
            y_min = y_max = n.y;
            z_min = z_max = n.z;
            first = false;
            continue;
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


let extent3 = (r) => {
  let x = r.x.max - r.x.min,
      y = r.y.max - r.y.min,
      z = r.z.max - r.z.min

  return {x, y, z}
}


let distance3 = (e) =>
  Math.sqrt(
    Math.pow(e.x, 2) +
    Math.pow(e.y, 2) +
    Math.pow(e.z, 2)
  )







class Point3 {
  constructor (x, y, z, last) {

    this.x = x
    this.y = y
    this.z = z

    this.timestamp = window.performance.now()

    if (last) last.next = this

  }
}


let currentO = null;

// helper function for adding mouse/touch move listeners
move3(
	(x, y, z) => {
    currentO = new Point3(x, y, z, currentO)
  }
)


// const convert = p => ({
//     alpha: Math.sin(Math.PI*(p.alpha/180)),
//     beta:  Math.sin(Math.PI*(p.beta /360)),
//     gamma: Math.sin(Math.PI*(p.gamma/360))
// })

const convert = p => ({
    x: Math.sin(2*Math.PI*(p.x /180)),
    y: Math.sin(2*Math.PI*(p.y /360)),
    z: Math.sin(2*Math.PI*(p.z /360))
})


const READY = 1, STARTED = 2, LOST = 4
let state = READY

const button = document.getElementById('state_game_button');

const start = () => {
  if(state & READY | LOST) {
    state = STARTED
    button.style.opacity = 0
  }
}

const lose = () => {
  if(state & STARTED) {
    state = LOST;
    button.style.opacity = 1
    button.textContent = 'LOST!'
  }
}


button.addEventListener('click', e => {
  e.preventDefault()
  start()
})











class Wakeable {

  constructor(element) {
      this.awake = false;
  }

  render(timestamp) {
      if(!this.awake) this.wake();
      this.touch = timestamp || window.performance.now();
  }

  sleep(){
      this.awake = false;
  }

  wake(){
      // start waiting to go to sleep
      let check = () => {
          if(this.touch + 1000 < window.performance.now()) {
              this.sleep();
          } else {
              setTimeout(check, 1000)
          }
      }
      setTimeout(check, 1000);

      this.awake = true;
  }

}



let implementation = {};

class MoveCurrent {
  constructor(element) {
    this.element = element;
  }

  render(timestamp) {
    if(this.last !== current && current){
      let x = ~~current.x,
          y = ~~current.y,
          t = ~~current.timestamp;

        this.element.textContent =
`{
*  x:${x},
*  y:${y},
*  timestamp:${t}
* }`
    }

  }
}

implementation.move_current = el => new MoveCurrent(el);





class MoveList {

    constructor(element) {
        this.awake = false;

        this.canvas = element;//.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');


    }

    render(timestamp) {
        if(!this.awake) this.wake();
        this.touch = timestamp || window.performance.now();


        // The actual stuff
        if (!current) return

        this.last = this.past

        if (!this.past) this.past = current

        // traverse forward in time until we are
        // within 1.5 seconds of now
        for(this.past of points(this.past))
          if(this.past.timestamp > timestamp - 1500)
            break

        if(this.past != this.last || this.first != current){
            this.first = current

        // end of actual stuff

            // let canvas = element.querySelector('canvas');
            // let ctx = canvas.getContext('2d');

            let r = range(points(this.past))
            let e = extent(r)
            let d = distance(e)
            // console.log(r,e,d)

            let canvas = this.canvas;
            let ctx = this.ctx;

            var w = canvas.width, h = canvas.height;

            let s = Math.min(w / e.x , h / e.y, 2.5);

            s *= 0.95;

            let tx = -r.x.min - (e.x/2);
            let ty = -r.y.min - (e.y/2);


            ctx.clearRect(0,0, canvas.width, canvas.height)
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fff'
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.save();

            ctx.translate(w/2, h/2)
            ctx.scale(s,s);

            ctx.translate(tx, ty);


            ctx.beginPath();
            for(let p of points(this.past)){
                ctx.lineTo(p.x, p.y)
            }
            ctx.stroke();

            ctx.restore();
        }



    }

    sleep(){
        this.past = this.last = this.first = null;
        this.awake = false;
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    }
    wake(){
        this.past = this.last = this.first = null;

        // start waiting to go to sleep
        let check = () => {
            if(this.touch + 1000 < window.performance.now()) {
                this.sleep();
            } else {
                setTimeout(check, 1000)
            }
        }
        setTimeout(check, 1000);

        this.awake = true;

    }

}


implementation.move_list = el => new MoveList(el);




class MoveGraph  extends Wakeable {

    constructor(element) {
      super()

      this.el_text = document.getElementById('move_graph_text')
      this.el_bar = document.getElementById('move_graph_bar')

    }

    render(timestamp) {
        if(!this.awake) this.wake();
        this.touch = timestamp || window.performance.now();


        // The actual stuff
        if (!current) return

        this.last = this.past

        if (!this.past) this.past = current

        // traverse forward in time until we are
        // within 1.5 seconds of now
        for(this.past of points(this.past))
          if(this.past.timestamp > timestamp - 1500)
            break

        if(this.past != this.last || this.first != current){
            this.first = current

        // end of actual stuff

            // let canvas = element.querySelector('canvas');
            // let ctx = canvas.getContext('2d');

            let r = range(points(this.past))
            let e = extent(r)
            let d = distance(e)
            // console.log(r,e,d)

            let sc = scale(d);
            let t = tooFar(sc);

            this.el_text.textContent = `
* scaled:  ${sc}
* tooFar: ${t ? 'true': 'false'}`

            this.el_bar.style.width = (sc*100) + '%'
            this.el_bar.style.background = t ? 'red' : '#333';

        }



    }

    sleep(){
      super.sleep();
      this.past = this.last = this.first = null;
    }
}


implementation.move_graph = el => new MoveGraph(el);




class MoveCalculation extends Wakeable {

  constructor(element) {
    super();
    this.el_range = document.getElementById('move_calculation_range')
    this.el_extent = document.getElementById('move_calculation_extent')
    this.el_distance = document.getElementById('move_calculation_distance')
  }

  sleep() {
    super.sleep()
    this.start = null;
  }

  render(timestamp) {
    super.render();

    if (!current) return

    for(this.start of points(this.start || current))
      if(this.start.timestamp > timestamp - 1500)
        break

    let r = range(points(this.start))
    let e = extent(r)
    let d = distance(e)

    this.el_range   .textContent =
      `x = ${r.x.min}…${r.x.max}, y = ${r.y.min}…${r.y.max}`
    this.el_extent  .textContent =
      `x = ${e.x}, y = ${e.y}`
    this.el_distance.textContent = d.toFixed(3)

  }

}
implementation.move_calculation = el => new MoveCalculation(el)




class ColourData extends Wakeable {

  constructor(element) {
    super();
    this.el_range = document.getElementById('move_calculation_range')
    this.el_extent = document.getElementById('move_calculation_extent')
    this.el_distance = document.getElementById('move_calculation_distance')
  }

  sleep() {
    super.sleep()
    this.start = null;
  }

  render(timestamp) {
    super.render();

    if (!current) return

    for(this.start of points(this.start || current))
      if(this.start.timestamp > timestamp - 1500)
        break

    let r = range(points(this.start))
    let e = extent(r)
    let d = distance(e)

    this.el_range   .textContent = JSON.stringify(r)
    this.el_extent  .textContent = JSON.stringify(e)
    this.el_distance.textContent = JSON.stringify(d)

  }

}
implementation.colour_data = el => new ColourData(el)



// colour(
//   clamp(255)(
//     scale(100)(
//       distance(
//         extent(
//           range(
//             points(start)
// )))))






class ColourCalculation extends Wakeable {

  constructor(element) {
    super();
    // this.el_scale  = document.getElementById('colour_calculation_scale')
    // this.el_clamp  = document.getElementById('colour_calculation_clamp')
    this.el_colour = document.getElementById('colour_calculation_colour')
    this.el_out    = document.getElementById('colour_calculation_out')

  }

  sleep() {
    super.sleep()
    this.start = null;
  }

  render(timestamp) {
    super.render();

    if (!current) return

    for(this.start of points(this.start || current))
      if(this.start.timestamp > timestamp - 1500)
        break

    let r = range(points(this.start))
    let e = extent(r)
    let d = distance(e)

    let s  = scale(d)
    let cl = colour(s)

    // this.el_scale  .textContent = JSON.stringify(s)
    // this.el_clamp  .textContent = JSON.stringify(c)
    this.el_colour .textContent = cl

    this.el_out.style.backgroundColor = cl
  }

}
implementation.colour_calculation = el => new ColourCalculation(el)







class OrientationCurrent {
    constructor(element) {
        this.element = element;
    }

    render(timestamp) {
        if(currentO && this.last !== currentO){
            this.element.textContent = `{
  gamma:     ${currentO.x},
  alpha:     ${currentO.y},
  beta:      ${currentO.z}
}`
            this.last = current
        }

    }
}

implementation.orientation_current = el => new OrientationCurrent(el);













class OrientationGraph extends Wakeable {

    constructor(element) {
      super()

        this.canvas = element;//.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');


    }

    render(timestamp) {
      super.render()


        // The actual stuff
        if (!currentO) return

        this.last = this.past

        if (!this.past) this.past = currentO

        // traverse forward in time until we are
        // within 1.5 seconds of now
        for(this.past of points(this.past))
          if(this.past.timestamp > timestamp - 1500)
            break

        if(this.past != this.last || this.first != currentO){
            this.first = currentO

        // end of actual stuff

            // let canvas = element.querySelector('canvas');
            // let ctx = canvas.getContext('2d');

            let r = range3(points(this.past))
            let e = extent3(r)
            let d = distance3(e)
            // console.log(r,e,d)

            let canvas = this.canvas;
            let ctx = this.ctx;

            var w = canvas.width, h = canvas.height;

            let s = Math.min(w / e.x , h / e.y, 2.5);

            s *= 0.95;

            let tx = -r.x.min - (e.x/2);
            let ty = -r.y.min - (e.y/2);


            ctx.clearRect(0,0, canvas.width, canvas.height)
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#fff'
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.save();

            ctx.translate(w/2, h/2)
            ctx.scale(s,s);

            ctx.translate(tx, ty);


            ctx.beginPath();
            for(let p of points(this.past)){
                ctx.lineTo(p.x, p.y)
            }
            ctx.stroke();

            ctx.restore();
        }



    }

    sleep(){
      super.sleep()
      this.past = this.last = this.first = null;
    }

}


implementation.orientation_graph = el => new OrientationGraph(el);





class StateCode {

    constructor(element) {
      this.element = element;
    }

    render(timestamp) {
      if(this.last === state) return;

      this.element.textContent =
        state & READY ? 'READY' :
        state & STARTED ? 'STARTED' :
        state & LOST ? 'LOST' : 'UNKNOWN'

      this.last = state;


    }


}


implementation.state_code = el => new StateCode(el);


function* gmap(generator, fn){
  for(let p of generator)
    yield fn(p)

}



class StateGame extends Wakeable {

    constructor(element) {
      super()

      this.element = element;
      // this.button = document.getElementById('state_game_start');
      // this.button.addEventListener('click', start, false);
    }

    render(timestamp) {
      super.render()
      // if(state & LOST) return this.past = this.last = this.first = null;



        // The actual stuff
        if (!currentO) return

        this.last = this.past

        if (!this.past) this.past = currentO

        // traverse forward in time until we are
        // within 1.5 seconds of now
        for(this.past of points(this.past))
          if(this.past.timestamp > timestamp - 1500)
            break

        if(this.past != this.last || this.first != currentO){
            this.first = currentO;


            let r = range3(gmap(points(this.past),convert))
            let e = extent3(r)
            let d = distance3(e)
            // console.log(d);
            // consoel.l

            // let c = clamp(255)(parseInt(scale(255/2)(d)))
            // let s = scale(d);
            let s = Math.min(d / 2,1)

            this.element.style.backgroundColor = colour(s)

            if(s === 1) lose()

        }



    }

    sleep(){
      super.sleep()
      this.past = this.last = this.first = null;
    }

}


implementation.state_game = el => new StateGame(el);








class OrientationConvert extends Wakeable {

    constructor(element) {
      super()

      this.element = element;

    }

    render(timestamp) {
      super.render()

      if (!currentO || this.last == currentO) return

      var c = convert(currentO);

      this.element.textContent = `
*   gamma = ${c.x}
*   alpha = ${c.y}
*   beta  = ${c.z}`
    }

    sleep(){
      super.sleep()
      this.last = null;
    }

}


implementation.orientation_convert = el => new OrientationConvert(el);













// Hook into the sections of the page, only firing implementations when visible

let sections = []

// sections in view
let active = []
// whether the active list needs updating
let _needs_update

//<span class="d-key" id="move_current">{

const assignSections = () => {
  sections = Array.from(document.getElementsByClassName('d-key'))
      .map( e => ({
          element: e,
          key: e.id,
          fn: implementation[e.id] && implementation[e.id](e)
      }));
  _needs_update = true

}

if(window.Prism) {

  // same as Prism.highlightAll, but with a single callback at end
  const elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

  let count = elements.length

  for (let i=0, element; element = elements[i++];) {
    Prism.highlightElement(element, false, () => {
      if(!--count) assignSections()
    });
  }

} else {
  assignSections()
}

// debug
// ((failed) => {
//     if(!failed.length) return;
//     console.log("missing implementation: ", failed.join(', '))
//
// })(sections.filter( s => !s.fn ).map( s => s.key ));




function updateActive(){
    if(!_needs_update) return;
    _needs_update = false;

    let h = window.innerHeight || document.documentElement.clientHeight,
        w = window.innerWidth || document.documentElement.clientWidth

    active = sections
        .filter( _ => {
            let rect = _.element.getBoundingClientRect()
            return (
                rect.top + rect.height >= 0
                // && rect.left >= 0 &&
                && rect.bottom - rect.height <= h
                // && rect.right <= w
            )
        });
}



// debounced needs update
let _needs_update_timer;
function setScroll(){
    if(_needs_update_timer) return;

    _needs_update_timer = setTimeout(() => {
        _needs_update = true;
        _needs_update_timer = false;
    }, 100)

}

window.addEventListener('resize', setScroll, false)
window.addEventListener('scroll', setScroll, false)


let disabled = false;

function render(t){
    requestAnimationFrame(render)

    if(disabled) return

    updateActive();

    active.forEach( s => {
        if(s.fn) s.fn.render(t, s.element)
    })

}

requestAnimationFrame(render)

const on = (obj, name, fn) =>
  obj.addEventListener(name, fn, false)
const off = (obj, name, fn) =>
  obj.removeEventListener(name, fn)

const scrollH = (selector) => {

  // help-move-hint
  let el = document.querySelector(selector);
  if(el) {
    let bounds = el.getBoundingClientRect()
    return bounds.bottom < 0 ? bounds.height : 0;
  }
  return 0;

}


// Article helper stuff
let enableTouchHelpCircles = () => {

  document.body.className += ' help-touch'
  off(document, 'touchstart', enableTouchHelpCircles)

  let h = scrollH('.help-touch-hint')
  if(h) window.scrollBy(0, h + 22)
}
on(document, 'touchstart', enableTouchHelpCircles);


on(document, 'touchstart', e => {
  let target = e.target;

  if(target.classList.contains('is-touch')){
    e.preventDefault();

    target.classList.add('helping');
    let helped = () => {
      off(document, 'touchend', helped)
      target.classList.remove('helping');
    }
    on(document,'touchend', helped)

  }
}, false)

/*


document.addEventListener('mousemove', (e) => {
    fn.call(null,
        e.pageX - window.scrollX,
        e.pageY - window.scrollY)
}, false);
*/



const moveHelp = e => {
  let target = e.target;

  if(target.classList.contains('is-move')){
    e.preventDefault();

    let startX = e.pageX;
    let startY = e.pageY;
    let handleMove = (e) => {

      let a = e.pageX - startX;
      let b = e.pageY - startY;
      let c = Math.floor(a - b / 2);

      let at = (a % 360 + 360) % 360;
      let bt = ((b % 360 + 360) % 360) - 180;
      let ct = ((c % 180 + 180) % 180) - 90;

      if(backdoor) backdoor(at,bt,ct)

      target.style.transform = `rotateY(${a}deg) rotateX(${b}deg) rotateZ(${c*2}deg)`;

    }

    on(document, 'mousemove', handleMove)

    target.classList.add('helping');

    let helped = () => {
      off(document, 'mouseup', helped)
      off(document, 'mousemove', handleMove)
      target.classList.remove('helping');
      target.style.transform = ''
    }

    document.addEventListener('mouseup', helped, false)

  }
}

//
on(document, 'mousedown', moveHelp)




// Thanks, Android 6.0
const moveHelpT = e => {
  let target = e.target;

  if(target.classList.contains('is-move')){
    e.preventDefault();

    let startX = e.touches[0].pageX;
    let startY = e.touches[0].pageY;
    let handleMove = (e) => {

      let a = e.touches[0].pageX - startX;
      let b = e.touches[0].pageY - startY;
      let c = Math.floor(a - b / 2);

      let at = (a % 360 + 360) % 360;
      let bt = ((b % 360 + 360) % 360) - 180;
      let ct = ((c % 180 + 180) % 180) - 90;

      if(backdoor) backdoor(at,bt,ct)

      target.style.transform = `rotateY(${a}deg) rotateX(${b}deg) rotateZ(${c*2}deg)`;

    }

    on(document, 'touchmove', handleMove)

    target.classList.add('helping');

    let helped = () => {
      off(document, 'touchend', helped)
      off(document, 'touchmove', handleMove)
      target.classList.remove('helping');
      target.style.transform = ''
    }

    document.addEventListener('touchend', helped, false)

  }
}

//
on(document, 'touchstart', moveHelpT)



let disableMoveHelpCircles = (e) => {
  if(!e.alpha) return;
  let h = scrollH('.help-move-hint')

  document.body.className += ' no-help-move'
  off(window, 'deviceorientation', disableMoveHelpCircles)
  off(document, 'mousedown', moveHelp)
  off(document, 'touchstart', moveHelpT)

  // console.log(h)
  if(h) window.scrollBy(0, - h - 22)
}
on(window, 'deviceorientation', disableMoveHelpCircles);



// disable interactiveness

const disableInput = document.getElementById('disable-jjs')
const updateDisabled = () => {disabled = disableInput.checked}

on(disableInput, 'change', updateDisabled)

updateDisabled()
