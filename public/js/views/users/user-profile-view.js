define([
  'views/base/view',
  'text!templates/users/user-profile-view.hbs'
], function(View, template) {
  'use strict';

  var UserProfileView = View.extend({
    container: 'content',
    template: template
  });

  return UserProfileView;
});
