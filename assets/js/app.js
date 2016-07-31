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

    $routeProvider.when('/',                            {title : 'UserAuth',            templateUrl: 'partials/home.ejs' });
    $routeProvider.when('/users',                       {title : 'Users - UserAuth',    templateUrl: 'partials/users.ejs' });
    $routeProvider.when('/users/login',                 {title : 'Login - UserAuth',    templateUrl: 'partials/login.ejs' });
    $routeProvider.when('/users/register',              {title : 'Register - UserAuth', templateUrl: 'partials/register.ejs' });
    $routeProvider.when('/users/profile',               {title : 'Profile - UserAuth',  templateUrl: 'partials/profile.ejs'});
    $routeProvider.when('/users/:userID?',              {title : 'Users - UserAuth',    templateUrl: 'partials/user.ejs' });
    $routeProvider.when('/users/:userID?/:userName?',   {title : 'Users - UserAuth',    templateUrl: 'partials/user.ejs' });
    $routeProvider.when('/404',                         {title : '404 - UserAuth',      templateUrl: 'partials/404.ejs'});
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