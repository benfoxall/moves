function Store(size, n) {
  this._data = [];
  this._size = size;
}

Store.prototype.add = function(i) {
  this._data.unshift(i);
  if (this._data.length > this._size)
    this._data.pop();
};

Store.prototype.last = function(i) {
  return this._data[0];
};

Store.prototype.take = function(c, fn) {
  c = Math.min(c, this._data.length);
  for (var i = 0; i < c; i++) {
    fn(this._data[i]);
  }
};
