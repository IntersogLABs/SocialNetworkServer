define(['views/base/form-view', 'text!templates/register.hbs'], function(FormView, template) {
  'use strict';

  var RegisterView = FormView.extend({
    autoRender: true,
    container: 'body',
    containerMethod: 'html',
    template: template
  });

  return RegisterView;
});
