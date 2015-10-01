define([
  'views/base/collection-view',
  'text!templates/feed/feed-view.hbs',
  '../posts/post-view'
], function(CollectionView, template, PostView) {
  'use strict';

  var FeedView = CollectionView.extend({
    itemView: PostView,
    listSelector: ".feed",
    fallbackSelector: ".empty",
    loadingSelector: ".loading",
    container: 'content',
    template: template
  });

  return FeedView;
})
