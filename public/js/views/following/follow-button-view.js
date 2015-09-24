define([
  'views/base/view',
  'text!templates/following/follow-button-view.hbs'
], function(View, template) {
  'use strict';

  var FollowButtonView = View.extend({
    autoRender: true,
    container: '.follow-button',
    template: template
  });

  return FollowButtonView;
});
