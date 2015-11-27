var expect = chai.expect;

describe('Store', function() {
  var store;

  describe('size 10', function() {

    before(function() {
      store = new Store(10, 1);
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

  });

});
