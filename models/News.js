var mongoose = require('mongoose');

// HomePage Schema
var newsSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	video_url:{
		type: String
	}
});

var News = module.exports = mongoose.model('News', newsSchema);

// Get Home Page content
module.exports.getHomePage = function(callback, limit) {
	News.find(callback).limit(limit);
}