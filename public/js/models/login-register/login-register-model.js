define([
    'models/base/model'
], function(Model) {
    'use strict';

    var LoginRegister = Model.extend({
        urlRoot: config.apiUrl + ""
    });

    return LoginRegister;
});