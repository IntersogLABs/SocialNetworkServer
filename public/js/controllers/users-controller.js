define([
  'controllers/base/controller',
  'models/users/users-collection',
  'views/users/users-collection-view',
  'views/users/user-wall-view',
  'models/users/wall-collection',
  'views/users/wall-add-post-view',
  'models/following/subscribe-model',
  'views/following/follow-button-view',
  'models/users/me-model',
  'views/users/user-profile-view',
  'views/users/user-edit-profile-view'
], function(Controller, UserCollection, UsersCollectionView, UserWallView, Wall, WallAddPostView, Subscribe, FollowButtonView, Me, UserProfileView, UserEditProfileView) {
  'use strict';

  var UsersController = Controller.extend({

    beforeAction: function(){
      var superResult = Controller.prototype.beforeAction.apply(this, arguments)

      this.reuse('userlist', {
        compose: function() {
          this.collection = new UserCollection();
          this.collection.fetch().then(function(data){
            console.log(data)
	    var me = _.find(data, function(item) {
	      return item.nick === localStorage.getItem('user');
	    });
	    if (me) {
	      localStorage.setItem('userid', me._id);
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
      this.model = new Wall(params);
      this.model.fetch({id: params.id})

      this.view = new UserWallView({
	collection: this.model,
	region: 'content'
      })
	.subview('add-post', new WallAddPostView({model:this.model}))

      this.subscribeModel = new Subscribe({wallId: params.id})
      this.subscribeModel.isFollowing().then(function() {
	this.subscribeView.render();
      }.bind(this));
      this.subscribeView = new FollowButtonView({model:this.subscribeModel});
    },
    follow: function(params) {
      this.model = new Subscribe({wallId: params.id})
      this.model.save();
      this.redirectTo('users#show', {id: params.id});
    },
    unfollow: function(params) {
      this.model = new Subscribe({wallId: params.id})
      this.model.drop();
      this.redirectTo('users#show', {id: params.id});
    },
    me: function() {
      this.model = new Me();
      this.model.fetch().then(function(){
	this.view.render();
      }.bind(this))

      this.view = new UserProfileView({
	model: this.model,
	region: 'content'
      })
    },
    editme: function() {
      this.model = new Me();
      this.view = new UserEditProfileView({
	model: this.model,
	region: 'content'
      })
      
      this.model.fetch().then(function() {
	this.model.set({_id: ''});
	this.model.idAttribute = '_id';
	this.view.render();
      }.bind(this))

      this.model.on('sync', function() {
	if (arguments[2].validate) {
	  this.redirectTo('users#me');
	}
      }.bind(this));
    }
  });

  return UsersController;
});
