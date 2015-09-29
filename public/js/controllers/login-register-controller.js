define([
    'controllers/base/controller',
    'models/login-register/login-register-model',
    'views/login-register-view',
    'views/welcome-message-view',
    'models/users/users-collection'
], function(Controller, LoginRegisterModel, LoginRegisterView, WelcomeView, UserCollection) {
    'use strict';

    var LoginRegisterController = Controller.extend({
        initialize: function(){
            this.model = new LoginRegisterModel();
            this.model.on("change:user", _.bind(this.sendToDB, this) )

            if(localStorage.getItem("currUser")) {
             console.log(JSON.parse(localStorage.getItem("currUser")));
            this.model.set("user", JSON.parse(localStorage.getItem("currUser")));
            }
        },

        // Actions
        show: function(params) {
            if(window.config.currUser) {
                $('#content').html('');
                $('#sidebar').html('');
                this.view = new WelcomeView({
                    region: 'content'
                });
                return;
            }
            this.view = new LoginRegisterView({
                region: 'content',
                model: this.model
            });
        },

        quit: function() {
            if(!window.config.currUser) window.location.href = "http://localhost/public/index.html"

            localStorage.removeItem('currUser');
            window.config.currUser = undefined;
            window.location.href = "http://localhost/public/index.html"
        },

        sendToDB: function() {

            var length = 0
            _.forEach(this.model.changed.user, function(index, i, arr) {
                length++;
            })

            /////////////////////////Login/////////////////////////////////////////////////////

            if(length == 2) {
                var self = this.model.changed.user;

                $.when($.ajaxSetup({
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', self.username + ':' + self.password);
                    },

                    done: function() {
                        return 1;
                    }
                })).then(function(){
                        $.ajax({
                            url: window.config.apiUrl + 'user',

                            success: function(){

                                var selfView = this;
                                this.collection = new UserCollection();

                                this.collection.fetch().then(function(data){
                                    var currUser = _.find(data, function(index) {
                                        return index.nick == self.username
                                    })

                                    window.config.currUser = currUser;
                                    localStorage.setItem("currUser", JSON.stringify(self));
                                    selfView.view.remove()

                                }).then( function(){
                                    if(!selfView.view) return;
                                    selfView.view = new WelcomeView({
                                        region: 'content'
                                    });
                                })


                            }.bind(this),

                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                            }
                        })
                }.bind(this))
            }

            /////////////////////////Registration///////////////////////////////////////////////

            else if(length == 4) {
                var self = this.model.changed.user;

                if(self.password != self.confirm_password) {
                    alert('Password does not match the confirm password!')
                    return;
                }

                    var body = {}
                    body.nick = self.username;
                    body.email = self.email;
                    body.pwd = self.password;
                    body.repeatPwd = self.confirm_password;

                    $.ajax({
                        type: "POST",
                        url: window.config.apiUrl + 'register',
                        data: JSON.stringify(body),
                        contentType: 'application/json',

                        success: function() {
                            alert("You registered!")
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                        }

                })
            }

        }
    });
    return LoginRegisterController;
});
