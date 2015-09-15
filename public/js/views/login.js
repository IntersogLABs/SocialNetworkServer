define(['views/base/view', 'text!templates/login.hbs'], function(View, template) {
  'use strict';

  var LoginView = View.extend({
    autoRender: true,
    container: 'body',
    template: template
  });

  return LoginView;
});
