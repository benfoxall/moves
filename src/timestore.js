
class TimeStore {

  constructor(props) {
    this.props = props;
    this.n = props.length;
    this.size = 512;
    this.data = new Int32Array(this.size * this.n);
    this.deltas = new Uint32Array(this.size);
    this.idx = 0;
    this.count = 0;
    this.last = this.now();
  }

  now() {
    return Date.now();
  }

  add(object) {

    this.idx = (this.idx || this.size) - 1;

    this.data.set(
      this.props.map( p => object[p]),
      this.idx * this.n
    )

    this.count++;

    // store the timestamp diff of this event
    var now = this.now();
    var delta = now - this.last;
    this.deltas[this.idx] = delta;
    this.last = now;
  }

  each(milliseconds, fn) {
    milliseconds -= (this.now() - this.last);

    var args = new Array(this.n);

    var offset = 0, offsetMax = Math.min(this.count, this.size);
    while (offset < offsetMax) {
      if (milliseconds < 0) break;

      var i = (this.idx + offset) % this.size;

      fn.apply(null, this.props.map(
        (p,j) => this.data[(i * this.n) + j]
      ));

      milliseconds -= this.deltas[i];
      offset++;
    }
  }

  range(milliseconds) {
    milliseconds -= (this.now() - this.last);

    var min = new Array(this.n), max = new Array(this.n), i, v;
    var offset = 0, offsetMax = Math.min(this.count, this.size);
    while (offset < offsetMax) {
      if (milliseconds < 0) break;

      let i = (this.idx + offset) % this.size;

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
    })
  }

  extent(milliseconds) {
    return this.range(milliseconds).map(r => r[1] - r[0])
  }

}
