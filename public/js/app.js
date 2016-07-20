/**
 * Routing
 */

var app = angular.module('UserAuth', ['ngRoute']);

// $locationProvider - Removing the fragment identifier from AngularJS urls (# symbol)
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {title : 'Home', templateUrl: 'partials/home.ejs' });
    $routeProvider.when('/user/login', {title : 'Login', templateUrl: 'partials/login.ejs' });
    $routeProvider.when('/user/register', {title : 'Register', templateUrl: 'partials/register.ejs' });
    $routeProvider.when('/user/profile', {templateUrl: 'partials/profile.ejs'});
    $routeProvider.when('/404', {templateUrl: 'partials/404.ejs'});
    $routeProvider.otherwise('/404');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

}]);

// changes the title as the routes change depending on the URL
app.run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    });
}]);