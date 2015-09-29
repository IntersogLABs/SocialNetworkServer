define([
  'models/base/model'
], function(Model) {
  'use strict';

  var Wall = Model.extend({
    urlRoot: config.apiUrl + "user"
  });

  return Wall;
});