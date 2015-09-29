define([
    'views/base/view',
    'text!templates/welcome-message.hbs'
], function(View, template) {
    'use strict';

    var WelcomeView = View.extend({
        autoRender: true,
        className: "welcome",
        tagName: "div",
        template: template
    });

    return WelcomeView;
});
