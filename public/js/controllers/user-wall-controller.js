define([
    'controllers/base/controller',
    'views/users/user-wall-view',
    'models/users/users-collection',
    'controllers/posts-controller'

], function(Controller, UserWallView, UserCollection, PostsController) {
    'use strict';

    var UserWallController = Controller.extend({

        constructor: function (data) {
            this.makeView(data)
            _.bind(this, this.renderView)
            _.bind(this, this.renderPosts)
        },


        makeView: function (obj) {
            this.collection = new UserCollection();
            var user, follows = [], followers = [], isFollowedOnCurrentUser = false;
            var self = this;

            ///////////////////////////////////find  observing  page////////////////////////////////////////////////////
            this.collection.fetch().then(function (item) {
                user = _.find(item, function (index) {
                    return (index._id == obj.currUserId)
                })
            })
            ///////////////////////////////////find  people followed current user/////////////////////////////////
            $.ajax({
                url: window.config.apiUrl + 'user/' + obj.currUserId + '/following',
                success: function (data) {
                    self.collection.fetch().then(function (item) {
                        _.each(data, function (index) {
                            follows.push(_.find(item, function (itemI) {
                                if (itemI._id == index) {
                                    return itemI
                                }
                            }))
                        })
                    })


                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                }
            }).then(function () {
                ///////////////////////////////////is current user followed by registered user/////////////////////////
                $.ajax({
                    url: window.config.apiUrl + 'user/' + obj.currUserId + '/followers',
                    success: function (data) {
                        _.each(data, function (index) {
                            if (index == window.config.currUser._id) {
                                isFollowedOnCurrentUser = true;
                                return;
                            }
                        })
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                    }
                })

            }).then(function () {
                ///////////////////////////////////find  people, which follow current user/////////////////////////////
                $.ajax({
                    url: window.config.apiUrl + 'user/' + obj.currUserId + '/followers',
                    success: function (data) {
                        self.collection.fetch().then(function (item) {   //find  observing  page
                            _.each(data, function (index) {
                                followers.push(_.find(item, function (itemI) {
                                    if (itemI._id == index) {
                                        return itemI
                                    }
                                }))
                            })
                        }).then(function () {
                            self.obj = {
                                region: 'content',
                                template: {
                                    nick: user.nick, email: user.email, followers: followers,
                                    follows: follows, isFollowed: isFollowedOnCurrentUser,
                                    isCurrUser: window.config.currUser.nick != user.nick
                                },
                                currUserId: obj.currUserId
                            };
                            self.renderView()
                        })
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                    }
                })
            })
        },

        renderView: function() {
            console.log("RENDER VIEW")
            var self = this;
            if(this.view) {
                self.view.unbind('change')
                this.obj.template.isFollowed = !this.obj.template.isFollowed
                delete self.view;
            }
                self.obj.template.followers = []

                /////////////////////////for rerender view after follow or unfollow user///////////////////////////////

                $.ajax({
                    url: window.config.apiUrl + 'user/' + self.obj.currUserId + '/followers',
                    success: function (data) {
                        self.collection.fetch().then(function (item) {   //find  observing  page
                            _.each(data, function (index) {
                                self.obj.template.followers.push(_.find(item, function (itemI) {
                                    if (itemI._id == index) {
                                        return itemI
                                    }
                                }))
                            })
                        }).then(function() {
                            self.view = new UserWallView(self.obj)
                            self.view.on('change', self.renderView.bind(self))
                        }).then(function() {
                            self.renderPosts()
                        })
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                    }
                })

        },

        renderPosts: function() {
            if(this.postController) delete this.postController;
            this.postController = new PostsController({currUserId: this.obj.currUserId})
            this.postController.on('change', this.renderPosts.bind(this))
        }

    });

    return UserWallController;
});
