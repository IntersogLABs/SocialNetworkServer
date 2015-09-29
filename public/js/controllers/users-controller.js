define([
  'controllers/base/controller',
  'models/users/users-collection',
  'views/users/users-collection-view',
  'controllers/user-wall-controller'

], function(Controller, UserCollection, UsersCollectionView, UserWallController, PostsCollection) {
  'use strict';

  var UsersController = Controller.extend({

    beforeAction: function(){
      var superResult = Controller.prototype.beforeAction.apply(this, arguments)


      this.reuse('main-post', {
        compose: function() {
          this.collection = new UserCollection();
          this.collection.fetch().then(function(data){
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
    index: function(params) {

        if(!window.config.currUser) {
            window.location.href = "http://localhost/public/index.html"
            return
        }
        if(!params.id) return;

        var userWallController = new UserWallController({currUserId: params.id});
    }

  });

  return UsersController;
});
