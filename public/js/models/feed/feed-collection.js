define([
  'models/base/collection',
  'models/posts/post-model',
  'models/users/wall-collection'
], function(Collection, Post, Wall) {
  'use strict';

  var Feed = Collection.extend({
    url: function() { return config.apiUrl + 'user/' + window.config.userid + '/following'; },
    model: Post,
    allPosts: function() {
      var collection = this;

      this.fetch().then(function(data) {
	var postPromises = [];

	data.forEach(function(item) {
	  var wall = new Wall({id: item.idolId._id});
	  postPromises.push(wall.fetch());
	})

	Promise.all(postPromises).then(function(data) {
	  collection.reset(_.flatten(data));
	})
      })
    }
  });

  return Feed;
})
