define([
    'views/base/view',
    'text!templates/posts/ppost-item-view.hbs',
    'models/posts/post-model'
], function(View, template, ModelView) {
    'use strict';

    var PostItemView = View.extend({
        autoRender: true,
        template: template,

        initialize: function(obj) {
            this.model = obj.model
            this.parent = obj.parent;
            console.log(obj.model)
        },
        render: function() {
            console.log('render')
            var html = Handlebars.compile(this.template)(this.model);
            this.el = html;
            $(this.el).on('click', this.onClick)            ///can't bind compiled element with view
            $(this.parent).html( $(this.parent).html() + html);
        },

        onClick:function() {
            console.log('CLICKKK')
        }
    });

    return PostItemView;
});
