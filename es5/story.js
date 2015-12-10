'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var move3 = function move3(fn) {
    window.addEventListener('deviceorientation', function (e) {
        fn.call(null, e.gamma, e.beta, e.alpha);
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

    var x_min = undefined,
        x_max = undefined,
        y_min = undefined,
        y_max = undefined,
        first = true;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            if (first) {
                x_min = x_max = n.x;
                y_min = y_max = n.y;
                first = false;
                continue;
            }

            if (n.x < x_min) {
                x_min = n.x;
            } else if (n.x > x_max) {
                x_max = n.x;
            }

            if (n.y < y_min) {
                y_min = n.y;
            } else if (n.y > y_max) {
                y_max = n.y;
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
        x: { min: x_min, max: x_max },
        y: { min: y_min, max: y_max }
    };
};

var extent = function extent(r) {
    var x = r.x.max - r.x.min,
        y = r.y.max - r.y.min;

    return { x: x, y: y };
};

var distance = function distance(e) {
    return Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.y, 2));
};

var scale = function scale(a) {
    return function (b) {
        return a * b;
    };
};

var clamp = function clamp(max) {
    return function (d) {
        return Math.min(max, Math.max(0, d));
    };
};

var colour = function colour(i) {
    return 'rgb(' + i + ', ' + (255 - i) + ', 0)';
};

// 3d versions

var range3 = function range3(points) {

    var x_min = undefined,
        x_max = undefined,
        y_min = undefined,
        y_max = undefined,
        z_min = undefined,
        z_max = undefined,
        first = true;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var n = _step2.value;

            if (first) {
                x_min = x_max = n.x;
                y_min = y_max = n.y;
                z_min = z_max = n.z;
                first = false;
                continue;
            }

            if (n.x < x_min) {
                x_min = n.x;
            } else if (n.x > x_max) {
                x_max = n.x;
            }

            if (n.y < y_min) {
                y_min = n.y;
            } else if (n.y > y_max) {
                y_max = n.y;
            }

            if (n.z < z_min) {
                z_min = n.z;
            } else if (n.z > z_max) {
                z_max = n.z;
            }
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

    return {
        x: { min: x_min, max: x_max },
        y: { min: y_min, max: y_max },
        z: { min: z_min, max: z_max }
    };
};

var extent3 = function extent3(r) {
    var x = r.x.max - r.x.min,
        y = r.y.max - r.y.min,
        z = r.z.max - r.z.min;

    return { x: x, y: y, z: z };
};

var distance3 = function distance3(e) {
    return Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.y, 2) + Math.pow(e.z, 2));
};

var Point3 = function Point3(x, y, z, last) {
    _classCallCheck(this, Point3);

    this.x = x;
    this.y = y;
    this.z = z;

    this.timestamp = window.performance.now();

    if (last) last.next = this;
};

var currentO = null;

// helper function for adding mouse/touch move listeners
move3(function (x, y, z) {
    currentO = new Point3(x, y, z, currentO);
});

var READY = 1,
    STARTED = 2,
    LOST = 4;
var state = READY;

var button = document.getElementById('state_game_button');

var start = function start() {
    if (state & READY | LOST) {
        state = STARTED;
        button.style.opacity = 0;
    }
};

var lose = function lose() {
    if (state & STARTED) {
        state = LOST;
        button.style.opacity = 1;
    }
};

button.addEventListener('click', start);

