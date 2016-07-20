/**
 * Register Controller
 */
app.controller('registerController', ['$scope','$location', function($scope, $location) {
    var viewModel = this;

    viewModel.register = function() {
        console.log(viewModel.data);
    };

}]);

/**
 * Login Controller
 */
app.controller('loginController', ['$scope','$location', function($scope, $location) {
    var viewModel = this;

    viewModel.login = function() {
        console.log(viewModel.data);
    };

}]);

/**
 * Profile Controller
 */
app.controller('profileController', ['$scope','$location', function($scope, $location) {
    var viewModel = this;

}]);
