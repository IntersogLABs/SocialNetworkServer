define([
  'views/base/collection-view',
  'text!templates/users/users-collection-view.hbs',
  './user-item-view'
], function(CollectionView, template, UserItemView) {
  'use strict';

  var UsersCollectionView = CollectionView.extend({
    autoRender: true,
    itemView: UserItemView,
    template: template,
    listSelector: ".users-list",
    fallbackSelector: ".fallback",
    loadingSelector: ".loading",
    animationDuration: 0

  });

  return UsersCollectionView;
});
