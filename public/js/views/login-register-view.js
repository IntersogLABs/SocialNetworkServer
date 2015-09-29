define([
'views/base/view',
'text!templates/login-register-view.hbs'
], function(View, template) {
'use strict';
var LoginRegisterView = View.extend({
autoRender: true,
className: "login-register-form",
tagName: "div",
template: template,

events: {
    "click": "onClick"
},

remove: function() {
this.el.remove();
},

onClick: function(event){

//////////////////////Show Register Block///////////////////////////////////////////////
    if($($(event.target)[0]).hasClass('register') ) {
        if($(this.el).find('.login-block').hasClass("none-displayed")!=true) {
            $(this.el).find('.login-block')[0].classList.add("none-displayed")
            $(this.el).find('.login-block')[0].classList.remove("displayed")

            $(this.el).find('.register-block')[0].classList.add("displayed")
            $(this.el).find('.register-block')[0].classList.remove("none-displayed")

            $(this.el).find('.register')[0].classList.add("checked-title")
            $(this.el).find('.login')[0].classList.remove("checked-title")
        }
    }

    //////////////////////Show Login Block///////////////////////////////////////////////
    else if($($(event.target)[0]).hasClass('login') ) {
        if($(this.el).find('.register-block').hasClass("none-displayed")!=true) {
            $(this.el).find('.register-block')[0].classList.add("none-displayed")
            $(this.el).find('.register-block')[0].classList.remove("displayed")

            $(this.el).find('.login-block')[0].classList.add("displayed")
            $(this.el).find('.login-block')[0].classList.remove("none-displayed")

            $(this.el).find('.login')[0].classList.add("checked-title")
            $(this.el).find('.register')[0].classList.remove("checked-title")
        }
    }

    //////////////////////Click on button "Post"//////////////////////////////////////////
    else if($($(event.target)[0]).hasClass('button-post')) {
        var arrayInput = $($(this.el).find('.displayed')[0]).find("input")
        var isPermit =  true;

            _.forEach(arrayInput, function(index, i, arr) {
                if(index.value == '') {
                    alert('Fill all fields!');
                    return isPermit = false;
                }
            })

        if(isPermit) {
            var obj = {}
            _.forEach(arrayInput, function(index, i, arr) {
                obj[index.defaultValue] = index.value
            })
            this.model.set('user', obj);
        }
    }
}
});

return LoginRegisterView;
});