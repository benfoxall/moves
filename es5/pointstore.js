"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = (function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
        this.next = null;
    }

    _createClass(Point, [{
        key: Symbol.iterator,
        value: regeneratorRuntime.mark(function value() {
            var p;
            return regeneratorRuntime.wrap(function value$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            p = this;

                        case 1:
                            _context.next = 3;
                            return p;

                        case 3:
                            if (p = p.next) {
                                _context.next = 1;
                                break;
                            }

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, value, this);
        })

        /*
            calculate the range of x & y for all
            points linked to this one
        */

    }, {
        key: "range",
        value: function range() {
            var minX = this.x,
                maxX = this.x,
                minY = this.y,
                maxY = this.y;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var n = _step.value;

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

            return [minX, maxX, minY, maxY];
        }
    }]);

    return Point;
})();