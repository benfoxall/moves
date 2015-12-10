// Helpers

const move = fn => {
    document.addEventListener('mousemove', (e) => {
        fn.call(null,
            e.pageX - window.scrollX,
            e.pageY - window.scrollY)
    }, false);

    document.addEventListener('touchmove', function(e){
      for (var i = 0; i < e.touches.length; i++) {
         fn.call(null,
             e.touches[i].pageX - window.scrollX,
             e.touches[i].pageY - window.scrollY)
      }
    });
}

const move3 = fn => {
    window.addEventListener('deviceorientation', (e) => {
        fn.call(null,
            e.gamma,
            e.beta,
            e.alpha)
    });
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


let scale = a => b => a * b

let clamp = max => d => Math.min(max, Math.max(0, d))

let colour = i => `rgb(${i}, ${255-i}, 0)`




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


const READY = 1, STARTED = 2, LOST = 4
let state = READY

let start = () => {
  if(state & READY | LOST) {
    state = STARTED
  }
}

let lose = () => {
  if(state & STARTED) {
    state = LOST
  }
}












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
        if(this.last !== current){
            this.element.textContent = JSON.stringify(current, null, 2)
            this.last = current
        }

    }
}

implementation.move_current = el => new MoveCurrent(el);





class MoveList {

    constructor(element) {
        this.awake = false;

        this.canvas = element.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        // don't allow scrolling from here
        element.addEventListener('touchstart', e => e.preventDefault())

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








class MoveGraph {

    constructor(element) {
        this.awake = false;

        this.canvas = element.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');


        // this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#08f'
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        // this.ctx.translate()


        // don't allow scrolling from here
        element.addEventListener('touchstart', e => e.preventDefault())

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


            ctx.clearRect(0,0, canvas.width, canvas.height)
            ctx.save();
            let s = canvas.width/2;
            let angle = (Math.PI * 2 *  (d/300));
            // console.log(angle)
            ctx.fillStyle = angle > (Math.PI*2) ? '#f00' : '#08f'
            ctx.translate(s, s)
            ctx.rotate((angle*-.5)+ (Math.PI/2))

            ctx.beginPath()
            ctx.moveTo(0,0)

            ctx.arc(
              0,0,
              s,
              0,
              angle
            );

            ctx.lineTo(0,0)

            ctx.fill()


            ctx.fillStyle = '#fff';
            ctx.beginPath()
            ctx.moveTo(0,0)

            var r2 = Math.max(0.001,Math.min(1,1-(angle / (Math.PI*2)))) * s;

            ctx.arc(
              0,0,
              r2,
              0,
              Math.PI * 2
            );

            ctx.lineTo(0,0)

            ctx.fill()

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

    this.el_range   .textContent = JSON.stringify(r)
    this.el_extent  .textContent = JSON.stringify(e)
    this.el_distance.textContent = JSON.stringify(d)

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
    this.el_scale  = document.getElementById('colour_calculation_scale')
    this.el_clamp  = document.getElementById('colour_calculation_clamp')
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

    let s  = scale(255/300)(d)
    let c  = clamp(255)(parseInt(s))
    let cl = colour(c)

    this.el_scale  .textContent = JSON.stringify(s)
    this.el_clamp  .textContent = JSON.stringify(c)
    this.el_colour .textContent = JSON.stringify(cl)

    this.el_out.style.backgroundColor = cl
  }

}
implementation.colour_calculation = el => new ColourCalculation(el)







class OrientationCurrent {
    constructor(element) {
        this.element = element;
    }

    render(timestamp) {
        if(this.last !== currentO){
            this.element.textContent = JSON.stringify(currentO, null, 2)
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

        // don't allow scrolling from here
        element.addEventListener('touchstart', e => e.preventDefault())

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
            ctx.strokeStyle = '#08f'
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




// Hook into the sections of the page, only firing implementations when visible

const sections = Array.from(document.querySelectorAll('[data-key]'))
    .map( e => ({
        element: e,
        key: e.dataset.key,
        fn: implementation[e.dataset.key] && implementation[e.dataset.key](e)
    }));


// debug
((failed) => {
    if(!failed.length) return;
    console.log("missing implementation: ", failed.join(', '))

})(sections.filter( s => !s.fn ).map( s => s.key ));



let active = [];

// whether the active list needs updating
let _needs_update = true

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



function render(t){
    requestAnimationFrame(render)

    updateActive();

    active.forEach( s => {
        if(s.fn) s.fn.render(t, s.element)
    })


}

render(window.performance.now());
