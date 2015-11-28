function Store(size, n) {
  this._size = size || 128;
  this._n = n || 1;

  this._i = 0;
  this.__data = new Uint8Array(size * n);

  // count of items stored
  this._c = 0;
}

Store.prototype.add = function(i) {
  if (!Array.isArray(i)) {i = [i];};

  // overflow possible
  this.__data.set(i, this._i * this._n);

  // decrement round (makes scanning easier)
  this._i = this._i ? this._i - 1 : this._size - 1;

  this._c ++;
};

Store.prototype.take = function(c, fn) {
  c = Math.min(c, this._size, this._c);

  for (var i = 1; i < c + 1; i++) {
    var idx = ((this._i + i) % this._size) * this._n;
    var arr = this.__data.subarray(idx, idx + this._n);
    fn.apply(this, [].slice.call(arr,0));
  }
};

Store.prototype.extent = function(c) {

  c = Math.min(c, this._size, this._c);

  var _n = this._n;
  var min = new Array(_n), max = new Array(_n);

  for (var i = 1; i < c + 1; i++) {
    var idx = ((this._i + i) % this._size) * this._n;
    for (var j = 0; j < _n; j++) {
      if (i == 1) {
        min[j] = max[j] = this.__data[idx + j];
      } else {
        min[j] = Math.min(min[j], this.__data[idx + j]);
        max[j] = Math.max(max[j], this.__data[idx + j]);
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
