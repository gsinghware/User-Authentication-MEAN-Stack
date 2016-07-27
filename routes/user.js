var jwt = require('jsonwebtoken');
var User = require('../models/user');

function createToken(user) {
    var token;
    if (user.local.username) {
        token = jwt.sign({
            id: user._id,
            username: user.local.username,
            email: user.local.email
        }, process.env.secretKey);
    } else if (user.facebook.id) {
        token = jwt.sign({
            id: user._id,
            fbid: user.facebook.id,
        }, process.env.secretKey);
    }

    return token;
};

module.exports = function (express, passport) {

    var api = express.Router();

    /**
     * GET register
     */
    api.get('/register', function (request, response) {
        if (request.user)
            return response.redirect('/');
        response.render('index');
    });

    /**
     * POST register
     */
    api.post('/register', function (request, response) {

        User.findOne({ 
            $or: [{ 'local.username': request.body.username },
                  { 'local.email': request.body.email } ]}, function (error, user) {
            
            if (error) return handleError(error);

            if (user) {
                if ( user.local.username == request.body.username && user.local.email != request.body.email ) {
                    response.json({ Error: 'Username is already in use'});
                } else if ( user.local.username != request.body.username && user.local.email == request.body.email ) {
                    response.json({ Error: 'Email is already in use'});
                } else if ( user.local.username == request.body.username && user.local.email == request.body.email ) {
                    response.json({ Error: 'Both Username and Email are already in use'});
                }
            } else {
                var user = new User({
                    'local.username': request.body.username,
                    'local.password': request.body.password,
                    'local.email': request.body.email
                });
                user.save(function (error) {
                    if (error) {
                        response.send(error);
                        return;
                    }
                    response.json({ success: true, message: 'New user has been created'});
                });
            }
        });
    });

    /**
     * GET login
     */
    api.get('/login', function (request, response) {
        if (request.user)
            return response.redirect('/');
        response.render('index');
    });

    /**
     * POST login
     */
    api.post('/login', function (request, response) {

        User.findOne({ 'local.username': request.body.username }, function (error, user) {
            if (error) return handleError(error);

            if (!user) {
                response.send({ 
					Error: "Username doesn't exist.",
					success: false
				});
            } else {
                var validPassword = user.comparePassword(request.body.password);
				if (!validPassword) {
					response.send({
						Error: "Invalid Password.",
						success: false
					});
				} else {
                    var token = createToken(user);
					response.json({
						success: true,
                        token: token,
						message: "Successfully login!"
					});
				}
            }
        });
    });

    /**
     * GET profile
     */
    api.get('/profile', function (request, response) {
        if (!request.user)
            return response.redirect('/');
        response.render('index');
    });

    /**
     * GET user
     */
    api.get('/me', function (request, response) {
        return response.json(request.user);
    });

    /**
     * GET facebook user info
     */
    api.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'], session: false }));

    /**
     * GET the returned facebook callback
     */
    api.get('/auth/facebook/callback', 
        passport.authenticate('facebook', { session: false }), 
        function(request, response) {
            var token = createToken(request.user);
            response.cookie('access_token', token);
            response.redirect('/');
        }
    );

    /**
     * POST update Profile
     */
    api.post('/updateProfile', function (request, response) {
        User.findOne({_id: request.user._id}, function (error, foundUser) {
            if (error) return handleError(error);
            else {
                if (!foundUser) response.send({ Error: "Username doesn't exist.", success: false });
                else {
                    if (request.body.email) foundUser.local.email = request.body.email;
                    
                    foundUser.save(function (error, updatedUser) {
                        if (error) return handleError(error);
                        else request.user = updatedUser;
                        response.json({
                            success: true,
                            message: "User has been updated successfully."
                        });
                    })
                }
            }
        });
    });

    /**
     * POST update Password
     */
    api.post('/updatePassword', function (request, response) {
        User.findOne({_id: request.user._id}, function (error, foundUser) {
            if (error) return handleError(error);
            else {
                if (!foundUser) response.send({ Error: "Username doesn't exist.", success: false });
                else {
                    if (request.body.password) foundUser.local.password = request.body.password;
                    
                    foundUser.save(function (error, updatedUser) {
                        if (error) return handleError(error);
                        else request.user = updatedUser;
                        response.json({
                            success: true,
                            message: "User has been updated successfully."
                        });
                    })
                }
            }
        });
    });
                                                
    return api;

};