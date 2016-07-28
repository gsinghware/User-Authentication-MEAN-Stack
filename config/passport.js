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
	    callbackURL:    process.env.FBcallbackURL,
        profileFields: ['id', 'emails', 'name']
    }, function(accessToken, refreshToken, profile, done) {

        User.findOne({'facebookID': profile.id}, function(error, user) {

            if(error) return done(error);

            // found the user, return the user
            if(user) return done(null, user);

            // create a new FB user
            var newUser = new User({
                'email':        profile.emails[0].value,
                'facebookID':   profile.id,
                'name':         profile.name.givenName + " " + profile.name.familyName
            });

            newUser.save(function(error){                
                if(error) throw error;
                return done(null, newUser);
            });
        });
    }));
};