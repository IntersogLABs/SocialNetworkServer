define([
  'views/base/view',
  'text!templates/following/follow-button-view.hbs'
], function(View, template) {
  'use strict';

  var FollowButtonView = View.extend({
    initialize: function(args, opts){
      var superResult = View.prototype.initialize.apply(this, arguments);
      console.log(this);
      return superResult;
    },
    autoRender: true,
    container: '.follow-button',
    template: template
  });

  return FollowButtonView;
});
