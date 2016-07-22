/**
 * User Service factory
 */
app.factory('userFactory', ['$http', '$cookies', function($http, $cookies) {
    
    var userFactory = {};

    userFactory.registerUser = function (userData) {
        return $http.post('/user/register', userData);
    };

    userFactory.loginUser = function (userData) {
        return $http.post('/user/login', userData).success(function (data) {
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

    return userFactory;
}]);