define(['chaplin', 'views/site-view', 'views/login'], function(Chaplin, SiteView, LoginView) {
  'use strict';

  var Controller = Chaplin.Controller.extend({
    // Place your application-specific controller features here.
    beforeAction: function() {
      if (!localStorage.getItem('user')) {
	if (arguments[1].path == 'register') return;

	this.view = new LoginView();
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
