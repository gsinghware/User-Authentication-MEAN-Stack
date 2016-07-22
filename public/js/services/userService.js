/**
 * User Service factory
 */
app.factory('userFactory', ['$http', '$cookies', '$window', function($http, $cookies, $window) {
    
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

    userFactory.getUser = function () {
        return $http.get('/user/me');
    };

    // need to use window because need to connect to facebook server
    userFactory.authFacebook = function () {
        return window.location.href = '/user/auth/facebook';
    };

    return userFactory;
}]);