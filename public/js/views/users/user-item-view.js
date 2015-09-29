define([
  'views/base/view',
  'text!templates/users/user-item-view.hbs'
], function(View, template) {
  'use strict';

  var UserItemView = View.extend({
    autoRender: true,
    className: "list-group-item",
    tagName: "a",
    template: template
  });

  return UserItemView;
});
