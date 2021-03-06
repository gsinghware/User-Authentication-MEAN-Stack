/**
 * Register Controller - register user after the post
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
 * Login Controller - login user after the post
 */
app.controller('loginController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    viewModel.authFacebook = function() {
        userFactory.authFacebook();
    };

    viewModel.login = function() {
        userFactory.loginUser(viewModel.data).then(function (response) {
            console.log(response);
            if (response.data.success) {
                $location.path('/');
            } else {
                $scope.error = response.data.message;
            }
        });
    };
}]);

/**
 * Users Controller - get all the users and display them
 */
app.controller('usersController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

    userFactory.getUsers().then(function (users) {
        console.log(users);
        if (users.data) {
            $scope.users = users.data;
        } else {
            $scope.error = users.data.message;
        }
    });

    $scope.testUser = function() {
        console.log("you clicked here");
    };

    viewModel.isLoggedIn = $scope.$parent.mainCtrl.isLoggedIn;

}]);

/**
 * Forget Password Controller - get all the users and display them
 */
app.controller('forgetPassController', ['$scope','$location', 'userFactory', function($scope, $location, userFactory) {
    var viewModel = this;

}]);
/**
 * User Controller - get all the users and display them
 */
app.controller('userController', ['$scope', '$routeParams', '$location', 'userFactory', function($scope, $routeParams, $location, userFactory) {
    var viewModel = this;

    console.log($routeParams.userID);

    userFactory.getUser($routeParams.userID).then(function (user) {
        if (user.data.success) {
            $scope.name = user.data.data.name;
            $scope.email = user.data.data.email;
            $scope.type = user.data.data.type;
        } else {
            // TODO: figure out what to do if server didn't find the user
            console.log("did not find the user");
        }
    });

    $scope.testUser = function() {
        console.log("you clicked here");
    };

    viewModel.editUser = false;

    viewModel.isLoggedIn = $scope.$parent.mainCtrl.isLoggedIn;

}]);

/**
 * Profile Controller
 */
app.controller('profileController', ['$scope','$location', '$timeout', 'userFactory', function($scope, $location, $timeout, userFactory) {
    var viewModel = this;

    $scope.name = $scope.$parent.mainCtrl.user.name;
    $scope.email = $scope.$parent.mainCtrl.user.email;
    
    viewModel.updateProfile = function() {

        $scope.profileSuccessMessage = "";
        $scope.profileFailMessage = "";

        if ($scope.email != $scope.$parent.mainCtrl.user.email || 
            $scope.name != $scope.$parent.mainCtrl.user.name) {

            data = {"email": $scope.email, "name": $scope.name};
            
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


