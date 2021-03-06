/**
 * User Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:      {type: String, required: true, unique: true},
    password:   {type: String},
    name:       {type: String},
    type:       {type: String},
    facebookID: {type: String, unique: true, sparse: true},

}, { timestamps: true });

/**   
 * The purpose of this middleware is to hash the password before 
 * saving to database
 */
var bcrypt = require('bcrypt-nodejs');

userSchema.pre('save', function (next) {
	var user = this;
	var SALT_FACTOR = 10;

	if (!user.isModified('password')) 
    	return next();
    
    bcrypt.genSalt(SALT_FACTOR, function (error, salt) {
    	if (error) return next(error);

    	/* hash the password */
	    bcrypt.hash(user.password, salt, null, function(error, hash) {
	    	if (error) return next(error);

            user.password = hash;
    		next();
	    });
    });
});

/* compare password function */
userSchema.methods.comparePassword = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', userSchema);