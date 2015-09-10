define(['chaplin', 'views/site-view', 'views/login'], function(Chaplin, SiteView, LoginView) {
  'use strict';

  var Controller = Chaplin.Controller.extend({
    // Place your application-specific controller features here.
    beforeAction: function() {
      if (!config.user || !config.pwd) {
	if (arguments[1].path == 'register') return;

	this.view = new LoginView()
	  .delegate('click', '.login-submit', function(e){
	    var $form = $(e.target).closest('form');
	    config.user = $('[name="login"]').val();
	    config.pwd = $('[name="password"]').val();
	    $form.hide();
	    Chaplin.utils.redirectTo({url: 'users'});
	    return false;
	  });
      } else {
	this.reuse('site', SiteView);
      }
    }
  });

  return Controller;
});
