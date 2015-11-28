function Store(size, n) {
  this.size = size || 128;
  this.n = n || 1;

  this.i = 0;
  this.data = new Uint8Array(size * n);

  // count of items stored
  this.count = 0;
}

Store.prototype.add = function(i) {
  if (!Array.isArray(i)) {i = [i];};

  // overflow possible
  this.data.set(i, this.i * this.n);

  // decrement round (makes scanning easier)
  this.i = this.i ? this.i - 1 : this.size - 1;

  this.count ++;
};

Store.prototype.take = function(c, fn) {
  c = Math.min(c, this.size, this.count);

  for (var i = 1; i < c + 1; i++) {
    var idx = ((this.i + i) % this.size) * this.n;
    var arr = this.data.subarray(idx, idx + this.n);
    fn.apply(this, [].slice.call(arr,0));
  }
};

Store.prototype.extent = function(c) {

  c = Math.min(c, this.size, this.count);

  var _n = this.n;
  var min = new Array(_n), max = new Array(_n);

  for (var i = 1; i < c + 1; i++) {
    var idx = ((this.i + i) % this.size) * this.n;
    for (var j = 0; j < _n; j++) {
      if (i == 1) {
        min[j] = max[j] = this.data[idx + j];
      } else {
        min[j] = Math.min(min[j], this.data[idx + j]);
        max[j] = Math.max(max[j], this.data[idx + j]);
      }
    }
  }

  return min.map(function(min, i) {
    return [min, max[i]];
  });
};

Store.prototype.distance = function(i) {

  return Math.sqrt(
    this.extent(i)
      .reduce(function(memo, e) {
        return Math.pow(e[1] - e[0], 2) + memo;
      },0)
  );

};
