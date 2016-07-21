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

module.exports = mongoose.model('User', userSchema);