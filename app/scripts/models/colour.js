var Colour = Ember.Object.extend();

Colour.reopenClass({
  find: function () {
    return ['red', 'blue', 'yellow'];
  }
});

export default Colour;
