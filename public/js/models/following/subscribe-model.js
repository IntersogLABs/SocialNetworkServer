define([
  'models/base/model'
], function(Model) {
  'use strict';

  var Subscribe = Model.extend({
    initialize: function(args, opts){
      var superResult = Model.prototype.initialize.apply(this, arguments);
      this.set({_id: 1});
      return superResult;
    },
    urlRoot: function() { return config.apiUrl + 'user/' + this.get('wallId') + '/'; },
    url: function() { return this.urlRoot() + 'follow'; },
    isFollowing: function() {
      this
	.fetch({url: this.urlRoot() + 'folowers'})
	.then(
	  (function(result){
	    this.set({'following': _.some(result, function(item) {
	      return item.fan._id == window.config.userid;
	    })})
	    console.log(this);
	  }).bind(this)
	)
    }
  });

  return Subscribe;
});
