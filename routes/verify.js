/**
 * verify jsonwebtoken
 */

var jwt = require('jsonwebtoken');
var User = require('../models/user');

module.exports = function (app) {

    /**
     * this middleware will be called on each page load and it gets the token from the cookies
     * and authenticate the user using the secretKey and if it decoded with error then
     * we have a valid user otherwise the user is not logged in or is a fake cookie.
     * 
     * IMPORTANT: this middleware sets the request.user variable with can be accessed in any
     * route to find the logged in user info.
     */
    app.use(function(request, response, next) {
        var token = request.cookies["access_token"];
        if (token) {
            jwt.verify(token, process.env.secretKey, function (error, user) {
                if (error) {
                    request.user = false;
                    next();
                } else {
                    User.findOne({ '_id': user._id }, function (error, user) {
                        if (error) return handleError(error);
                        
                        if (user) {
                            request.user = user;
                        } else {
                            request.user = false;
                        }
                        next();
                    });
                }
            });
        } else {
            request.user = false;
            next();
        }
    });
};