var Wakeable = (function () {
    function Wakeable(element) {
        _classCallCheck(this, Wakeable);

        this.awake = false;
    }

    _createClass(Wakeable, [{
        key: 'render',
        value: function render(timestamp) {
            if (!this.awake) this.wake();
            this.touch = timestamp || window.performance.now();
        }
    }, {
        key: 'sleep',
        value: function sleep() {
            this.awake = false;
        }
    }, {
        key: 'wake',
        value: function wake() {
            var _this = this;

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

    return Wakeable;
})();

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
                this.element.textContent = JSON.stringify(current, null, 2);
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

        // don't allow scrolling from here
        element.addEventListener('touchstart', function (e) {
            return e.preventDefault();
        });
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
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = points(this.past)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    this.past = _step3.value;

                    if (this.past.timestamp > timestamp - 1500) break;
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

                s *= 0.95;

                var tx = -r.x.min - e.x / 2;
                var ty = -r.y.min - e.y / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#fff';
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.save();

                ctx.translate(w / 2, h / 2);
                ctx.scale(s, s);

                ctx.translate(tx, ty);

                ctx.beginPath();
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = points(this.past)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var p = _step4.value;

                        ctx.lineTo(p.x, p.y);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
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
            var _this2 = this;

            this.past = this.last = this.first = null;

            // start waiting to go to sleep
            var check = function check() {
                if (_this2.touch + 1000 < window.performance.now()) {
                    _this2.sleep();
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

var MoveGraph = (function () {
    function MoveGraph(element) {
        _classCallCheck(this, MoveGraph);

        this.awake = false;

        this.canvas = element.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        // this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#08f';
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        // this.ctx.translate()

        // don't allow scrolling from here
        element.addEventListener('touchstart', function (e) {
            return e.preventDefault();
        });
    }

    _createClass(MoveGraph, [{
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
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = points(this.past)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    this.past = _step5.value;

                    if (this.past.timestamp > timestamp - 1500) break;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
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

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                var s = canvas.width / 2;
                var angle = Math.PI * 2 * (d / 300);
                // console.log(angle)
                ctx.fillStyle = angle > Math.PI * 2 ? '#f00' : '#08f';
                ctx.translate(s, s);
                ctx.rotate(angle * -.5 + Math.PI / 2);

                ctx.beginPath();
                ctx.moveTo(0, 0);

                ctx.arc(0, 0, s, 0, angle);

                ctx.lineTo(0, 0);

                ctx.fill();

                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.moveTo(0, 0);

                var r2 = Math.max(0.001, Math.min(1, 1 - angle / (Math.PI * 2))) * s;

                ctx.arc(0, 0, r2, 0, Math.PI * 2);

                ctx.lineTo(0, 0);

                ctx.fill();

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
            var _this3 = this;

            this.past = this.last = this.first = null;

            // start waiting to go to sleep
            var check = function check() {
                if (_this3.touch + 1000 < window.performance.now()) {
                    _this3.sleep();
                } else {
                    setTimeout(check, 1000);
                }
            };
            setTimeout(check, 1000);

            this.awake = true;
        }
    }]);

    return MoveGraph;
})();

implementation.move_graph = function (el) {
    return new MoveGraph(el);
};

var MoveCalculation = (function (_Wakeable) {
    _inherits(MoveCalculation, _Wakeable);

    function MoveCalculation(element) {
        _classCallCheck(this, MoveCalculation);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(MoveCalculation).call(this));

        _this4.el_range = document.getElementById('move_calculation_range');
        _this4.el_extent = document.getElementById('move_calculation_extent');
        _this4.el_distance = document.getElementById('move_calculation_distance');
        return _this4;
    }

    _createClass(MoveCalculation, [{
        key: 'sleep',
        value: function sleep() {
            _get(Object.getPrototypeOf(MoveCalculation.prototype), 'sleep', this).call(this);
            this.start = null;
        }
    }, {
        key: 'render',
        value: function render(timestamp) {
            _get(Object.getPrototypeOf(MoveCalculation.prototype), 'render', this).call(this);

            if (!current) return;

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = points(this.start || current)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    this.start = _step6.value;

                    if (this.start.timestamp > timestamp - 1500) break;
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            var r = range(points(this.start));
            var e = extent(r);
            var d = distance(e);

            this.el_range.textContent = JSON.stringify(r);
            this.el_extent.textContent = JSON.stringify(e);
            this.el_distance.textContent = JSON.stringify(d);
        }
    }]);

    return MoveCalculation;
})(Wakeable);

implementation.move_calculation = function (el) {
    return new MoveCalculation(el);
};

var ColourData = (function (_Wakeable2) {
    _inherits(ColourData, _Wakeable2);

    function ColourData(element) {
        _classCallCheck(this, ColourData);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColourData).call(this));

        _this5.el_range = document.getElementById('move_calculation_range');
        _this5.el_extent = document.getElementById('move_calculation_extent');
        _this5.el_distance = document.getElementById('move_calculation_distance');
        return _this5;
    }

    _createClass(ColourData, [{
        key: 'sleep',
        value: function sleep() {
            _get(Object.getPrototypeOf(ColourData.prototype), 'sleep', this).call(this);
            this.start = null;
        }
    }, {
        key: 'render',
        value: function render(timestamp) {
            _get(Object.getPrototypeOf(ColourData.prototype), 'render', this).call(this);

            if (!current) return;

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = points(this.start || current)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    this.start = _step7.value;

                    if (this.start.timestamp > timestamp - 1500) break;
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            var r = range(points(this.start));
            var e = extent(r);
            var d = distance(e);

            this.el_range.textContent = JSON.stringify(r);
            this.el_extent.textContent = JSON.stringify(e);
            this.el_distance.textContent = JSON.stringify(d);
        }
    }]);

    return ColourData;
})(Wakeable);

implementation.colour_data = function (el) {
    return new ColourData(el);
};

// colour(
//   clamp(255)(
//     scale(100)(
//       distance(
//         extent(
//           range(
//             points(start)
// )))))

var ColourCalculation = (function (_Wakeable3) {
    _inherits(ColourCalculation, _Wakeable3);

    function ColourCalculation(element) {
        _classCallCheck(this, ColourCalculation);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColourCalculation).call(this));

        _this6.el_scale = document.getElementById('colour_calculation_scale');
        _this6.el_clamp = document.getElementById('colour_calculation_clamp');
        _this6.el_colour = document.getElementById('colour_calculation_colour');
        _this6.el_out = document.getElementById('colour_calculation_out');

        return _this6;
    }

    _createClass(ColourCalculation, [{
        key: 'sleep',
        value: function sleep() {
            _get(Object.getPrototypeOf(ColourCalculation.prototype), 'sleep', this).call(this);
            this.start = null;
        }
    }, {
        key: 'render',
        value: function render(timestamp) {
            _get(Object.getPrototypeOf(ColourCalculation.prototype), 'render', this).call(this);

            if (!current) return;

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = points(this.start || current)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    this.start = _step8.value;

                    if (this.start.timestamp > timestamp - 1500) break;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            var r = range(points(this.start));
            var e = extent(r);
            var d = distance(e);

            var s = scale(255 / 300)(d);
            var c = clamp(255)(parseInt(s));
            var cl = colour(c);

            this.el_scale.textContent = JSON.stringify(s);
            this.el_clamp.textContent = JSON.stringify(c);
            this.el_colour.textContent = JSON.stringify(cl);

            this.el_out.style.backgroundColor = cl;
        }
    }]);

    return ColourCalculation;
})(Wakeable);

