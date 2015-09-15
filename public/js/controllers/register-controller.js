define([
  'chaplin',
  'controllers/base/controller',
  'models/register',
  'views/register'
], function(Chaplin, Controller, Register, RegisterView) {
  'use strict';

  var RegisterController = Controller.extend({
    index: function() {
      this.model = new Register();
      this.view = new RegisterView()
	.delegate('click', '.register-submit', (function(e) {
	  var $form = $(e.target).closest('form');
	  this.model.on('synced', (function(){
	    config.user = this.model.attributes.nick;
	    config.pwd = this.model.attributes.pwd;
	    Chaplin.utils.redirectTo({url: 'users'});
	    $form.hide();
	  }).bind(this));
	  this.model.post($form.serializeArray());
	  e.preventDefault();
	}).bind(this));
    }
  });

  return RegisterController;
});
