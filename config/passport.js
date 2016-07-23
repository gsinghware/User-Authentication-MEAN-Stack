/**
 * passport middleware authentication (local, facebook)
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');
var User = require('../models/user');

module.exports = function(passport) {

    passport.use(new FacebookStrategy({
	    clientID:       process.env.FBclientID,
	    clientSecret:   process.env.FBclientSecret,
	    callbackURL:    process.env.FBcallbackURL
    }, function(accessToken, refreshToken, profile, done) {

        User.findOne({'facebook.id': profile.id}, function(error, user) {

            if(error) return done(error);

            // found the user, return the user
            if(user) return done(null, user);

            console.log(profile);

            // user does not exist, so adding it
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.name = profile.displayName;

            newUser.save(function(error){                
                if(error) throw error;
                return done(null, newUser);
            });
        });

    }));
};