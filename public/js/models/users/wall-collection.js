define([
  'models/base/collection',
  './wall-post'
], function(Collection, WallPost) {
  'use strict';

  var Wall = Collection.extend({
    initialize: function(args){
      var superResult = Collection.prototype.initialize.apply(this, arguments);
      this.id = args.id;
      return superResult;
    },
    url: function() { return config.apiUrl + 'user/' + this.id + '/wall'; },
    model: WallPost,
    new: function() {
      return new WallPost(null, {wallId: this.id});
    }
  });

  return Wall;
});
