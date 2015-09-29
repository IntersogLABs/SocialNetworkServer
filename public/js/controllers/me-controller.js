define([
    'controllers/base/controller',
    'controllers/user-wall-controller'

],function(Controller, UserWallController) {
    'use strict';

    var UsersController = Controller.extend({
        index: function(params) {
            if(!window.config.currUser) {
                window.location.href = "http://localhost/public/index.html"
                return
            }
            var userWallController = new UserWallController({currUserId: window.config.currUser._id});
        }
    })

    return UsersController;
});

