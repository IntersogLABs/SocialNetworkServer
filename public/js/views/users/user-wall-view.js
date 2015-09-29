define([
    'views/base/view',
    'text!templates/users/user-wall-view.hbs'
], function(View, template) {
    'use strict';

    var UserWallView = View.extend({
        autoRender: true,
        className: "user-main-page",
        tagName: "div",
        template: template,

        initialize: function(){
            $('.' + this.className).on('click', this.onClick.bind(this))
        },

        constructor: function(obj) {
            this.obj = obj;
            this.currUserId = obj.currUserId
            console.log(obj.currUserId)
            template = Handlebars.compile(this.template)(obj.template)
            $('#' + obj.region).html(template)
            this.initialize()
        },

        onClick: function(event){
            if(event.target.classList.contains('button-follow') ) {
                var self = this
                if(event.target.classList.contains('follow') ) {
                    console.log("FOLLOW")
                    console.log(self.currUserId)
                    var data = ''
                    $.ajax({
                        type: "POST",
                        url: window.config.apiUrl + 'user/' + self.currUserId + '/follow',
                        data: JSON.stringify({content: data}),
                        contentType: 'application/json',

                        success: function() {
                            self.trigger('change')
                        },


                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                        }

                    })
                }

                else if(event.target.classList.contains('unfollow') ) {
                    $.ajax({
                        type: "DELETE",
                        url: window.config.apiUrl + "user/" + self.currUserId + "/follow",

                        success: function() {
                            self.trigger('change')
                        },


                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                        }
                    })
                }
            }

        }
    });

    return UserWallView;
});