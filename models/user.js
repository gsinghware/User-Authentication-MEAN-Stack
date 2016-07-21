/**
 * User Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    local: {
        username:   {type: String, unique: true},
        password:   {type: String,},
        email:      {type: String, unique: true},
    }, 
    facebook: {
        userID:     {type: String},
    }
}, { timestamps: true });

 /**   
  * The purpose of this middleware is to hash the password before 
  * saving to database
  */

var bcrypt = require('bcrypt-nodejs');

userSchema.pre('save', function (next) {
	var user = this;
	var SALT_FACTOR = 10;

	if (!user.isModified('local.password')) 
    	return next();
    
    bcrypt.genSalt(SALT_FACTOR, function (error, salt) {
    	if (error) return next(error);

    	/* hash the password */
	    bcrypt.hash(user.local.password, salt, null, function(error, hash) {
	    	if (error) return next(error);

            user.local.password = hash;
    		next();
	    });
    });

});

/* compare password function */
userSchema.methods.comparePassword = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.local.password);
};

module.exports = mongoose.model('User', userSchema);