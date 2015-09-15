define([
  'views/base/collection-view',
  'text!templates/users/user-wall-view.hbs',
  '../posts/post-view'
], function(CollectionView, template, PostView) {
  'use strict';

  var UserWallView = CollectionView.extend({
    autoRender: true,
    itemView: PostView,
    listSelector: ".wall",
    fallbackSelector: ".empty",
    loadingSelector: ".loading",
    container: 'content',
    template: template
  });

  return UserWallView;
});
