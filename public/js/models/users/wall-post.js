define([
  'models/posts/post-model'
], function(Post) {
  'use strict';

  var WallPost = Post.extend({
    initialize: function(args, opts){
      var superResult = Post.prototype.initialize.apply(this, arguments);
      this.wallId = opts.wallId;
      return superResult;
    },
    url: function() { return config.apiUrl + 'user/' + this.wallId + '/wall'; }
  });

  return WallPost;
});
