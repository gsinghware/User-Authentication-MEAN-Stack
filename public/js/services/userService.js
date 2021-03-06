/**
 * User Service factory
 */
app.factory('userFactory', ['$http', '$cookies', '$window', function($http, $cookies, $window) {
    
    var userFactory = {};

    userFactory.registerUser = function (userData) {
        return $http.post('/users/register', userData);
    };

    userFactory.loginUser = function (userData) {
        return $http.post('/users/login', userData).success(function (data) {
			userFactory.setSessionToken(data.token);
			return data;
		});
    };

    userFactory.logoutUser = function () {
        $cookies.remove('access_token');
    };

    userFactory.setSessionToken = function (token) {
        $cookies.put('access_token', token);
    };

    userFactory.getSessionUser = function () {
        console.log("here two");
        return $http.get('/users/profile/json');
    };

    userFactory.getUser = function (id) {
        console.log("here three");
        return $http.get('/users/' + id + '.json');
    };

    userFactory.getUsers = function () {
        return $http.get('/users/json');
    };

    // need to use window because need to connect to facebook server
    userFactory.authFacebook = function () {
        return window.location.href = '/users/auth/facebook';
    };

    userFactory.updateProfile = function (data) {
        return $http.post('/users/updateProfile', data);
    };
    
    userFactory.updatePassword = function (data) {
        return $http.post('/users/updatePassword', data);
    };

    return userFactory;
}]);