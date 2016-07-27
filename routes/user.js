var jwt = require('jsonwebtoken');
var User = require('../models/user');

function createToken(user) {
    return jwt.sign({
        _id: user._id
    }, process.env.secretKey, {expiresIn: "2 days"});
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
        console.log(request.body)
        User.findOne({
            $or: [{ 'username': request.body.username },
                  { 'email':    request.body.email } ]}, function (error, user) {
            
            if (error) return handleError(error);

            if (user) {
                if ( user.username == request.body.username && user.email != request.body.email ) {
                    response.json({ success: false, message: 'Username is already in use'});
                } else if ( user.username != request.body.username && user.email == request.body.email ) {
                    response.json({ success: false, message: 'Email is already in use'});
                } else if ( user.username == request.body.username && user.email == request.body.email ) {
                    response.json({ success: false, message: 'Both Username and Email are already in use'});
                }
            } else {
                var user = new User({
                    'username': request.body.username,
                    'password': request.body.password,
                    'email':    request.body.email,
                    'type':     'Regular'
                });
                user.save(function (error) {
                    if (error) {
                        response.json({ success: false, message: error});
                        return;
                    }
                    response.json({ success: true, message: 'New user has been created'});
                });
            }
            return;
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

        User.findOne({ 'username': request.body.username }, function (error, user) {
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
                    if (request.body.email) foundUser.email = request.body.email;
                    
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

                    var validPassword = foundUser.comparePassword(request.body.password);
                    if (validPassword)
                        foundUser.password = request.body.newPassword;
                    else {
                        response.json({
                            success: false,
                            message: "Current password is wrong."
                        });
                        return;
                    }

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