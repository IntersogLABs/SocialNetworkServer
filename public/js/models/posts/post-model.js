define([
  'models/base/model'
], function(Model) {
  'use strict';

  var Post = Model.extend({
    initialize: function(data) {
      this.data = data;
    }
  });

  return Post;
});