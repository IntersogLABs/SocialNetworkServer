define([
  'controllers/base/controller',
  'models/users/users-collection',
  'views/users/users-collection-view',
  'views/users/user-wall-view',
  'models/users/wall-collection',
  'views/users/wall-add-post-view',
  'models/following/subscribe-model',
  'views/following/follow-button-view'
], function(Controller, UserCollection, UsersCollectionView, UserWallView, Wall, WallAddPostView, Subscribe, FollowButtonView) {
  'use strict';

  var UsersController = Controller.extend({

    beforeAction: function(){
      var superResult = Controller.prototype.beforeAction.apply(this, arguments)


      this.reuse('userlist', {
        compose: function() {
          this.collection = new UserCollection();
          this.collection.fetch().then(function(data){
            console.log(data)
	    window.config.userid = _.find(data, function(item) {
	      return item.nick === window.config.user;
	    });
	    if (window.config.userid) {
	      window.config.userid = window.config.userid._id;
	    }
          })
          this.view = new UsersCollectionView({
            collection: this.collection,
            region: 'sidebar'
          });
        }
      });

      return superResult
    },
    
    // Actions
    index: function() {
    },
    show: function(params) {
      var that = this;

      this.model = new Wall(params);
      this.model.fetch({id: params.id})

      this.view = new UserWallView({
	collection: this.model,
	region: 'content'
      })
	.subview('add-post', new WallAddPostView({model:this.model}))

      this.reuse(Math.random().toString(), {
	compose: function() {
	  this.model = new Subscribe({wallId: params.id})
	  this.model.isFollowing();
	  this.view = new FollowButtonView({model:this.model});
	}
      });
    },
    follow: function(params) {
      var subscribeModel = new Subscribe({wallId: params.id})
      subscribeModel.save();
      this.redirectTo('users#show', {id: params.id});
    },
    unfollow: function(params) {
      var subscribeModel = new Subscribe({wallId: params.id})
      subscribeModel.destroy();
      this.redirectTo('users#show', {id: params.id});
    }
  });

  return UsersController;
});
