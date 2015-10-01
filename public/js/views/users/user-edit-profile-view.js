define([
  'views/base/form-view',
  'text!templates/users/user-edit-profile-view.hbs'
], function(FormView, template) {
  'use strict';

  var UserEditProfileView = FormView.extend({
    container: 'content',
    template: template
  });

  return UserEditProfileView;
});
