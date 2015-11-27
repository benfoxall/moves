function Store(size, n) {
  this._data = [];
}

Store.prototype.add = function(i) {
  this._data.unshift(i);
};

Store.prototype.last = function(i) {
  return this._data[0];
};

Store.prototype.take = function(c, fn) {
  for (var i = 0; i < c; i++) {
    fn(this._data[i]);
  }
};
