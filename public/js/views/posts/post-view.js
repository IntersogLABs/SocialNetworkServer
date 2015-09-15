define([
  'views/base/view',
  'text!templates/posts/post-view.hbs'
], function(View, template) {
  'use strict';

  var PostView = View.extend({
    autoRender: true,
    template: template
  });

  return PostView;
});
