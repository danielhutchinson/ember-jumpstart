import Colour from 'example/models/colour';

export default Ember.Route.extend({
    model: function () {
      return Colour.find();
    }
});
