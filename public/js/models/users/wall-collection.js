define([
  'models/base/collection',
  '../posts/post-model'
], function(Collection, Post) {
  'use strict';

  var Wall = Collection.extend({
    url: function() { return config.apiUrl + 'user/' + this.models[0].id + '/wall'; },
    model: Post
  });

  return Wall;
});
