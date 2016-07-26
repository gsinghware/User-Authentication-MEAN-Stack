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
app.controller('profileController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    // get the username & email from the mainCtrl
    var userEmail = $scope.$parent.mainCtrl.user.local.email;
    var username = $scope.$parent.mainCtrl.user.local.username;

    // set that as the scope
    $scope.username = username;
    $scope.email = userEmail;

    viewModel.updateProfile = function() {

        // two types of updates
        // 1. local user: cannot update username, can update email
        // 2. facebook user: can get username if doesn't have one and can update email

        viewModel.data = {};
        
        // facebook user getting a username for the ist & only time
        if (username == "") viewModel.data.username = $scope.username;
        
        // updating email if the scope email doesn't equal the mainCtrl user email
        if ($scope.email != userEmail) viewModel.data.email = $scope.email;
    
        if (Object.keys(viewModel.data).length != 0) {
            userFactory.updateProfile(viewModel.data).then(function (response) {
                if (response.data.success) {
                    console.log(response);
                } else {
                    $scope.error = response.data.Error;
                }
            });
        }
    };

    viewModel.updatePassword = function () {
        // TODO: verify password and if valid, upadate it
        console.log("verify password and if valid, upadate it");

        userFactory.updatePassword(viewModel.data).then(function (response) {
            if (response.data.success) {
                console.log(response);
            } else {
                $scope.error = response.data.Error;
            }
        });
    };

}]);


