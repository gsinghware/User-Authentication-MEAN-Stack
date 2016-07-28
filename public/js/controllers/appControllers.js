/**
 * Main Controller (Most Outter Controller)
 */

app.controller('mainController', ['$rootScope', '$location', 'userFactory', function($rootScope, $location, userFactory) {
    var viewModel = this;

    // $routeChangeStart callback is executed every time route changes
    $rootScope.$on('$routeChangeStart', function(e, next, previous) {
        
        // navbar isActive class function
        viewModel.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        viewModel.updateUser();

    });

    viewModel.updateUser = function () {
        userFactory.getUser().then(function(user) {
            if (user.data) {
                viewModel.isLoggedIn = true;
                viewModel.user = user.data;
            } else
                viewModel.isLoggedIn = false;
        });
    };

    viewModel.logoutUser = function() {
        userFactory.logoutUser();
        $location.path('users/login');
    };

    viewModel.userProfile = function () {
        $location.path('users/profile');
    };

}]);