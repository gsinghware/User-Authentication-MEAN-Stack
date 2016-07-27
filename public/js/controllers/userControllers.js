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
    
    //console.log($scope.$parent.$parent.mainCtrl.user.email);
    
    // get the username & email from the mainCtrl
    var userEmail = $scope.$parent.mainCtrl.user.email;
    var username = $scope.$parent.mainCtrl.user.username;

    // set that as the scope
    $scope.username = username;
    $scope.email = userEmail;

    viewModel.updateProfile = function() {

        $scope.profileSuccessMessage = "";
        $scope.profileFailMessage = "";

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
                    $scope.profileSuccessMessage = response.data.message;
                } else {
                    $scope.email = userEmail;
                    $scope.profileFailMessage = response.data.message;
                }
                
                $timeout(function () {
                    $scope.profileSuccessMessage = "";
                    $scope.profileFailMessage = "";
                }, 3000);
            });
        }

    };

    viewModel.updatePassword = function () {
        $scope.passwordSuccessMessage = "";
        $scope.passwordFailMessage = "";

        userFactory.updatePassword(viewModel.data).then(function (response) {
            if (response.data.success)
                $scope.passwordSuccessMessage = response.data.message;
            else
                $scope.passwordFailMessage = response.data.message;
            
            $timeout(function () {
                $scope.passwordSuccessMessage = "";
                $scope.passwordFailMessage = "";
            }, 3000);
            
            // clear the input boxes
            viewModel.data = {};
            $scope.passwordForm.$setUntouched();
            $scope.passwordForm.$setPristine();
        });
    };

}]);


