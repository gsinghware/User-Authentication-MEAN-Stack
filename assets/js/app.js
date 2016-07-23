/**
 * Routing
 */

// after facebook login, the location needs to be redirected to "#_=_"
if (window.location.hash && window.location.hash === "#_=_") {
    if (window.history && history.pushState) {
        window.history.pushState("", document.title, window.location.pathname);
    } else {
        // Prevent scrolling by storing the page's current scroll offset
        var _scroll = {
            top: document.body.scrollTop,
            left: document.body.scrollLeft
        };
        window.location.hash = "";
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = _scroll.top;
        document.body.scrollLeft = _scroll.left;
    }
}

var app = angular.module('UserAuth', ['ngRoute', 'ngCookies']);

// $locationProvider - Removing the fragment identifier from AngularJS urls (# symbol)
app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.when('/', {title : 'Home', templateUrl: 'partials/home.ejs' });
    $routeProvider.when('/user/login', {title : 'Login', templateUrl: 'partials/login.ejs' });
    $routeProvider.when('/user/register', {title : 'Register', templateUrl: 'partials/register.ejs' });
    $routeProvider.when('/user/profile', {title : 'Profile',templateUrl: 'partials/profile.ejs'});
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