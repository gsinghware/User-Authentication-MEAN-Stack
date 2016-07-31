var jwt = require('jsonwebtoken');
var User = require('../models/user');

function createToken(user) {
    return jwt.sign({
        _id: user._id
    }, process.env.secretKey, {expiresIn: '2 days'});
};

module.exports = function (express, passport) {

    var api = express.Router();

    /**
     * GET users render page
     */
    api.get('/', function(request, response) {
        response.render('index');
    });

    /**
     * GET users json
     */
    api.get('/json', function(request, response) {
        User.find({}, function(error, users) {
            response.json(users);
        });
    });

    /**
     * GET register render page
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
        var user = new User({
            'email':    request.body.email,
            'password': request.body.password,
            'type':     'Regular'
        });

        user.name = 'user' + user._id;

        user.save(function (error) {
            if (error) {
                if (error.code == "11000")
                    response.json({ success: false, message: request.body.email + ' is already in use.'});
                else
                    response.json({ success: false, message: error});
                return;
            }
            response.json({ success: true, message: 'New user has been created'});
        });
    });

    /**
     * GET login render page
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

        User.findOne({ 'email': request.body.email }, function (error, user) {
            if (error) return handleError(error);
            
            if (!user) {
                response.json({ success: false, message: 'Email does not exist.'});
            } else {
                var validPassword = user.comparePassword(request.body.password);
				if (!validPassword) {
                    response.json({ success: false, message: 'Invalid Password.'});
				} else {
                    var token = createToken(user);
					response.json({ success: true, token: token, message: 'Successfully login!'});
				}
            }
        });
    });

    /**
     * GET profile render page
     */
    api.get('/profile', function (request, response) {
        if (!request.user)
            return response.redirect('/');
        response.render('index');
    });

    /**
     * GET user json
     */
    api.get('/profile/json', function (request, response) {
        console.log("profile json", request.user);
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
                if (!foundUser) 
                    response.send({ success: false, message: 'User does not exist.' });
                else {
                    if (request.body.email) 
                        foundUser.email = request.body.email;

                    if (request.body.name) 
                        foundUser.name = request.body.name;
                    
                    foundUser.save(function (error, updatedUser) {
                        if (error) {
                            if (error.code == "11000")
                                response.json({ success: false, message: request.body.email + ' is already in use.'});
                            else
                                response.json({ success: false, message: error});
                            return;
                        }
                        
                        request.user = updatedUser;
                        response.json({ success: true, message: 'User has been updated successfully.'});
                    });
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
                if (!foundUser) response.send({ success: false, message: 'User does not exist.' });
                else {
                    var validPassword = foundUser.comparePassword(request.body.password);
                    if (validPassword)
                        foundUser.password = request.body.newPassword;
                    else {
                        response.json({ success: false, message: 'Current password is wrong.' });
                        return;
                    }

                    foundUser.save(function (error, updatedUser) {
                        if (error) return handleError(error);
                        else request.user = updatedUser;
                        response.json({ success: true, message: 'User has been updated successfully.' });
                    })
                }
            }
        });
    });

    api.get('/testusers', function (request, response) {
        var users = [
            new User({
                'name': 'gsinghbox1',
                'email':    'gsinghbox1@gmail.com',
                'password': 'testing',
                'type':     'Admin'
            }),
            new User({
                'name': 'gsinghbox2',
                'email':    'gsinghbox2@gmail.com',
                'password': 'testing',
                'type':     'Regular'
            }),
            new User({
                'name': 'gsinghbox3',
                'email':    'gsinghbox3@gmail.com',
                'password': 'testing',
                'type':     'Regular'
            }),
            new User({
                'name': 'gsinghbox4',
                'email':    'gsinghbox4@gmail.com',
                'password': 'testing',
                'type':     'Regular'
            }),
            new User({
                'name': 'gsinghbox5',
                'email':    'gsinghbox5@gmail.com',
                'password': 'testing',
                'type':     'Regular'
            })
        ];

        for (i = 0; i < users.length; i++) {
        
            users[i].save(function (error) {
                if (error) {
                    if (error.code == "11000")
                        response.json({ success: false, message: request.body.email + ' is already in use.'});
                    else
                        response.json({ success: false, message: error});
                    return;
                }
            });
            
        }
        response.json({ success: true, message: "Test Users have been added" });
    });
    

    /**
     * GET users info in json format
     */
    api.get('/:userID.json', function(request, response) {

        var userID = (request.params.userID == undefined) ? null : request.params.userID;
        var userName = (request.params.userName == undefined) ? null : request.params.userName;

        User.findOne({ '_id': userID }, function (error, user) {
            if (user) {
                response.json({ success: true, data: user});
            } else {
                // TODO: forward to page showing user doesn't exist...
                response.json({ success: false, data: user, error: error});
            }
        });

    });

    // /**
    //  * GET users render page
    //  */
    // api.get('/:userID?', function(request, response) {
    //     console.log("optional parameter /:userID?");
    //     var userID = (request.params.userID == undefined) ? null : request.params.userID;
    //     console.log(api.get('/users/' + userID + '.json'));
    //     response.json({ success: true, message: "Testing" });
    // });

    // /**
    //  * GET users render page
    //  */
    // api.get('/:userID?/:userName', function(request, response) {
    //     console.log("optional parameter /:userID?/:userName");
    //     // response.render('index');
    // });
    
    
    return api;

};