var expect = chai.expect;

describe('Store', function() {
  function take(i){
    var items = [];

    store.take(i, function(i) {
      var args = [].slice.call(arguments);
      if(args.length === 1) items.push(i)
      else items.push(args);
    });

    return items;
  }

  var store;

  describe('size 5', function() {

    beforeEach(function() {
      store = new Store(5, 1);
      store.add(5);
      store.add(6);
      store.add(7);
    });

    it('iterates through', function() {

      expect(take(3)).to.eql([7, 6, 5]);

    });

    it('only gives amount of items stored', function() {

      expect(take(10)).to.eql([7, 6, 5]);

    });

    it('rolls on more than 5 items', function() {
      store.add(8);
      store.add(9);
      store.add(10);

      expect(take(10)).to.eql([10, 9, 8, 7, 6]);

    });

    it('is pretty cool with stuff', function() {
      for (var i = 0; i < 1000; i++)
        store.add(7);

      expect(take(10)).to.eql([7, 7, 7, 7, 7]);

    });

    it('computes extent', function() {
      expect(store.extent(10)).to.eql([[5,7]])
    });

    it('computes distance', function() {
      expect(store.distance(10)).to.eql(2)
    });

  });


  describe('size 5, n=2', function() {

    beforeEach(function() {
      store = new Store(5, 2);
      store.add([5,5]);
      store.add([6,6]);
      store.add([7,7]);
    });

    it('iterates through', function() {

      expect(take(3)).to.eql([[7,7], [6,6], [5,5]]);

    });

    it('only gives amount of items stored', function() {

      expect(take(10)).to.eql([[7,7], [6,6], [5,5]]);

    });

    it('rolls on more than 5 items', function() {
      store.add([8, 8]);
      store.add([9, 9]);
      store.add([10, 10]);

      expect(take(10)).to.eql([[10,10], [9,9], [8,8], [7,7], [6,6]]);

    });

    it('is pretty cool with stuff', function() {
      for (var i = 0; i < 1000; i++)
        store.add([7,7]);

      expect(take(10)).to.eql([[7,7], [7,7], [7,7], [7,7], [7,7]]);

    });

    it('computes extent', function() {
      console.log(store.extent(10))
      expect(store.extent(10)).to.eql([[5,7],[5,7]])
    });

    it('computes distance', function() {
      expect(store.distance(10)).to.eql(Math.sqrt(8))
    });

  });

});





describe('TimeStore', function() {
  function take(i){
    var items = [];

    store.take(i, function(i) {
      var args = [].slice.call(arguments);
      if(args.length === 1) items.push(i)
      else items.push(args);
    });

    return items;
  }

  var store, clock;

  describe('basic functions', function() {

    beforeEach(function(){
      clock = sinon.useFakeTimers();
    })
    afterEach(function(){
      clock.restore()
    })

    beforeEach(function() {
      store = new TimeStore(5, 1);
      store.add(5);
      store.add(6);
      clock.tick(5000);
      store.add(7);
      store.add(8);
      clock.tick(5000);
      store.add(9);
      store.add(10);
    });

    it('gives the extent covered on different timespans', function() {

      expect(store.extent(0)).to.eql([[9,10]]);
      expect(store.extent(5000)).to.eql([[7,10]]);
      expect(store.extent(10000)).to.eql([[6,10]]);

    });

    it('gives the distance covered over different timespans', function() {

      expect(store.distance(0)).to.eql(1);
      expect(store.distance(5000)).to.eql(3);
      expect(store.distance(10000)).to.eql(4);

    });

  });


  describe('higher dimensions', function() {

    beforeEach(function(){
      clock = sinon.useFakeTimers();
    })
    afterEach(function(){
      clock.restore()
    })

    beforeEach(function() {
      store = new TimeStore(5, 2);
      store.add(5,5);
      store.add(6,6);
      clock.tick(5000);
      store.add(7,7);
      store.add(8,8);
      clock.tick(5000);
      store.add(9,9);
      store.add(10,10);
    });

    it('gives the extent covered on different timespans', function() {

      expect(store.extent(0)).to.eql([[9,10],[9,10]]);
      expect(store.extent(5000)).to.eql([[7,10],[7,10]]);
      expect(store.extent(10000)).to.eql([[6,10],[6,10]]);

    });

    it('gives the distance covered over different timespans', function() {

      expect(store.distance(0)).to.eql(Math.sqrt(2));
      expect(store.distance(5000)).to.eql(Math.sqrt(9 + 9));
      expect(store.distance(10000)).to.eql(Math.sqrt(16 + 16));

    });

  });

});