implementation.colour_calculation = function (el) {
    return new ColourCalculation(el);
};

var OrientationCurrent = (function () {
    function OrientationCurrent(element) {
        _classCallCheck(this, OrientationCurrent);

        this.element = element;
    }

    _createClass(OrientationCurrent, [{
        key: 'render',
        value: function render(timestamp) {
            if (this.last !== currentO) {
                this.element.textContent = JSON.stringify(currentO, null, 2);
                this.last = current;
            }
        }
    }]);

    return OrientationCurrent;
})();

implementation.orientation_current = function (el) {
    return new OrientationCurrent(el);
};

var OrientationGraph = (function (_Wakeable4) {
    _inherits(OrientationGraph, _Wakeable4);

    function OrientationGraph(element) {
        _classCallCheck(this, OrientationGraph);

        var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(OrientationGraph).call(this));

        _this7.canvas = element; //.querySelector('canvas');
        _this7.ctx = _this7.canvas.getContext('2d');

        // don't allow scrolling from here
        element.addEventListener('touchstart', function (e) {
            return e.preventDefault();
        });

        return _this7;
    }

    _createClass(OrientationGraph, [{
        key: 'render',
        value: function render(timestamp) {
            _get(Object.getPrototypeOf(OrientationGraph.prototype), 'render', this).call(this);

            // The actual stuff
            if (!currentO) return;

            this.last = this.past;

            if (!this.past) this.past = currentO;

            // traverse forward in time until we are
            // within 1.5 seconds of now
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = points(this.past)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    this.past = _step9.value;

                    if (this.past.timestamp > timestamp - 1500) break;
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            if (this.past != this.last || this.first != currentO) {
                this.first = currentO;

                // end of actual stuff

                // let canvas = element.querySelector('canvas');
                // let ctx = canvas.getContext('2d');

                var r = range3(points(this.past));
                var e = extent3(r);
                var d = distance3(e);
                // console.log(r,e,d)

                var canvas = this.canvas;
                var ctx = this.ctx;

                var w = canvas.width,
                    h = canvas.height;

                var s = Math.min(w / e.x, h / e.y, 2.5);

                s *= 0.95;

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
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = points(this.past)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var p = _step10.value;

                        ctx.lineTo(p.x, p.y);
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
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
            _get(Object.getPrototypeOf(OrientationGraph.prototype), 'sleep', this).call(this);
            this.past = this.last = this.first = null;
        }
    }]);

    return OrientationGraph;
})(Wakeable);

