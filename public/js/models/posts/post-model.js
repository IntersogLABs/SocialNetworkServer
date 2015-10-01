define([
  'models/base/model'
], function(Model) {
  'use strict';

  var Post = Model.extend({
    urlRoot: config.apiUrl + "posts"
  });

  return Post;
});
