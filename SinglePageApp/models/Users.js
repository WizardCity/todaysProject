var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	SALT_WORK_FACTOR = 10;

// Book Schema
var userSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	email:{
		type: String,
		unique: true,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	admin:{
		type: Boolean,
		default: false
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function(next) {
    var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    if (err) return next(err);

	    // hash the password using our new salt
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        if (err) return next(err);

	        // override the cleartext password with the hashed one
	        user.password = hash;
	        next();
	    });
	});
});

userSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		username: this.username,
		exp: parseInt(expiry.getTime() / 1000),
	}, config.secret);
};


var User = module.exports = mongoose.model('User', userSchema);

// Get Users
module.exports.getUsers = function(callback, limit) {
	User.find(callback).limit(limit);
}

// Add User
module.exports.register = function(user, callback) {
	User.create(user, callback);
}

// Delete User
module.exports.deleteUser = function(id, callback) {
	var query = {_id: id};
	User.remove(query, callback);
}

// Update User
module.exports.updateUserPriv = function(id, user, options, callback) {
	var query = {_id: id};
	var update = {
		admin: user.admin
	}
	User.findOneAndUpdate(query, update, options, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username}
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, cb) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        cb(null, isMatch);
    });
}