'use strict';

var implementation = {};

implementation.move_current = function (t, element) {};

// Hook into the sections of the page, only firing implementations when visible

var sections = Array.from(document.querySelectorAll('[data-key]')).map(function (e) {
    return {
        element: e,
        key: e.dataset.key,
        fn: implementation[e.dataset.key]
    };
});

// debug
(function (failed) {
    if (!failed.length) return;
    console.log("missing implementation: ", failed.join(', '));
})(sections.filter(function (s) {
    return !s.fn;
}).map(function (s) {
    return s.key;
}));

var active = [];

// whether the active list needs updating
var _needs_update = true;

function updateActive() {
    if (!_needs_update) return;
    _needs_update = false;

    var h = window.innerHeight || document.documentElement.clientHeight,
        w = window.innerWidth || document.documentElement.clientWidth;

    active = sections.filter(function (_) {
        var rect = _.element.getBoundingClientRect();
        return rect.top + rect.height >= 0
        // && rect.left >= 0 &&
         && rect.bottom - rect.height <= h
        // && rect.right <= w
        ;
    });
}

// debounced needs update
var _needs_update_timer = undefined;
function setScroll() {
    if (_needs_update_timer) return;

    _needs_update_timer = setTimeout(function () {
        _needs_update = true;
        _needs_update_timer = false;
    }, 100);
}

window.addEventListener('resize', setScroll, false);
window.addEventListener('scroll', setScroll, false);

function render(t) {
    requestAnimationFrame(render);

    updateActive();

    active.forEach(function (s) {
        if (s.fn) s.fn.call(null, t, s.element);
    });
}

render(window.performance.now());