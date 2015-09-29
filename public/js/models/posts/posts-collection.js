define([
  'models/base/collection',
  'models/posts/post-model',
], function(Collection, PostModel) {
  'use strict';

  var Post = Collection.extend({
    model: PostModel,

    initialize: function(obj) {
      this.url = window.config.apiUrl + "user/" + obj.currentIdUser + "/wall"
    }
  });

  return Post;
});

