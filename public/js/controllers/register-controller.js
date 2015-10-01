define([
  'controllers/base/controller',
  'models/register',
  'views/register'
], function(Controller, Register, RegisterView) {
  'use strict';

  var RegisterController = Controller.extend({
    index: function() {
      this.model = new Register();
      this.view = new RegisterView({model: this.model})
      this.model.on('sync', function(model, res, xhr) {
	if (xhr.validate) {
	  localStorage.setItem('user', model.get('nick'));
	  localStorage.setItem('pwd', model.get('pwd'));
	  this.redirectTo('users#index');
	}
      }.bind(this));
    },

    logout: function() {
      localStorage.removeItem('user');
      localStorage.removeItem('pwd');
      localStorage.removeItem('userid');
      this.redirectTo('hello#show');
    }
  });

  return RegisterController;
});
