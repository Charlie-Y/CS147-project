var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');

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

Video.plugin(textSearch);

Video.index({
    title:"text",
    description:"text"
});

module.exports.Video = Video;