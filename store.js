function TimeStore(size, n){
  this.n = n || 1;
  this.size = size || 200;
  this.data = new Int32Array(this.size * this.n);
  this.deltas = new Uint16Array(this.size); // max 32s
  this.idx = 0;
  this.count = 0;
  this.last = this.now();
}

TimeStore.prototype.now = function(){
  return Date.now();
}

TimeStore.prototype.add = function(){

  this.idx = (this.idx || this.size) - 1;

  for (var i = 0; i < this.n; i++)
    this.data[(this.idx*this.n) + i] = arguments[i];

  this.count ++;

  // store the timestamp diff of this event
  var now = this.now();
  var delta = now - this.last;
  this.deltas[this.idx] = delta;
  this.last = now;
}

TimeStore.prototype.extent = function(milliseconds){
  milliseconds -= (this.now() - this.last);

  var min = new Array(this.n), max = new Array(this.n), i, v;
  var offset = 0, offsetMax = Math.min(this.count, this.size);
  while(offset < offsetMax){
    if(milliseconds<0) break;

    i = (this.idx + offset) % this.size;

    for (var j = 0; j < this.n; j++) {
      v = this.data[(i*this.n) + j];
      min[j] = offset ? Math.min(min[j], v) : v;
      max[j] = offset ? Math.max(max[j], v) : v;
    }

    milliseconds -= this.deltas[i];
    offset++;
  }

  return min.map(function(min, i) {
    return [min, max[i]];
  });
}

TimeStore.prototype.distance = function(milliseconds){
  return Math.sqrt(
    this.extent(milliseconds)
      .reduce(function(memo, e) {
        return Math.pow(e[1] - e[0], 2) + memo;
      },0)
  );
}




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
