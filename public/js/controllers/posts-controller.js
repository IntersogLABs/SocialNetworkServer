define([
  'controllers/base/controller',
  'models/posts/posts-collection',
  'views/posts/posts-collection-view',
  'views/posts/post-item-view',
  'models/posts/post-model'
], function(Controller, PostCollection, PostsView, PostView, PostModel) {
  'use strict';

  var PostsController = Controller.extend({

      initialize: function(obj) {
          this.obj = obj;

          this.collection = new PostCollection({currentIdUser: obj.currUserId});
          this.view = new PostsView({parent: "#posts", currUserId: obj.currUserId});

          this.view.on('change:delete', this.deletePost.bind(this))
          this.view.on('change:edit', this.editPost.bind(this))
          this.view.on('change', this.controllerChanged.bind(this))

          this.renderPosts()
    },

      deletePost:function() {
          console.log("DELETE")
          var index = this.view.index
          console.log(index)
          console.log(index)
          var self = this;
          this.collection.fetch()
              .then(function(data){
                  console.log(data[index])
                  $.ajax({
                      type: "DELETE",
                      url: window.config.apiUrl + "post/" + data[index]._id,

                      success: function(data) {
                          self.controllerChanged()
                      },

                      error: function(XMLHttpRequest, textStatus, errorThrown) {
                          alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                      }
                  })
              })

      },

      editPost: function() {
          var index = this.view.index
          var self = this

          this.collection.fetch()
              .then(function(post){
                  $.ajax({
                      type: "PUT",
                      url: window.config.apiUrl + "post/" + post[index]._id,
                      data: JSON.stringify({content: self.view.editText}),
                      contentType: 'application/json',

                      success: function(data) {
                          self.controllerChanged()
                          console.log(data)
                      },

                      error: function(XMLHttpRequest, textStatus, errorThrown) {
                          alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                      }
                  })
              })
      },

      renderPosts: function() {
          console.log("RENDER")

          var self = this;
          this.collection.fetch().then(function(data){
              console.log(data)

              if(data.length == 0) {
                  var v = new PostView({model: undefined});
                  return;
              }

              _.each(data, function(item) {
                  var m = new PostModel({data: item})
                  var v = new PostView({model: item, parent: '#posts-content', currUserId: self.currUserId});
              })
          })
      },


      //////////////////If there were some changes with post (delete edit, new post)/////////////////////////////////
      controllerChanged: function(){
          $('#posts-content').html('')
          this.renderPosts()
      }
  });

  return PostsController;
});
