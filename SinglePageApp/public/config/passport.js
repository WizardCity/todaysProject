var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	User = require('../../models/Users'),
	config = require('../config/db');

module.exports = function(passport) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		console.log(jwt_pay);
		User.getUserById(jwt_payload_id, function(err, user) {
			if(err){
				return done(err, false);
			}

			if(user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}));
}