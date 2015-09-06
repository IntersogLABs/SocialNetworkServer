define([
  'models/base/collection',
  './user-model'
], function(Collection, UserModel) {
  'use strict';

  var User = Collection.extend({
    url: config.apiUrl + "user",
    model: UserModel
  });

  return User;
});