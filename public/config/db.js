// config/db.js

var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/todaysProject';
var secret = 'MYSERCRET';

if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

// Connection Events
mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

// Capture app termination / restart events


// To be called when process is restarted or terminated

gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

// For nodemon restarts

process.once('SIGUSR2', function() {
	gracefulShutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// For app termination

process.on('SIGINT', function() {
	gracefulShutdown('app termination', function() {
		process.exit(0);
	});
});

//Bring in Models

module.exports = {
	secret
}