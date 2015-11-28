function Store(size, n) {
  this._data = [];
  this._size = size;
  this._n = n || 1;
}

Store.prototype.add = function(i) {
  if(!Array.isArray(i)) i = [i];

  this._data.unshift(i);
  if (this._data.length > this._size)
    this._data.pop();
};

Store.prototype.take = function(c, fn) {
  c = Math.min(c, this._data.length);
  for (var i = 0; i < c; i++) {
    fn.apply(this,this._data[i]);
  }
};

Store.prototype.extent = function(i) {
  var _n = this._n;
  var min = new Array(_n), max = new Array(_n);

  this.take(i, function(value){
    for (var j = 0; j < _n; j++) {
      min[j] = min[j] ? Math.min(min[j], arguments[j]) : arguments[j];
      max[j] = max[j] ? Math.max(max[j], arguments[j]) : arguments[j];
    }
  })

  return min.map(function(min, i){
    return [min, max[i]]
  });
}

Store.prototype.distance = function(i) {

  var ex = this.extent(i);

  var vectors = ex.map(function(e){
    return e[1] - e[0]
  })

  return Math.sqrt(vectors.reduce(function(memo, v){
    return Math.pow(v, 2) + memo;
  },0))

}
