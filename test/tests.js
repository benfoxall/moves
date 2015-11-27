var expect = chai.expect;

describe('Store', function() {
  var store;

  describe('size 5', function() {

    before(function() {
      store = new Store(5, 1);
      store.add(5);
      store.add(6);
      store.add(7);
    });

    it('gives correct element', function() {
      expect(store.last()).to.equal(7);
    });

    it('iterates through', function() {
      var items = [];

      store.take(3, function(i) {
        items.push(i);
      });

      expect(items).to.eql([7, 6, 5]);

    });

    it('only gives amount of items stored', function() {
      var items = [];

      store.take(10, function(i) {
        items.push(i);
      });

      expect(items).to.eql([7, 6, 5]);

    });

    it('rolls on more than 5 items', function() {
      store.add(8);
      store.add(9);
      store.add(10);

      var items = [];

      store.take(10, function(i) {
        items.push(i);
      });

      expect(items).to.eql([10, 9, 8, 7, 6]);

    });

    it('is pretty cool with stuff', function() {
      for (var i = 0; i < 1000; i++) {
        store.add(7);
      }

      var items = [];

      store.take(10, function(i) {
        items.push(i);
      });

      expect(items).to.eql([7, 7, 7, 7, 7]);

    });

  });

});
