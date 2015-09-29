define([
    'views/base/view',
    'text!templates/users/user-main-page.hbs'
], function(View, template) {
    'use strict';

    var UserMainPageView = View.extend({
        autoRender: true,
        className: "user-main-page",
        tagName: "div",
        template: template
    });

    return UserMainPageView;
});
