define([
  'views/base/form-view',
  'text!templates/users/wall-add-post-view.hbs'
], function(FormView, template) {
  'use strict';

  var WallAddPostView = FormView.extend({
    autoRender: true,
    container: ".wall-add-post",
    template: template
  });

  return WallAddPostView;
});
