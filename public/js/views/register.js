define(['views/base/view', 'text!templates/register.hbs'], function(View, template) {
  'use strict';

  var RegisterView = View.extend({
    autoRender: true,
    container: 'body',
    template: template
  });

  return RegisterView;
});
