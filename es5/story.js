'use strict';

var _marked = [points].map(regeneratorRuntime.mark);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Helpers

var move = function move(fn) {
    document.addEventListener('mousemove', function (e) {
        fn.call(null, e.pageX - window.scrollX, e.pageY - window.scrollY);
    }, false);

    document.addEventListener('touchmove', function (e) {
        for (var i = 0; i < e.touches.length; i++) {
            fn.call(null, e.touches[i].pageX - window.scrollX, e.touches[i].pageY - window.scrollY);
        }
    });
};

// Actual stuff

var Point = function Point(x, y, last) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;

    this.timestamp = window.performance.now();

    if (last) last.next = this;
};

var current = null;

// helper function for adding mouse/touch move listeners
move(function (x, y) {
    current = new Point(x, y, current);
});

function points(p) {
    return regeneratorRuntime.wrap(function points$(_context) {
        while (1) switch (_context.prev = _context.next) {
            case 0:
                _context.next = 2;
                return p;

            case 2:
                if (p = p.next) {
                    _context.next = 0;
                    break;
                }

            case 3:
            case 'end':
                return _context.stop();
        }
    }, _marked[0], this);
}

var range = function range(points) {

    var minX = undefined,
        maxX = undefined,
        minY = undefined,
        maxY = undefined,
        first = true;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            if (first) {
                minX = maxX = n.x;
                minY = maxY = n.y;
                first = false;
                continue;
            }

            if (n.x < minX) {
                minX = n.x;
            } else if (n.x > maxX) {
                maxX = n.x;
            }

            if (n.y < minY) {
                minY = n.y;
            } else if (n.y > maxY) {
                maxY = n.y;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return {
        x: { min: minX, max: maxX },
        y: { min: minY, max: maxY }
    };
};

var extent = function extent(range) {
    return {
        x: range.x.max - range.x.min,
        y: range.y.max - range.y.min
    };
};

var distance = function distance(range) {
    return Math.sqrt(Math.pow(range.x, 2) + Math.pow(range.y, 2));
};

var implementation = {};

var move_current_last = undefined;
implementation.move_current = function (t, element) {
    if (move_current_last !== current) {
        element.innerText = JSON.stringify(current);
        move_current_last = current;
    }
};

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
var past = undefined,
    last = undefined,
    first = undefined;

implementation.move_list = function (timestamp, element) {
    if (!current) return;

    last = past;

    if (!past) past = current;

    // traverse forward in time until we are
    // within 1.5 seconds of now
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = points(past)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            past = _step2.value;

            if (past.timestamp > timestamp - 1500) break;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    if (past != last || first != current) {
        first = current;

        var canvas = element.querySelector('canvas');
        var ctx = canvas.getContext('2d');

        var r = range(points(past));
        var e = extent(r);
        var d = distance(e);
        // console.log(r,e,d)

        var w = canvas.width,
            h = canvas.height;

        var s = Math.min(w / e.x, h / e.y, 2.5);

        var tx = -r.x.min - e.x / 2;
        var ty = -r.y.min - e.y / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#08f';
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.save();

        ctx.translate(w / 2, h / 2);
        ctx.scale(s, s);

        ctx.translate(tx, ty);

        ctx.beginPath();
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = points(past)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var p = _step3.value;

                ctx.lineTo(p.x, p.y);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        ctx.stroke();

        ctx.restore();
    }
};

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