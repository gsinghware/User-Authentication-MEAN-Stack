/**
 * User Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:   {type: String, unique: true, sparse: true},
    password:   {type: String},
    email:      {type: String, required: true, unique: true},
    name:       {type: String},
    type:       {type: String, enum: ['Admin', 'Regular']},
    facebookID: {type: String, unique: true, sparse: true},

    // local: {
    //     username:   {type: String, sparse: true, unique: true},
    //     password:   {type: String},
    //     email:      {type: String, sparse: true, unique: true},
    // },
    // facebook: {
    //     id:         {type: String},
    //     name:       {type: String}
    // }
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