'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var MoveCurrent = (function () {
    function MoveCurrent(element) {
        _classCallCheck(this, MoveCurrent);

        this.element = element;
    }

    _createClass(MoveCurrent, [{
        key: 'render',
        value: function render(timestamp) {
            if (this.last !== current) {
                this.element.textContent = JSON.stringify(current);
                this.last = current;
            }
        }
    }]);

    return MoveCurrent;
})();

implementation.move_current = function (el) {
    return new MoveCurrent(el);
};

var MoveList = (function () {
    function MoveList(element) {
        _classCallCheck(this, MoveList);

        this.awake = false;

        this.canvas = element.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    _createClass(MoveList, [{
        key: 'render',
        value: function render(timestamp) {
            if (!this.awake) this.wake();
            this.touch = timestamp || window.performance.now();

            // The actual stuff
            if (!current) return;

            this.last = this.past;

            if (!this.past) this.past = current;

            // traverse forward in time until we are
            // within 1.5 seconds of now
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = points(this.past)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    this.past = _step2.value;

                    if (this.past.timestamp > timestamp - 1500) break;
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

            if (this.past != this.last || this.first != current) {
                this.first = current;

                // end of actual stuff

                // let canvas = element.querySelector('canvas');
                // let ctx = canvas.getContext('2d');

                var r = range(points(this.past));
                var e = extent(r);
                var d = distance(e);
                // console.log(r,e,d)

                var canvas = this.canvas;
                var ctx = this.ctx;

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
                    for (var _iterator3 = points(this.past)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
        }
    }, {
        key: 'sleep',
        value: function sleep() {
            this.past = this.last = this.first = null;
            this.awake = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }, {
        key: 'wake',
        value: function wake() {
            var _this = this;

            this.past = this.last = this.first = null;

            // start waiting to go to sleep
            var check = function check() {
                if (_this.touch + 1000 < window.performance.now()) {
                    _this.sleep();
                } else {
                    setTimeout(check, 1000);
                }
            };
            setTimeout(check, 1000);

            this.awake = true;
        }
    }]);

    return MoveList;
})();

implementation.move_list = function (el) {
    return new MoveList(el);
};

// Hook into the sections of the page, only firing implementations when visible

var sections = Array.from(document.querySelectorAll('[data-key]')).map(function (e) {
    return {
        element: e,
        key: e.dataset.key,
        fn: implementation[e.dataset.key] && implementation[e.dataset.key](e)
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
        if (s.fn) s.fn.render(t, s.element);
    });
}

render(window.performance.now());