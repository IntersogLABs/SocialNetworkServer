define(function() {
  'use strict';

  // The routes for the application. This module returns a function.
  // `match` is match method of the Router
  return function(match) {
    match('', 'hello#show');
    match('register', 'register#index');
    match('feed', 'feed#index');
    match('users', 'users#index');
    match('users/:id', 'users#show');
    match('follow/:id', 'users#follow');
    match('unfollow/:id', 'users#unfollow');
    // match('/me', 'me#index');
  };
});
