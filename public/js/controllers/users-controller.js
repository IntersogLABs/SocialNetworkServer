define([
  'controllers/base/controller',
  'models/users/users-collection',
  'views/users/users-collection-view',
  'views/users/user-wall-view',
  'models/users/wall-collection'
], function(Controller, UserCollection, UsersCollectionView, UserWallView, Wall) {
  'use strict';

  var UsersController = Controller.extend({

    beforeAction: function(){
      var superResult = Controller.prototype.beforeAction.apply(this, arguments)


      this.reuse('userlist', {
        compose: function() {
          this.collection = new UserCollection();
          this.collection.fetch().then(function(data){
            console.log(data)
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
      });
    }
  });

  return UsersController;
});
