define([
  './user-model'
], function(User) {
  'use strict';

  var Me = User.extend({
    urlRoot: config.apiUrl + "me"
  });

  return Me;
});
