var mongoose = require('mongoose');
var Video = new mongoose.Schema({
	  title: String
	, description: String
	, duration: String
	, lastWatched: Date
	, created: Date
	, id: Number
	, videoURL: String
	, imageURL: String
	, breakpoints: [{ name: String, start: String, end: String }]
});
module.exports.Video = Video;