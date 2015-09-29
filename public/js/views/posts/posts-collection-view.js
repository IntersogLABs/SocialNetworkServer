define([
    'views/base/view',
    'text!templates/posts/post-collection-view.hbs'
], function(View, template) {
    'use strict';

    var PostsView = View.extend({
        template: template,
        autoRender: true,

        initialize: function(obj) {
            this.parent = obj.parent
            console.log(obj.currUserId)
            this.currUserId = obj.currUserId
        },

        render: function() {
            console.log('render')
            console.log($(this.parent))
            this.el = Handlebars.compile(template)
            $(this.parent).html(this.el)
            $(this.parent).on('click', this.onClick.bind(this))
        },

        onClick: function() {
            console.log('CLICK')
            if($('.content-edit').length) {
                console.log($(event.target))

                ////////////if it is textarea for editting post/////////////////////////////
                if($(event.target)[0].classList.contains('edit')) return;

                ////////////if click is out of the current edditing post///////////////////
                if(! $(event.target).closest('.content-edit').length) {

                    console.log($('.edit').find('textarea')[0].placeholder)

                    $('.edit').find('.content-edit').replaceWith("<div class='content'>"
                        + $('.edit').find('textarea')[0].placeholder + "</div>")

                    _.each($('.edit'), function(item) {
                        item.classList.remove('edit')
                    })
                }
            }

            ///////////////to post new post///////////////////////////////////////////////
            if(event.target.className == 'button-post') {
                console.log("CLICK user-wall-view")
                console.log(this.el)

                var data = $(this.el).find('.write-post').find('textarea')[0].value;

                if(!data) return;

                $.ajax({
                    type: "POST",
                    url: window.config.apiUrl + 'user/' + this.currUserId + '/wall',
                    data: JSON.stringify({content: data}),
                    contentType: 'application/json',

                    success: function(){
                        console.log('SUCCESS')
                    },

                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("ERROR: " + JSON.parse(XMLHttpRequest.responseText).message)
                    }
                })
                this.trigger('change');
            }

            ///////////////to delete post from page/////////////////////////////////////////////
            else if(event.target.classList.contains('button-post-delete')) {
               this.index = $( $( $(event.target).parent()).parent()).index()
               this.trigger('change:delete')
            }
            ///////////////to change post to textarea for edit/////////////////////////////////
            else if(event.target.classList.contains('button-post-edit')) {
                console.log('Edit')
                var parent =  $ ($( $(event.target).parent()).parent())
                if (parent.find('.button-edit').length) return;

                parent[0].classList.add('edit')
                this.index = parent.index()
                parent.find('.content').replaceWith("<div class='content-edit'><textarea placeholder =" + parent.find('.content').html() + "></textarea><div class = 'button-edit-post'>Post</div></div>")
            }
            ///////////////to put edits on page  (pushing button Post)///////////////////////
            else if(event.target.classList.contains('button-edit-post')) {
                this.editText = $ ($('.edit').find('textarea')[0]) [0]. value
                this.trigger('change:edit')
            }
            console.log($('.content-edit'))

        }
    })

return PostsView;
});