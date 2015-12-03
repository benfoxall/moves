"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeStore = (function () {
  function TimeStore(props) {
    _classCallCheck(this, TimeStore);

    this.props = props;
    this.n = props.length;
    this.size = 512;
    this.data = new Int32Array(this.size * this.n);
    this.deltas = new Uint32Array(this.size);
    this.idx = 0;
    this.count = 0;
    this.last = this.now();
  }

  _createClass(TimeStore, [{
    key: "now",
    value: function now() {
      return Date.now();
    }
  }, {
    key: "add",
    value: function add(object) {

      this.idx = (this.idx || this.size) - 1;

      this.data.set(this.props.map(function (p) {
        return object[p];
      }), this.idx * this.n);

      this.count++;

      // store the timestamp diff of this event
      var now = this.now();
      var delta = now - this.last;
      this.deltas[this.idx] = delta;
      this.last = now;
    }
  }, {
    key: "each",
    value: function each(milliseconds, fn) {
      var _this = this;

      milliseconds -= this.now() - this.last;

      var args = new Array(this.n);

      var offset = 0,
          offsetMax = Math.min(this.count, this.size);
      while (offset < offsetMax) {
        if (milliseconds < 0) break;

        var i = (this.idx + offset) % this.size;

        fn.apply(null, this.props.map(function (p, j) {
          return _this.data[i * _this.n + j];
        }));

        milliseconds -= this.deltas[i];
        offset++;
      }
    }
  }, {
    key: "range",
    value: function range(milliseconds) {
      milliseconds -= this.now() - this.last;

      var min = new Array(this.n),
          max = new Array(this.n),
          i,
          v;
      var offset = 0,
          offsetMax = Math.min(this.count, this.size);
      while (offset < offsetMax) {
        if (milliseconds < 0) break;

        var _i = (this.idx + offset) % this.size;

        for (var j = 0; j < this.n; j++) {
          v = this.data[_i * this.n + j];
          min[j] = offset ? Math.min(min[j], v) : v;
          max[j] = offset ? Math.max(max[j], v) : v;
        }

        milliseconds -= this.deltas[_i];
        offset++;
      }

      return min.map(function (min, i) {
        return [min, max[i]];
      });
    }
  }, {
    key: "extent",
    value: function extent(milliseconds) {
      return this.range(milliseconds).map(function (r) {
        return r[1] - r[0];
      });
    }
  }]);

  return TimeStore;
})();