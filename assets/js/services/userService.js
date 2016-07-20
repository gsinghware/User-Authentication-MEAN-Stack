/**
 * User Service factory
 */
app.factory('userFactory', ['$http', function($http) {
    
    var userFactory = {};

    userFactory.registerUser = function (userData) {
        return $http.post('/user/register', userData);
    };

    userFactory.loginUser = function (userData) {
        return $http.post('/user/login', userData);
    };

    return userFactory;
}]);