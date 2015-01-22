var Colour = Ember.Object.extend();

Colour.reopenClass({
  find: function () {
    return ['red', 'blue', 'green'];
  }
});

export default Colour;
