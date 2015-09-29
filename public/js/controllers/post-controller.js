define([
    'models/base/collection',
    'models/posts/post-model',
    'views/posts/post-item-view'

], function(Collection, PostModel, PostView) {
    'use strict';

    var Post = Collection.extend({
        //url: config.apiUrl + "post",
       // model: PostModel,

        constructor: function(data) {
            this.model = new PostModel();
            this.model.data = data;

            this.view = new PostView({
                model: this.model
            })

            this.view.render();
        }
    });

    return Post;
});