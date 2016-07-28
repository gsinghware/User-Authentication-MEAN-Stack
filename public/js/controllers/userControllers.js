/**
 * Register Controller
 */
app.controller('registerController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    viewModel.register = function() {
        userFactory.registerUser(viewModel.data).then(function (response) {
            if (response.data.success) {
                $location.path('/user/login');
            } else {
                $scope.error = response.data.message;
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
                $location.path('/');
            } else {
                $scope.error = response.data.message;
            }
        });
    };
}]);

/**
 * Profile Controller
 */
app.controller('profileController', ['$scope','$location', '$timeout', 'userFactory', function($scope, $location, $timeout, userFactory) {
    var viewModel = this;

    $scope.username = $scope.$parent.mainCtrl.user.username;
    $scope.email = $scope.$parent.mainCtrl.user.email;
    
    viewModel.updateProfile = function() {

        $scope.profileSuccessMessage = "";
        $scope.profileFailMessage = "";

        if ($scope.email != $scope.$parent.mainCtrl.user.email) {
            data = {"email": $scope.email};

            userFactory.updateProfile(data).then(function (response) {
            
                if (response.data.success) {
                    $scope.profileSuccessMessage = response.data.message;
                    $scope.$parent.mainCtrl.updateUser();
                } else {
                    $scope.email = $scope.$parent.mainCtrl.user.email;
                    $scope.profileFailMessage = response.data.message;
                }
                
                $timeout(function () {
                    $scope.profileSuccessMessage = "";
                    $scope.profileFailMessage = "";
                }, 5000);

            });
        }
    };

    viewModel.updatePassword = function () {
        $scope.passwordSuccessMessage = "";
        $scope.passwordFailMessage = "";

        userFactory.updatePassword(viewModel.data).then(function (response) {
            if (response.data.success) {
                $scope.passwordSuccessMessage = response.data.message;
                $scope.$parent.mainCtrl.updateUser();
            } else
                $scope.passwordFailMessage = response.data.message;
            
            $timeout(function () {
                $scope.passwordSuccessMessage = "";
                $scope.passwordFailMessage = "";
            }, 5000);
            
            // clear the input boxes
            viewModel.data = {};
            $scope.passwordForm.$setUntouched();
            $scope.passwordForm.$setPristine();
        });
    };

}]);


