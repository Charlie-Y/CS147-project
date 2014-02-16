var mongoose = require('mongoose');

var Video = new mongoose.Schema({
	  title: String
	, description: String
	, duration: String
	, lastWatched: Date
	, created: Date
	, id: Number
	, keyword: [ String ]
	, videoURL: String
	, imageURL: String
	, breakpoints: [{ name: String, start: String, end: String }]
});

Video.index( { keyword: 1 } );

module.exports.Video = Video;