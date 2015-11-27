var expect = chai.expect;

describe('Store', function() {
  function take(i){
    var items = [];

    store.take(i, function(i) {
      items.push(i);
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
      expect(store.extent(10)).to.eql([5,7])
    });

    it('computes distance', function() {
      expect(store.distance(10)).to.eql(2)
    });

  });

});
