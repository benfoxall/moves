class TimeStore {

  constructor(n) {
    this.n = n || 1;
    this.size = 512;
    this.data = new Int32Array(this.size * this.n);
    this.deltas = new Uint32Array(this.size);
    this.idx = 0;
    this.count = 0;
    this.last = this.now();
  }

  now() {
    return Date.now();
  };

  add() {

    this.idx = (this.idx || this.size) - 1;

    for (var i = 0; i < this.n; i++)
      this.data[(this.idx * this.n) + i] = arguments[i];

    this.count++;

    // store the timestamp diff of this event
    var now = this.now();
    var delta = now - this.last;
    this.deltas[this.idx] = delta;
    this.last = now;
  };

  each(milliseconds, fn) {
    milliseconds -= (this.now() - this.last);

    var args = new Array(this.n);

    var offset = 0, offsetMax = Math.min(this.count, this.size);
    while (offset < offsetMax) {
      if (milliseconds < 0) break;

      var i = (this.idx + offset) % this.size;

      for (var j = 0; j < this.n; j++) {
        args[j] = this.data[(i * this.n) + j];
      }

      fn.apply(null, args);

      milliseconds -= this.deltas[i];
      offset++;
    }
  };

  extent(milliseconds) {
    milliseconds -= (this.now() - this.last);

    var min = new Array(this.n), max = new Array(this.n), i, v;
    var offset = 0, offsetMax = Math.min(this.count, this.size);
    while (offset < offsetMax) {
      if (milliseconds < 0) break;

      i = (this.idx + offset) % this.size;

      for (var j = 0; j < this.n; j++) {
        v = this.data[(i * this.n) + j];
        min[j] = offset ? Math.min(min[j], v) : v;
        max[j] = offset ? Math.max(max[j], v) : v;
      }

      milliseconds -= this.deltas[i];
      offset++;
    }

    return min.map(function(min, i) {
      return [min, max[i]];
    });
  };

  distance(milliseconds) {
    return Math.sqrt(
      this.extent(milliseconds)
        .reduce(function(memo, e) {
          return Math.pow(e[1] - e[0], 2) + memo;
        },0)
    );
  };


}