implementation.orientation_graph = function (el) {
    return new OrientationGraph(el);
};

var StateCode = (function () {
    function StateCode(element) {
        _classCallCheck(this, StateCode);

        this.element = element;
    }

    _createClass(StateCode, [{
        key: 'render',
        value: function render(timestamp) {
            if (this.last === state) return;

            this.element.textContent = state & READY ? 'READY' : state & STARTED ? 'STARTED' : state & LOST ? 'LOST' : 'UNKNOWN';

            this.last = state;
        }
    }]);

    return StateCode;
})();

implementation.state_code = function (el) {
    return new StateCode(el);
};

var StateGame = (function (_Wakeable5) {
    _inherits(StateGame, _Wakeable5);

    function StateGame(element) {
        _classCallCheck(this, StateGame);

        var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(StateGame).call(this));

        _this8.element = element;
        // this.button = document.getElementById('state_game_start');
        // this.button.addEventListener('click', start, false);
        return _this8;
    }

    _createClass(StateGame, [{
        key: 'render',
        value: function render(timestamp) {
            _get(Object.getPrototypeOf(StateGame.prototype), 'render', this).call(this);
            if (state & LOST) return this.past = this.last = this.first = null;

            // The actual stuff
            if (!currentO) return;

            this.last = this.past;

            if (!this.past) this.past = currentO;

            // traverse forward in time until we are
            // within 1.5 seconds of now
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = points(this.past)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    this.past = _step11.value;

                    if (this.past.timestamp > timestamp - 1500) break;
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            if (this.past != this.last || this.first != currentO) {
                this.first = currentO;

                var r = range3(points(this.past));
                var e = extent3(r);
                var d = distance3(e);
                // consoel.l

                var c = clamp(255)(parseInt(scale(255 / 300)(d)));

                this.element.style.backgroundColor = colour(c);

                if (c > 254) lose();
            }
        }
    }, {
        key: 'sleep',
        value: function sleep() {
            _get(Object.getPrototypeOf(StateGame.prototype), 'sleep', this).call(this);
            this.past = this.last = this.first = null;
        }
    }]);

    return StateGame;
})(Wakeable);

implementation.state_game = function (el) {
    return new StateGame(el);
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

// Article helper stuff
var enableTouchHelpCircles = function enableTouchHelpCircles() {
    document.body.className += ' help-touch';
    document.removeEventListener('touchstart', enableTouchHelpCircles);
};
document.addEventListener('touchstart', enableTouchHelpCircles, false);

document.addEventListener('touchstart', function (e) {
    var target = e.target;

    if (target.dataset.help === 'touch') {
        (function () {
            e.preventDefault();

            target.classList.add('helping');
            var helped = function helped() {
                document.removeEventListener('touchend', helped);
                target.classList.remove('helping');
            };
            document.addEventListener('touchend', helped, false);
        })();
    }
}, false);