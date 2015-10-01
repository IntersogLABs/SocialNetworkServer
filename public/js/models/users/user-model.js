define([
  'models/base/model'
], function(Model) {
  'use strict';

  var User = Model.extend({
    urlRoot: config.apiUrl + "user"
  });

  return User;
});