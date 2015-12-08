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


function * points(p) {
    do yield p
    while (p = p.next)
}

const range = (points) => {

    let minX, maxX, minY, maxY, first = true;

    for(let n of points) {
        if(first){
            minX = maxX = n.x;
            minY = maxY = n.y;
            first = false;
            continue;
        }

        if (n.x < minX) {minX = n.x}
        else if (n.x > maxX ) {maxX = n.x}

        if (n.y < minY) {minY = n.y}
        else if (n.y > maxY) {maxY = n.y}
    }

    return {
        x:{min: minX, max: maxX},
        y:{min: minY, max: maxY}
    }
}



let extent = (range) => ({
  x: range.x.max - range.x.min,
  y: range.y.max - range.y.min
})

let distance = (range) =>
    Math.sqrt(
        Math.pow(range.x, 2) +
        Math.pow(range.y, 2)
  )






let implementation = {};

let move_current_last;
implementation.move_current = (t, element) => {
    if(move_current_last !== current){
        element.innerText = JSON.stringify(current)
        move_current_last = current
    }
}


// class MoveList(){
//     constructor(element){
//         this.canvas = element.querySelector('canvas');
//         this.ctx = canvas.getContext('2d');
//
//         this.past = this.last = this.first = null;
//
//         this.timer = null;
//     }
//
//     render(timestamp){
//         clearTimeout(this.timer);
//
//         this.timer = setTimeout()
//     }
// }



// VERY TODO: reliquish these
let past, last, first;

implementation.move_list = (timestamp, element) => {
    if (!current) return

    last = past

    if (!past) past = current

    // traverse forward in time until we are
    // within 1.5 seconds of now
    for(past of points(past))
      if(past.timestamp > timestamp - 1500)
        break

    if(past != last || first != current){
        first = current

        let canvas = element.querySelector('canvas');
        let ctx = canvas.getContext('2d');

        let r = range(points(past))
        let e = extent(r)
        let d = distance(e)
        // console.log(r,e,d)

        var w = canvas.width, h = canvas.height;

        let s = Math.min(w / e.x , h / e.y, 2.5);

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
        for(let p of points(past)){
            ctx.lineTo(p.x, p.y)
        }
        ctx.stroke();

        ctx.restore();
    }

}



// Hook into the sections of the page, only firing implementations when visible

const sections = Array.from(document.querySelectorAll('[data-key]'))
    .map( e => ({
        element: e,
        key: e.dataset.key,
        fn: implementation[e.dataset.key]
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
        if(s.fn) s.fn.call(null, t, s.element)
    })


}

render(window.performance.now());
