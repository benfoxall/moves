let implementation = {};

implementation.move_current = (t, element) => {


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
