define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Register = Model.extend({
    urlRoot: config.apiUrl + 'register',
    initialize: function() {
      Chaplin.Model.prototype.initialize.apply(this, arguments);
      _.extend(this, Chaplin.SyncMachine);
      this.on('error', this.unsync);
    },
    post: function(data) {
      this.beginSync();
      $.post(this.urlRoot, this.wrapJson(data), (function(){this.finishSync()}).bind(this));
    }
  });


  return Register;
});
