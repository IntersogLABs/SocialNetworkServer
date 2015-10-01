define([
  'views/base/view',
  'views/base/error-message-view'
], function(View, ErrorMessageView) {
  'use strict';

  var FormView = View.extend({
    events: {
      'submit form': 'save'
    },
    save: function(e) {
      e.preventDefault();
      var data = {};
      $(e.target).serializeArray().map(function(item){
	data[item.name] = item.value;
      });
      var model = this.model;
      if (model.models) {
	var collection = model;
	model = collection.new();
	model.set(data);
	collection.push(model);
      } else {
	model.set(data);
      }
      model.save().fail(function(res){
	model.set('message', res.responseJSON.message);
	this.subview('errorMessage', new ErrorMessageView({
	  model: model
	}));
      }.bind(this)).always(function(){
	this.render()
	_.each(this.subviews, function(view) {
	  view.render();
	});
      }.bind(this));
    },
  });

  return FormView;
});
