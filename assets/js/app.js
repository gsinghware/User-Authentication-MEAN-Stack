/**
 * Routing
 */

var app = angular.module('UserAuth', ['ngRoute']);

// $locationProvider - Removing the fragment identifier from AngularJS urls (# symbol)
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {title : 'Home', templateUrl: 'partials/home.ejs' });
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

}]);