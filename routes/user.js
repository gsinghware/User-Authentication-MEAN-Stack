var User = require('../models/user');

module.exports = function (express, passport) {

    require('../config/passport')(passport, User);

    var api = express.Router();

    /**
     * GET register
     */
    api.get('/register', function (request, response) {
        if (response.user)
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
        if (response.user)
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
            return response.redirect('/user/login');
        response.render('index');
    });

    return api;

};