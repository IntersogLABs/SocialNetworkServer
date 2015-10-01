define([
  'chaplin',
  'views/site-view',
  'views/login',
  'models/base/model',
  'views/base/error-message-view'
], function(Chaplin, SiteView, LoginView, Model, ErrorMessageView) {
  'use strict';

  var Controller = Chaplin.Controller.extend({
    // Place your application-specific controller features here.
    beforeAction: function() {
      if (!localStorage.getItem('user')) {
	if (arguments[1].path == 'register') return;

	this.view = new LoginView();

	var message = localStorage.getItem('message');
	if (message) {
	  this.model = new Model();
	  this.model.set('message', message);
	  this.view.subview('errorMessage', new ErrorMessageView({
	    model: this.model
	  }));
	}

	this.view.delegate('click', '.login-submit', function(e){
	  var $form = $(e.target).closest('form');
	  localStorage.setItem('user', $('[name="login"]').val());
	  localStorage.setItem('pwd', $('[name="password"]').val());

	  config.loginCounter++;
	  this.redirectTo({url: 'users'});
	  return false;
	}.bind(this));
      } else {
	this.reuse('site'+config.loginCounter, SiteView);
      }
    }
  });

  return Controller;
});
