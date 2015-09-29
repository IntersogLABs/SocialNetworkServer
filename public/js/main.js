
// Configure the AMD module loader
    requirejs.config({
        // The path where your JavaScripts are located
        baseUrl: './js/',
        // Specify the paths of vendor libraries
        paths: {
            jquery: '../bower_components/jquery/dist/jquery',
            underscore: '../bower_components/lodash/dist/lodash',
            backbone: '../bower_components/backbone/backbone',
            handlebars: '../bower_components/handlebars/handlebars',
            text: '../bower_components/requirejs-text/text',
            chaplin: '../bower_components/chaplin/chaplin'
        },
        // Underscore and Backbone are not AMD-capable per default,
        // so we need to use the AMD wrapping of RequireJS
        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            handlebars: {
                exports: 'Handlebars'
            }
        }
        // For easier development, disable browser caching
        // Of course, this should be removed in a production environment
        //, urlArgs: 'bust=' +  (new Date()).getTime()
    });

// Bootstrap the application
    require(['application', 'routes'], function (Application, routes) {

        window.config = {
            apiUrl: "http://localhost:127/"
        }

           /* $.ajaxSetup({
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'newnick1:pwd111P@');
            }
            })*/


        new Application({
            routes: routes,
            controllerSuffix: '-controller',
            pushState: false
        });
    });

