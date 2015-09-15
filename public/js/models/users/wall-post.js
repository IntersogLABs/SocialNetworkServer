define([
  'models/base/model'
], function(Model) {
  'use strict';

  var Post = Model.extend({
    url: function() { return config.apiUrl + 'user/' + this.models[0].id + '/wall'; }
  });

  return Post;
});
