/**
 * Register Controller
 */
app.controller('registerController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    viewModel.register = function() {
        userFactory.registerUser(viewModel.data).then(function (response) {
            if (response.data.success) {
                console.log(response);
                $location.path('/user/login');
            } else {
                $scope.error = response.data.Error;
            }
        });
    };
}]);

/**
 * Login Controller
 */
app.controller('loginController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    viewModel.authFacebook = function() {
        userFactory.authFacebook();
    };

    viewModel.login = function() {
        userFactory.loginUser(viewModel.data).then(function (response) {
            if (response.data.success) {
                console.log(response);
                $location.path('/');
            } else {
                $scope.error = response.data.Error;
            }
        });
    };
}]);

/**
 * Profile Controller
 */
app.controller('profileController', ['$scope','$location', function($scope, $location) {
    var viewModel = this;

}]);
