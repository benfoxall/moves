function Store(size, n) {
  this._data = [];
  this._size = size;
}

Store.prototype.add = function(i) {
  this._data.unshift(i);
  if (this._data.length > this._size)
    this._data.pop();
};

Store.prototype.take = function(c, fn) {
  c = Math.min(c, this._data.length);
  for (var i = 0; i < c; i++) {
    fn(this._data[i]);
  }
};

Store.prototype.extent = function(i) {
  var min, max;
  this.take(i, function(value){
    min = min ? Math.min(min, value) : value;
    max = max ? Math.max(max, value) : value;
  })
  return [min,max]
}

Store.prototype.distance = function(i) {
  var ex = this.extent(i);
  return ex ? ex[1] - ex[0] : 0;
}
