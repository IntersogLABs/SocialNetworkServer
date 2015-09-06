define([
  'controllers/base/controller',
  'models/users/users-collection',
  'views/users/users-collection-view'
], function(Controller, UserCollection, UsersCollectionView) {
  'use strict';

  var UsersController = Controller.extend({

    beforeAction: function(){
      var superResult = Controller.prototype.beforeAction.apply(this, arguments)


      this.reuse('main-post', {
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
    index: function(params) {
      $("#content").html(params.id)
    }
  });

  return UsersController;
});
