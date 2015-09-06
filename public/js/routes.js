define(function() {
  'use strict';

  // The routes for the application. This module returns a function.
  // `match` is match method of the Router
  return function(match) {
    match('', 'hello#show');
    match('users', 'users#index');
    match('users/:id', 'users#index');
    // match('/me', 'me#index');
  };
});
