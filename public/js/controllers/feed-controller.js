define([
  'controllers/base/controller',
  'models/feed/feed-collection',
  'views/feed/feed-view'
], function(Controller, FeedCollection, FeedView) {
  'use strict';

  var FeedController = Controller.extend({
    index: function(params) {
      this.model = new FeedCollection();
      this.view = new FeedView({
	collection: this.model,
	region: 'content'
      });
      this.model.allPosts();
    }
  })

  return FeedController;
})
