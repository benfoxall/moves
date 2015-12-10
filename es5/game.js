'use strict';

var _marked = [points].map(regeneratorRuntime.mark);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function Point(x, y, z, last) {
  _classCallCheck(this, Point);

  this.x = x;
  this.y = y;
  this.z = z;

  this.timestamp = window.performance.now();

  if (last) last.next = this;
};

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

  var x_min = undefined,
      x_max = undefined,
      y_min = undefined,
      y_max = undefined,
      z_min = undefined,
      z_max = undefined,
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
    y: { min: y_min, max: y_max },
    z: { min: z_min, max: z_max }
  };
};

var extent = function extent(r) {
  var x = r.x.max - r.x.min,
      y = r.y.max - r.y.min,
      z = r.z.max - r.z.min;

  return { x: x, y: y, z: z };
};

var distance = function distance(e) {
  return Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.y, 2) + Math.pow(e.z, 2));
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

var READY = 1,
    STARTED = 2,
    LOST = 4;
var state = READY;

var button = document.getElementsByTagName('button')[0];

var start = function start() {
  if (state & READY | LOST) {
    state = STARTED;
    button.className = 'hidden';
  }
};

var lose = function lose() {
  if (state & STARTED) {
    state = LOST;
    button.className = '';
  }
};

// gather points
var current = null;

window.addEventListener('deviceorientation', function (e) {
  current = new Point(e.gamma, e.beta, e.alpha, current);
});

// render points
var first = null;

// handy to save distance for other stuff
var _distance = 0;

var _first = undefined,
    _current = undefined;

var render = function render(timestamp) {
  requestAnimationFrame(render);

  if (!current) return;

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = points(first || current)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      first = _step2.value;

      if (first.timestamp > timestamp - 1500) break;
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

  if (state & LOST) return;

  // optimisation to not have to redraw same thing
  if (_first == first && _current == current) return;
  _first = first;
  _current = current;

  var d = distance(extent(range(points(first))));

  var c = Math.round(clamp(255)(scale(255 / 80)(d)));

  document.body.style.background = colour(c);

  if (c > 254) lose();

  console.log(d, c);
};

requestAnimationFrame(render);

button.addEventListener('click', start, false);