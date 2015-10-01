define([
  'views/base/view',
  'text!templates/base/error-message-view.hbs'
], function(View, template) {
  'use strict';

  var ErrorMessageView = View.extend({
    autoRender: true,
    container: '[role=form]',
    containerMethod: 'prepend',
    template: template
  });

  return ErrorMessageView;
});
