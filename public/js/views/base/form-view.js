define([
  'views/base/view'
], function(View) {
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
	model.save()
      } else {
	model.set(data);
	model.save();
      }
      this.render();
    },
  });

  return FormView;
});
