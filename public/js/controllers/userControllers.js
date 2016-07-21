/**
 * Register Controller
 */
app.controller('registerController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    viewModel.register = function() {
        userFactory.registerUser(viewModel.data).then(function (response) {
            console.log("in resiter");
            if (response.data.success) {
                $location.path('/user/login');
            } else {
                // TODO: user failes to register
            }
        });
    };
}]);

/**
 * Login Controller
 */
app.controller('loginController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    viewModel.login = function() {
        userFactory.loginUser(viewModel.data).then(function (response) {
            console.log(response);
            if (response.data.success) {
                
            } else {
                // TODO: user failes to login
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
