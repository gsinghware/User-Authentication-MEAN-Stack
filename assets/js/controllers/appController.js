/**
 * Main Controller (Most Outter Controller)
 */

app.controller('mainController', ['$rootScope', '$location', function($rootScope, $location) {
    var viewModel = this;

    // $routeChangeStart callback is executed every time route changes
    $rootScope.$on('$routeChangeStart', function() {
        
        // navbar isActive class function
        viewModel.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

    });

}]);