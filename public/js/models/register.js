define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Register = Model.extend({
    urlRoot: config.apiUrl + 'register',
  });


  return Register;
});
